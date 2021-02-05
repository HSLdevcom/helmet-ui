# Uuden HELMET 4.0 sij19 -sijoittelupankin perustaminen ”tyhjästä”

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

Perusta tyhjä skenaario kohdassa _First scenario_ (tarvitset alussa skenaariot 19 ja 20, toinen niistä luodaan myöhemmin):
-	Number: esim. 19 
-	Title: esim. pp

**Huom: järjestelmä käyttää oletusarvoisesti skenaarioita 19 (pp), 20 (vrk), 21 (aht), 22 (pt) ja 23 (iht).**
Näitä numeroita käytetään tässä ohjeessa, mutta tarvittaessa voidaan käyttää muitakin numeroita ja ilmoittaa ne makron 4verkkoa_HM40.mac kutsussa

Valitse koordinaatisto:
-	Spatial reference: File - Load: National Grids -> Finland -> ETRS 1989 GK25FIN.prj **TAI**
-	Spatial reference: Edit - ERTS89 / GK25FIN (uudemmat EMME-versiot) 
- Koordinaatistoa voi myöhemmin muuttaa valikossa File - Project Settings – GIS.

Luotuasi projektin, muuta Emme promptissa (Tools – Prompt) laitetyyppejä komennolla `dev`. 
Päätteen tyypiksi on hyvä valita ”Emtool (non-graphic report /40l)” ja tulostimen tyypiksi (6): ”ASCII (no page / header)”.

## Kopioi syöttötiedostot

Verkkojen sisäänajoon tarvitset HELMET-makrot, jotka saat ladattua 
[täältä](https://minhaskamal.github.io/DownGit/#/home?url=https://github.com/HSLdevcom/helmet-model-system/tree/master/Database) (zip). 
Laita ne Emme-projektin Database-kansioon (esimerkiksi `C:\HELMET40\sijoittelu\Database`). 
Lisää Database-kansioon myös alikansiot kullekin tarkasteluvuodelle (esim. 2019 ja 2030) ja alikansioihin tiedostot, 
jotka sisältävät tiedot kulkutavoista, ajoneuvotyypeistä, verkosta, kääntymisistä sekä linkkien ruuhkamaksuista. HSL:n tarjoamien valmiiden lähtötietojen osalta tarvittavat aineistot eri tarkasteluvuosille löytyvät jakokansiosta Verkot (lisätietoja [täällä](mallin_lahtotietotiedostot.md).)

## Valmistele skenaariot

Luo Promptin (module 1.22) tai Modellerin (Tools - Modeller - Data management - Scenario) avulla toinen tyhjä skenaario (19 tai 20, toisen näistä loit jo aiemmin).

Mene Emme-promptiin ja luo seuraavaksi testiverkot:
-	Aja skenaariossa 19 makrot `batin_tyhjapyoraverkko.mac` (makrot ajetaan kommennolla `~<makron_nimi.mac`).
-	Aja skenaariossa 20 makro `batin_tyhjaverkko.mac`.
-	Kopioi skenaario 20 skenaarioiksi 21, 22 ja 23 (module 1.22 tai Modeller).
- Tee valmiiksi ennustejärjestelmän tarvitsemat extra-attribuutit. Tämä onnistuu helpoiten makrolla `aja_extra_attr_HM31.mac`, 
  joka luo tarvittavat attribuutit skenaarioihin 19 ja 21–23

Liikennejärjestelmää kuvaavat tiedostot (kulkutavat, ajoneuvotyypit, verkot, kääntymiset, joukkoliikennelinjasto) pitää lukea Emme-pankkiin tietyssä järjestyksessä ja poistaa vastakkaisessa järjestyksessä. Siksi on hyödyllistä, että Emme-pankissa on valmiina yksinkertainen testiverkko, jotta se voidaan poistaa hallitusti ja lukea tilalle tarkasteltavan vaihtoehdon tiedostot.

## Aja makro 4verkkoa_HM40.mac

Makro `4verkkoa_HM40.mac` lukee sisään kulkutavat, ajoneuvotyypit, verkot, kääntymiset, joukkoliikennelinjaston sekä linkkien ruuhkamaksut. Makrolle annetaan parametreina:

1. vaihtoehdon tunnus (esim. 2019_20191122), pakollinen
2. alikansio (oletus nykyinen, esim. `sijopankki2017`).
3. pyöräverkon skenaario (oletus s=19)
4. vuorokausiverkko (oletus s+1)
5. aht skenaarion numero (oletus s+2)
6. pt skenaarion numero (oletus s+3)
7. iht skenaarion numero (oletus s+4)
8. skenaarion nimi (oletus sama kuin 1)

Jos kutsussa ei anneta parametreja, ne kysytaan ajon alussa interaktiivisesti ja ehdotetaan oletusarvoja.

Vaihtoehdon tunnuksen näet esim. alikansiossa `C:\HELMET40\sijoittelu\Database\2019` olevien tiedostojen nimistä (tiedostonimen loppuosa). Ajo esim

    ~<4verkkoa_HM40.mac 2016_20191014 sijopankki2016 19 20 21 22 23 V2016
    ~<4verkkoa_HM40.mac 2018_20191014 sijopankki2018 29 30 31 32 33 V2018
    ~<4verkkoa_HM40.mac 2019_20191122 sijopankki2019 39 40 41 42 43 V2019
    
Vain ensimmäinen parametri (vaihtoehdon tunnus) on pakollinen. Myös toinen parametri tarvitaan, jos tiedostot eivät ole kansiossa database. Muilta osin voidaan hyväksyä ohjelman ehdottamat oletusarvot.

Makro `4verkkoa_HM40.mac` lukee skenaarioon 19 tarpeelliset tiedot moduuleilla x.yy seuraavista tiedostoista 
(käytettävän moduulin voi päätellä tiedostonimestä, esimerkiksi tiedoston `d201_modes_M2016.in` kohdalla käytettävä moduuli on 2.01).
 
|Tiedosto                    | Sisältö                                           |
|----------------------------|---------------------------------------------------|
|`d201_modes_M2016_pyora.in` |	kulkutavat (muutettu fillari ”autokulkutavaksi”) |
|`d211_verkko_tunnus.in`     |	verkko (sama kuin moottoroidulla liikenteellä)   |

Makro lukee myös skenaarioihin 21–23 tarpeelliset tiedot moduuleilla x.yy tiedostoista

|Tiedosto                    | Sisältö                                                    |
|----------------------------|------------------------------------------------------------|
|`d201_modes_M2016.in`	     |	kulkutavat (yhteinen kaikille vaihtoehdoille)             |
|`d202_veh_M2016.in`	       |	ajoneuvotyypit (yhteinen kaikille vaihtoehdoille)         |
|`d211_verkko_tunnus.in`     |	verkko (yhteinen kaikille aikajaksoille)                  |
|`d221_linjat_tunnus.in`     |	linjasto (yhteinen kaikille aikajaksoille)                |
|`d231_verkko_tunnus.in`     |	kääntymiset (yhteinen kaikille aikajaksoille)             |
|`d241_hinta_tunnus.in`      |	mahdolliset ruuhkamaksut tai tietullit aikajaksoittain    |
|`d241_vuorovalit_tunnus.in` |	linjojen vuorovälit aikajaksoittain                       | 

Skenaariota 20 ei tarvitse muuttaa, sillä sen paikalle kopioidaan skenaario 22 (päiväliikenne) vuorokausiskenaarioksi, johon ennustejärjestelmä tallettaa sijoittelun tuloksia.

Makro tekee valmiiksi ennustejärjestelmän tarvitsemat extra-attribuutit. 
Samalla luetaan skenaarioon myös ruuhkamaksut tiedostoista `d241_hinta_tunnus.in` moduulilla 2.41.

Makro `4verkkoa_HM40.mac` kopioi skenaarion 21 skenaarioiksi 22 ja 23 (vanha sisältö poistetaan) ja käynnistää myös makrot, jotka muuttavat kenttiä `ul1`, `ul2`, `hdwy`, `us2`, `vdf` ja `ttf` skenaarion aikajakson (mm. bussikaistan käyttö) mukaisiksi. Lisäksi tehdään erilaisia tarkistuksia (mm. nollalinkit, puuttuvat vuorovälit, ratikoiden nopeudet, junien matka-ajat). 

Jos skenaarion muodostaminen epäonnistuu esim. tunnuksessa tai alikansion nimessä olevan virheen takia, 
poista skenaario ja perusta se uudelleen moduulilla 1.22 sekä alusta se makrolla 
`batin_tyhjaverkko.mac`. Aja sitten uudelleen makro `4verkkoa_HM40.mac` oikeilla parametreilla.

## Muut lähtötiedot

Muut tarvittavat lähtötiedot (mm. maankäyttö, kustannukset, pohjakysyntä) ajetaan automaattisesti sisään ennusteprosessin aikana.

## Makron 4verkkoa_HM40.mac toiminta 

Tarkistetaan ja tarvittaessa täydennetään kutsuparametrit.

Muodostetaan pyöräilyskenaario
* Luetaan kulkutavat, verkkotiedosto (solmut ja linkit) sekä pyörätieluokat. 
* Muutetaan linkeille pyörätieluokan mukaiset viivytysfunktiot (makrolla `vdf_pyora.mac`)

Muodostetaan moottoroidun liikenteen skenaariot
* Luetaan  kulkutavat, ajoneuvotyypit, verkkotiedosto (solmut ja linkit), kääntymiskiellot ja aamuruuhkan joukkoliikennelinjasto.
* Muutetaan linkkien attribuutit (viivytysfunktio `vdf`, kapasiteetti `ul1` ja vapaa nopeus `ul2`) linkkityypin `type` perusteella (makrolla `muuta_linkkien_attribuutit_eikorj.mac`)
* Määritellään joukkoliikennelinjojen pysähtymiset solmutyypin `ui2` perusteella (makroilla `hsl_kunnat.mac` ja `pysakki.mac`)
* Luetaan aht-skenaarioon linkkien ruuhkamaksut tai tietullit aikajaksoittain (makrolla `hinnat_lue.mac`)
* Luetaan aht-skenaarioon joukkoliikennelinjojen vuorovälit `hdwy` aikajaksoittain (makrolla `vuorovalit_lue.mac`)
* Kopioidaan aht-skenaario pt- ja iht-skenaarioiksi.
* Määritellään aikajaksokohtaiset attribuuttien arvot
  - autoliikenteen viivytysfunktion `vdf` numero (bussikaista voimassa vai ei) (makroilla `f_bussi_M2016_3?.mac`)
  - kapasiteetti (`ul1`), jos vahintaan kolmesta kaistasta yksi on joukkoliikennekaista (makroilla `f_bussi_M2016_3?.mac`)
  - bussiliikenteen viivytysfunkton parametri `us2` linkkityypin ja bussikaistan voimassaolon perusteella (makroilla `f_us2_M2016_4?.mac`)
  - joukkoliikenteen viivytysfunktion `ttf` numero (busseille bussikaistan voimassaolon ja ratikoille aikajakson perusteella) (makroilla `f_jkl_M2016_5?.mac`)
  - joukkoliikenteen vuoroväli `hdwy` (makrolla `vuorovalit_kopioi.mac`)
  - ruuhkamaksun tai tietullin suuruus (makrolla `vuorovalit_kopioi.mac`).

Tehdään tarkistuksia eri aikajaksojen skenaarioihin (makrolla `tarkista_verkko.mac`)
* Yhteenveto linkkityypeista ja viivytysfunktioista
* Luettelo linkeistä, joilta puuttuu pituus (`length=0`)
* Luettelo autolinkeistä, joilta puuttuu kapasiteetti (`ul1=0`)
* Luettelo autoiinkeistä, joilta puuttuu vapaa nopeus (`ul2=0`)
* Luettelo autoiinkeistä, joilta puuttuu viivytysfunktio (`vdf=0`)
* Raitiovaunulinkkien `ul1`-kentassa olevan raitiovaunuliikenteen nopeuden minimi- ja maksimiarvot sekä onko jokin nopeuksista nolla.
* Puuttuuko juna- tai metroliikenteen matka-aika (`us1=0`) ennen pysahtymista olevalla segmentillä (`noalin=0` tai `noboan=0`).
* Poikkeaako juna- tai metroliikenteen matka-aika `us1` nollasta, vaikka ei pysahdysta (`noalin=1` ja `noboan=1`).
* Linjat, joilta puuttuu vuorovali (`hdwy=0.01`)

Kopioidaan pt-skenaario vrk-skenaarioksi.

## Muita makroja

**lvari_M2016.mac** laskee kulkutavan mukaisen värikoodin linkkiattribuuttiin `@lvari`

**tee_luokittelumuuttujat.mac** määrittelee linkkiattribuutit `@kunc,  @lvari, @neli` ja `@sij19`, joita voidaan käyttää esim. alueluokituksissa

**tee_suoritemuuttujat.mac** määrittelee linkkiattribuutit `@ajnkm,  @ajnh, @hlokm` ja `@hloh`, joihin voidaan tallettaa linkkien suoritteita
