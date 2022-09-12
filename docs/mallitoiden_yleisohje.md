---
sort: 4
---

# Mallijärjestelmän käyttöohje

On tärkeää, että mallia käytetään ja muokataan yhtenäisillä periaatteilla. 
Näin saadaan mahdollisimman luotettavia tuloksia, ja mahdollistetaan aineistojen  hyödyntäminen myös muissa projekteissa. 
Myös työn huolellinen dokumentointi on tärkeää, sillä se auttaa aineistojen tulkinnassa ja myöhemmässä hyödyntämisessä. 

Mallin käyttämiä lähtötietoja on kuvattu [täällä](mallin_lahtotietotiedostot.md). 
HSL:n lähtötietoaineistot (mm. maankäytöt ja verkkojen tiedot) saat ladattua zip-pakettina, kun olet täyttänyt aineistojen luovutuksen hakemuslomakkeen.
Näistä löydät yleistietoa [täältä](HSL_lahtotiedot.md).
Hakemuslomake löytyy Teams-ryhmästä EXT-Helmet, jonne saat käyttöoikeuden HSL:n Liikennejärjestelmäryhmästä (Johanna Piipponen).
Kutakin projektia varten tulee hakea uudet aineistot, jotta aineistojen käyttöä voidaan seurata sekä varmistutaan, että lähtötiedot ovat aina ajan tasalla.

Mallin asennusohjeet löydät [täältä](kaytto-ohje.md), ja Emme-pankin perustamisen ohjeet [täältä](sijopankki.md).
Kutakin projektia varten kannattaa luoda yksi yhteinen Emme-pankki, johon kootaan eri Helmet-skenaariot (esim. eri linjastovaihtoehdot).
Pääosin suositellaan käytettäväksi vain HSL:n julkaisemia skriptejä ja näiden oletusparametrejä.
Poikkeamat näihin on syytä dokumentoida huolella (ks. [dokumentointiohje](HSL-toiden_dokumentointi.md)).

## Malliajojen ohje

Helmet-käyttöliittymän (UI) kautta pääset määrittämään projektin asetukset ja lähtötiedot.

### Asetukset

Mallin ajoa varten tulee määritellä seuraavat asetukset. 

:warning: **Kansiopoluissa ei saa olla ääkkösiä!**

- Suorituskelpoinen Emme Python 
  - Tämän **on oltava** Emmen mukana tullut ’python.exe’, jotta tietyt edellytykset täyttyvät.
  - esim. `C:\Program Files\INRO\Emme\Emme 4\Emme-4.5.0\Python37\python.exe`
- GitHubin [Helmet 4.1 Model System](https://github.com/HSLdevcom/helmet-model-system)-sivuston kansio ’Scripts’
  - Kansiossa ovat järjestelmän käyttämät Python-ohjelmat.
  - Version päivitys voidaan tehdä klikkaamalla "Lataa eri versio...". Nämä eivät korvaa skriptien vanhoja versioita, 
  vaan uusimmat versiot skripteistä talletetaan uuteen kansioon.
  - Voidaan käyttää myös olemassa olevaa kansiota.
- Projektin kansiopolku
  - Tänne talletetaan Helmet-skenaarioiden (malliajojen) määrittelyt (.json)
  - Tämä **ei** siis viittaa Emmen projektitiedostoon (.emp)
- Lähtödatan sisältävä kansio
  - Tässä ovat omissa alakansioissaan pohjakysyntämatriisit ja nykytilanteen syöttötiedot (2018)
  - Kansion sisällön saa HSL:ltä (ks. [lähtötietotiedostojen ohje](mallin_lahtotietotiedostot.md))
- Tulosten tallennuspolku
  - Tänne talletetaan ennusteajojen tulokset

Näiden asetusten lisäksi on kehittäjille tarkoitettuja asetuksia helmet-model-system -kansion tiedostossa `dev-config.json`.
Näihin ei ole tavalliselle käyttäjälle yleensä syytä koskea, mutta joissain tapauksissa hyödyllinen asetusmahdollisuus ei ole vielä implementoitu käyttöliittymään.
Lisää tietoja `dev-config.json`-tiedoston asetuksista löytyy 
[tästä](https://github.com/HSLdevcom/helmet-model-system/tree/olusanya/Scripts#configuring-the-model-run-with-dev-configjson).

### Malliajon määrittely

Jokaista ajettavaa HELMET-skenaariota kohden on tehtävä seuraavat määrittelyt:

1.	Skenaarion tai ajon nimi
    - *Skenaario* ei tässä viittaa Emme-skenaarioon, vaan tässä annetaan nimi verkkokuvaus- ja maankäyttötietoyhdistelmälle joka menee yhteen malliajoon.
2.	Emmen project-tiedosto (.emp)
3.	Emme-skenaarion numero. 
   Asetuksista riippuen sijoittelutulokset tallennetaan tähän skenaarioon tai erikseen seuraavaan neljään skenarioon (vrk, aht, pt, iht).
4.	Kansio, jossa ovat syöttötiedot
    - esim. `C:\Helmet\Scenario_input_data\2030`
    - Kansiossa on oltava *yksi* kappale kustakin tiedostotyypista .cco, .edu, .ext, .lnd, .pop, .prk, .tco, .trk sekä .wrk. 
      Tiedostojen nimillä ei ole merkitystä, ja ne voivat poiketa toisistaan (kansiossa voi esim. olla 2023.pop ja 2023_b.wrk).
5.	Suoritettavien iteraatiokierrosten enimmäismäärä (yleensä 10)
    - Voit myös tehdä pelkän loppusijoittelun, jolloin iteraatioita ei ajeta. Pelkän
      loppusijoittelun tekeminen vaatii, että kysyntämatriisit omx-muodossa aiemmasta malliajosta
      löytyvät skenaarion tuloskansiosta.
6.	Valinta, lasketaanko joukkoliikenteen kustannusmatriisi vai käytetäänkö aiemmin laskettua 
   (sijaitsee tämän skenaarion tuloskansiossa `Tulosten tallennuspolku\Skenaario nimi`).
7.  Valinta, poistetaanko sijoittelun strategiatiedostot malliajon jälkeen.
8.  Valinta, tallennetaanko eri ajanjaksot erillisiin Emme-skenaarioihin.
9.  Valinta, tallennetaanko mm. joukkoliikenteen matka-ajan osamatriisit (in-vehicle time, first
    waiting time, jne.). Malliajoon ja hankearviointiin tarpeelliset matriisit tallennetaan
    aina .omx-muodossa riippumatta tästä valinnasta.
    - Mikäli halutaan useiden Helmet-skenaarioiden kaikki Emme-matriisit talteen samaan
      Emme-projektiin (.emx-tiedostoihin), voidaan lisäksi ennen jokaista malliajoa määrittää
      ensimmäisen matriisin numero. Varataan yhteen malliajoon aina 300 matriisin numeroavaruus,
      joten jos ensimmäiseen malliajoon on käytetty 100 (oletus), toiseen malliajoon kannattaa
      laittaa 400.

### Hyöty-kustannusanalyysin (hankearvioinnin) määrittely

H/K-analyysillä voidaan verrata ajettujen skenaarioiden hyötyjä ja kustannuksia. Tulokset tulostuvat excel-tiedostoon tuloskansiossa. Analyysia varten on määriteltävä:

1. Vertailuvaihtoehdon (ve0) tuloskansio (`Tulosten tallennuspolku\Skenaarion nimi`)
2. Hankevaihtoehdon (ve1) tuloskansio

Jos ennusteita on ajettu kahdelle vuodelle (esim. 2040 ja 2060), vertailuvaihtoehto ja hankevaihtoehto on mahdollista määrittää toisellekin ennustevuodelle.

## Tulosten käsittely ja tulkinta

Lisätietoa mallin tuottamista tulostiedostoista ja tulosten tulkinnasta [täällä](tulokset.md).
Esimerkkejä mallituloksista tehtävistä visualisoinneista [täällä](esimerkkeja_tuloksista.md).

## Dokumentointi ja aineistojen luovutus

Työn lopuksi kannattaa dokumentoida huolella tehdyt muutokset. 
Yleensä työn tilaajalla on tietyt toiveet siitä, millaiset dokumentit mallitöistä halutaan. 
HSL:n tilaamissa töissä kaikki tehdyt muutokset tulee dokumentoida ja aineistot luovuttaa [tämän ohjeen](HSL-toiden_dokumentointi.md) mukaan.  
