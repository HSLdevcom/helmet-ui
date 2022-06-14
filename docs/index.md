# HSL:n liikenne-ennustejärjestelmän yleiskuvaus

Helmet on HSL:n liikenne-ennustejärjestelmä, joka kattaa Helsingin seudun 14 kuntaa ja Siuntion sekä niitä ympäröivän työssäkäyntialueen.
Uusin malliversio Helmet 4 julkaistiin lokakuussa 2020. Järjestelmä käyttää Inron Emme-ohjelmistoa.

HSL:n Helmet-liikenne-ennustemallia voidaan käyttää arvioimaan erilaisten muutostekijöiden vaikutuksia liikennejärjestelmään.
Mallia hyödynnetään ja kehitetään erityisesti palvelemaan seudullisen MAL-suunnitelman vaikutusten arviontia.
HSL ja muut tahot käyttävät Helmet-mallia myös monissa muissa töissä, kuten linjastosuunnitelmien vaikutusten arvioinnissa sekä liikennehankkeiden hankearvioinneissa.

Mallin avulla saadaan tietoa suunnitteluratkaisuihin ja valintoihin jo suunnitteluprosessin aikana, ja sen avulla arvioidaan suunnittelun vaikutuksia ”etukäteen”.
Malli tuo esiin esimerkiksi linjastouunnitelman tai liikennehankkeen vaikutukset/vaikutuksia kulkumuotojakaumaan,
matka-aikaan, saavutettavuuteen, matkamääriin ja liikennesuoritteisiin.

## Mallijärjestelmän rakenne

Helmet 4 -mallijärjestelmässä mallin neljä porrasta ennustetaan seuraavassa järjestyksessä:
1. Matkatuotos
2. Kulkutavanvalinta
3. Suuntautuminen
4. Sijoittelu

Mallijärjestelmän rakenne on esitetty tarkemmin seuraavassa kuvassa: 

![Helmet-mallijärjestelmän rakenne](Helmet-mallijarjestelma.png)

Mallijärjestelmän kysyntämalleja kuvataan tarkemmin raportissa [Helsingin seudun työssäkäyntialueen liikenne-ennustejärjestelmän kysyntämallit 2020](https://hslfi.azureedge.net/globalassets/julkaisuarkisto/2020/6_2020_helsingin_seudun_tyossakayntialueen_liikenne-ennustejarjestelman_kysyntamallit.pdf).

Mallijärjestelmän tarjontakuvauksista lisätietoa on raportissa Helsingin seudun liikenteen Emme-verkon kuvaus, joka on saatavilla mallin käyttäjien EXT-Helmet -Teams-ryhmässä.

## Helmet 4 uusia ominaisuuksia

Tässä on kuvattu keskeisiä nostoja Helmet 4:n uusista ominaisuuksista sekä eroavaisuuksista Helmet 3:een verrattuna.
Laajemmin aihetta on kuvattu
[malliraportissa](https://hslfi.azureedge.net/globalassets/julkaisuarkisto/2020/6_2020_helsingin_seudun_tyossakayntialueen_liikenne-ennustejarjestelman_kysyntamallit.pdf). 

### Kulkutapa- ja suuntautumismallien rakenne

Helmet-mallien aiempiin versioihin verrattuna kulkutapa- ja suuntautumismallien rakenne on HS15-alueella käännetty siten,
että kulkutavanvalinta on nyt ylemmällä tasolla kuin määräpaikan valinta (eli suuntautuminen).

![Kulkutapa- ja suuntautumismallien rakenne eri Helmet-versioissa](Kulkutapa-%20ja%20suuntautumismallien%20rakenne%20eri%20Helmet-versioissa.png)

### Aluejako

Helmet 4 -malleissa käytetään vain yhtä aluejakoa, eli mallissa ei enää ole erillisiä ennuste- ja sijoittelualueita tai näiden välisiä jakolukuja.
Ennustealuejaon tihentyminen kasvattaa jonkin verran mallin ajon vaatimaa aikaa.

### Kiertomatkat

Helmet 4 -ennustejärjestelmässä kysyntä ei perustu enää matkoihin, vaan kiertomatkoihin, johon meno- ja paluumatkojen
(esimerkiksi kotoa töihin tai kouluun ja takaisin) lisäksi voi kuulua toissijainen määräpaikka: esimerkiksi työmatkaan liittyvä kauppa- tai asiointimatka.

### Agenttisimuloinnin kehittäminen

Uudessa ennustejärjestelmässä on mahdollisuus ajaa perinteisen malliajon lisäksi niin sanottuja agenttisimulointeja,
joissa voidaan seurata yksilöiden matkustamista vuorokauden aikana.
Tällä tavalla voidaan tutkia miten erilaiset toimenpiteet vaikuttavat eri väestöryhmiin.
Tätä mahdollisuutta kehitetään edelleen talven 2020-2021 aikana MAL-suunnittelun vaikutusten arvioinnin kehittämisen yhteydessä. 

### Joukkoliikenteen ruuhkautuvuus

Aikaisemmissa malliversioissa ruuhkautuminen aiheutti ongelmia:
* Jotkut linjat ylikuormittuivat epärealistisesti
* Hankearvioinnit eivät ole ottaneet huomioon kapasiteettilisäysten vaikutuksia matkan mukavuuteen ja toteutettavuuteen

Kuormitusaste vaikuttaa reitinvalintoihin, ja reitin vastus kasvaa kun linjan kuormitusaste kasvaa.
Ruuhkautuvuus vaikuttaa ainoastaan loppusijoitteluun eli siihen minkä kyseistä yhteysväliä palvelevan joukkoliikennelinjan matkustaja valitsee,
ei kulkutavan valintaan tai suuntautumiseen.

### Pyöräilyn mallinnus

* Pyöräilylinkit (yhteydet) on tarkistettu
* Verkolle on lisätty tieto pyörätien karkeasta laatuluokasta:
  * Baana
  * Erillinen pyörätie
  * Pyörätie kadun varressa
  * Pyöräkaista
  * Sekaliikenne (oletus)
* Pyöräilyn yhteydet vaikuttavat reitinvalintoihin

## Mallintamisen taustoja

### Termejä

* **Malli:** Matemaattinen kuvaus järjestelmästä (tässä tapauksessa Helsingin seudun liikkumisesta)
* **Mallin estimointi:** Mallin parametrien määritys niin, että malli kuvaa käytetyillä lähtötiedoilla mahdollisimman hyvin lähtöaineistossa (nykytila) havaittua käyttäytymistä 
* **Mallin validointi:** Testaus, että malli tosiaan ennakoi nykytilalle oikean tuloksen
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
* Teoriapohjaksi ks. esim. Kenneth Trainin e-kirja Discrete Choice Methods with Simulation, ensimmäinen osa luvusta 2 (Properties of Discrete Choice Models), s. 11-23: 
(https://eml.berkeley.edu/books/choice2.html))

Tyypillisesti liikennemallit jakautuvat neljään osaan, jotka on kytketty toisiinsa:
* _Matkatuotos_ eli matkojen määrät lähtö- ja määräpaikoittain
* _Suuntautuminen_ eli lähtö- ja määräpaikkojen yhdistelmät
* _Kulkutavan valinta_ eli matkojen jako mm. henkilöauton, joukkoliikenteen ja pyöräilyn kesken
* _Sijoittelu_ eli reittien valinta
