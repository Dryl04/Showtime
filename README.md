# Showtime

Application web de réservation de concerts : catalogue de concerts et de groupes, réservation de
billets avec QR code, liste d'envies, notifications par e-mail et tableau de bord d'administration.
Rendu côté serveur (NestJS + EJS) et API REST JSON en parallèle.

> Projet réalisé à Epitech.

## Fonctionnalités

- **Authentification** : inscription, connexion, JWT (Passport) stocké en cookie, mots de passe hachés
  (bcrypt), rôles utilisateur / administrateur.
- **Concerts** : liste, recherche, fiche détaillée, création et modification.
- **Groupes** : liste, fiche, création, modification, recherche par nom.
- **Réservations** : formulaire de réservation, « mes réservations », billet détaillé avec **QR code**.
- **Liste d'envies et favoris** : concerts et groupes suivis par l'utilisateur.
- **Notifications e-mail** (Nodemailer, gabarits EJS) : nouveau concert, rappel de concert,
  événement d'un artiste.
- **Administration** : tableau de bord, activité, gestion des utilisateurs (promotion admin, suppression).
- **API REST** sous `/api` (concerts, groupes, réservations, utilisateurs, liste d'envies, admin) ;
  collection Postman fournie : `My Show Time API.postman_collection.json`.
- Sécurité : Helmet (CSP), validation des entrées (class-validator).

## Stack

NestJS · TypeScript · MongoDB / Mongoose · EJS · Tailwind CSS (CDN) · Passport JWT · bcrypt ·
Nodemailer · @nestjs/schedule · qrcode · Jest.

## Lancer le projet

Prérequis : Node.js, une base MongoDB et un serveur SMTP.

```bash
cp .env.example .env     # PORT, MONGODB_URI, JWT_SECRET, JWT_EXPIRES_IN, SMTP_*
npm install
npm run start:dev        # mode développement avec rechargement
npm run build && npm run start:prod
```

Tests :

```bash
npm run test
npm run test:e2e
```

## Structure

```
src/auth/           inscription, connexion, stratégie JWT
src/concerts/       concerts (pages + API)
src/groups/         groupes (pages + API)
src/bookings/       réservations et billets
src/qr/             génération des QR codes
src/wishlist/       liste d'envies
src/users/          profils et favoris
src/notifications/  e-mails et gabarits
src/admin/          tableau de bord d'administration
src/views/          vues EJS
```
