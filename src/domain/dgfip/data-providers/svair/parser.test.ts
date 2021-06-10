/* eslint-disable no-irregular-whitespace */
import {
  match,
  formatString,
  formatDate,
  formatMoney,
  formatFloat,
} from './parser';
import * as cheerio from 'cheerio';

const rawOuput = `<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
	
<head>
<meta http-equiv="Content-type" content="text/html; charset=UTF-8" />

<title>Impots.gouv.fr - Service de vérification en ligne des avis</title>
<link href="/secavis/css/style.css" rel="styleSheet" type="text/css" />
</head>

<body>

<div id="conteneur">
<div id="barre_haut">
			<div style="float: left;"><img src="/secavis/img/bo_seule-2.gif" alt="" /></div>
			<div style="float: right;"><img src="/secavis/img/bo_seule-3.gif" alt="" /></div>
</div>
<div id="principal">
<div id="nav_pro">
<b>L'administration fiscale certifie l'authenticité du document présenté pour les données suivantes :</b>
</div>

<div class="titre_affiche_avis">
<span>Impôt   2019 sur les revenus de l'année  2018  
</span>
</div>		
		

			<table>
				<tbody>
				<tr>
					<td class="label">
					</td>
					<td class="label">Déclarant 1
					</td>
					<td class="label">Déclarant 2
					</td>
				</tr>
				<tr>
					<td class="labelPair">Nom
					</td>
					<td class="labelPair">MOUSTAKI
					</td>
					<td class="labelPair">MOUSTAKI
					</td>
				</tr>
				<tr>
					<td class="labelImpair">Nom de naissance
					</td>
					<td class="labelImpair">MOUSTAKI
					</td>
					<td class="labelImpair">MOUSTACROUTE
					</td>
				</tr>
				<tr>
					<td class="labelPair">Prénom(s)
					</td>
					<td class="labelPair">GEORGES
					</td>
					<td class="labelPair">GEORGETTE
					</td>
				</tr>
				<tr>
					<td class="labelImpair">Date de naissance
					</td>
					<td class="labelImpair">03/05/1976
					</td>
					<td class="labelImpair">03/05/1976
					</td>
				</tr>
				<tr>
					<td class="labelPair">
						Adresse déclarée au 1<sup>er</sup> janvier  2019
					</td>
					<td class="labelPair">19 RUE DES ROSIERS
					</td>
					<td class="labelPair">
					</td>
				</tr>
					<tr>
					<td class="labelPair">
					</td>
					<td colspan="2" class="labelPair">75002 PARIS
					</td>
					</tr>			
				<tr>
					<td class="espace"></td>
				</tr>
				<tr>
					<td class="labelPair" colspan="2">Date de mise en recouvrement de l'avis d'impôt
					</td>
					<td class="textPair">31/07/2019
					</td>
				</tr>		
				<tr>
					<td class="labelImpair" colspan="2">Date d'établissement
					</td>
					<td class="textImpair">09/07/2019
					</td>
				</tr>
				<tr>
					<td class="labelPair" colspan="2">Nombre de part(s)
					</td>
					<td class="textPair">1.00
					</td>
				</tr>
				<tr>
					<td class="labelImpair" colspan="2">Situation de famille
					</td>
					<td class="textImpair">Célibataire
					</td>
				</tr>
				<tr>
					<td class="labelPair" colspan="2">Nombre de personne(s) à charge
					</td>
					<td class="textPair">0
					</td>
				</tr>
				<tr>
					<td class="labelImpair" colspan="2">Revenu brut global
					</td>
					<td class="textImpair">23 503 €
					</td>
				</tr>
				<tr>
					<td class="labelPair" colspan="2">Revenu imposable
					</td>
					<td class="textPair">23 504 €
					</td>
				</tr>
				<tr>
					<td class="labelImpair" colspan="2">Impôt sur le revenu net avant corrections
					</td>
					<td class="textImpair">2 074 €
					</td>
				</tr>
				<tr>
					<td class="labelPair" colspan="2">Montant de l'impôt
					</td>
					<td class="textPair">Non imposable
					</td>
				</tr>								
				<tr>
					<td class="labelImpair" colspan="2">Revenu fiscal de référence
					</td>
					<td class="textImpair">23 503 €
					</td>
				</tr>							

			</tbody></table>
			
			<div id="situationPartielle">
			</div>
				
			<div id="boutonsAvis">		
				<a class="nouvelle_recherche" href="/secavis/">			
					Nouvelle recherche				
				</a>
			 </div>

		</div>
		<div id="bas_page">© Ministère de l'Économie et des Finances</div><img src="https://logs1279.xiti.com/hit.xiti?s=532158&amp;s2=3&amp;p=AFFICHAGE::Avis_Sans_Correctif_erreur_pas_javascript&amp;" alt="" height="1" width="1" />
	</div>
</body>
</html>`;

describe('The match fucntion', () => {
  const $ = cheerio.load(rawOuput);
  const cells = $('td').contents().toArray();

  it('matches string values', () => {
    const nameMatcher = {
      regex: /^Nom(?! de)(?!bre)/,
      format: formatString,
    };

    const result = match(cells, nameMatcher);

    expect(result).toEqual('MOUSTAKI');
  });

  it('returns undefined for missing values', () => {
    const missingMatcher = {
      regex: /^Yolo/,
      format: formatString,
    };

    const result = match(cells, missingMatcher);

    expect(result).toBeUndefined();
  });

  it('matches dates', () => {
    const creationDateMatcher = {
      regex: /^Date d'/,
      format: formatDate,
    };

    const result = match(cells, creationDateMatcher);

    expect(result).toEqual(new Date('07-09-2019'));
  });

  it('matches a second person', () => {
    const secondPersonBirthNameMatcher = {
      regex: /^Nom de naissance/,
      format: formatString,
      offset: 2,
    };

    const result = match(cells, secondPersonBirthNameMatcher);

    expect(result).toEqual('MOUSTACROUTE');
  });

  it('matches non taxable notice', () => {
    const taxAmountMatcher = {
      regex: /^Montant de l'imp/,
      format: formatMoney,
    };

    const result = match(cells, taxAmountMatcher);

    expect(result).toBeUndefined();
  });

  it('matches money', () => {
    const incomeMatcher = {
      regex: /^Revenu fiscal de référence/,
      format: formatMoney,
    };

    const result = match(cells, incomeMatcher);

    expect(result).toEqual(23503);
  });

  it('matches float numbers', () => {
    const sharesCountMatcher = {
      regex: /^Nombre de part/,
      format: formatFloat,
    };

    const result = match(cells, sharesCountMatcher);

    expect(result).toEqual(1.0);
  });

  it('matches the address', () => {
    const addressLine1Matcher = {
      regex: /Adresse déclarée/,
      format: formatString,
      offset: 3,
    };
    const addressLine2Matcher = {
      regex: /Adresse déclarée/,
      format: formatString,
      offset: 6,
    };

    const addressLine1 = match(cells, addressLine1Matcher);
    const addressLine2 = match(cells, addressLine2Matcher);

    expect(addressLine1).toEqual('19 RUE DES ROSIERS');
    expect(addressLine2).toEqual('75002 PARIS');
  });
});
