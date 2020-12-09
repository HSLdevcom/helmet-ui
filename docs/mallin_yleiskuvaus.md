# HSL:n liikenne-ennustemallin yleiskuvaus

Helmet on HSL:n oma liikenne-ennustejärjestelmä, joka kattaa Helsingin seudun 14 kuntaa. Ennustemallin ylläpidosta vastaa Liikennejärjestelmäryhmä (Jens West ja Timo Elolähde), ja liikenneverkkokuvausten ylläpidosta vastaa Joukkoliikennejärjestelmät-ryhmä (Mervi Vatanen). Uusin malliversio Helmet 4 julkaistiin lokakuussa 2020.

HSL:n Helmet-liikenne-ennustemallia voidaan käyttää arvioimaan erilaisten muutostekijöiden vaikutuksia liikennejärjestelmään. Mallia hyödynnetään ja kehitetään erityisesti palvelemaan seudullisen MAL-suunnitelman vaikutusten arviontia. HSL ja muut tahot käyttävät Helmet-mallia myös monissa muissa töissä, kuten linjastosuunnitelmien vaikutusten arvioinnissa sekä liikennehankkeiden hankearvioinneissa.

Mallin avulla saadaan tietoa suunnitteluratkaisuihin ja valintoihin jo suunnitteluprosessin aikana, ja sen avulla arvioidaan suunnittelun vaikutuksia ”etukäteen”. Malli tuo esiin esimerkiksi kulkumuotojakauman, matka-ajan, saavutettavuuden, matkamääriä ja liikennesuoritteita. Lisätietoa ja esimerkkejä mallilla tuotettavista tarkasteluista täällä: **linkki uudelle erilliselle sivulle**

## Mallintamisen taustoja

### Termejä

* **Malli:** Matemaattinen kuvaus järjestelmästä (tässä tapauksessa Helsingin seudun liikkumisesta)
* **Mallin estimointi:** Mallin parametrien määritys niin että malli antaa tietyillä lähtötiedoilla tietyn tuloksen (nykytilan)
* **Mallin validointi:** Testaus että malli tosiaan ennakoi nykytilalle oikean tuloksen
* **Ennuste:** Mallin käyttö _samoilla parametreilla_, mutta _eri lähtötiedoilla_ kuin estimoinnissa

### Mallin oletuksia, perusteluita ja rajoituksia

Oletuksena yksilöiden hyödyn maksimointi:
* Malli olettaa, että ihmiset ovat tietoisia kaikista vaihtoehdoista ja niiden hyödyistä ja haitoista
* Malli tekee ainoastaan ihmisten oman hyödyn maksimoivia valintoja
* Todellisuudessa ihmisten päätöksenteko ei ole näin suoraviivaista ja rationaalista, mutta hyötymaksimointi on mallintamisessa yleisesti käytetty oletus

Malli perustuu nykytilan havaintoaineiston valintoihin:
* Oletetaan, että ennustevuoden ihmiset tekevät valintansa samalla perusteella kuin havaintoaineistossa eli nykytilassa
* Ennusteita ei voida tehdä asenteiden muutoksista (jos matka-aikaa, kustannuksia ym. arvostetaan eri tavalla kuin nykyisin)

Mallin matemaattinen pohja perustuu diskreetteihin valintamalleihin:
* Mallijärjestelmä rakentuu useista eri osamalleista, joissa kuvataan logit-malleilla todennäköisyyttä, että päätöksentekijä valitsee tietyn vaihtoehdon (esim. kulkutapa)
* Teoriapohjaksi ks. esim. Kenneth Trainin e-kirja Discrete Choice Methods with Simulation, ensimmäinen osa luvusta 2 (Properties of Discrete Choice Models), s. 11-23: (https://eml.berkeley.edu/books/choice2.html))

## HSL:n Helmet-malli

### Mallin lähtötiedot

Lähtötietojen määrittäminen on jo itsessään ennustamista. HSL ylläpitää lähtötietoaineistoja MAL-suunnittelun ja joukkoliikennesuunnittelun tueksi. Lisätietoja HSL:n tarjoamista aineistoista täällä (**linkki uudelle erilliselle sivulle**).

Helmet-mallin lähtötiedoiksi tarvitaan seuraavat tiedot:

**Maankäyttöä koskevat tiedot:**
* Asukkaiden kokonaismäärät ja ikäryhmittäin
* Työpaikkojen kokonaismäärät
* Kerros- ja pientalojen osuudet
* Kaupan työpaikkojen määrät
* Palvelutyöpaikkojen määrät
* 2. ja 3. asteen oppilaspaikkamäärät

**Liikennejärjestelmää koskevat tiedot:**
* Henkilöauton kilometrikustannus
* Joukkoliikenteen vyöhykehinnat
* Tie-ja katuverkon ominaisuudet (linkin tieluokka, kaistamäärä, pituus)
* Joukkoliikennelinjasto (tunnus, reitti, keskimääräinen vuoroväli)
* Erillisillä malleilla laskettu tavaraliikenne sekä satamien ja lentoaseman henkilöliikenne

### Lähtötietojen vaikutus ennustemallin eri osiin

* Autonomistus alueittain
  * Kerros- ja pientalojen osuudet
  * Matka-aikasuhteet
* Matkamäärä alueittain
  * Asukasmäärä ikäryhmittäin
  * Autonomistus
* Kulkutavan valinta
  * Matka-aika
  * Matkakustannus
  * Autonomistus
* Matkakohteiden valinta
  * Matka-aika
  * Matkakustannus
  * Työpaikkamäärä
  * Oppilaspaikkojen määrä
* Reitin valinta
  * Matka-aika
  * Matkakustannus

### Mallijärjestelmän rakenne

**Tähän kuva s. 14:** 

https://hslfi.sharepoint.com/sites/ext-hlj-toimikunta/Jaetut%20asiakirjat/Forms/AllItems1.aspx?originalPath=aHR0cHM6Ly9oc2xmaS5zaGFyZXBvaW50LmNvbS86Zjovcy9leHQtaGxqLXRvaW1pa3VudGEvRWstTFBqdW1NekZIaU1BTElpYjNHMEVCVUZyWm95eFJCSHkyTjN6ZGJJQmdvUT9ydGltZT1MdXBCZjFDYjJFZw&id=%2Fsites%2Fext%2Dhlj%2Dtoimikunta%2FJaetut%20asiakirjat%2FGeneral%2FHelmet%204%2E0%20%2Desittelytilaisuus%2FLiikenteen%20ennustaminen%2Epdf&parent=%2Fsites%2Fext%2Dhlj%2Dtoimikunta%2FJaetut%20asiakirjat%2FGeneral%2FHelmet%204%2E0%20%2Desittelytilaisuus

**Tähän yleistä neliporrasmalleista**

Mallijärjestelmää kuvataan tarkemmin raportissa: **tähän linkki malliraporttiin**

### Helmet 4 uusia ominaisuuksia

**Joukkoliikenteen ruuhkautuvuus**

Aikaisemmissa malliversioissa ruuhkautuminen aiheutti ongelmia:
* Jotkut linjat ylikuormittuivat epärealistisesti
* Hankearvioinnit eivät ole ottaneet huomioon kapasiteettilisäysten vaikutuksia matkan mukavuuteen ja toteutettavuuteen

Jatkossa Helmet 4 myötä kuormitusaste vaikuttaa reitinvalintoihin, ja reitin vastus kasvaa kun linjan kuormitusaste kasvaa.

**Pyöräilyn mallinnus**

* Pyöräilylinkit (yhteydet) on tarkistettu
* Verkolle on lisätty tieto pyörätien karkeasta laatuluokasta:
  * Baana
  * Erillinen pyörätie
  * Pyörätie kadun varressa
  * Pyöräkaista
  * Sekaliikenne (oletus)
* Pyöräilyn yhteydet vaikuttavat reitinvalintoihin

