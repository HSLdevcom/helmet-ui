---
sort: 1
---

# Ohjeet Helmet 4.1 -liikenne-ennustejärjestelmän käyttöön

Tässä ohjeessa kuvataan [Helmet 4.1-liikenne-ennustejärjestelmän](https://github.com/HSLdevcom/helmet-model-system) käyttöliittymää. 
Järjestelmä käyttää INROn [Emme–ohjelmistoa](https://www.inrosoftware.com/en/products/emme/).

## Asennus ja käytön aloitus

### Emmen asennus

Ennen kuin Helmet UI -käyttöliittymää voidaan käyttää, seuraavien edellytysten on täytyttävä:

1.	[Emme 4.5.X](https://www.inrosoftware.com/en/products/emme/) on asennettu, lisenssi on aktivoitu (Authorization) 
   ja koneessa on lisenssitikku (INRO Key).
2.	Käyttäjän PATH -ympäristömuuttujiin on lisätty `%EMMEPATH%\programs`.
    -	Avaa Windows-järjestelmän Ohjauspaneeli
    -	Valitse Käyttäjätilit ja vielä uudelleen Käyttäjätilit. Valitse sen jälkeen vasemmalla olevasta valikosta ”Muuta ympäristömuuttujia”.
    -	Etsi ylhäällä olevasta laatikosta ”käyttäjän (oma_käyttäjätunnuksesi) muuttujat”, valitse Path-muuttuja ja ”muokkaa ympäristömuuttujia”.
    -	Valitse "Uusi" ja kirjoita `%EMMEPATH%\Programs`
    -	Paina OK ikkunassa ”Muokkaa ympäristömuuttujia” ja vielä uudelleen OK ikkunassa ”ympäristömuuttujat”.
3.	[valinnainen] [Helmet 4.1 Model System](https://github.com/HSLdevcom/helmet-model-system) on ladattu käyttöön ja määritelty 
   _(tai annetaan tämän käyttöliittymän ladata se)_

### Emme-projektin määrittely

Seuraavaksi sinun on määriteltävä *Emme-projekti*. 
Kutakin projektia varten kannattaa luoda yksi yhteinen Emme-projektipankki, johon kootaan eri Helmet-skenaariot (esim. eri linjastovaihtoehdot).

1. Käynnistä Emme-ohjelmisto.
2. Perusta uusi projekti. Määrittele, mihin kansioon haluat sen asentaa. 
   - Emme muodostaa tiedoston `projektin_nimi.emp` kansioon `projektin_nimi` ja sen alikansioon 
     `projektin_nimi\database` suuren binaaritiedoston `emmebank` sekä muitakin alikansioita ja tiedostoja.
3. Noudata [erillistä ohjetta](sijopankki.md), jossa kerrotaan mm. sopivista dimensioista (solmujen, linkkien ym. maksimimäärät). 
   Ne vaikuttavat em. `emmebank`-tiedoston kokoon. Aja sisään verkot ja linjastot ohjeen mukaan.

### Helmet asennus

Helmet käyttöliittymän asennusohjelma voidaan ladata kansiosta [releases](https://github.com/HSLdevcom/helmet-ui/releases), 
josta kunkin version exe-paketit löytyvät oman väliotsikkonsa alta. Ladattavan paketin nimeksi tulee `Helmet.4.1.UI-x.y.z.Setup.exe`, 
missä `x.y.z` on sovellusversion numero. Suositellaan uusimman version (luettelon ensimmäisenä) lataamista.

:warning: **Tällä hetkellä sovellus on niin harvoin asennettu, että Windows huomauttaa siitä ja estää asennuksen suorituksen. 
Tämä voidaan ohittaa kahdella tavalla:**
- Valitse "More info" ("Lisätietoja") ja klikkaa "Run anyway" ("Suorita joka tapauksessa"). (Tämä vaihtoehto ei aina toimi)
- Klikkaa ladattua .exe-tiedostoa hiiren kakkospainikkeella, valitse Ominaisuudet ja laita rasti ruutuun "Unblock" ("Salli").

![Unblock](unblock.png)
 
Sovellus asentuu käyttäjän koneelle kansioon `%HOMEPATH%/AppData`. Varsinainen sovellus on kansiossa `AppData\Local`, ja sen asetukset 
kansiossa `AppData\Roaming`. 
Jos käyttäjällä jostain syystä ei ole pääsyä `AppData`-kansioon, vaihtoehto on sovelluksen lataaminen zip-tiedostona ja purku haluamaan kansioon.

Päivitettäessä uuteen versioon asetusten pitäisi säilyä muuttumattomina edellyttäen, että uusi versio 
on taakse päin yhteensopiva vanhojen asetusten kanssa.

Kun sovellus käynnistetään ensimmäistä kertaa, se yrittää löytää työasemalta Emme-asennuksen ja ladata 
[Helmet 4.1 -liikenne-ennustejärjestelmän (model system)](https://github.com/HSLdevcom/helmet-model-system) 
uusimman version skriptit. Sovellus suorittaa myös komennon ’pip install’. 
Nämä kommennot pyörivät hiljaa taustalla, ja sovellus alkaa reagoida vasta niiden valmistuttua.

Emmen Python-polussa oleva määrittely saattaa epäonnistua, 
jos ympäristömuuttujaa ’EMMEPATH’ ei ole määritelty tai jos sovellus on asennettu epätavallisella tavalla. Jos näin käy, suorituskelpoisen 
Python-kielen ja kansion Scripts sijainti on määriteltävä manuaalisesti Asetukset-valikosta.

## Malliajojen ohje

Asennuksen jälkeen pääset määrittämään projektin asetukset ja lähtötiedot.

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
  - Tässä ovat omissa alakansioissaan pohjakysyntämatriisit ja nykytilanteen syöttötiedot (2016)
  - Kansion sisällön saa HSL:ltä (ks. [lähtötietotiedostojen ohje](mallin_lahtotietotiedostot.md))
- Tulosten tallennuspolku
  - Tänne talletetaan ennusteajojen tulokset

Näiden asetusten lisäksi on kehittäjille tarkoitettuja asetuksia helmet-model-system -kansion tiedostossa `dev-config.json`.
Näihin ei ole tavalliselle käyttäjälle yleensä syytä koskea, mutta joissain tapauksissa hyödyllinen asetusmahdollisuus ei ole vielä implementoitu käyttöliittymään.
Lisää tietoja `dev-config.json`-tiedoston asetuksista löytyy tästä:
https://github.com/HSLdevcom/helmet-model-system/tree/olusanya/Scripts#configuring-the-model-run-with-dev-configjson

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
    waiting time, jne.) talteen. Malliajoon ja hankearviointiin tarpeelliset matriisit tallennetaan
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

### Tulosten käsittely ja tulkinta

Lisätietoa mallin tuottamista tulostiedostoista ja tulosten tulkinnasta [täällä](tulokset.md).
