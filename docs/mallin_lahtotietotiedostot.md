# Mallin lähtötietotiedostot ja niiden muokkaaminen

## HSL:n ylläpitämät lähtötiedot

Yleiskuvaus HSL:n ylläpitämistä aineistoista ja niiden päivitysperiaatteista löytyy [täältä](HSL_lahtotiedot.md). HSL:n lähtötietoaineistot (mm. maankäytöt ja verkkojen tiedot) saat ladattua zip-pakettina, kun olet täyttänyt aineistojen luovutuksen hakemuslomakkeen. Paketti sisältää seuraavat aineistot:

### Ennusteskenaarioiden syöttötiedot

Kansio sisältää kullekin tarkasteluvuodelle/skenaariolle alikansion, jossa on lähtötiedot mm. maankäytön ja kustannukset osalta. **Näihin pitäisi varmaan lisätä readme-selsoteet?**

**Tiedostot**

* **Cco** = autoilun kilometrikustannus
* **Edu** = kunkin ennustealueen oppilaspaikkamäärät peruskoulussa, toisella asteella ja korkeakouluissa
* **Ext** = **???**
* **Lnd** = kunkin ennustealueen rakennetun maa-alan osuus sekä erillistalojen osuus rakennuskannasta
* **Pop** = kunkin ennustealueen kokonaisväkiluku sekä eri ikäryhmien osuudet
* **Prk** = kunkin ennustealueen työpaikan ja asiointimatkojen pysäköintikustannukset
* **Tco** = joukkoliikenteen kuukausikustannukset eri vyöhykkeillä
* **Trk** = rekkaliikenteen lähtötiedot: yhdistelmäajoneuvoilta kielletyt ennustealueet ja jätehuollon ennustealueet
* **Wrk** = kunkin ennustealueen kokonaistyöpaikkamäärä sekä eri alojen työpaikkojen osuudet (palvelut, kaupat, logistiikka, teollisuus)

### Lähtötiedot

**Täydennettävä selostus**

### Verkot

Kansio sisältää kullekin tarkasteluvuodelle/skenaariolle alikansion, jossa on liikenneverkon lähtötiedot sekä niiden selostus (readme).

**Tiedostot**

* **d211** = liikenneverkon solmut ja niiden attribuutit (HUOM: Helmet 4 käyttää myös uutta label-attribuuttia)
* **d221** = joukkoliikennelinjaston kuvaus: mm. linjatunnus, kulkumuoto, ajoneuvotyyppi (vehicle), reitin otsikko, reitin käyttämät solmut (HUOM: pysähtymiset lasketaan solmujen tietojen perusteella verkkojen sisäänajomakrolla (**nimi!!**) ja eri aikajaksojen vuorovälit ajetaan sisään erillisestä tiedostosta)
* **d231** = kääntymiskiellot eri solmujen välillä
* **d241_hinta** = tienkäyttömaksu eri solmujen välillä
* **d241_pyoratieluokka** = pyörätieluokka eri linkeillä
* **d241_vuorovalit** = joukkoliikennelinjaston vuorovälit eri aikajaksoilla (aht, pt, iht)
* **d311_jakoluvut** = **???**
* **d311_matktermkys** = **???**
* **d311_tama_ennustevektorit** = **???**
* Muut tiedostot **Tarkistettava näiden yhtenäisyys eri vuosina ja kuvattava mitä sisältyy**

## Lähtötietojen muokkaaminen

Lähtötietoja voi muokata joko suoraan lähtötietotiedostoihin tai Emme-ohjelman kautta. **Onko muokkausohjeosuudelle tarvetta vai riittääkö yleisohje ja index?**
