# Helmet liikenne-ennustejärjestelmä

[Helmet 4.0-liikenne-ennustejärjestelmän](https://github.com/HSLdevcom/helmet-model-system) käyttöliittymä. 
Järjestelmä käyttää INROn [Emme–ohjelmistoa](https://www.inrosoftware.com/en/products/emme/).

## Asennus

### Emmen asennus

Ennen kuin Helmet UI -käyttöliittymää voidaan käyttää, seuraavien edellytysten on täytyttävä:

1.	[Emme 4.4.X](https://www.inrosoftware.com/en/products/emme/) on asennettu, lisenssi on aktivoitu (Authorization) 
   ja koneessa on lisenssitikku (INRO Key).
2.	Käyttäjän PATH -ympäristömuuttujiin on lisätty `%EMMEPATH%\programs`.
    -	Avaa Windows-järjestelmän Ohjauspaneeli
    -	Valitse Käyttäjätilit ja vielä uudelleen Käyttäjätilit. Valitse sen jälkeen vasemmalla olevasta valikosta ”Muuta ympäristömuuttujia”.
    -	Etsi ylhäällä olevasta laatikosta ”käyttäjän (oma_käyttäjätunnuksesi) muuttujat”, valitse Path-muuttuja ja ”muokkaa ympäristömuuttujia”.
    -	Valitse "Uusi" ja kirjoita `%EMMEPATH%\Programs`
    -	Paina OK ikkunassa ”Muokkaa ympäristömuuttujia” ja vielä uudelleen OK ikkunassa ”ympäristömuuttujat”.
3.	[valinnainen] [Helmet 4.0 Model System](https://github.com/HSLdevcom/helmet-model-system) on ladattu käyttöön ja määritelty 
   _(tai annetaan tämän käyttöliittymän ladata se)_

### Emme-projektin määrittely

Seuraavaksi sinun on määriteltävä *Emme-projekti*:

1. Käynnistä Emme-ohjelmisto.
2. Perusta uusi projekti. Määrittele, mihin kansioon haluat sen asentaa. 
   - Emme muodostaa tiedoston `projektin_nimi.emp` kansioon `projektin_nimi` ja sen alikansioon 
     `projektin_nimi\database` suuren binaaritiedoston `emmebank` sekä muitakin alikansioita ja tiedostoja.
3. Noudata [erillistä ohjetta](sijopankki.md), jossa kerrotaan mm. sopivista dimensioista (solmujen, linkkien ym. maksimimäärät). 
   Ne vaikuttavat em. `emmebank`-tiedoston kokoon. Aja sisään verkot ja linjastot ohjeen mukaan.

### Helmet asennus

Helmet käyttöliittymän asennusohjelma voidaan ladata kansiosta [releases](https://github.com/HSLdevcom/helmet-ui/releases), 
josta kunkin version exe-paketit löytyvät oman välitosikkonsa alta. Ladattavan paketin nimeksi tulee `Helmet.4.0.UI-x.y.z.Setup.exe`, 
missä `x.y.z` on sovellusversion numero. Suositellaan uusimman version (luettelon ensimmäisenä) lataamista.

:warning: **Tällä hetkellä versioiden jakelupaketteja ei ole allekirjoitettu, joten Windows huomauttaa siitä ja estää asennuksen suorituksen. 
Tämä voidaan ohittaa kahdella tavalla:**
- Valitse "More info" ("Lisätiedot") ja klikkaa "Run anyway". (Tämä vaihtoehto toimii luultavasti vain, jos sinulla on admin-oikeudet)
- Klikkaa ladattua.exe-tiedostoa hiiren kakkospainikkeella, valitse Ominaisuudet ja laita rasti ruutuun "Unblock".

![Unblock](unblock.png)
 
Sovellus asentuu käyttäjän koneelle kansioon `%HOMEPATH%/AppData`. Varsinainen sovellus on kansiossa `AppData\Local`, ja sen asetukset 
kansiossa `AppData\Roaming`. Päivitettäessä uuteen versioon asetusten pitäisi säilyä muuttumattomina edellyttäen, että uusi versio 
on taakse päin yhteensopiva vanhojen asetusten kanssa.

Kun sovellus käynnistetään ensimmäistä kertaa, se yrittää löytää työasemalta Emme-asennuksen ja ladata 
[Helmet 4.0 -liikenne-ennustejärjestelmän (model system)](https://github.com/HSLdevcom/helmet-model-system) 
uusimman version skriptit. Sovellus suorittaa myös komennon ’pip install’. EMMEn Python-polussa oleva määrittely saattaa epäonnistua, 
jos ympäristömuuttujaa ’EMMEPATH’ ei ole määritelty tai jos sovellus on asennettu epätavallisella tavalla. Jos näin käy, suorituskelpoisen 
Python-kielen ja kansion Scripts sijainti on määriteltävä manuaalisesti Asetukset-valikosta.

## Asetukset

- suorituskelpoinen Emme Python 
  - Tämän **on oltava** Emmen mukana tullut ’python.exe’, jotta tietyt edellytykset täyttyvät.
  - esim. `C:\Program Files\INRO\Emme\Emme 4\Emme-4.4.2\Python27\python.exe`
- GitHubin [Helmet 4.0 Model System](https://github.com/HSLdevcom/helmet-model-system)-sivuston kansio ’Scripts’
  - Kansiossa ovat järjestelmän käyttämät Python-ohjelmat.
  - Version päivitys voidaan tehdä klikkaamalla "Lataa eri versio...". Nämä eivät korvaa skriptien vanhoja versioita, 
  vaan uusimmat versiot skripteistä talletetaan uuteen kansioon.
  - Voidaan käyttää myös olemassa olevaa kansiota.
- Projektin kansiopolku
  - Tänne talletetaan Helmet-skenaarioiden (malliajojen) määrittelyt (.json)
  - Tämä **ei** siis viita Emmen projektitiedostoon (.emp)
- Lähtödatan sisältävä kansio
  - Täällä ovat pohjakysyntämatriisit ja nykytilanteen syöttötiedot (2016)
  - Kansion sisältön saa HSL:ltä
- Tulosten tallennuspolku
  - Tänne talletetaan ennusteajojen tulokset

## Malliajon määrittely

Jokaista ajettavaa HELMET-skenaariota kohden on tehtävä seuraavat määrittelyt:

1.	Skenaarion tai ajon nimi
2.	Emmen project-tiedosto (.emp)
3.	Pyöräliikenteen Emme-skenaarion numero (yleensä 19). Seuraavat neljä numeroa on varattava jalankulkuskenaariolle sekä 
   kolmen aikajakson auto- ja joukkoliikenneskenaarioille (aht, pt, iht).
4.	Kansio, jossa ovat syöttötiedot
    - esim. `C:\Helmet\Scenario_input_data\2030`
    - Kansiossa on oltava *yksi* kappale kustakin tiedostotyypista .cco, .edu, .ext, .lnd, .pop, .prk, .tco, .trk sekä .wrk. 
      Tiedostojen nimillä ei ole merkitystä, ja ne voivat poiketa toisistaan (kansiossa voi esim. olla 2023.pop ja 2023_b.wrk).
5.	Valinta, lasketaanko joukkoliikenteen kustannusmatriisi vai käytetäänkö aiemmin laskettua 
   (sijaitsee tämän skenaarion tuloskansiossa `Tulosten tallennuspolku\Skenaario nimi`)
6.	Suoritettavien iteraatiokierrosten määrä

## Höyty-kustannusanalyysin (hankearvioinnin) määrittely

Voidaan verrata ajettujen skenaarioiden hyötyjä ja kustannuksia. Tulokset tulostuvat excel-tiedostoon tuloskansiossa. Analyysia varten on määriteltävää:

1. Vertailuvaihtoehdon (ve0) tuloskansio (`Tulosten tallennuspolku\Skenaario nimi`)
2. Hankevaihtoehdon (ve1) tuloskansio

Jos ennusteita on ajettu kahdelle vuodelle (esim. 2040 ja 2060), vertailuvaihtoehto ja hankevaihtoehto ovat mahdollisia määrittää toisellekin ennustevuodelle.
