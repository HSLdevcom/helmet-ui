# Uuden HELMET 4.0 sij19 -sijoittelupankin perustaminen ”tyhjästä”

Luo uusi Emme-projekti haluamaasi kansioon:
- File - New - Project…
-	Name: esim. sijoittelu
-	Project location: esim. `C:\HELMET40`

Emme luo valitsemaasi kansioon alikansion (tässä tapauksessa `C:\HELMET40\sijoittelu`) ja tähän alikansioon emp-tiedoston. 
Huomaa, että emp-tiedoston nimen pitää vastata alikansion nimeä, tässä tapauksessa siis `sijoittelu.emp`.

Seuraavassa valintaikkunassa valitse kohta _Create an empty project_ ja jatka dimensioiden määrittelyyn. 
Alla on lueteltu HELMET-sijoittelupankin (lisenssikoko vähintään 9) dimensiot::

| Koko      |Muuttuja                                                             |
|-----------|---------------------------------------------------------------------|
| 5–20      | network scenarios (vähintään 5, mutta voi olla enemmänkin, esim. 20)|
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

Muokkaa seuraavaksi yksikköasetuksia. Asetuksiksi käyvät seuraavat (voit muokata näitä myös Promptissa moduulilla 1.23):
- unit of energy: MJ
- unit of cost: eur
- unit of length: km
- **length of 1 coordinate unit: 0.001**

Perusta tyhjä skenaario kohdassa _First scenario_ (tarvitset alussa skenaariot 19 ja 20, toinen niistä luodaan myöhemmin):
-	Number: esim. 19 
-	Title: esim. pp

**Huom: järjestelmä käyttää skenaarioita 19 (pp), 20 (jk), 21 (aht), 22 (pt) ja 23 (iht).**

Valitse koordinaatisto:
-	Spatial reference: File - Load: National Grids -> Finland -> ETRS 1989 GK25FIN.prj **TAI**
-	Spatial reference: Edit - ERTS89 / GK25FIN (uudemmat EMME-versiot) 
- Koordinaatistoa voi myöhemmin muuttaa valikossa File - Project Settings – GIS.

Luotuasi projektin, muuta Emme promptissa (Tools – Prompt) laitetyyppejä komennolla `dev`. 
Päätteen tyypiksi on hyvä valita ”Emtool (non-graphic report /40l)” ja tulostimen tyypiksi (6): ”ASCII (no page / header)”.

Verkkojen sisäänajoon tarvitset HELMET-makrot 
([zip](https://minhaskamal.github.io/DownGit/#/home?url=https://github.com/HSLdevcom/helmet-model-system/tree/master/Database)). 
Laita ne Emme-projektin Database-kansioon (esimerkiksi `C:\HELMET40\sijoittelu\Database`). 
Lisää Database-kansioon myös alikansiot kullekin tarkasteluvuodelle (esim. 2019 ja 2030) ja alikansioihin tiedostot, 
jotka sisältävät tiedot kulkutavoista, ajoneuvotyypeistä, verkosta, kääntymisistä sekä linkkien ruuhkamaksuista. 

Luo Promptin (module 1.22) tai Modellerin (Tools - modeller) avulla toinen tyhjä skenaario (19 tai 20, toisen näistä loit jo aiemmin).

Luo seuraavaksi testiverkot:
-	Aja skenaariossa 19 makrot `batin_tyhjapyoraverkko.mac` (makrot ajetaan kommennolla `~<makron_nimi.mac`).
-	Aja skenaariossa 20 makro `batin_tyhjaverkko.mac`.
-	Kopioi skenaario 20 skenaarioiksi 21, 22 ja 23 (module 1.22 tai Modeller).
-   Tee valmiiksi ennustejärjestelmän tarvitsemat extra-attribuutit. Tämä onnistuu helpoiten makrolla `aja_extra_attr_HM31.mac`, 
  joka luo tarvittavat attribuutit skenaarioihin 19 ja 21–23

Lue makrolla 4verkkoa_HM40.mac sisään kulkutavat, ajoneuvotyypit, verkot, kääntymiset sekä linkkien ruuhkamaksut.  Makrolle annetaan parametreina:
1. vaihtoehdon tunnus (esim. 2017LM_20170131)
2. alikansio (jos ei nykyinen, esim. `sijopankki2017`).
3. pyöräverkon skenaario
4. vuorokausiverkko
5. aht skenaarion numero
6. pt skenaarion numero
7. iht skenaarion numero
8. skenaarion nimi

Vaihtoehdon tunnuksen näet esim. alikansiossa `C:\HELMET40\sijoittelu\Database\2019` olevien tiedostojen nimistä (tiedostonimen loppuosa). Ajo esim

    ~<4verkkoa_HM40.mac 2016_20191014 sijopankki2016 19 20 21 22 23 V2016
    ~<4verkkoa_HM40.mac 2018_20191014 sijopankki2018 29 30 31 32 33 V2018
    ~<4verkkoa_HM40.mac 2019_20191122 sijopankki2019 39 40 41 42 43 V2019

Makro `4verkkoa_HM40.mac` lukee skenaarioon 19 tarpeelliset tiedot moduuleilla x.yy seuraavista tiedostoista 
(käytettävän moduulin voi päätellä tiedostonimestä, esimerkiksi tiedoston `d201_modes_M2016.in` kohdalla käytettävä moduuli on 2.01).
 
|Tiedosto                    | Sisältö                                           |
|----------------------------|---------------------------------------------------|
|`d201_modes_M2016_pyora.in` |	kulkutavat (muutettu fillari ”autokulkutavaksi”) |
|`d211_verkko_tunnus.in`     |	verkko (sama kuin moottoroidulla liikenteellä)   |

Skenaarioihin 21–23 voidaan kätevästi lukea tarpeelliset tiedot moduuleilla x.yy tiedostoista

|Tiedosto                    | Sisältö                                                    |
|----------------------------|------------------------------------------------------------|
|`d201_modes_M2016.in`	     |	kulkutavat (yhteinen kaikille vaihtoehdoille)             |
|`d202_veh_M2016.in`	       |	ajoneuvotyypit (yhteinen kaikille vaihtoehdoille)         |
|`d211_verkko_tunnus.in`     |	verkko (yhteinen kaikille aikajaksoille)                  |
|`d221_linjat_tunnus.in`     |	linjasto (yhteinen kaikille aikajaksoille)                |
|`d231_verkko_tunnus.in`     |	kääntymiset (yhteinen kaikille aikajaksoille)             |
|`d241_hinta_tunnus.in`      |	mahdolliset aikajaksokohtaiset ruuhkamaksut tai tietullit |
|`d241_vuorovalit_tunnus.in` |	kunkin aikajakson vuorovälit                              |

Skenaariota 20 ei tarvitse muuttaa, sillä sen paikalle kopioidaan skenaario 21 (aht) kävelyskenaarioksi sijoittelussa.

Makro tekee valmiiksi ennustejärjestelmän tarvitsemat extra-attribuutit. 
Samalla luetaan skenaarioon myös ruuhkamaksut tiedostoista `d241_hinta_tunnus.in` moduulilla 2.41.

Makro `4verkkoa_HM40.mac` kopioi skenaarion 21 skenaarioiksi 22 ja 23 (vanha sisältö poistetaan) ja käynnistää tarvittaessa myös makrot, 
jotka muuttavat kenttiä `hdwy`, `us2`, `vdf` ja `ttf` skenaarion aikajakson (mm. bussikaistan käyttö) mukaisiksi.

Jos skenaarion muodostaminen epäonnistuu esim. tunnuksessa tai alikansion nimessä olevan virheen takia, 
poista skenaario ja perusta se uudelleen moduulilla 1.22 sekä alusta se makrolla 
`batin_tyhjaverkko.mac`. Aja sitten uudelleen makro `4verkkoa_HM40.mac` oikeilla parametreilla.

Muut tarvittavat lähtötiedot ajetaan automaattisesti sisään ennusteprosessin aikana.
