---
sort: 2
---

# Ohje mallitöihin

Perehdythän tähän ohjeeseen ennen Helmet-mallin käyttöä! 

On tärkeää, että mallia käytetään ja muokataan yhtenäisillä periaatteilla. Näin saadaan mahdollisimman luotettavia tuloksia, ja mahdollistetaan aineistojen  hyödyntäminen myös muissa projekteissa. Myös työn huolellinen dokumentointi on tärkeää, sillä se auttaa aineistojen tulkinnassa ja myöhemmässä hyödyntämisessä. 

Noudatathan näitä käyttö- ja dokumentointiohjeita HSL:n tilaamissa töissä. Ohjeita suositellaan lisäksi noudattamaan myös muissa Helmet-tarkasteluissa. HSL:n yhteyshenkilöiltä saat tarvittaessa apua pulmatilanteisiin. Ilmoitathan HSL:n yhteyshenkilöille myös mikäli havaitset virheitä tai puutteita mallissa.

## Yleiskuvaus

Yleistietoa mallijärjestelmästä löydät [täältä](index.md).

Mallin käyttämiä lähtötietoja on kuvattu [täällä](HSL_lahtotiedot.md). HSL:n lähtötietoaineistot (mm. maankäytöt ja verkkojen tiedot) saat ladattua zip-pakettina, kun olet täyttänyt aineistojen luovutuksen hakemuslomakkeen. Lähtötiedot voi ladata sisään Emmen skenaarioihin erillisen makron avulla. 

Mallin asennus- ja käyttöohjeet löydät [täältä](kaytto-ohje.md), ja tarkempia lähtötietojen käsittelyn ohjeita sekä Helmet-makrojen ohjeet ja latauslinkin [täältä](sijopankki.md). Pääosin suositellaan käytettäväksi vain HSL:n julkaisemia skriptejä ja näiden oletusparametrejä. Poikkeamat näihin on syytä dokumentoida huolella (ks. [dokumentointiohje](HSL-toiden_dokumentointi.md)).

Kutakin projektia varten kannattaa luoda yksi yhteinen Emme-pankki, johon kootaan eri Helmet-skenaariot (esim. eri linjastovaihtoehdot). Emmeen luodaan kutakin Helmet-skenaariota kohden viisi eri Emme-skenaariota (pyöräliikenne, vuorokausiliikenne, aamuhuipputunti, päivätunti ja iltahuipputunti).

Helmet-järjestelmä tuottaa valmiiksi erilaisia tulosteita malliajojen tuloksista. Emmellä ja muilla sovelluksilla voidaan tuottaa lisäksi erilaisia analyysejä.

## Mallin lähtötietoaineistojen jakelu

HSL tarjoaa valmiina erilaisia lähtötietoaineistoja. Näistä löydät yleistietoa [täältä](HSL_lahtotiedot.md) ja tarkemmat kuvaukset [täältä](mallin_lahtotietotiedostot.md).

HSL:n ylläpitämiä ennusteskenaarioiden syöttötietoja luovutetaan ainoastaan täyttämällä hakemuslomake aineistojen luovuttamiseksi. Hakemuslomake löytyy Teams-ryhmästä EXT-Helmet, jonne saat käyttöoikeuden HSL:n Liikennejärjestelmäryhmästä (Jens West). Kutakin projektia varten tulee hakea uudet aineistot, jotta aineistojen käyttöä voidaan seurata sekä varmistutaan, että lähtötiedot ovat aina ajan tasalla.

## Ohjeet lähtötietojen muokkaamiseen

Yleensä mallitöiden yhteydessä on tarpeen muokata joitakin lähtötietoja. Lähtötietoja voi muokata joko sisään ajettavia tiedostoja editoimalla (ja ajamalla muokatut tiedot uudelleen sisään) tai Emme-ohjelman kautta. Tehdyt muutokset on hyvä dokumentoida huolella.

Yleistietoa HSL:n tarjoamista lähtötietoaineistoista ja tarkempia muokkausohjeita löydät [täältä](HSL_lahtotiedot.md) ja [täältä](mallin_lahtotietotiedostot.md). Noudatathan HSL:n ohjeita ja periaatteita verkonkuvauksia koodatessa, jotta varmistutaan tulosten oikeellisuudesta ja aineistojen yhteiskäyttöisyydestä.

## Ohjeet malliajoon muokatuilla lähtötiedoilla

Lähtötietojen muokkaamisen jälkeen varmista, että muutokset tulevat mukaan kaikkiin haluamiisi skenaarioihin. Lähtötietojen sisäänajomakrolla (ks. [ohje](sijopankki.md)) voit päivittää lähtötietotiedostoihin muokattuja tietoja useampaan skenaarioon kerrallaan. Vaihtoehtoisesti voi Emmen kautta esim. liikenneverkkoon tehtyjä muutoksia kopioida muihin skenaarioihin .ems-muutostiedostojen avulla.

Varmista ennen malliajoa myös, että Helmet 4-käyttöliittymä viittaa haluamaasi ennusteskenaarion lähtötietokansioon (maankäyttö, kustannukset ym), ja että tulokset tallentuvat haluttuun paikkaan (ks. [mallin käyttö-ohje](kaytto-ohje.md)).

Lähtötietojen muokkaamisen jälkeen voit ajaa mallin [Helmet 4-käyttöliittymän ohjeen](kaytto-ohje.md) mukaan.

## Tulostiedot

Tulostiedostoista ja niiden analysoinnista lisätietoja [täällä](tulokset.md).

Esimerkkejä mallituloksista tehtävistä visualisoinneista [täällä](esimerkkeja_tuloksista.md).

## Dokumentointi ja aineistojen luovutus

Työn lopuksi kannattaa dokumentoida huolella tehdyt muutokset. Yleensä työn tilaajalla on tietyt toiveet siitä, millaiset dokumentit mallitöistä halutaan. HSL:n tilaamissa töissä kaikki tehdyt muutokset tulee dokumentoida ja aineistot luovuttaa [tämän ohjeen](HSL-toiden_dokumentointi.md) mukaan.  
