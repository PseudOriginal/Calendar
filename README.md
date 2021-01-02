Synopsis Node JS

Nom du projet : C@lendar

Description du projet : Un calendrier en ligne gratuit pour planifier toutes vos activités et dont vous recevez les notifications de rappel via mail



Membres de l’équipe : Adrien DEMAGNY, Hadrien TOURNES, Kevin NAGELS, Thomas SELVA, Yefan GUO


<b>1. Synthèse du sujet posé et analyse</b>

Le sujet posé consiste à réaliser une application web répondant à un besoin spécifique, le domaine ainsi que le design de l’application sont libres. Notre application devra comporter au moins une base de données. 

Il faudra respecter les contraintes de temps (deadline le 15 décembre 2020 à 23h59) ainsi que de moyens mis à notre disposition (aucun budget, équipe de 5 personnes à temps partiel).
Les tâches à réaliser vont de la conception de l'application jusqu'au déploiement de cette dernière. 

Dans ce document nous allons établir la conception de notre application.

Nous sommes partis du simple constat que mis à part les calendriers développés par les géants du numérique, il était difficile d’utiliser un calendrier en ligne et de manière gratuite. En effet, malgré l’existence du format ical standardisant l’échange de calendrier entre les différentes applications, bien souvent les utilisateurs ont plusieurs calendriers différents (Microsoft, Google…) mais qui ne sont pas forcément synchronisés.

Notre proposition de valeur c’est de vous fournir une plateforme en ligne gratuite regroupant tous vos calendriers. Vous aurez la possibilité de recevoir des emails de rappel ainsi que des demandes de rendez-vous pour optimiser votre temps ! Vous pourrez modifier vos calendriers, les importer ou même les exporter.

Nous sommes bien conscients qu’il existe déjà des solutions répondant partiellement au problème, qui ont d’ailleurs déjà été évoquées dans ce document. Par exemple, Microsoft Teams pour la gestion des rendez-vous et des réunions en ligne ou Google Calendar pour le regroupement de calendriers. Mais nous avons aussi remarqué que ces solutions nécessitent la création de comptes sur des groupes déjà considérés comme des géants du numérique, c’est pourquoi nous préférons vous fournir la possibilité de créer un compte sur notre plateforme qui ne fournira pas toutes vos données à ces géants du numérique.

Pour conclure, nous pouvons donc résumer le problème auquel nous souhaitons répondre ainsi :
- Stocker ces calendriers en ligne
- Regroupement de calendriers
- Création de compte dont les données sont vraiment privées
- Gestion des rendez-vous (de la planification à la réalisation)
- Rappel des événements importants

<b>2. Synthèse du travail de conception</b>


Nous allons maintenant évoquer les différentes solutions aux sous-problèmes. Pour commencer, pour répondre au premier sous-problème, la solution est assez simple, en effet, il nous suffit de créer une interface de calendrier qui a été évoquée précédemment.

Pour le deuxième sous-problème, le regroupement des calendriers, il suffit d’ajouter un système d’exportation et d’importation de calendriers, sachant qu’un système standard, l’ical, existe déjà. La création de multiples calendriers serait un plus.

Pour le sous-problème suivant, la création de compte “privé”, nous comptons y répondre simplement en ne vendant pas les différentes données des utilisateurs. De plus, nous réfléchissons aussi à la possibilité de créer des calendriers sans avoir de compte.

Concernant la gestion des rendez-vous, de la planification à la réalisation, nous comptons mettre en place la possibilité d’inviter des personnes à un événement. Pour ce qui est de la réalisation, nous hésitons à mettre en place la possibilité de faire les réunions directement via notre calendrier, sur le navigateur internet.

Pour le dernier sous-problème, l’utilisateur recevra des notifications push via email à un temps donné (configuré par l’utilisateur lors de la création ou de l’édition d’un événement) avant le début de chaque événement, s’il le souhaite.

Etant donné que toutes ces solutions s’assemblent parfaitement sous la forme d’un calendrier en ligne, c’est ce que nous souhaitons mettre en place, comme dit dans les paragraphes précédents.


<b>3. Présentation de la feuille de route projet</b>


Nous avons trois lignes de développement : le frontend qui gère le calendrier, le backend au niveau de la gestion des comptes ainsi que de la sauvegarde des calendriers associés aux comptes, et enfin le backend avec l’envoi automatique des notifications par mail.
Pour dérouler le développement de ces trois lignes simultanément nous allons adopter une approche agile, structurée suivant 3 sprints.
 
Le temps de travail nécessaire peut s’estimer de la manière suivante pour chaque tâche :	
- Nous devons avoir la possibilité de créer un compte : 2
- il faut pouvoir s’identifier à ce compte : 1
- Nous pouvons créer, éditer, supprimer un événement dans le planning  : 2
- Nous pouvons ainsi notifier l’utilisateur en faisant des rappels avant le début d'un événement via l'email de l'utilisateur : 4
- Comme nous souhaitons regrouper des calendriers, il est essentiel de pouvoir en importer : 2
- De plus, nous pouvons exporter le planning et l’utiliser par exemple dans l’agenda d’autres applications : 2

Où l’unité estimée n’est pas un temps déjà fixé puisqu’en agile nous devons au moins réaliser un sprint pour estimer la vitesse de l’équipe.

Pour la répartition des tâches nous devons prendre en compte les obligations de chacuns entre les cours, les jours en entreprise pour ceux en alternance, les autres projets qui débutent tous en même temps et enfin les imprévus dû au contexte tout particulier.


Le premier sprint prendrait fin le 15 novembre 2020, le second sprint durerait 2 semaines et se terminerait le 29 novembre 2020, enfin le dernier sprint jusqu’à la date de rendu le 15 décembre 2020.

Nous devons encore créer les sous-tâches correspondantes à la mise en place progressive de chaque fonctionnalité mais l’objectif du sprint 1 c’est de commencer l’implémentation du serveur mail, faire la page de login en front, et mettre en place la bbd du serveur pour les comptes. Ce qui fera que nous pourrons nous connecter et créer un compte.

Pour le sprint 2, l’objectif est de pouvoir gérer le calendrier sur le front, le sauvegarder sur le serveur, et le récupérer lors de la connexion. D’autre part, l'implémentation du serveur mail continue.

Pour le sprint 3 : déploiement en ligne, finition des fonctionnalités.

Au vu de la durée relativement courte du projet, au vu des impératifs nombreux de l’équipe et au vu des sprint très réguliers, nous ne ferons pas de points d'avance particuliers.


<b>4. Présentation des objectifs du prototype initial</b>

- Nous allons commencer par lister les fonctionnalités les plus essentielles : 
- Nous devons avoir la possibilité de créer un compte
- Dans cette même logique, il faut pouvoir s’identifier à ce compte
- Nous pouvons créer, éditer, supprimer un événement dans le planning 
- Nous pouvons ainsi notifier l’utilisateur en faisant des rappels avant le début d'un événement via l'email de l'utilisateur
- Comme nous souhaitons regrouper des calendriers, il est essentiel de pouvoir en importer
- De plus, nous pouvons exporter le planning et l’utiliser par exemple dans l’agenda d’autres applications

Ainsi que les fonctionnalités qui ne sont pas vitales pour l’application, mais tout de même importantes : 
- Gérer son compte (modifier son email par exemple)
- Personnaliser l’affichage des événements (couleurs, labels, …)
- Créer un calendrier sans compte
- Créer plusieurs calendriers
- Personnaliser l’arrière plan du calendrier/des events
- Demande de rdv

Pour ce qui concerne les limites de notre application, comme cela a été évoqué dans les paragraphes ci-dessus, nous avons pensé à ajouter une fonctionnalité permettant de faire directement les rendez-vous en ligne, et une autre permettant de voir les disponibilités en ligne. Mais, au vu du temps qui nous a été donné pour faire ce projet et des projets à faire en parallèle de celui-ci, nous en avons déduit qu’il serait impossible d’ajouter ces fonctionnalités pour la première version. De même pour les notifications push (les alertes sur le système du téléphone ou de l’ordinateur) qui nous ont paru trop compliquées et peu importantes pour apparaître dans la première version. Mais si ce projet avait continué au-delà de la date fixée par ce cours, ces fonctionnalités auraient alors été implémentées.
---------
