# Documentation Utilisateur – Audiophile

## 1. Présentation générale

Audiophile permet à un utilisateur de centraliser sa musique provenant de différents services de streaming (Spotify, YouTube Music), d’analyser ses écoutes et de générer automatiquement des playlists organisées par genres et par artistes.

L’objectif principal est de transformer des bibliothèques musicales souvent désordonnées (likes, playlists mixtes) en playlists “clean”, cohérentes et faciles à écouter.

---

## 2. Création de compte utilisateur

- L’utilisateur peut créer un compte via la plateforme.
- Le compte permet de :
  - Sauvegarder les connexions aux services de musique
  - Stocker les données analysées (artistes, genres, playlists)
  - Retrouver ses playlists générées à tout moment
    ![image.png](/front/documentation/images/account_create.png)
    ![image.png](/front/documentation/images/accout_login.png)

---

## 3. Liaison des plateformes de musique

- L’utilisateur peut connecter un ou plusieurs services de streaming :
  - Spotify
  - YouTube Music
  - Deezer
  - etc.
- La connexion se fait via les systèmes d’authentification officiels (OAuth).
- Une fois lié, la plateforme obtient l’autorisation de :
  - Lire les artistes écoutés
  - Accéder aux musiques likées
  - Accéder aux playlists de l’utilisateur

---

## 4. Récupération des artistes et playlists écoutés

- La plateforme récupère la liste des artistes écoutés par l’utilisateur ainsi que ses playlists.
- Les playlists sont affiché sur la plateforme le temps de la connexions:
  - Ces donnés ne sont pas stocké

![image.png](/front/documentation/images/main_page.png)

---

## 5. Traitement des playlists existantes

---

- L’utilisateur peut filtrer ses playlists existantes depuis les plateformes connectées.
- Pour chaque playlist :
  - Les titres sont analysés individuellement
  - Les genres sont déterminés via les artistes
- Le résultat permet de créée une nouvelle playlist propres et cohérentes

## 7. Playlists créées par l’application

- Les playlists crées par l’application sont :
  - Stocké par celle-ci
  - Lié au compte de l’utilisateur
- Les playlists créées par l’application peuvent :
  - Être consultées depuis la plateforme
  - Être exportées vers les services de streaming liés
- L’utilisateur garde le contrôle sur :
  - Les plateformes de destination
  - Les playlists qu’il souhaite synchroniser ou non
