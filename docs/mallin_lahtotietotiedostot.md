---
sort: 5
---

# Mallin lähtötietotiedostot ja niiden muokkaaminen

## HSL:n ylläpitämät lähtötiedot

Yleiskuvaus HSL:n ylläpitämistä aineistoista ja niiden päivitysperiaatteista löytyy [täältä](HSL_lahtotiedot.md).
HSL:n lähtötietoaineistot (mm. maankäytöt ja verkkojen tiedot) saat ladattua zip-pakettina,
kun olet täyttänyt aineistojen luovutuksen hakemuslomakkeen EXT-Helmet -Teams-ryhmässä.
Paketti sisältää seuraavat aineistot:

### Ennusteskenaarioiden syöttötiedot

Kansio sisältää kullekin tarkasteluvuodelle/skenaariolle alikansion, jossa on lähtötiedot mm. maankäytön ja kustannusten osalta.
Kunkin tiedoston alussa on kuvattu mitä tiedosto sisältää ja mistä tiedot tulevat.
Kansiossa on oltava yksi kappale kustakin tiedostotyypista .cco, .edu, .ext, .lnd, .pop, .prk, .tco, .trk sekä .wrk.
Tiedostojen nimillä ei ole merkitystä, ja ne voivat poiketa toisistaan (kansiossa voi esim. olla 2023.pop ja 2023_b.wrk)

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

Kansio sisältää perusvuoden (lähtökohtaisesti 2018, mutta jotkut tiedot voivat olla vanhempia) syöttötietoja (kuvattu yllä)
ja [kysyntämatriiseja](tulokset.md#tuloskansion-matriisitiedostojen-kuvaukset).
Kysyntämatriisit menevät ensimmäiseen sijoitteluun, josta kysyntälaskenta alkaa.
Perusvuoden syöttötiedot menevät tavaraliikennemalliin ja autonomistusmalliin, jotka molemmat ovat muutosmalleja.
Syöttötiedoissa on yksi ylimääräinen tiedosto verrattuna ennusteskenaarioiden syöttötietoihin:

* **car** = kunkin ennustealueen autotiheys

### Verkot

Kansio sisältää kullekin tarkasteluvuodelle/skenaariolle alikansion, jossa on liikenneverkon lähtötiedot sekä niiden selostus (readme).

**Tiedostot**

* **base_network_xxx.txt** = liikenneverkon solmut ja linkit sekä niiden attribuutit (HUOM: Helmet 4 käyttää myös solmun label-attribuuttia, jossa lippuvyöhykkeen kirjain)
* **transit_lines_xxx.txt** = joukkoliikennelinjaston kuvaus: mm. linjatunnus, kulkumuoto, ajoneuvotyyppi (vehicle), reitin otsikko, reitin käyttämät solmut
  (HUOM: pysähtymiset lasketaan solmujen tietojen perusteella ennusteprosessin aikana ja eri aikajaksojen vuorovälit ajetaan sisään
  erillisestä tiedostosta `extra_transit_lines_xxx.txt`)
* **turns_xxx.txt** = kääntymiskiellot eri solmujen välillä
* **extra_links_xxx.txt** = linkkikohtainen tienkäyttömaksu eri aikajaksoilla (aht, pt, iht)
* **extra_links_xxx.txt** = pyörätieluokka eri linkeillä
* **extra_transit_lines_xxx.txt** = joukkoliikennelinjojen vuorovälit eri aikajaksoilla (aht, pt, iht)

Skenaariot voi muodostaa kootusti Modellerissa, tarkempi kuvaus [täällä](sijopankki.md). 
Moduuli ajaa myös sisään seuraavat kaikille skenaarioille yhteiset tiedot:

* **modes_xxx.txt** auto- ja pyöräverkon kulkutavat
* **vehicles_xxx.txt** joukkoliikenteen ajoneuvotyypit

## Lähtötietojen muokkaaminen

Lähtötietoja voi muokata joko suoraan lähtötietotiedostoihin tai Emme-ohjelmiston (Modeller, Network Editor, Prompt) kautta.

Verkkokuvausperiaatteita on kuvattu tarkemmin raportissa Helsingin seudun liikenteen Emme-verkon kuvaus, joka on saatavilla mallin käyttäjien EXT-Helmet -Teams-ryhmässä. 
Noudatathan näitä periaatteita verkonkuvauksia koodatessa, jotta varmistutaan tulosten oikeellisuudesta ja aineistojen yhteiskäyttöisyydestä.
Jos teet merkittäviä muutoksia, esim. lisäät uuden kulkumuodon, sovi tästä erikseen HSL:n yhteyshenkilöiden kanssa.

Lisätietoja mallin käyttämisestä [täällä](mallitoiden_yleisohje.md).
Taustatietoa verkkokuvausten muodostamisesta ja historiasta löydät raportista [Helsingin seudun työssäkäyntialueen  liikenne-ennustejärjestelmän tarjontamallit 2017](https://hslfi.azureedge.net/globalassets/julkaisuarkisto/2019/helsingin-seudun-tyossakayntialueen-liikenne-ennustejarjestelman-tarjontamallit-6-2019.pdf).

## Lähtötietojen vaikutus ennustemallin eri osiin

* Autonomistus alueittain
  * Kerros- ja pientalojen osuudet
  * Matka-aikasuhteet
* Matkamäärä alueittain
  * Asukasmäärä ikäryhmittäin
  * Autonomistus
* Kulkutavan valinta
  * Alueparien väliset matka-ajat autolla ja joukkoliikenteellä
  * Alueparien väliset etäisyydet polkupyörällä ja autolla
  * Alueparien väliset matkakustannukset: joukkoliikennelipun hinta, autoiun muuttuvat kustannukset (polttoaine, renkaat) ja mahdollinen ruuhkamaksu/tietulli
  * Autonomistus alueittain
* Matkakohteiden valinta
  * Saavutettavuus (matka-aika, etäiyys ja matkakustannus määräpaikkaan eri kulkutavoilla)
  * Työpaikkamäärä määräpaikassa
  * Oppilaspaikkojen määrä määräpaikassa
* Reitin valinta
  * Auto- ja joukkoliikennelinkin matka-aika
  * Pyörälinkin pituus
  * Autolinkin matkakustannus
