## Bienvenue sur la documentation interactive d'API Particulier.

### Commencer à utiliser l'API

API Particulier est une API en accès restreint, ce qui signifie qu'il vous faut remplir une [demande d'habilitation](https://datapass.api.gouv.fr) avant de pouvoir l'utiliser avec des vraies données.

Afin de vous permettre de commencer à utiliser l'API avant la validation de votre demande d'habilitation, nous avons mis en place un bac à sable de l'API, qui reproduit les comportements de l'API, en remplaçant les données réelles par des données fictives.

Dans le bac à sable, pour chaque type de donnée disponible, un jeu de donnée libre en édition est mis à votre disposition, afin que vous puissiez faire vos tests en toute autonomie.

Le fonctionnement du bac à sable est identique à celui de la véritable API de production, à la différence près que les données sont fictives, éditables par tout le monde, et que les jetons d'accès sont en libre service.

Pour utiliser un jeton France Connect, cliquez sur Authorize (plus bas sur la page) puis entrez la valeur du jeton obtenu suite à une cinématique de  connexion France Connect.

Le bac à sable et l'API de production sont appellables par deux adresses distinctes :

- bac à sable : https://particulier-test.api.gouv.fr/api
- production : https://particulier.api.gouv.fr/api


### Périmètre des données retournées

**Important :** le contenu du jeu de données retourné dépend des _scopes_ associés à votre accès FranceConnect.

En effet, les disposition de l'article [L144-8](https://www.legifrance.gouv.fr/affichCodeArticle.do?cidTexte=LEGITEXT000031366350&idArticle=LEGIARTI000031367412&dateTexte=&categorieLien=cid) n'autorisent que l'échange des informations **strictement nécessaires** pour traiter une démarche.

Afin de respecter ce devoir de minimisation de la donnée, chaque jeton est associé, par la demande d'habilitation, à des _scopes_ agissant comme des masques sur la donnée.

Ainsi, pour pouvoir lire de la donnée provenant de la DGFIP par exemple, il est nécessaire de cocher lors de votre [demande d'habilitation](https://datapass.api.gouv.fr) une ou plusieurs cases correspondant aux données de la DGFIP, votre jeton possèdera alors les _scopes_ associés aux données cochées.

En conséquence, suivant les accès conférés, une même requête peut retourner des résultats différents.

**Attention :** La documentation ci-dessous ne prend pas en compte les _scopes_, qui agissent comme masques de la donnée retournée par l'API. Cette documentation suppose donc que vous avez été habilité à accéder à la donnée décrite.
