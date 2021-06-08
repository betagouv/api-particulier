/* eslint-disable no-irregular-whitespace */
import {SvairDataProvider} from './svair.data-provider';
import axios from 'axios';
// eslint-disable-next-line node/no-unpublished-import
import MockAdapter from 'axios-mock-adapter';
import {DGFIPInput} from '../dto';

describe('Svair data provider', () => {
  const svairDataProvider = new SvairDataProvider();
  const mock = new MockAdapter(axios);
  const expectedViewState = 'the-view-state';
  mock
    .onGet()
    .reply(
      200,
      `<input name="javax.faces.ViewState" value="${expectedViewState}">`
    );

  it('loads the JSF view state', async () => {
    const actualViewState = await svairDataProvider.getViewState();
    expect(actualViewState).toEqual(expectedViewState);
  });

  it('reads data in the response html', async () => {
    const input: DGFIPInput = {
      taxNumber: '3',
      taxNoticeNumber: '20B123',
    };
    mock.onPost().reply(
      200,
      `<!DOCTYPE html>
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
					<td class="labelPair">
					</td>
				</tr>
				<tr>
					<td class="labelImpair">Nom de naissance
					</td>
					<td class="labelImpair">MOUSTAKI
					</td>
					<td class="labelImpair">
					</td>
				</tr>
				<tr>
					<td class="labelPair">Prénom(s)
					</td>
					<td class="labelPair">GEORGES
					</td>
					<td class="labelPair">
					</td>
				</tr>
				<tr>
					<td class="labelImpair">Date de naissance
					</td>
					<td class="labelImpair">03/05/1976
					</td>
					<td class="labelImpair">
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
</html>`
    );
    const data = await svairDataProvider.fetch(input);

    expect(data).toEqual({
      anneeImpots: '2019',
      anneeRevenus: '2018',
      dateEtablissement: '09/07/2019',
      dateRecouvrement: '31/07/2019',
      declarant1: {
        dateNaissance: '03/05/1976',
        nom: 'MOUSTAKI',
        nomNaissance: 'MOUSTAKI',
        prenoms: 'GEORGES',
      },
      declarant2: {
        dateNaissance: '',
        nom: '',
        nomNaissance: '',
        prenoms: '',
      },
      foyerFiscal: {
        adresse: '19 RUE DES ROSIERS 75002 PARIS',
        annee: 2020,
      },
      impotRevenuNetAvantCorrections: 2074,
      montantImpot: null,
      nombreParts: 1,
      nombrePersonnesCharge: 0,
      revenuBrutGlobal: 23503,
      revenuFiscalReference: 23503,
      revenuImposable: 23504,
      situationFamille: 'Célibataire',
    });
  });
});
