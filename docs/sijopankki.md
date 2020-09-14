# Uuden HELMET 4.0 sij19 -sijoittelupankin perustaminen ”tyhjästä”

Luo uusi Emme-projekti haluamaasi kansioon (esimerkiksi `C:\HELMET40\sijoittelu`). 
Huomaa, että emp-tiedoston nimen pitää vastata alikansion nimeä, tässä tapauksessa siis `sijoittelu.emp`. 

HELMET-sijoittelupankin (lisenssikoko vähintään 9) dimensiot:

| Koko    |Muuttuja                                                             |
|---------|---------------------------------------------------------------------|
| 4–20    | network scenarios (vähintään 5, mutta voi olla enemmänkin, esim. 20)|
| 2100    | zones or centroids                                                  |
| 20000   | nodes incl. centroids (17999 regular nodes)                         |
| 55000   | directional links                                                   |
| 30      | transit vehicle types                                               |
| 2000    | transit lines or routes                                             |
| 200000  | transit line segments                                               |
| 10000   | turn table entries                                                  |
| 400     | matrices of type mf                                                 |
| 200     | matrices of type mo                                                 |
| 200     | matrices of type md                                                 |
| 9999    | matrices of type ms                                                 |
| 99      | functions per function class                                        |
| 5000    | operators per function class                                        |
| 3830000 | words for extra attributes                                          |

Asetuksiksi käyvät seuraavat (moduuli 1.23):
- unit of energy: MJ
- unit of cost: eur
- unit of length: km
- **length of 1 coordinate unit: 0.001**

Perusta tyhjät skenaariot 19 ja 20 ja anna niille otsikko. Jos haluat asettaa koordinaatiston jo nyt:
Spatial reference: File, Load: National Grids -> Finland -> ETRS 1989 GK25FIN.prj

Muuta Emme promptissa laitetyyppejä komennolla dev. Päätteen tyypiksi on hyvä valita ”Emtool (non-graphic report /40l)” ja tulostimen tyypiksi (6): ”ASCII (no page / header)”.

**Järjestelmä käyttää skenaarioita 19 (pp), 20 (jk), 21 (aht), 22 (pt) ja 23 (iht).**

Verkkojen sisäänajoon tarvitset HELMET-makrot ([zip](https://minhaskamal.github.io/DownGit/#/home?url=https://github.com/HSLdevcom/helmet-model-system/tree/master/Database)). Laita ne Emme-projektin Database-kansioon (esimerkiksi `C:\HELMET40\sijoittelu\Database`).

Avaa sijoittelupankki Emmen päävalikossa (Emme prompt)
-	Aja skenaariossa 19 makrot `batin_tyhjapyoraverkko.mac`
-	Aja skenaariossa 20 makro `batin_tyhjaverkko.mac`, joka lukee pienen testiverkon.
-	Kopioi skenaario 20 skenaarioiksi 21, 22 ja 23 (module 1.22 tai Modeller).
-	Tee valmiiksi ennustejärjestelmän tarvitsemat extra-attribuutit. Tämä onnistuu helpoiten makrolla `aja_extra_attr_HM31.mac`, 
  joka luo tarvittavat attribuutit skenaarioihin 19 ja 21–23.
 
Skenaarioihin 21–23 voidaan kätevästi lukea tarpeelliset tiedot moduuleilla x.yy tiedostoista

|Tiedosto | Sisältö|
|---|---|
|`d201_modes_M2016.in`	|	kulkutavat (yhteinen kaikille vaihtoehdoille)|
|`d202_veh_M2016.in`	|	ajoneuvotyypit (yhteinen kaikille vaihtoehdoille)|
|`d211_verkko_tunnus.in` |	verkko (yhteinen kaikille aikajaksoille)|
|`d221_linjat_tunnus.in` |	linjasto (yhteinen kaikille aikajaksoille)|
|`d231_verkko_tunnus.in` |	kääntymiset (yhteinen kaikille aikajaksoille)|
|`d241_hinta_tunnus.in` |	mahdolliset aikajaksokohtaiset ruuhkamaksut tai tietullit|
|`d241_vuorovalit_tunnus.in` |	kunkin aikajakson vuorovälit|

sekä skenaarioon 19 tiedostoista

|Tiedosto | Sisältö|
|---|---|
|`d201_modes_M2016_pyora.in` |	kulkutavat (muutettu fillari ”autokulkutavaksi”)|
|`d211_verkko_tunnus.in` |	verkko (sama kuin moottoroidulla liikenteellä)|

käyttäen makroa `batin_4verkkoa_M2019.mac`, jolle annetaan parametreina:
1. vaihtoehdon tunnus (esim. 2017LM_20170131)
2. alikansio (jos ei nykyinen, esim. `.\sijopankki2017\`, huomaa kenoviiva lopussa). 
Skenaariota 20 ei tarvitse muuttaa (sen paikalle kopioidaan skenaario 21 (aht) kävelyskenaarioksi sijoittelussa).

Jos extra-attribuutit `@hinta`, `@hinah`, `@hinih` ja `@hinpt` on määritelty, 
samalla makrolla `batin_4verkkoa_M2019.mac` voidaan lukea skenaarioon myös ruuhkamaksut tiedostoista `d241_hinta_tunnus.in` moduulilla 2.41.

Makro `batin_4verkkoa_M2019.mac` kopioi skenaarion 21 skenaarioiksi 22 ja 23 (vanha sisältö poistetaan) ja käynnistää tarvittaessa myös makrot, 
jotka muuttavat kenttiä `hdwy`, `us2`, `vdf` ja `ttf` skenaarion aikajakson (mm. bussikaistan käyttö) mukaisiksi.

Jos skenaarion muodostaminen epäonnistuu esim. tunnuksessa tai alikansion nimessä olevan virheen takia, 
poista skenaario ja perusta se uudelleen moduulilla 1.22 sekä alusta se makrolla 
`batin_tyhjaverkko.mac`. Aja sitten uudelleen makro batin_4verkkoa_M2019.mac oikeilla parametreilla.

Jatka sijoittelupankissa Emmen päävalikossa (Emme prompt)
-	Lue sisään partitiot tiedostosta `d301_sijoittelupankki_M2019.in` (module 3.01 -> 1= input/modify zone groups (using batch entry))  
-	Lue sisään funktiot tiedostosta `d411_pituusriippuvaiset_HM30.in` (module 4.11) 
(ei välttämätöntä, koska luetaan sisään myös ennusteprosessin aikana)

Muut tarvittavat lähtötiedot ajetaan automaattisesti sisään ennusteprosessin aikana.
