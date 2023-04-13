---
sort: 2
---

# Sijoittelupankin perustaminen

## Luo uusi Emme-projekti haluamaasi kansioon
- File - New - Project…
-	Name: esim. `Viima`
-	Project location: esim. `C:\HELMET41`

Emme luo valitsemaasi kansioon alikansion (tässä tapauksessa `C:\HELMET41\Viima`) ja tähän alikansioon emp-tiedoston.
Huomaa, että emp-tiedoston nimen pitää vastata alikansion nimeä, tässä tapauksessa siis `Viima.emp`.

Seuraavassa valintaikkunassa valitse kohta _Create an empty project_ ja jatka dimensioiden määrittelyyn.

Tarvittavat skenaario- matriisi- ja ekstra-attribuuttimäärät riippuvat Helmet-asetuksista:
- Jos malliajon määrittelyssä aiotaan valita _Tallenna eri ajanjaksot erillisiin Emme-skenaarioihin_,
  tarvitaan viisi Emme-skenaariota kutakin tarkasteltavaa Helmet-skenaariota kohti.
  Ensimmäinen niistä toimii lähtötietona (verkko ja linjasto) malliajoon ja muut luodaan automaattisesti
  malliajon aikana ajanjaksojen tuloksia varten (vrk, aht, pt, iht).
  Tässä tapauksessa pärjätään pienemmällä ekstra-attribuuttimäärällä.
- Jos malliajon määrittelyssä ei valita _Tallenna eri ajanjaksot erillisiin Emme-skenaarioihin_,
  tarvitaan yksi Emme-skenaario kutakin tarkasteltavaa Helmet-skenaariota kohti.
  Tässä tapauksessa tarvitaan tuloksia varten enemmän ekstra-attribuuttitilaa.
- Jos malliajon määrittelyssä aiotaan valita _Tallenna eri ajanjaksojen matriisit Emme-projektin Database-kansioon_,
  tarvitaan enemmän tilaa matriiseille

Alla on lueteltu HELMET-sijoittelupankin (lisenssikoko vähintään 9) dimensiot:

| Muuttuja                                                                  | Koko      | Vaihtoehtoinen koko                                 |
|---------------------------------------------------------------------------|-----------|-----------------------------------------------------|
| Network scenarios                                                         | 1+        | 5+ (jos ajanjaksot erillisiin skenaarioihin)        |
| Zones or centroids                                                        | 2100      |                                                     |
| Nodes incl. centroids                                                     | 20 000    |                                                     |
| Directional links                                                         | 55 000    |                                                     |
| Transit vehicle types                                                     | 30        |                                                     |
| Transit lines or routes                                                   | 2 000     |                                                     |
| Transit line segments                                                     | 200 000   |                                                     |
| Turn table entries                                                        | 10 000    |                                                     |
| Full matrices                                                             | 100       | 300+ (jos matriisit Emmessä talteen)                |
| Origin matrices                                                           | 10        |                                                     |
| Destination matrices                                                      | 10        |                                                     |
| Words for extra attributes                                                | 9 700 000 | 3 100 000 (jos ajanjaksot erillisiin skenaarioihin) |

Muokkaa seuraavaksi yksikköasetuksia. Asetuksiksi käyvät seuraavat (voit muokata näitä myös valitsemalla Tools - Prompt ja moduulin 1.23):
- unit of energy: MJ
- unit of cost: eur
- unit of length: km
- **length of 1 coordinate unit: 0.001**

Perusta tyhjä skenaario kohdassa _First scenario_:
-	Number: esim. 1
-	Title: esim. 2018_20211130

Valitse koordinaatisto:
-	Spatial reference: Edit - ETRS89 / GK25FIN
-	Tarkenna kartta Helsingin kantakaupungin alueelle, jotta UTM-vyöhyke menee muotoon 35N
- Koordinaatistoa voi myöhemmin muuttaa valikossa File - Project Settings – GIS.

## Lue sisään verkkotiedostot

Verkkojen sisäänajo tapahtuu Modeller käyttöliittymän kautta. 
HSL:n tarjoamien valmiiden lähtötietojen osalta tarvittavat aineistot eri tarkasteluvuosille löytyvät jakokansiosta
`Verkot` (lisätietoja [täällä](mallin_lahtotietotiedostot.md)).
Valitse moduuli `Data management/Scenario/Import scenario`.
`Folder containing scenario to import:` -valikossa, valitse jakokansiosta `Verkot` yksi kansio, esim. `2018`.
Valitse olemassa oleva skenaarionumero (`Overwrite scenario`) tai luo uusi.

Moduuli lukee skenaarioon tarpeelliset tiedot tiedostoista

|Tiedosto                      | Sisältö                                                    |
|------------------------------|------------------------------------------------------------|
|`modes_xxx.txt`	             |	kulkutavat (yhteinen kaikille skenaarioille)              |
|`vehicles_xxx.txt`	           |	ajoneuvotyypit (yhteinen kaikille skenaarioille)          |
|`base_network_xxx.txt`        |	verkko (yhteinen kaikille ajanjaksoille)                  |
|`transit_lines_xxx.txt`       |	linjasto (yhteinen kaikille ajanjaksoille)                |
|`turns_xxx.txt`               |	kääntymiset (yhteinen kaikille ajanjaksoille)             |
|`extra_links_xxx.txt`         |	linkkien pyörätieluokat (yhteinen kaikille ajanjaksoille) |
|`extra_links_xxx.txt`         |	mahdolliset ruuhkamaksut tai tietullit ajanjaksoittain    |
|`extra_transit_lines_xxx.txt` |	linjojen vuorovälit ajanjaksoittain                       | 

`extra_xxx.txt`-tiedostot luovat valmiiksi ennustejärjestelmän tarvitsemat ekstra-attribuutit. 

## Muut lähtötiedot

Muut tarvittavat lähtötiedot (mm. kustannukset, pohjakysyntä) ajetaan automaattisesti sisään ennusteprosessin aikana.
