# Helmet liikenne-ennustejärjestelmä

[Helmet 4.0-liikenne-ennustejärjestelmän](https://github.com/HSLdevcom/helmet-model-system) käyttöliittymä. 
Järjestelmä käyttää INROn [Emme–ohjelmistoa](https://www.inrosoftware.com/en/products/emme/).

## Loppukäyttäjän ohje

### Asennus

Ennen kuin Helmet UI -käyttöliittymää voidaan käyttää, seuraavien edellytysten on täytyttävä:

1.	[Emme 4.4.X](https://www.inrosoftware.com/en/products/emme/) on asennettu, lisenssi on aktivoitu (Authorization) 
ja koneessa on lisenssitikku (INRO Key).
2.	Käyttäjän PATH -ympäristömuuttujiin on lisätty `%EMMEPATH%\programs` .
3.	[valinnainen] [Helmet 4.0 Model System](https://github.com/HSLdevcom/helmet-model-system) on ladattu käyttöön ja määritelty 
_(tai annetaan tämän käyttöliittymän ladata se)_

Helmet UI:n asennusohjelma voidaan ladata kansiosta [releases](https://github.com/HSLdevcom/helmet-ui/releases), 
josta kunkin version exe-paketit löytyvät oman välitosikkonsa alta.

:warning: **Tällä hetkellä versioiden jakelupaketteja ei ole allekirjoitettu, joten Windows huomauttaa siitä ja estää asennuksen suorituksen. 
Tämä voidaan ohittaa kahdella tavalla:**
- Valitse "More info" ("Lisätiedot") ja klikkaa "Run anyway". (Tämä vaihtoehto toimii luultavasti vain, jos sinulla on admin-oikeudet)
- Klikkaa ladattua.exe-tiedostoa hiiren kakkospainikkeella, valitse Ominaisuudet ja laita rasti ruutuun "Unblock".

![Unblock](docs/unblock.png)
 
Sovellus asentuu käyttäjän koneelle kansioon `%HOMEPATH%/AppData`. Varsinainen sovellus on kansiossa `AppData\Local`, ja sen asetukset 
kansiossa `AppData\Roaming`. Päivitettäessä uuteen versioon asetusten pitäisi säilyä muuttumattomina edellyttäen, että uusi versio 
on taakse päin yhteensopiva vanhojen asetusten kanssa.

Kun sovellus käynnistetään ensimmäistä kertaa, se yrittää löytää työasemalta Emme-asennuksen ja ladata 
[Helmet 4.0 -liikenne-ennustejärjestelmän (model system)](https://github.com/HSLdevcom/helmet-model-system) 
uusimman version skriptit. Sovellus suorittaa myös komennon ’pip install’. EMMEn Python-polussa oleva määrittely saattaa epäonnistua, 
jos ympäristömuuttujaa ’EMMEPATH’ ei ole määritelty tai jos sovellus on asennettu epätavallisella tavalla. Jos näin käy, suorituskelpoisen 
Python-kielen ja kansion Scripts sijainti on määriteltävä manuaalisesti Asetukset-valikosta.

### Asetukset

- suorituskelpoinen Emme Python 
  - Tämän **on oltava** Emmen mukana tullut ’python.exe’, jotta tietyt edellytykset täyttyvät.
  - esim. `C:\Program Files\INRO\Emme-4.4.2\Python27\python.exe`
- GitHubin [Helmet 4.0 Model System](https://github.com/HSLdevcom/helmet-model-system)-sivuston kansio ’Scripts’
  - Kansiossa ovat järjestelmän käyttämät Python-ohjelmat.
  - Version päivitys voidaan tehdä klikkaamalla "Lataa eri versio...". Nämä eivät korvaa skriptien vanhoja versioita, 
  vaan uusimmat versiot skripteistä talletetaan uuteen kansioon.
  - Voidaan käyttää myös olemassa olevaa kansiota.
- kansio Project
  - Tänne talletetaan malliajon määrittelyt (.json).
- kansio Base data 
  - Täällä ovat pohjakysyntämatriisit ja nykytilanteen vuosi (2016)
- kansio Result data 
  - Tänne talletetaan ennusteajon tulokset 

### Malliajon määrittely

Jokaista ajettavaa HELMET-skenaariota kohden on tehtävä seuraavat määrittelyt:

1.	Skenaarion tai ajon nimi
2.	Emmen project-tiedosto (.emp)
3.	Pyöräliikenteen Emme-skenaarion numero (yleensä 19). Seuraavat neljä numeroa on varattava jalankulkuskenaariolle sekä 
kolmen aikajakson auto- ja joukkoliikenneskenaarioille (aht, pt, iht).
4.	Kansio, jossa ovat syöttötiedot. 
  - esim. `C:\Helmet\helmet-model-system\Scenario_input_data\2030`
5.	Valinta, lasketaanko joukkoliikenteen kustannusmatriisi vai käytetäänkö aiemmin laskettua (sijaitsee tämän skenaarion kansiossa results)
6.	Suoritettavien iteraatiokierrosten määrä

Tässä on latauslinkki käyttäjiä varten. Suositellaan uusimman version (luettelon ensimmäisenä) lataamista.

- https://github.com/HSLdevcom/helmet-ui/releases

Ladattavan paketin nimeksi tulee `Helmet.4.0.UI-x.y.z.Setup.exe`, missä `x.y.z` on sovellusversion numero.
