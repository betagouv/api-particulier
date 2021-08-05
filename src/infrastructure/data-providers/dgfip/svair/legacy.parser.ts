// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
const {
  RateLimitedError,
} = require('../../../../domain/data-fetching/data-providers/dgfip/errors/rate-limited.error');
const _ = require('lodash');
const xpath = require('xpath');
const select = xpath.useNamespaces({h: 'http://www.w3.org/1999/xhtml'});
const dom = require('xmldom').DOMParser;
const {
  InvalidCredentialsError,
} = require('../../../../domain/data-fetching/data-providers/dgfip/errors/invalid-credentials.error');
const {
  InvalidFormatError,
} = require('../../../../domain/data-fetching/errors/invalid-format.error');
const {parseEuro, parseDateOrString} = require('../parsing-functions');

export const result = function parseResult(html) {
  if (html.indexOf('class="interdit"') !== -1) {
    return Promise.reject(new RateLimitedError());
  }
  const doc = new dom({
    errorHandler: {
      warning: () => {},
      error: () => {},
    },
  }).parseFromString(html.replace(/(\n|\t)/g, ''));
  const result = {
    declarant1: {},
    declarant2: {},
  };

  const mappingDeclarant = {
    nom: 'Nom',
    nomNaissance: 'Nom de naissance',
    prenoms: 'Prénom(s)',
    dateNaissance: {
      src: 'Date de naissance',
      fn: parseDateOrString,
    },
  };

  const compactedDeclarantMapping = _.map(mappingDeclarant, (val, key) => {
    const obj = _.isString(val) ? {src: val} : val;
    return _.assign(obj, {dest: key});
  });

  const declarantMappingBySrc = _.keyBy(compactedDeclarantMapping, 'src');

  function getImpot(value) {
    if (value.trim() === 'Non imposable') {
      return null;
    }
    return parseEuro(value);
  }

  const mapping = {
    dateRecouvrement: {
      src: "Date de mise en recouvrement de l'avis d'impôt",
      fn: parseDateOrString,
    },
    dateEtablissement: {src: "Date d'établissement", fn: parseDateOrString},
    nombreParts: {src: 'Nombre de part(s)', fn: parseFloat},
    situationFamille: 'Situation de famille',
    nombrePersonnesCharge: {
      src: 'Nombre de personne(s) à charge',
      fn: _.parseInt,
    },
    revenuBrutGlobal: {src: 'Revenu brut global', fn: parseEuro},
    revenuImposable: {src: 'Revenu imposable', fn: parseEuro},
    impotRevenuNetAvantCorrections: {
      src: 'Impôt sur le revenu net avant corrections',
      fn: getImpot,
    },
    montantImpot: {src: "Montant de l'impôt", fn: getImpot},
    revenuFiscalReference: {src: 'Revenu fiscal de référence', fn: parseEuro},
  };

  const compactedMapping = _.map(mapping, (val, key) => {
    const obj = _.isString(val) ? {src: val} : val;
    return _.assign(obj, {dest: key});
  });

  const mappingBySrc = _.keyBy(compactedMapping, 'src');

  if (select('//*[@id="nonTrouve"]', doc).length) {
    return Promise.reject(new InvalidCredentialsError());
  }

  const docRow = select('//*[@id="principal"]//h:table//h:tr', doc);
  docRow.forEach(line => {
    const cells = line.getElementsByTagName('td');
    const rowHeading = cells[0].firstChild;
    if (rowHeading && rowHeading.data in declarantMappingBySrc) {
      const mappingEntry = declarantMappingBySrc[rowHeading];
      if (cells[1].firstChild) {
        if (mappingEntry.fn) {
          result.declarant1[mappingEntry.dest] = mappingEntry.fn(
            cells[1].firstChild.data
          );
        } else {
          result.declarant1[mappingEntry.dest] = cells[1].firstChild.data;
        }
      }
      let data;
      if (cells[2].firstChild) {
        if (mappingEntry.fn) {
          data = mappingEntry.fn(cells[2].firstChild.data);
        } else {
          data = cells[2].firstChild.data;
        }
      }
      result.declarant2[mappingEntry.dest] = data || '';
    } else if (cells.length === 2 && rowHeading in mappingBySrc) {
      const mappingEntry = mappingBySrc[rowHeading];
      if (cells[1].firstChild) {
        if (mappingEntry.fn) {
          result[mappingEntry.dest] = mappingEntry.fn(cells[1].firstChild.data);
        } else {
          result[mappingEntry.dest] = cells[1].firstChild.data;
        }
      } else {
        result[mappingEntry.dest] = null;
      }
    }
  });

  const adress = [];
  const adressRowNumbers = [5, 6, 7];
  adressRowNumbers.forEach(n => {
    if (docRow[n]) {
      const node = docRow[n].getElementsByTagName('td')[1];
      if (node && node.firstChild) {
        adress.push(node.firstChild.data);
      }
    }
  });

  const nodeAnnee = select('//*[@class="titre_affiche_avis"]//h:span', doc);
  if (nodeAnnee.length > 0) {
    const titleAnnee = nodeAnnee[0].firstChild.data;
    const regexp = /(\d{4})/g;

    result.anneeImpots = parseInt(regexp.exec(titleAnnee)[0]);
    result.anneeRevenus = parseInt(regexp.exec(titleAnnee)[0]);

    result.foyerFiscal = {
      annee: result.anneeImpots,
      adresse: adress.join(' '),
    };
  }

  const nodeErreurCorrectif = select('//*[@id="erreurCorrectif"]', doc);
  if (nodeErreurCorrectif.length > 0) {
    const textNode = _.filter(nodeErreurCorrectif[0].childNodes, {nodeType: 3});
    textNode.forEach((value, index) => {
      if (index === 0) {
        result.erreurCorrectif = value.data;
      } else {
        result.erreurCorrectif += ' ' + value.data;
      }
    });
  }

  const nodeSituationPartielle = select('//*[@id="situationPartielle"]', doc);
  if (nodeSituationPartielle.length > 0) {
    const textNode = _.filter(nodeSituationPartielle[0].childNodes, {
      nodeType: 3,
    });
    textNode.forEach((value, index) => {
      if (index === 0) {
        result.situationPartielle = value.data;
      } else {
        result.situationPartielle += ' ' + value.data;
      }
    });
  }

  if (!result.declarant1.nom) {
    return Promise.reject(new InvalidFormatError());
  }
  return Promise.resolve(_.omitBy(result, _.isUndefined));
};
