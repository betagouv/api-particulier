import axios from 'axios';
import {format, parse} from 'date-fns';
import {chunk, findIndex, flatten} from 'lodash';
import {Person} from 'src/domain/data-fetching/data-providers/cnaf/dto';
import fakeReponses from './fake-responses.json';

(async () => {
  try {
    console.log('Start to populate Airtable');
    const people: Person[] = [];
    const peopleIdMap: {allocataires: number[]; enfants: number[]}[] = [];

    fakeReponses.forEach(data => {
      const {allocataires, enfants} = data.response;

      const allocatairesIds = allocataires.map(allocataire => {
        const parsedAllocataire = {
          nomPrenom: allocataire.nomPrenom,
          dateDeNaissance: parse(
            allocataire.dateDeNaissance,
            'ddmmyyyy',
            new Date()
          ),
          sexe: allocataire.sexe,
        };
        let index = findIndex(people, parsedAllocataire);
        if (index === -1) {
          index = people.length;
          people.push(parsedAllocataire);
        }
        return index;
      });
      const enfantsIds = enfants.map(enfant => {
        const parsedEnfant = {
          nomPrenom: enfant.nomPrenom,
          dateDeNaissance: parse(
            enfant.dateDeNaissance,
            'ddmmyyyy',
            new Date()
          ),
          sexe: enfant.sexe,
        };
        let index = findIndex(people, parsedEnfant);
        if (index === -1) {
          index = people.length;
          people.push(parsedEnfant);
        }
        return index;
      });

      peopleIdMap.push({allocataires: allocatairesIds, enfants: enfantsIds});
    });
    console.log(
      `There are ${peopleIdMap.length} rows to create with ${people.length} people to create`
    );

    const peopleIds = flatten(
      await Promise.all(
        chunk(people, 10).map(async peopleChunk => {
          const {data} = await axios.post(
            `${process.env.AIRTABLE_CNAF_API_URL}/Personnes`,
            {
              records: peopleChunk.map(person => ({
                fields: {
                  nomPrenom: person.nomPrenom,
                  dateDeNaissance: format(person.dateDeNaissance, 'yyyy-MM-dd'),
                  sexe: person.sexe,
                  "Foyers en tant qu'allocataire": [],
                },
              })),
            },
            {
              headers: {
                Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
              },
            }
          );
          const ids = data.records.map((record: {id: string}) => record.id);
          return ids;
        })
      )
    );

    await Promise.all(
      chunk(fakeReponses, 10).map(async (responsesChunk, chunkIndex) => {
        const peopleIndex = chunkIndex * 10;
        const foyers = responsesChunk.map((response, index) => ({
          fields: {
            numeroAllocataire: response.numeroAllocataire,
            codePostal: response.codePostal,
            'adresse.complementIdentiteGeo':
              response.response.adresse.complementIdentiteGeo !== '0'
                ? response.response.adresse.complementIdentiteGeo
                : undefined,
            'adresse.numeroRue': response.response.adresse.numeroRue,
            'adresse.codePostalVille':
              response.response.adresse.codePostalVille,
            'adresse.pays': response.response.adresse.pays,
            'adresse.identite': response.response.adresse.identite,
            quotientFamilial:
              typeof response.response.quotientFamilial !== 'number'
                ? parseInt(response.response.quotientFamilial)
                : response.response.quotientFamilial,
            mois:
              response.response.mois !== undefined &&
              typeof response.response.mois !== 'number'
                ? parseInt(response.response.mois)
                : response.response.mois,
            annee:
              typeof response.response.annee !== 'number'
                ? parseInt(response.response.annee)
                : response.response.annee,
            allocataires: peopleIdMap[peopleIndex + index].allocataires.map(
              personId => peopleIds[personId]
            ),
            enfants: peopleIdMap[peopleIndex + index].enfants.map(
              personId => peopleIds[personId]
            ),
          },
        }));
        await axios.post(
          `${process.env.AIRTABLE_CNAF_API_URL}/Foyers`,
          {
            records: foyers,
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
            },
          }
        );
      })
    );

    console.log('Data loaded!');
  } catch (e) {
    if (axios.isAxiosError(e)) {
      console.log(e.response?.data);
    }
    console.log(e);
  }
})();
