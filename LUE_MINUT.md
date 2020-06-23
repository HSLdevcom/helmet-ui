# Helmet UI Käyttöliittymä
 
[Helmet 4.0-liikenne-ennustejärjestelmän](https://github.com/HSLdevcom/helmet-model-system) käyttöliittymä. Järjestelmä käyttää INROn [Emme – ohjelmistoa](https://www.inrosoftware.com/en/products/emme/).

## Loppukäyttäjän ohje

### Asennus

Ennen kuin Helmet UI -käyttöliittymää voidaan käyttää, seuraavien edellytysten on täytyttävä:

1.	[Emme 4.4.X](https://www.inrosoftware.com/en/products/emme/) on asennettu, lisenssi on aktivoitu (Authorization) ja koneessa on lisenssitikku (INRO Key).
2.	Käyttäjän PATH -ympäristömuuttujiin on lisätty '%EMMEPATH%\programs' .
3.	[valinnainen] [Helmet 4.0 Model System](https://github.com/HSLdevcom/helmet-model-system) on ladattu käyttöön ja määritelty _(tai annetaan tämän käyttöliittymän ladata se)_

Helmet UI:n asennusohjelma voidaan ladata kansiosta [releases](https://github.com/HSLdevcom/helmet-ui/releases), josta kunkin version exe-paketit löytyvät oman välitosikkonsa alta.

:warning: **Tällä hetkellä versioiden jakelupaketteja ei ole allekirjoitettu, joten Windows huomauttaa siitä ja estää asennuksen suorituksen. Tämä voidaan ohittaa kahdella tavalla:**
- Valitse "More info" ("Lisätiedot") ja klikkaa "Run anyway". (Tämä vaihtoehto toimii luultavasti vain, jos sinulla on admin-oikeudet)
- Klikkaa ladattua.exe-tiedostoa hiiren kakkospainikkeella, valitse Ominaisuudet ja laita rasti ruutuun "Unblock".

![Unblock](docs/unblock.png)
 
Sovellus asentuu käyttäjän koneelle kansioon '%HOMEPATH%/AppData'. Varsinainen sovellus on kansiossa 'AppData\Local', ja sen asetukset 
kansiossa 'AppData\Roaming'. Päivitettäessä uuteen versioon asetusten pitäisi säilyä muuttumattomina edellyttäen, että uusi versio 
on taakse päin yhteensopiva vanhojen asetusten kanssa.

Kun sovellus käynnistetään ensimmäistä kertaa, se yrittää löytää työasemalta Emme-asennuksen ja ladata 
[Helmet 4.0 -liikenne-ennustejärjestelmän (model system)](https://github.com/HSLdevcom/helmet-model-system) uusimman version skriptit. Sovellus suorittaa myös komennon ’pip install’. EMMEn Python-polussa oleva määrittely saattaa epäonnistua, jos ympäristömuuttujaa ’EMMEPATH’ ei ole määritelty tai jos sovellus on asennettu epätavallisella tavalla. Jos näin käy, suorituskelpoisen Python-kielen ja kansion Scripts sijainti on määriteltävä manuaalisesti Asetukset-valikosta.

### Asetukset

- suorituskelpoinen Emme Python 
  - Tämän **on oltava** Emmen mukana tullut ’python.exe’, jotta tietyt edellytykset täyttyvät.
  - esim. 'C:\Program Files\INRO\Emme-4.4.2\Python27\python.exe'
- GitHubin [Helmet 4.0 Model System](https://github.com/HSLdevcom/helmet-model-system)-sivuston kansio ’Scripts’
  - Kansiossa ovat järjestelmän käyttämät Python-ohjelmat.
  - Version päivitys voidaan tehdä klikkaamalla "Lataa eri versio...". Nämä eivät korvaa skriptien vanhoja versioita, vaan uusimmat versiot skripteistä talletetaan uuteen kansioon.
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
3.	Pyöräliikenteen Emme-skenaarion numero (yleensä 19). Seuraavat neljä numeroa on varattava jalankulkuskenaariolle sekä kolmen aikajakson auto- ja joukkoliikenneskenaarioille (aht, pt, iht).
4.	Kansio, jossa ovat syöttötiedot. 
  - esim. 'C:\Helmet\helmet-model-system\Scenario_input_data\2030'
5.	Valinta, lasketaanko joukkoliikenteen kustannusmatriisi vai käytetäänkö aiemmin laskettua (sijaitsee tämän skenaarion kansiossa results)
6.	Suoritettavien iteraatiokierrosten määrä

Tässä on latauslinkki käyttäjiä varten. Suositellaan uusimman version (luettelon ensimmäisenä) lataamista.

- https://github.com/HSLdevcom/helmet-ui/releases

Ladattavan paketin nimeksi tulee 'Helmet.4.0.UI-x.y.z.Setup.exe', missä 'x.y.z' on sovellusversion numero.

## Ohjelmistokehitys

_Tässä on ohjeita järjestelmän kehittäjille. Loppukäyttäjän ohjeet olivat edellisessä luvussa._

This is an [Electron](https://electrojs.org) application written in JavaScript _([NodeJS API](https://nodejs.org/api/) and [Electron API](https://www.electronjs.org/docs/api) available within app)_, HTML and CSS.

### Requirements

- Git client
- Node.js 10 LTS & NPM
- EMME 4.x.x _(Windows-only)_
- _[optionally]_ [helmet-model-system](https://github.com/HSLdevcom/helmet-model-system) _(otherwise downloaded and auto-installed by the UI)_

On Mac and Linux, [Wine](https://www.winehq.org/) and [Mono](https://www.mono-project.com/) are also required to make the app for Windows.

### Setup

Due to tight integration with EMME, the application is mainly targeted for Windows but can be developed on Mac and Linux as well. However, the final testing should always happen on Windows with Emme.

```
$ git clone <this repository>
$ npm install
```

See [End-User Enviroment](#end-user-environment) for preparing the Windows environment for testing. EMME and EMME-Python versions can be set in [versions.js](src/versions.js), affecting the automatic resolving of Python binary.

### Running and building

`npm start` command is used to start the application in development environment. Running `npm run make` will create an installer binary to be distributed to end-users.

See also: [Electronforge.io](https://www.electronforge.io/)

### Version Control

[Git](https://git-scm.com/) is used as the primary tool for version control and `master` branch is the main development line, aka. bleeding edge. All changes should be made in dedicated feature/bugfix branches, followed by a [pull request](https://help.github.com/en/articles/creating-a-pull-request) and a peer-review. Then, after all checks have passed, the branch may be merged in `master`.

### Continuous Integration

The application is built automatically by [Travis CI](https://travis-ci.org/HSLdevcom/helmet-ui.svg?branch=master) when changes are pushed in master branch or pull requests are opened.

[Releases](https://github.com/HSLdevcom/helmet-ui/releases) are deployed automatically when changes are pushed in the `release` branch, which should be updated with `master` only to make new releases.

### Publishing Releases

The Electron Forge's [Github publisher](https://www.electronforge.io/config/publishers/github) is used to upload files and draft a new release, thus avoiding the need to upload and tag releases manually.

The resulting draft must be reviewed, edited and approved in Github to make it publically available to everyone. This allows testing the package and making final fixes to it before making it public.

1. Test and bring all the desired changes in the `master` branch.
1. Remove if there's word `SNAPSHOT` in `version` field of [package.json](./package.json), and update version as per semver practises.
    - See also: [Semantic Versioning](https://semver.org/)
1. Switch to `release` branch
1. Merge `master` to `release` and push to remote
    - `$ git merge master`
    - `$ git push`
1. Wait for [Travis](https://travis-ci.org/HSLdevcom/helmet-ui) to build the application.
1. Go to [releases page](https://github.com/HSLdevcom/helmet-ui/releases) page and **Edit** the newly created draft.
    1. Ensure the release name corresponds to version number
    1. Write a brief description (new features, changes, fixes etc)
    1. Check/uncheck the pre-release checkbox as needed.
    1. Select `release` branch as the target for tagging
    1. Press **Publish release** when all is good.
    1. Switch back to `master` branch and update the version number matching the release. This can be updated to indicate a [snapshot](http://codethataint.com/blog/what-are-maven-snapshots/) before next release (e.g. `1.3.0-SNAPSHOT`) while said release (`1.3.0`) is in development, if necessary.

_Notice: you cannot create drafts with an existing version number (i.e. release name). Thus, any intermediate drafts must be deleted before pushing final tweaks and fixes for the version about to be released._

## TODO & Known Problems

As of 2020-03-17:

1. The application is not [signed](https://electronjs.org/docs/tutorial/code-signing), causing the anti-virus software and Windows to consider it suspicious.
    - Fix: aqcuire a certificate and add it to the [build process](https://www.electronforge.io/config/makers/squirrel.windows) to enable signing

## Version history

**3.0.0**  
Breaking change: Changes all Python interface input data paths _(as well as output Results directory path)_ to dynamic.  

**2.1.1**  
ENHANCEMENT: *Reminder text "downloading new model-system requires internet connection"*    
ENHANCEMENT: *Add button in Settings to download new helmet-model-system version*  
FIX: *Overriding old model-system versions is postfixed with epoch timestamp in folder name*    
FIX: *pip install is performed after download of model-systed (previously triggered only on switching folder)*  

**2.1.0**  
FEA: *Cost Benefit Analysis (two input scenario result folders, and evaluation year, passed to side-script)*  

**2.0.0**  
Breaking change: Python interface is called via args, instead of stdin. Also the Python file name is different. Compatible with model-system version 0.1.0 and newer.  

**1.5.0**  
FEA: *Various UI/UX enhancements from discussion with an end-user*  

**1.4.0**  
FEA: *enable model-system version selection (before auto-install)*  

**1.3.0**  
FEA: *auto-install also model-system dependencies whenever model-system reference changes*  

**1.2.0**  
FEA: *enable auto-install of helmet-model-system*  

**1.1.1 (hotfix)**  
FIX: *cast numeric parameters as numbers when sent to model-system*  
FIX: *log python-process errors to log component as errors*  

**1.1.0**  
Rewritten with ReactJS  
FIX: *out of date lodash package*  
FEA: *new boolean field USE_FIXED_TRANSIT_COST*  
FEA: *new number field FIRST_SCENARIO_ID*  
FEA: *enable multiple saved scenarios*  
FEA: *enable serial execution of selected scenarios*  
FEA: *enable changing scenarios' load path (=HELMET Project)*  
FEA: *enable scenarios' reload ("Refresh") via button*  
FEA: *change "End" button to remove remaining scenarios from run*  

**1.0.0 (Initial release)**  
Able to set scenario parameters and run Helmet Model System.  
