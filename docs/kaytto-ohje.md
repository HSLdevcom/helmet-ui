---
sort: 1
---

# Helmet 4.1 -liikenne-ennustejärjestelmän käyttöönotto

Tässä ohjeessa kuvataan [Helmet 4.1-liikenne-ennustejärjestelmän](https://github.com/HSLdevcom/helmet-model-system) käyttöliittymää. 
Järjestelmä käyttää INROn [Emme–ohjelmistoa](https://www.inrosoftware.com/en/products/emme/).

## Emmen asennus

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

## Emme-projektin määrittely

Seuraavaksi sinun on määriteltävä *Emme-projekti*. 
Kutakin projektia varten kannattaa luoda yksi yhteinen Emme-projektipankki, johon kootaan eri Helmet-skenaariot (esim. eri linjastovaihtoehdot).

1. Käynnistä Emme-ohjelmisto.
2. Perusta uusi projekti. Määrittele, mihin kansioon haluat sen asentaa. 
   - Emme muodostaa tiedoston `projektin_nimi.emp` kansioon `projektin_nimi` ja sen alikansioon 
     `projektin_nimi\database` suuren binaaritiedoston `emmebank` sekä muitakin alikansioita ja tiedostoja.
3. Noudata [erillistä ohjetta](sijopankki.md), jossa kerrotaan mm. sopivista dimensioista (solmujen, linkkien ym. maksimimäärät). 
   Ne vaikuttavat em. `emmebank`-tiedoston kokoon. Aja sisään verkot ja linjastot ohjeen mukaan.

## Helmet-asennus

Helmet-käyttöliittymän asennustiedosto ladataan [releases-sivulta](https://github.com/HSLdevcom/helmet-ui/releases).
Asennustiedosto on nimeltään `Helmet.4.1-x.y.z.Setup.exe`, jossa `x.y.x` on käyttöliittymän
versionumero. Suosittelemme uusimman version eli sivulla ylimpänä olevan version lataamista.

:warning: **Sovellus on niin harvoin asennettu, että Windows tai selain voi huomauttaa siitä ja
estää asennuksen suorituksen. Tämä voidaan ohittaa eri tavoin, joista voit joutua käyttämään
useampaa yhtä aikaa:**

- Ladatessasi tiedostoa, klikkaa "Säilytä silti" mikäli selain ei tallenna tiedostoa
  automaattisesti.
- Kun avaat asennustiedoston, klikkaa varoitukseen "More info" ("Lisätietoja") ja klikkaa "Run
  anyway" ("Suorita joka tapauksessa").
- Klikkaa ladattua .exe-tiedostoa hiiren kakkospainikkeella, valitse Ominaisuudet ja laita rasti
  ruutuun "Unblock" ("Salli").

![Unblock](unblock.png)
 
Sovellus asentuu käyttäjän koneelle kansioon `%HOMEPATH%/AppData`. Varsinainen sovellus on kansiossa `AppData\Local`, ja sen asetukset 
kansiossa `AppData\Roaming`. 
Jos käyttäjällä jostain syystä ei ole pääsyä `AppData`-kansioon, vaihtoehto on sovelluksen lataaminen zip-tiedostona ja purku haluamaan kansioon.

:exclamation: Projektiasetukset nollautuvat, kun käyttöliittymän päivittää vanhemmasta versiosta
versioon 4.1 (mm. Kaivoksela-, Tikkurila-versiot). Jos et muista, mitkä vanhat asetukset
olivatkaan, voit tarkistaa ne polusta
`C:\Users\KÄYTTÄJÄTUNNUS\AppData\Roaming\Helmet 4\config.json`. Tiedosto aukeaa esimerkiksi
Notepadilla. Tiedostossa olevat polut syötetään käyttöliittymän projektiasetuksiin.

Kun sovellus käynnistetään ensimmäistä kertaa, se yrittää löytää työasemalta Emme-asennuksen ja ladata 
[Helmet 4.1 -liikenne-ennustejärjestelmän (model system)](https://github.com/HSLdevcom/helmet-model-system) 
uusimman version skriptit. Sovellus suorittaa myös komennon ’pip install’. 
Nämä kommennot pyörivät hiljaa taustalla, ja sovellus alkaa reagoida vasta niiden valmistuttua.

Emmen Python-polussa oleva määrittely saattaa epäonnistua, 
jos ympäristömuuttujaa ’EMMEPATH’ ei ole määritelty tai jos sovellus on asennettu epätavallisella tavalla. Jos näin käy, suorituskelpoisen 
Python-kielen ja kansion Scripts sijainti on määriteltävä manuaalisesti Asetukset-valikosta.
