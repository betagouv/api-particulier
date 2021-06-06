import {Scope} from '../application/application.aggregate';
import {DGFIPOutput} from './dto';
import {DGFIPScopesFilter} from './scopes.filter';

describe('DGFIP scopes filter', () => {
  const unfilteredData: DGFIPOutput = {
    declarant1: {
      nom: 'Mousterie',
      prenoms: 'Claude',
      dateNaissance: new Date('1986-06-02'),
      nomNaissance: 'Mousterie',
    },
    declarant2: {
      nom: 'Mousterie',
      prenoms: 'Jeanne',
      dateNaissance: new Date('1988-11-07'),
      nomNaissance: 'Arc',
    },
    dateRecouvrement: new Date('2022-02-01'),
    dateEtablissement: new Date('2021-09-01'),
    nombreParts: 2,
    situationFamille: 'pacsé',
    nombrePersonnesCharge: 0,
    revenuBrutGlobal: 56000,
    revenuImposable: 56000,
    impotRevenuNetAvantCorrections: 4700,
    montantImpot: 4700,
    revenuFiscalReference: 56000,
    foyerFiscal: {
      annee: 2021,
      adresse: '5 rue des Rosiers 75001 Paris',
    },
    anneeImpots: 2021,
    anneeRevenus: 2020,
    erreurCorrectif: '',
    situationPartielle: '',
  };
  const {filter} = new DGFIPScopesFilter();

  it('fiters according to dgfip_adresse scope', () => {
    const scopes: Scope[] = ['dgfip_adresse'];

    const filteredResult = filter(unfilteredData, scopes);

    expect(filteredResult).toMatchInlineSnapshot(`
Object {
  "anneeImpots": 2021,
  "anneeRevenus": 2020,
  "declarant1": Object {
    "dateNaissance": 1986-06-02T00:00:00.000Z,
    "nom": "Mousterie",
    "nomNaissance": "Mousterie",
    "prenoms": "Claude",
  },
  "declarant2": Object {
    "dateNaissance": 1988-11-07T00:00:00.000Z,
    "nom": "Mousterie",
    "nomNaissance": "Arc",
    "prenoms": "Jeanne",
  },
  "erreurCorrectif": "",
  "foyerFiscal": Object {
    "adresse": "5 rue des Rosiers 75001 Paris",
    "annee": 2021,
  },
  "situationPartielle": "",
}
`);
  });
});
