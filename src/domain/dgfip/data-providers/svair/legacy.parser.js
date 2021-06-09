const _ = require('lodash');
const xpath = require('xpath');
const select = xpath.useNamespaces({h: 'http://www.w3.org/1999/xhtml'});
const dom = require('xmldom').DOMParser;

function parseEuro(str) {
  const data = str
    .replace(/\u00A0/g, '')
    .replace(/€/g, '')
    .replace(/ /g, '')
    .replace(/\n/g, '')
    .replace(/\t/g, '');
  return isNumeric(data) ? _.parseInt(data) : 0;
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

module.exports.euro = parseEuro;

module.exports.result = function parseResult(html, year) {
  const doc = new dom().parseFromString(html.replace(/(\n|\t)/g, ''));
  let result = {
    declarant1: {},
    declarant2: {},
  };

  const mappingDeclarant = {
    nom: 'Nom',
    nomNaissance: 'Nom de naissance',
    prenoms: 'Prénom(s)',
    dateNaissance: 'Date de naissance',
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
    dateRecouvrement: "Date de mise en recouvrement de l'avis d'impôt",
    dateEtablissement: "Date d'établissement",
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
    return Promise.reject(new Error('Invalid credentials'));
  }

  const docRow = select('//*[@id="principal"]//h:table//h:tr', doc);
  docRow.forEach(line => {
    const cells = line.getElementsByTagName('td');
    const rowHeading = cells[0].firstChild;
    if (rowHeading && rowHeading.data in declarantMappingBySrc) {
      const mappingEntry = declarantMappingBySrc[rowHeading];
      if (mappingEntry.fn) {
        result = mappingEntry.fn(line, result);
      } else {
        if (cells[1].firstChild) {
          result.declarant1[mappingEntry.dest] = cells[1].firstChild.data;
        }
        let data;
        if (cells[2].firstChild) {
          data = cells[2].firstChild.data;
        }
        result.declarant2[mappingEntry.dest] = data || '';
      }
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
    const node = docRow[n].getElementsByTagName('td')[1];
    if (node && node.firstChild) {
      adress.push(node.firstChild.data);
    }
  });

  result.foyerFiscal = {
    annee: year,
    adresse: adress.join(' '),
  };

  const nodeAnnee = select('//*[@class="titre_affiche_avis"]//h:span', doc);
  if (nodeAnnee.length > 0) {
    const titleAnnee = nodeAnnee[0].firstChild.data;
    const regexp = /(\d{4})/g;

    result.anneeImpots = regexp.exec(titleAnnee)[0];
    result.anneeRevenus = regexp.exec(titleAnnee)[0];
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
    return Promise.reject(new Error('Parsing error'));
  }
  return Promise.resolve(result);
};
