## Bienvenue sur la documentation interactive d'API Particulier.

Pour utiliser API Particulier en production (particulier.api.gouv.fr), vous
devez obtenir un token de production. Pour ce faire, veuillez remplir une
[demande d'autorisation](http://signup.api.gouv.fr).

Pour faire un appel à API Particulier vous devez disposer de deux
informations : un token d'API et les informations d'identification d'un
particulier.

Pour les données issues de la DGFIP, les informations d'identification d'un
particulier sont : le numéro fiscal et le numéro d'avis d'imposition.

Pour les données issues de la CAF, les informations d'identification d'un
particulier sont : le numéro d'allocataire et le code postal.

Pour les données issues de Pôle Emploi, les informations d'identification
d'un particulier sont : le numéro d'identifiant Pôle Emploi, PeamU.

Pour les données issues de MESRI, les informations d'identification d'un
particulier sont : l'Identifiant National Étudiant, INE.

Vous trouverez ci-dessous de quoi exécuter des requêtes HTTP sur
l'environnement API Particulier de test (particulier-test.api.gouv.fr). Lors
du développement de votre solution logicielle, nous vous recommandons
d'utiliser cet environnement.

## L'environnement de test

L'environnement de test est fonctionnellement identique à l'environnement de
production.

Le token d'API à utiliser est un token de test.

Les données retournées sont des données de test.

### Token de test

Voici la liste des clés d'API de tests. Chacun donne accès à un _scope_
différent.

Les clés d'API de bac à sable sont des chaines alphanumériques de 32 caractères et des UUIDv4, les clés d'API de production sont des UUIDv4.

| Scope |
Token |

|------------------------------------------------------------|----------------------------------|

| DGFIP - Avis d'imposition |
83c68bf0b6013c4daf3f8213f7212aa5 |

| DGFIP - Adresse |
02013fe1b5221dd7d914e4406fb88891 |

| CNAF - Quotient familial |
73af98c480aa3abfd38830ec5c5354d8 |

| CNAF - Situation familiale |
3841b13fa8032ed3c31d160d3437a76a |

| CNAF - Adresse |
e0a109ba-8e2b-4809-95c5-6a818dda2351 |

| CNAF - Enfants |
ce469960-7bfc-401d-8599-686d158939ae |

| CNAF - Allocataires |
ea903339-692b-4cc2-96b3-09a2d6acd4d2 |

| "DGFIP - Avis d'imposition" et "CNAF - Situation familiale"|
d7e9c9f4c3ca00caadde31f50fd4521a |

| "DGFIP - Avis d'imposition", "CNAF - Situation familiale" et "CNAF - Quotient Familial"|
fb156a4e-d497-480f-b3ef-9bc1bccdfbb9 |

| Pôle Emploi - Identité, Contact, Adresse et Inscription |
fd38830c480221d0ff0b6013c4de6c32 |

| Pôle Emploi - Identité |
d76d8c36-f49d-4c26-b849-7466a9faf0d6 |

| Pôle Emploi - Contact |
b70015d5-6ecd-48a6-9a2b-9fdb9fdf1c67 |

| Pôle Emploi - Adresse |
438e839a-da85-4e10-a314-98092b856989 |

| Pôle Emploi - Inscription |
d726502d-ac6d-483f-b8b8-c9ba239547a6 |

| Statut Étudiant |
1b8bea9a1df409af64c995e58014f642 |

    **Important :** la taille du jeu de données retournées dépend du *scope* de la clé d'API utilisée. Certaines clés n'autorisent qu'un nombre réduit de données. Ainsi, suivant la clé utilisée, une même requête peut retourner des résultats différents. En effet, les disposition de l'article [L144-8](https://www.legifrance.gouv.fr/affichCodeArticle.do?cidTexte=LEGITEXT000031366350&idArticle=LEGIARTI000031367412&dateTexte=&categorieLien=cid) n'autorise que l'échange des informations **strictement nécessaires** pour traiter une démarche. En conséquence, pendant vos tests, assurez-vous d'utiliser la clé d'API associée au *scope* correspondant aux données auxquelles vous aurez accès d'un point de vue légal.

### Données de test

Des informations d'identification de particuliers de test sont disponibles
en ligne :

1. [données de la
   CAF](https://github.com/betagouv/api-particulier/blob/master/api-particulier/api/caf/fake-responses.json)

2. [données des
   impôts](https://airtable.com/invite/l?inviteId=inv3ImCypw30uuLK9&inviteToken=0482ffbcc5d830fb6a409161fc372635a48b6bbcffdcde552f5be4290f80db50)

3. [données de Pôle
   Emploi](https://airtable.com/invite/l?inviteId=inv1n0CkFzq3Y0pvn&inviteToken=a5b49ec5bb9d2323df4adbdfc6c65da35a2248af30c38095101b3cca6ea0898a)

4. [données du statut étudiant -
   étudiants](https://airtable.com/shrh9q7Kg4UaIllHA) et [données du statut
   étudiant - inscriptions](https://airtable.com/shrjMnKbwlgllQ1Im)

Si vous souhaitez tester un cas qui n'est pas encore présent, nous vous
invitons à ajouter le cas :

1. dans [la liste des cas de
   test](https://airtable.com/invite/l?inviteId=inv3ImCypw30uuLK9&inviteToken=0482ffbcc5d830fb6a409161fc372635a48b6bbcffdcde552f5be4290f80db50)
   pour les données des impôts

2. dans [la liste des cas de
   test](https://airtable.com/invite/l?inviteId=inv1n0CkFzq3Y0pvn&inviteToken=a5b49ec5bb9d2323df4adbdfc6c65da35a2248af30c38095101b3cca6ea0898a)
   pour les données Pôle Emploi

3. dans [le formulaire d'ajout d'étudiants de
   test](https://airtable.com/shrLBFosU8hgXU63F) et [le formulaire d'ajout
   d'inscriptions de test](https://airtable.com/shroKDzaHry2Gv3t1) pour les
   données statut étudiant

## Comment passer de l'environnement de test à l'environnement de production

    Lors de votre passage en production :
    - remplacez l'URL de particulier-test.api.gouv.fr à particulier.api.gouv.fr
    - remplacez la clé d'API de test par la clé d'API obtenue suite à votre [demande d'autorisation](http://datapass.api.gouv.fr)
