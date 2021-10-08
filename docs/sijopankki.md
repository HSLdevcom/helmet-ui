---
sort: 3
---

# Uuden HELMET 4.1 sij19 -sijoittelupankin perustaminen ”tyhjästä”

## Luo uusi Emme-projekti haluamaasi kansioon
- File - New - Project…
-	Name: esim. sijoittelu
-	Project location: esim. `C:\HELMET40`

Emme luo valitsemaasi kansioon alikansion (tässä tapauksessa `C:\HELMET40\sijoittelu`) ja tähän alikansioon emp-tiedoston. 
Huomaa, että emp-tiedoston nimen pitää vastata alikansion nimeä, tässä tapauksessa siis `sijoittelu.emp`.

Seuraavassa valintaikkunassa valitse kohta _Create an empty project_ ja jatka dimensioiden määrittelyyn. 
Alla on lueteltu HELMET-sijoittelupankin (lisenssikoko vähintään 9) dimensiot:

| Koko      |Muuttuja                                                             |
|-----------|---------------------------------------------------------------------|
| 5+        | network scenarios (5 kpl kutakin tarkasteltavaa Helmet-skenaariota kohti) |
| 2100      | zones or centroids                                                  |
| 20 000    | nodes incl. centroids (17999 regular nodes)                         |
| 55 000    | directional links                                                   |
| 30        | transit vehicle types                                               |
| 2 000     | transit lines or routes                                             |
| 200 000   | transit line segments                                               |
| 10 000    | turn table entries                                                  |
| 400       | matrices of type mf                                                 |
| 200       | matrices of type mo                                                 |
| 200       | matrices of type md                                                 |
| 9 999     | matrices of type ms                                                 |
| 99        | functions per function class                                        |
| 5 000     | operators per function class                                        |
| 3 000 000 | words for extra attributes                                          |

Muokkaa seuraavaksi yksikköasetuksia. Asetuksiksi käyvät seuraavat (voit muokata näitä myös valitsemalla Tools - Prompt ja moduulin 1.23):
- unit of energy: MJ
- unit of cost: eur
- unit of length: km
- **length of 1 coordinate unit: 0.001**

Perusta tyhjä skenaario kohdassa _First scenario_:
-	Number: esim. 1
-	Title: esim. 2018

Valitse koordinaatisto:
-	Spatial reference: File - Load: National Grids -> Finland -> ETRS 1989 GK25FIN.prj **TAI**
-	Spatial reference: Edit - ERTS89 / GK25FIN (uudemmat EMME-versiot)
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
|`base_network_xxx.txt`        |	verkko (yhteinen kaikille aikajaksoille)                  |
|`transit_lines_xxx.txt`       |	linjasto (yhteinen kaikille aikajaksoille)                |
|`turns_xxx.txt`               |	kääntymiset (yhteinen kaikille aikajaksoille)             |
|`extra_links_xxx.txt`         |	linkkien pyörätieluokat (yhteinen kaikille aikajaksoille) |
|`extra_links_xxx.txt`         |	mahdolliset ruuhkamaksut tai tietullit aikajaksoittain    |
|`extra_transit_lines_xxx.txt` |	linjojen vuorovälit aikajaksoittain                       | 

`extra_xxx.txt`-tiedostot luovat valmiiksi ennustejärjestelmän tarvitsemat extra-attribuutit. 

## Muut lähtötiedot

Muut tarvittavat lähtötiedot (mm. kustannukset, pohjakysyntä) ajetaan automaattisesti sisään ennusteprosessin aikana.
