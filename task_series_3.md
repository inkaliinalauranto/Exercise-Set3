# Tehtäväsarja 3

## Esitiedot

Tämä tehtävä on tehty Hono-projektina npm-paketinhallintaohjelmalla. Tietokanta on toteutettu Drizzle ORM -kirjastoa hyödyntämällä. Hono-projektin juureen on luotu drizzle.config.ts-tiedosto ja db-kansio. drizzle.config.ts-tiedostossa on Drizzle ORM -kirjaston käyttöön liittyviä määrittelyjä. Konfiguraatiofunktiokutsussa määritellään muun muassa, että käytetään SQLite-tietokantaa. Lisäksi määritellään polku tiedostoon, jossa tietokannan rakenne on määritelty, sekä tietokannan tiedostonimi.

<img src="./assets/image-1.png" alt="Drizzle ORM -kirjaston määrittelytiedosto" style="width: 60%;"/>

Projektin juureen on luotu myös db-kansio, jonne on tehty schema.ts- ja sqlite_db.ts-tiedostot. Valmiissa projektissa schema.ts-tiedostosta löytyy tietokantataulut ja tietokantarelaatiot, jotka on määritelty Drizzle ORM -kirjaston metodien avulla omiin muuttujiinsa. sqlite_db.ts-tiedossa Database-luokasta instantioidaan sqlite.db-niminen tietokanta ja db-muuttujaan luodaan yhteys tähän tietokantaan:

<img src="./assets/image-2.png" alt="sqlite_db.ts-tiedosto" style="width: 60%;"/>


Jotta tietokannan luonti ja sen tarkastelu Drizzle Studio -työkalun avulla onnistuu, on projektin package.json-tiedostossa olevan objektin scripts-avaimessa olevan objektin sisään lisätty generate-, migrate- ja studio-avaimet arvoineen. Jos devDepedencies-avaimen objektilta ei löydy @types/better-sqlite3-avainta, pitää se lisätä erikseen komentoterminaalin kautta ajamalla projektin juurisijainnissa komento `npm install @types/better-sqlite3 --save-dev`.

<img src="./assets/image-3.png" alt="Drizzle ORM -kirjaston määrittelytiedosto" style="width: 40%;"/>


## Toteutus
### 1. Toteuta määrittelyn pohjalta valitsemaasi tietokantaratkaisuun tarvittavat muutokset

**A) Lisätään tietokantaan posts-taulu määritellyn datarakenteen pohjalta**

Vaatimusmäärittelyiden mukaisesti id-sarake määritellään primary keyksi primaryKey-metodin avulla. Metodi asettaa sarakkeelle automaattisesti not-null- ja auto increment -ominaisuudet. Sarake on tietotyypiltään kokonaisluku. Käyttäjältä tulevan viestin varsinaista sisältöä varten tehdään content-sarake, jonka tietotyypiksi määritellään SQLiten tietotyypeistä text. Viestillä on oltava sisältö, joten sarake määritellään not-nulliksi. created_at-sarakkeen tietotyypiksi määritellään text, ja vaatimusmäärittelyn mukaisesti automatisoidaan aikaleiman lisääminen tietokannalle määrittelemällä sarakkeelle oletusarvo Drizzlen sql-funktion avulla. Viestillä on oltava aikaleima, joten määritellään sarake not-nulliksi. parent_post_id-sarake määritellään kokonaisluvuksi tai nulliksi riippuen siitä, onko tietue aloitus- vai vastausviesti. user_id-sarake määritellään kokonaisluvuksi. Asetetaan sarake myös not-nulliksi, koska viestillä on oltava tunnistettava lähettäjä eli käyttäjä.

<img src="./assets/image-4.png" alt="posts-taulun luonti" style="width: 60%;"/>

Ajetaan komentoterminaalissa projektin juurisijainnissa ensin komento `npm run generate`, sitten `npm run migrate` ja lopuksi `npm run studio`, minkä jälkeen tietokanta posts-taululla on luotu. Projektin juuresta löytyy tämän jälkeen sqlite.db-niminen tietokanta. Luotua tietokannan taulua pääsee tarkastelemaan Drizzle Studiossa osoittessa https://local.drizzle.studio. posts-taulusta löytyy nyt posts-muuttujaan määritellyt sarakkeet:

![posts-taulu Drizzle Studiossa](./assets/image-5.png)

Suoritetaan viestin lisäävä INSERT-kysely Drizzle runnerissa:

![Tietueen lisääminen Drizzle runnerin kautta](./assets/image-6.png)

Uusi tietue on nyt lisätty posts-tauluun. Tietokanta on huolehtinut id:n ja aikaleiman generoinnin lisätylle tietueelle:

![Lisätty tietue näkyy posts-taulussa](./assets/image-7.png)

**B) Lisätään posts-tauluun viiteavain viestiin itseensä** 

Vaatimusmäärittelyn mukaan aloitusviestille voi olla vastausviestejä, minkä vuoksi viestien välille tarvitaan relaatio/viite. Koska viite tehdään tauluun itseensä, on taulussa sarake parent_post_id. Jos tämän sarakkeen arvo tietueella on null, kyseessä on aloitusviesti. Jos tietueelta löytyy sarakkeen kohdasta arvo, kyseessä on vastausviesti. Sarakkeen arvo on silloin toisen viestitietueen id. Näin ollen parent_post_id-sarake on määriteltävä viiteavaimeksi ja viite on id-sarakkeeseen. Määritellään koodissa parent_post_id-sarake  viiteavaimeksi references-metodia hyödyntämällä:

<img src="./assets/image-8.png" alt="Sarakkeen määrittely viiteavaimeksi ohjelmallisesti" style="width: 75%;"/>

Koska aloitusviestillä voi olla useita vastausviestejä mutta viestillä voi olla korkeintaan yksi "parent"-viesti, tehdään posts-taulusta one-to-many-relaatio itseensä. Määritellään relaatiot aloitusviestistä mahdollisiin vastausviesteihin ja vastausviestistä aloitusviestiin omiin muuttujiinsa.

<img src="./assets/image-9.png" alt="relaatioiden ohjelmallinen luonti" style="width: 60%;"/>

**C) Lisätään tauluun uusi sarake**

Lisätään viestitietueille title-sarake tekstitietotyypillä. Jos halutaan, että jokaisella viestillä on otsikko, määritellään sarake posts-muuttujaan not-nulliksi. Koska taulun rakenteeseen tehtiin muutoksia, on tietokanta generoitava uudelleen. Koska tietokanta on tässä vaiheessa vasta tekeillä, poistetaan projektin juuresta drizzle-kansio sisältöineen ja sqlite.db-tiedosto. Ajetaan taulua kuvaavaan post-muuttujaan tehtyjen muutosten jälkeen projektin juuressa komennot npm run generate, npm run migrate ja npm run studio. Luomiskomennon jälkeen konsoliin tulostuu tieto, että posts-niminen taulu on luotu kuudella sarakkeella ja yhdellä vierasavaimella. Nyt myös Drizzle Studiossa näkyvään posts-tauluun on ilmestynyt relaatiot ja title-sarake:

![Lisätty title-sarake posts-taulussa Drizzle Studion kautta tarkasteltuna](./assets/image-10.png)

### 2. Lisää testidataa tietokantaan

**A) Lisätään tietokantaan aloitusviesti**

Lisätään viesti Drizzle Studiossa Drizzle runnerin kautta. Koska kyseessä on aloitusviesti, lisättävän viestin parent_post_id-sarakkeen arvo on null:

![Aloitusviestin lisääminen](./assets/image-11.png)

INSERT-kyselyn jälkeen lisätty tietue näkyy posts-taulussa:

![Lisätty aloitusviesti taulussa](./assets/image-12.png)

**B) Lisätään tietokantaan vastausviesti**

Lisätään Drizzle runnerin kautta äsken lisätylle aloitusviestille vastausviesti. Nyt lisättävän tietueen parent_post_id-sarakkeen arvon on oltava viite ensimmäisenä lisättyyn tietueeseen eli aloitusviestin id.

![Vastausviestin lisääminen](./assets/image-13.png)

Tämän jälkeen lisätty vastausviesti näkyy posts-taulussa:

![Lisätty vastausviesti taulussa](./assets/image-14.png)

**C) Aloitusviestien hakeminen tietokannasta**

Lisätään tauluun vielä muutama aloitus- ja vastausviesti:

![Lisätyt tietueet näkyvät posts-taulussa](./assets/image-15.png)

Koska jokaisen aloitusviestin parent_post_id-sarakkeen arvo on NULL, saadaan aloitusviestit haettua seuraavanlaisella kyselyllä:

>SELECT * FROM posts WHERE parent_post_id IS NULL;

Haetaan aloitusviestit nyt Drizzle runnerin kautta:

![Aloitusviestien hakeminen Drizzle-kyselyllä](./assets/image-16.png)

**D) Aloitusviestin vastausten hakeminen yhdellä tietokantakyselyllä**

Koska jokaisen aloitusviestin vastausviestin parent_post_id-sarakkeessa on sama arvo eli näiden "parent"-viestin id, saadaan tietyn aloitusviestin vastaukset haettua aloitusviestin id:n perusteella seuraavantyyppisellä kyselyllä:

>SELECT * FROM posts WHERE parent_post_id = {aloitusviestin id}

Jos nyt halutaan hakea esimerkiksi ensimmäisen aloitusviestin vastausviestit, asetetaan {aloitusviestin id}-kohdan tilalle luku 1. Haetaan ensimmäisen aloitusviestin vastausviestit Drizzle runnerin kautta:

![Ensimmäisen viestin vastausten hakeminen](./assets/image-17.png)

Haetaan yhdellä tietokantakyselyllä myös sekä aloitusviesti että sen vastausviestit liittämällä kyselyyn OR-vertailu:

>SELECT * FROM posts WHERE parent_post_id = 1 OR id = 1;

![Haetaan sekä aloitusviesti että sen vastausviestit](./assets/image-18.png)

**E) Aloitusviestin poistamisen ongelma, kun sille on olemassa vastauksia**

Jos jonkin vastausviestin "parent"-viesti koitetaan poistaa, ei operaatio oletusarvoisesti onnistu viite-eheyssyistä. Relaatioilla on oletuksena no action -toiminto. Silloin tietuetta, josta on vierasavainviite toiseen tietueeseen, ei voida poistaa, jottei vierasavaimellinen tietue jää orvoksi. 

<img src="./assets/image-19.png" alt="Viite-eheysongelma aloitusviestin poistamisen yhteydessä" style="width: 70%;"/>

Vaatimusmäärittelyn mukaan vastausviestit on poistettava, kun näiden "parent"- eli aloitusviesti poistetaan. Määritellään siksi parent_post_id-sarakkeen vierasavaintoiminnoksi no action -toiminnon sijaan cascade-toiminto sekä muokkaaville että poistaville kyselyille. Toiminto huolehtii siitä, että tietueet, joissa on viiteavain poistettavasta tietueesta, poistetaan, eikä tauluun jää orpoja tietueita. Vastaavasti tietueiden viiteavaimet päivittyvät, jos niiden "parent"-tietueen primary keyn arvo päivittyy, jolloin tauluun ei jää tietueita vanhalla viitteellä. 

<img src="./assets/image-20.png" alt="Viite-eheyssäännön ohjelmallinen muuttaminen cascade-arvoon" style="width: 75%;"/>

Generoidaan ja migroidaan tietokanta, jotta vierasavaintoimintoon liittyvä muutos saadaan voimaan. Käynnistetään sen jälkeen Drizzle Studio. Huolehditaan, että aiemmin lisätyt tietueet ovat tietokannassa. Suoritetaan sitten ensimmäisen aloitusviestin poistava kysely, joka tällä kertaa onnistuu.

<img src="./assets/image-21.png" alt="Aloitusviestin poistaminen viite-eheyssäännön cascadeksi muuttamisen jälkeen" style="width: 70%;"/>

Huomataan, ettei posts-taulussa ole aloitusviestin poistamisen jälkeen myöskään viestin vastaustietueita.

![posts-taulu aloitusviestin ja sen vastausviestien poistamisen jälkeen](./assets/image-22.png)

### 3. Suunnittele ja määrittele lisäominaisuus: tykkäykset viesteihin

**A) Suunnitellun lisäominaisuuden kuvaus**

Käyttäjien on mahdollista antaa tykkäys mihin tahansa keskustelupalstan viestiin.

**B) Vaatimusmäärittely**

- Viesteissä ei oletusarvoisesti ole tykkäyksiä
- Kuka tahansa käyttäjä voi tykätä mistä tahansa viestistä
- Yksi käyttäjä voi tykätä yksittäisestä viestistä samanaikaisesti vain kerran
- Käyttäjä voi poistaa tykkäyksensä mistä tahansa viestistä
- Kun viestiä tarkastellaan, siinä olevien tykkäysten lukumäärä on käyttäjälle näkyvissä
- Kun käyttäjätili poistetaan, käyttäjän mahdolliset tykkäykset poistetaan
- Kun viesti poistetaan, siihen kohdistuvat tykkäykset poistetaan

**C) Muutosten kuvaileminen keskustelupalstan datarakenteeseen** 

Koska yksi käyttäjä voi antaa tykkäyksen monelle viestille ja yhdellä viestillä voi olla monen eri käyttäjän tykkäys, on viestin ja käyttäjän välillä many-to-many-yhteys. Luodaan tykkäyksiä kuvavastavalle yhteydelle siis välitaulu, jonka nimi voisi olla esimerkiksi likes. Taulun primary key on komposiittiavain, joka muodostuu viiteavaimista posts- ja users-tauluihin. likes-taululla on siis kaksi saraketta: user_id ja post_id, jotka kumpikin ovat viiteavaimia. 

Kun käyttäjä tykkää viestistä, likes-tauluun lisätään esimerkiksi web-ohjelmointirajapintafunktion kautta tietue, jossa on tykätyn viestitietueen id sekä tykkäyksen antaneen käyttäjän id. Koska primary keyn on oltava ainutlaatuinen (Yasar 2022), voi yhdellä käyttäjällä yhtä viestiä kohtaan olla likes-taulussa ainoastaan yksi tietue. Näin ollen taulun rakenne hoitaa sen, että yksittäinen käyttäjä voi tykätä yksittäisestä viestistä samanaikaisesti vain kerran. Jos käyttäjä poistaa tykkäyksensä viestistä, rajapintafunktion kautta likes-taulusta poistetaan tietue, jonka user_id vastaa tykkäyksen poistavaa käyttäjää ja post_id viestiä, josta käyttäjä poistaa tykkäyksensä.

Jotta tykätty viesti tai viestistä tykännyt käyttäjä voidaan poistaa, määritellään likes-taulun vierasavaimille cascade-vierasavaintoiminto. Silloin käyttäjän poistamisen yhteydessä poistetaan myös käyttäjän eri viesteihin kohdistamat tykkäykset ja tietyn viestin poistamisen yhteydessä poistetaan kaikki kyseiseen viestiin kohdistuvat tykkäykset.

<img src="./assets/image-23.png" alt="Aloitsuviestin poistaminen viite-eheyssäännön cascadeksi muuttamisen jälkeen" style="width: 75%;"/>

Vaatimusmäärittelyn mukaisille viestikohtaisille tykkäysmäärille ei tässä ratkaisussa tehtäisi suoraan taulua tai saraketta olemassa oleviin tauluihin. Sen sijaan kunkin viestin tykkäyslukumäärien hakeminen voitaisiin integroida esimerkiksi rajapintafunktioon, joka hakee viestin tiedot. Viestin tiedot hakevaan rajapintafunktioon voitaisiin siis sisällyttää toinen seuraavanlainen tykkäysten lukumäärän hakeva SELECT-kysely:

>SELECT COUNT(user_id) AS like_count FROM likes WHERE post_id = {haettavan viestin id};

Mikäli koostefunktioihin liittyvät käytänteet sallivat, voitaisiin yllä oleva SELECT-kysely vaihtoehtoisesti sisällyttää viestin tiedot hakevaan SELECT-kyselyyn kyselyliitoksella. Varsinaisesta rajapintafunktiosta palautettaisiin lopuksi esimerkiksi viestin tiedot sisältävä JSON-objekti, jonka yhtenä avaimena olisi "likeCount" haetulla arvolla.

### Lähteet

Yasar, K. 2022. primary key (primary keyword). Viitattu 9.10.2024 https://www.techtarget.com/searchdatamanagement/definition/primary-key.
