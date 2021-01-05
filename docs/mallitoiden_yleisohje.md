# Ohje mallitöihin

Perehdythän tähän ohjeeseen ennen Helmet-mallin käyttöä! 

On tärkeää, että mallia käytetään ja muokataan yhtenäisillä periaatteilla. Näin saadaan mahdollisimman luotettavia tuloksia, ja mahdollistetaan aineistojen  hyödyntäminen myös muissa projekteissa. Myös työn huolellinen dokumentointi on tärkeää, sillä se auttaa aineistojen tulkinnassa ja myöhemmässä hyödyntämisessä. 

Noudatathan näitä käyttö- ja dokumentointiohjeita HSL:n tilaamissa töissä. Ohjeita suositellaan lisäksi noudattamaan myös muissa Helmet-tarkasteluissa. HSL:n yhteyshenkilöiltä saat tarvittaessa apua pulmatilanteisiin.

## Yleiskuvaus

Yleistietoa mallijärjestelmästä löydät [täältä](mallin_yleiskuvaus.md).

Mallin käyttämiä lähtötietoja on kuvattu [täällä](HSL_lahtotiedot.md).

Mallin ajoa sekä mallin käyttämiä parametreja ja muita oletuksia on kuvattu [täällä](index.md).
Pääosin suositellaan käytettäväksi vain HSL:n julkaisemia skriptejä ja näiden oletusparametrejä. Poikkeamat näihin on syytä dokumentoida huolella.

Ilmoitathan HSL:n yhteyshenkilöille mikäli havaitset virheitä tai puutteita mallissa.

### Tiedostorakenteet

Kutakin projektia varten kannattaa luoda yksi yhteinen Emme-pankki, johon kootaan eri tarkasteluskenaariot (esim. eri linjastovaihtoehdot). Emmeen luodaan kutakin tarkasteluskenaariota kohden viisi eri Emme-skenaariota (pyöräliikenne, vuorokausiliikenne, aamuhuipputunti, päivätunti ja iltahuipputunti).

HSL:n lähtötietoaineistot (mm. maankäytöt ja verkkojen tiedot) saat ladattua zip-pakettina, kun olet täyttänyt aineistojen luovutuksen hakemuslomakkeen. Lähtötiedot voi ladata sisään Emmen skenaarioihin erillisen makron avulla. 

Helmet-järjestelmä tuottaa valmiiksi erilaisia tulosteita malliajojen tuloksista. Nämä tallentuvat oletuksena **minne?**. Emmellä ja muilla sovelluksilla voidaan tuottaa lisäksi erilaisia analyysejä.

Alempana on kuvattu tarkemmin lähtötietoja, niiden muokkaamista sekä tulosten käsittelyä.

### Dokumentointi

HSL:n tilaamissa töissä kaikki tehdyt muutokset tulee dokumentoida mallitekniseen muistioon ja tallentaa lisäksi muutostiedostot ja/tai muokatut lähtötiedot. Tarkemmat ohjeet HSL-töiden dokumentoinnista löydät [täältä](HSL-toiden_dokumentointi.md).

## Työn aluksi

### Mallin lähtötietoaineistojen jakelu

Pohjaverkot työhön saat HSL:stä. Pohjaverkkona toimii yleensä HSL:n tuorein verkkokuvaus, mutta jos niissä on paljon MAL-työn jälkeen tehtyjä muutoksia, herkkyystarkasteluja tehdään myös edellisen MAL-kierroksen virallisissa verkoissa. HSL:n tilaamissa töissä HSL tekee aina nollavaihtoehdon. Töiden aloituksessa on huomioitava, että nollavaihtoehdon laatiminen vie pari viikkoa. **Onko tämä edelleen ajankohtainen??**

HSL tarjoaa valmiina erilaisia lähtötietoaineistoja. Näistä löydät yleistietoa [täältä](https://github.com/eevavesaoja/helmet-ui/blob/master/docs/HSL_lahtotiedot.md).

HSL:n ylläpitämiä ennusteskenaarioiden syöttötietoja luovutetaan ainoastaan täyttämällä hakemuslomake aineistojen luovuttamiseksi. Hakemuslomake löytyy Teams-ryhmästä EXT-Helmet, jonne saat käyttöoikeuden HSL:n Liikennejärjestelmäryhmästä (Jens West). Kutakin projektia varten tulee hakea uudet aineistot, jotta aineistojen käyttöä voidaan seurata sekä varmistutaan, että lähtötiedot ovat aina ajan tasalla.

### Ohjeet mallin lataamiseen ja käyttöön

Mallin lataamis- ja käyttöohjeita löydät [täältä](index.md).

## Työn aikana

### Ohjeet lähtötietojen muokkaamiseen

HSL tarjoaa valmiina erilaisia lähtötietoaineistoja. Yleensä mallitöiden yhteydessä on kuitenkin tarpeen muokata joitakin lähtötietoja. Lähtötietoja voi muokata joko sisään ajettavia tiedostoja editoimalla (ja ajamalla muokatut tiedot uudelleen sisään) tai Emme-ohjelman kautta. Tehdyt muutokset on hyvä dokumentoida huolella.

Yleistietoa HSL:n tarjoamista lähtötietoaineistoista ja tarkempia muokkausohjeita löydät [täältä](HSL_lahtotiedot.md). Noudatathan HSL:n ohjeita ja periaatteita verkonkuvauksia koodatessa, jotta varmistutaan tulosten oikeellisuudesta ja aineistojen yhteiskäyttöisyydestä.

### Ohjeet malliajoon muokatuilla lähtötiedoilla

Lähtötietojen muokkaamisen jälkeen varmista, että muutokset tulevat mukaan kaikkiin haluamiisi skenaarioihin. Lähtötietojen sisäänajomakrolla voit päivittää lähtötietotiedostoihin muokattuja tietoja useampaan skenaarioon kerrallaan (ohje **täällä**). Vaihtoehtoisesti voi Emmen kautta esim. liikenverkkoon tehtyjä muutoksia kopioida muihin skenaarioihin .ems-muutostiedostojen avulla.

Varmista ennen malliajoa myös, että Helmet 4-käyttöliittymä viittaa haluamaasi ennusteskenaarion lähtötietokansioon (maankäyttö, kustannukset ym), ja että tulokset tallentuvat haluttuun paikkaan (ks. tarkemmin alempana).

Lähtötietojen muokkaamisen jälkeen voit ajaa mallin Helmet 4-käyttöliittymällä [perusohjeen](index.md) mukaan.

### Tulostiedot

Tulostiedostoista ja niiden analysoinnista lisätietoja [täällä](tulokset.md).

Esimerkkejä mallituloksista tehtävistä visualisoinneista [täällä](esimerkkeja_tuloksista.md).

## Työn lopuksi

Työn lopuksi kannattaa dokumentoida huolella tehdyt muutokset. Yleensä työn tilaajalla on tietyt toiveet siitä, millaiset dokumentit mallitöistä halutaan. HSL:n tilaamissa töissä dokumentointi tehdään [tämän ohjeen](HSL-toiden_dokumentointi.md) mukaan.
