# Mallin lähtötietotiedostot ja niiden muokkaaminen

## HSL:n ylläpitämät lähtötiedot

Yleiskuvaus HSL:n ylläpitämistä aineistoista ja niiden päivitysperiaatteista löytyy [täältä](HSL_lahtotiedot.md). HSL:n lähtötietoaineistot (mm. maankäytöt ja verkkojen tiedot) saat ladattua zip-pakettina, kun olet täyttänyt aineistojen luovutuksen hakemuslomakkeen EXT-Helmet -Teams-ryhmässä. Paketti sisältää seuraavat aineistot:

### Ennusteskenaarioiden syöttötiedot

Kansio sisältää kullekin tarkasteluvuodelle/skenaariolle alikansion, jossa on lähtötiedot mm. maankäytön ja kustannusten osalta. Kunkin tiedoston alussa on kuvattu mitä tiedosto sisältää ja mistä tiedot tulevat. Kansiossa on oltava yksi kappale kustakin tiedostotyypista .cco, .edu, .ext, .lnd, .pop, .prk, .tco, .trk sekä .wrk. Tiedostojen nimillä ei ole merkitystä, ja ne voivat poiketa toisistaan (kansiossa voi esim. olla 2023.pop ja 2023_b.wrk)

**Tiedostot**

* **cco** = autoilun kilometrikustannus
* **edu** = kunkin ennustealueen oppilaspaikkamäärät peruskoulussa, toisella asteella ja korkeakouluissa
* **ext** = ulkoinen liikenne eli työsäkäyntialueen tienpäät
* **lnd** = kunkin ennustealueen rakennetun maa-alan osuus sekä erillistalojen osuus rakennuskannasta
* **pop** = kunkin ennustealueen kokonaisväkiluku sekä eri ikäryhmien osuudet
* **prk** = kunkin ennustealueen työpaikan ja asiointimatkojen pysäköintikustannukset
* **tco** = joukkoliikenteen kuukausikustannukset eri vyöhykkeillä
* **trk** = rekkaliikenteen lähtötiedot: yhdistelmäajoneuvoilta kielletyt ennustealueet ja jätteenkäsittelylaitosten ennustealueet
* **wrk** = kunkin ennustealueen kokonaistyöpaikkamäärä sekä eri alojen työpaikkojen osuudet (palvelut, kaupat, logistiikka, teollisuus)

### Lähtödata

Kansio sisältää perusvuoden (lähtökohtaisesti 2018, mutta jotkut tiedot voivat olla vanhempia) syöttötietoja (kuvattu yllä) ja [kysyntämatriiseja](tulokset.md#tuloskansion-matriisitiedostojen-kuvaukset). Syöttötiedoissa on yksi ylimääräinen verrattuna ennusteskenaarioiden syöttötietoihin:

* **car** = kunkin ennustealueen autotiheys

### Verkot

Kansio sisältää kullekin tarkasteluvuodelle/skenaariolle alikansion, jossa on liikenneverkon lähtötiedot sekä niiden selostus (readme).

**Tiedostot**

Kaikille vaihtoehdoille yhteiset
* **d201_modes_M2016_pyora.in** pyöräverkon kulkutavat
* **d201_modes_M2016.in** autoverkon kulkutavat
* **d202_veh_M2016.in** joukkoliikenteen ajoneuvotyypit
* **d411_pituusriippuvaiset_HM30.in** auto- ja joukkoliikenteen viivytysfunktiot
* **d411_pituusriippuvaiset_pyora.in** pyöräliikenteen viivytysfunktiot

Kustakin vaihtoehdosta
* **d211** = liikenneverkon solmut ja linkit sekä niiden attribuutit (HUOM: Helmet 4 käyttää myös solmun label-attribuuttia, jossa lippuvyöhykkeen kirjain)
* **d221** = joukkoliikennelinjaston kuvaus: mm. linjatunnus, kulkumuoto, ajoneuvotyyppi (vehicle), reitin otsikko, reitin käyttämät solmut (HUOM: pysähtymiset lasketaan solmujen tietojen perusteella verkkojen sisäänajomakrolla `4verkkoa_HM40.mac` ja eri aikajaksojen vuorovälit ajetaan sisään erillisestä tiedostosta d241_vuorovalit)
* **d231** = kääntymiskiellot eri solmujen välillä
* **d241_hinta** = linkkikohtainen tienkäyttömaksu eri aikajaksoilla (aht, pt, iht)
* **d241_pyoratieluokka** = pyörätieluokka eri linkeillä
* **d241_vuorovalit** = joukkoliikennelinjojen vuorovälit eri aikajaksoilla (aht, pt, iht)
* **hsl_kunnat** = macro joka laskee kuntakoodista (`ui1`) attribuutin `@hsl`, joka kertoo, onko pysäkkisolmu HSL-alueella (0=ei, 1=on)

Skenaariot voi muodostaa kootusti makrolla `4verkkoa_HM40.mac`, tarkempi kuvaus [täällä](sijopankki.md).

## Lähtötietojen muokkaaminen

Lähtötietoja voi muokata joko suoraan lähtötietotiedostoihin tai Emme-ohjelmiston (Modeller, Network Editor, Prompt) kautta.
