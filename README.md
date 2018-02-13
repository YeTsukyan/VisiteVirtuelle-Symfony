# Visite Virtuelle Immobilière
Visite Virtuelle Immobilière est un projet du BTS SN option IR du [lycée Antoine Bourdelle] de Montauban.
L'objectif du projet consiste créer une application Web destinée aux Agences Immobilières en leur permettant de créer des visites en vue 360° qui peuvent être visité par leurs clients.

-----

## Répertoires

### Documents
Documents pour le projet Visite Virtuelle Immobilière

https://github.com/VisiteVirtuelle/Documents

### VisiteVirtuelle-Symfony
Application web (avec framework Symfony) de Visite Virtuelle

https://github.com/VisiteVirtuelle/VisiteVirtuelle-Symfony

-----

## Installation
1. S'assurer que PHP est bien installé/présent dans le PATH avec `php -V`
2. Installer les dépendances :
   * Téléchargement de composer `php -r "readfile('https://getcomposer.org/installer');" | php`
   * Installation des dépendances `php composer.phar install`
3. Création de la base de données :
   * Création de la base de données `php bin/console doctrine:database:create`
   * Création des tables `php bin/console doctrine:schema:update --force`

-----

## Équipe
* Vincent CLAVEAU
* Malko CARRERAS
* Valentin PILLON
* Guillaume VIDAL
* Thomas DUDITLIEUX

## Organisation du projet
**Trello:** https://trello.com/b/lRY92q0W/organisation

[lycée Antoine Bourdelle]: http://bourdelle.entmip.fr/
