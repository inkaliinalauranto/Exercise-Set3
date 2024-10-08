# Tehtäväsarja 3

## Esivalmistelut

Tämä tehtävä on tehty Hono-projektina npm-paketinhallintaohjelmalla. Tietokanta on toteutettu Drizzle ORM -kirjastoa hyödyntämällä. Hono-projektin juureen on luotu drizzle.config.ts-tiedosto ja db-kansio. drizzle.config.ts-tiedostossa on Drizzle ORM -kirjaston käyttöön liittyviä määrittelyjä. Konfiguraatiofunktiokutsussa määritellään muun muassa, että käytetään SQLite-tietokantaa. Lisäksi määritellään polku tiedostoon, jossa tietokannan rakenne on määritelty, sekä tietokannan tiedostonimi.

![alt text](image.png)

Projektin juureen on luotu myös db-kansio, jonne on tehty schema.ts- ja sqlite_db.ts-tiedostot. Valmiissa projektissa schema.ts-tiedostosta löytyy tietokantataulut ja tietokantarelaatiot, jotka on määritelty Drizzle ORM -kirjaston metodien avulla omiin muuttujiinsa. sqlite_db.ts-tiedossa Database-luokasta instantioidaan sqlite.db-niminen tietokanta ja db-muuttujaan luodaan yhteys tähän tietokantaan.

![alt text](image-1.png)

Jotta tietokannan luonti ja sen tarkastelu Drizzle Studio -työkalun avulla onnistuu, on projektin package.json-tiedostossa olevan objektin scripts-avaimessa olevan objektin sisään lisätty generate-, migrate- ja studio-avaimet arvoineen. Jos devDepedencies-avaimen objektilta ei löydy @types/better-sqlite3-avainta, pitää se lisätä erikseen komentoterminaalin kautta ajamalla projektin juurisijainnissa komento npm install @types/better-sqlite3 --save-dev.

![alt text](image-2.png)

1. Toteuta määrittelyn pohjalta valitsemaasi tietokantaratkaisuun tarvittavat muutokset

A) Lisätään tietokantaan posts-taulu määritellyn datarakenteen pohjalta:

Luodaan Drizzle ORM -kirjaston avulla sqlite.db-niminen tietokanta. 

![The code for creating posts table](img_1a.png)

Ajetaan komentoterminaalissa projektin juurisijainnissa ensin komento npm run generate, sitten npm run migrate ja lopuksi npm run studio, minkä jälkeen tietokanta posts-taululla on luotu. Projektin juuresta löytyy tämän jälkeen sqlite.db-niminen tietokanta. Lisäksi luotua tietokannan taulua pääsee tarkastelemaan Drizzle Studiossa osoittessa https://local.drizzle.studio/. posts-taulusta löytyy nyt posts-muuttujaan määritellyt sarakkeet:

![alt text](image-3.png)
