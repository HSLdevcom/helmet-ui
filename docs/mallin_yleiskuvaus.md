# HSL:n liikenne-ennustemallin yleiskuvaus

Helmet on HSL:n oma liikenne-ennustejärjestelmä, joka kattaa Helsingin seudun 14 kuntaa. Ennustemallin ylläpidosta vastaa Liikennejärjestelmäryhmä (Jens West ja Timo Elolähde), ja liikenneverkkokuvausten ylläpidosta vastaa Joukkoliikennejärjestelmät-ryhmä (Mervi Vatanen). Uusin malliversio Helmet 4 julkaistiin lokakuussa 2020. Järjestelmä käyttää Inro:n Emme-ohjelmistoa.

HSL:n Helmet-liikenne-ennustemallia voidaan käyttää arvioimaan erilaisten muutostekijöiden vaikutuksia liikennejärjestelmään. Mallia hyödynnetään ja kehitetään erityisesti palvelemaan seudullisen MAL-suunnitelman vaikutusten arviontia. HSL ja muut tahot käyttävät Helmet-mallia myös monissa muissa töissä, kuten linjastosuunnitelmien vaikutusten arvioinnissa sekä liikennehankkeiden hankearvioinneissa.

Mallin avulla saadaan tietoa suunnitteluratkaisuihin ja valintoihin jo suunnitteluprosessin aikana, ja sen avulla arvioidaan suunnittelun vaikutuksia ”etukäteen”. Malli tuo esiin esimerkiksi kulkumuotojakauman, matka-ajan, saavutettavuuden, matkamääriä ja liikennesuoritteita. Lisätietoa ja esimerkkejä mallilla tuotettavista tarkasteluista [täällä](esimerkkeja_tuloksista.md).

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

Tyypillisesti liikennemallit jakautuvat neljään osaan, jotka on kytketty toisiinsa:
* _Matkatuotos_ eli matkojen määrät lähtö- ja määräpaikoittain
* _Suuntautuminen_ eli lähtö- ja määräpaikkojen yhdistelmät
* _Kulkutavan valinta_ eli jako mm. henkilöauton ja joukkoliikenteen kesken
* _Sijoittelu_ eli reittien valinta

## HSL:n Helmet-malli

### Mallin lähtötiedot

Lähtötietojen määrittäminen on jo itsessään ennustamista. HSL ylläpitää lähtötietoaineistoja MAL-suunnittelun ja joukkoliikennesuunnittelun tueksi. Lisätietoja HSL:n tarjoamista aineistoista [täällä](HSL_lahtotiedot.md).

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

Helmet 4 -mallijärjestelmässä mallin neljä porrasta ennustetaan seuraavassa järjestyksessä:
1. Matkatuotos
2. Kulkutavanvalinta
3. Suuntautuminen
4. Sijoittelu

Mallijärjestelmän rakenne on esitetty tarkemmin seuraavassa kuvassa: 

**Tähän kuva s. 14:** 
https://hslfi.sharepoint.com/sites/ext-hlj-toimikunta/Jaetut%20asiakirjat/Forms/AllItems1.aspx?originalPath=aHR0cHM6Ly9oc2xmaS5zaGFyZXBvaW50LmNvbS86Zjovcy9leHQtaGxqLXRvaW1pa3VudGEvRWstTFBqdW1NekZIaU1BTElpYjNHMEVCVUZyWm95eFJCSHkyTjN6ZGJJQmdvUT9ydGltZT1MdXBCZjFDYjJFZw&id=%2Fsites%2Fext%2Dhlj%2Dtoimikunta%2FJaetut%20asiakirjat%2FGeneral%2FHelmet%204%2E0%20%2Desittelytilaisuus%2FLiikenteen%20ennustaminen%2Epdf&parent=%2Fsites%2Fext%2Dhlj%2Dtoimikunta%2FJaetut%20asiakirjat%2FGeneral%2FHelmet%204%2E0%20%2Desittelytilaisuus

Mallijärjestelmän kysyntämalleja kuvataan tarkemmin raportissa [Helsingin seudun työssäkäyntialueen liikenne-ennustejärjestelmän kysyntämallit 2020](https://classic.hsl.fi/sites/default/files/uploads/helsingin_seudun_tyossakayntialueen_liikenne-ennustejarjestelman_kysyntamallit_6_2020.pdf).

Mallijärjestelmän tarjontakuvauksista lisätietoa raportissa [Helsingin seudun liikenteen Emme-verkon kuvaus](https://hslfi.sharepoint.com/sites/ext-helmet/Jaetut%20asiakirjat/Forms/AllItems1.aspx?FolderCTID=0x012000D424AF5AB4008242ABBD5A3D509AEA7E&id=%2Fsites%2Fext%2Dhelmet%2FJaetut%20asiakirjat%2FGeneral%2FOhjeet%2FLiite%20B%20%2D%20Emme%2Dverkon%5Fkuvaus%5F20200805%2Epdf&parent=%2Fsites%2Fext%2Dhelmet%2FJaetut%20asiakirjat%2FGeneral%2FOhjeet).

### Helmet 4 uusia ominaisuuksia

**Kulkutapa- ja suuntautumismallien rakenne**

Helmet-mallien aiempiin versioihin verrattuna kulkutapa- ja suuntautumismallien rakenne on HS15-alueella käännetty siten, että kulkutavanvalinta on nyt ylemmällä tasolla kuin määräpaikan valinta (eli suuntautuminen).

**Tähän kuva 1 raportista https://classic.hsl.fi/sites/default/files/uploads/helsingin_seudun_tyossakayntialueen_liikenne-ennustejarjestelman_kysyntamallit_6_2020.pdf**

**Kiertomatkat**

Helmet 4 -ennustejärjestelmässä kysyntä ei perustu enää matkoihin, vaan kiertomatkoihin, johon meno- ja paluumatkojen - esimerkiksi kotoa töihin tai kouluun ja takaisin - lisäksi voi kuulua toissijainen määräpaikka - esimerkiksi työmatkaan liittyvä kauppa- tai asiointimatka.  

**Agenttisimuloinnin kehittäminen**

Uudessa ennustejärjestelmässä on mahdollisuus ajaa perinteisen malliajon lisäksi niin sanottuja agenttisimulointeja, joissa voidaan seurata yksilöiden matkustamista vuorokauden aikana. Tällä tavalla voidaan tutkia miten erilaiset toimenpiteet vaikuttavat eri väestöryhmiin. Tätä mahdollisuutta kehitetään edelleen talven 2020-2021 aikana MAL-suunnittelun vaikutusten arvioinnin kehittämisen yhteydessä. 

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

## Tietopyynnöt

Liikenne-ennusteisiin ja näiden tuloksiin liittyvä tietopyynnöt kannattaa osoittaa Jens Westille ja Mervi Vataselle. Pääsääntöisesti tietopyyntöihin pyritään vastaamaan MAL-työn virallisilla ennusteilla, mutta tapauskohtaisesti voidaan toimittaa myös muuta aineistoa.

**Tähän kuvaus siitä, mitä aineistoja käytetään erilaisiin tietopyyntöihin vastatessa.** 

**Tarpeen määritellä, mitä versioita hyödynnetään erilaisissa tietopyynnöissä koskien mallituloksia. Esim. Mikä on HSL:n virallinen näkemys länsimetrosta ym? Tarvitaanko tähän prosessi (esim. että ei kysytä konsulteilta ennusteita vaan että HSL:ssä olisi keskitetysti kaikki tarvittavat pankit ja me voisimme sieltä poimia pyydetyt tiedot, jolloin säilyisi talossa myös tieto siitä, mitä kaikkia ennusteita on olemassa)**

## Mallin käyttöohjeet

Lisätietoa mallin käyttämisestä löydät [täältä](Mallitoiden_yleisohje.md).
