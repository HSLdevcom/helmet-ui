---
sort: 4
---

# Malliajon tulokset

Tulosten tallennuskansiopolku määritellään Helmet-käyttöliittymän projektiasetuksissa (ks. [ohjeet](kaytto-ohje.md)). 
Kunkin Helmet-skenaarion (malliajon) tulokset tallentuvat kyseisen Helmet-skenaarion nimellä nimettyyn alikansioon. 
Näihin kansioihin tallentuu kahdentyyppisiä tiedostoja matriiseja ja tekstitiedostoja, joita on kuvattu tässä ohjeessa tarkemmin.

Näiden lisäksi sijoittelutulokset jäävät talteen Emme-pankkiin.
Lisää tietoja sijoittelun tuloksista ja niiden analysoinnista löytyy Emmen dokumentaatiosta. Huom! Jos ajat samassa Emme-pankissa useita Helmet-skenaarioita, tarkat matriisitulokset jäävät Emmeen talteen vain, jos config-tiedostoon on määritelty matriiseille omat tallennuspaikat (ks. [ohjeet](kaytto-ohje.md)).

Lisää tietoja kysyntämallien toiminnallisuuksista ja niiden tulosten merkityksestä saat
[malliraportista](https://hslfi.azureedge.net/globalassets/julkaisuarkisto/2020/6_2020_helsingin_seudun_tyossakayntialueen_liikenne-ennustejarjestelman_kysyntamallit.pdf).

## Tuloskansion tekstitiedostojen kuvaukset

### Tiedostoissa käytetyt lyhenteet ja termit

#### Helsingin seudulla alkavien kiertomatkojen päätyypit

| Koodi | Kiertomatkan tyyppi   |
|-------|-----------------------|
| hw    | koti - työ            |
| hc    | koti - koulu          |
| hu    | koti - opiskelu       |
| hs    | koti - ostos/asiointi |
| ho    | koti - muu            |
| wo    | työ - joku            |
| oo    | muu kiertomatka       |
| *wh*  | työ - koti [1]        |

[1] Tyyppi *wh* on invertoitu versio kotiperäisten työmatkojen (hw) mallista. Sitä käytetään työvoiman saavutettavuuslaskennassa.

#### Ympäryskunnissa alkavien kiertomatkojen päätyypit

| Koodi | Kiertomatkan tyyppi |
|-------|---------------------|
| hwp   | koti - työ          |
| hop   | koti - muu          |
| oop   | muu kiertomatka     |

#### Kulkutavat

| Koodi | Kulkutapa      |
|-------|----------------|
| c     | auto           |
| t     | joukkoliikenne |
| b     | polkupyörä     |
| w     | jalankulku     |

#### Väylätyypit

| Koodi | Väylätyyppi                                                  |
|-------|--------------------------------------------------------------|
| 1     | Moottoritiet                                                 |
| 2     | Maantiet / Useampikaistaiset kaupunkiväylät eritasoliittymin |
| 3     | Useampikaistaiset pääkadut tasoliittymin valoilla            |
| 4     | Pääkadut                                                     |
| 5     | Kokooja-/tonttikadut                                         |

#### Suuralueet

| Koodi          | Selitys                                         | Sijoittelualueet |
|----------------|-------------------------------------------------|------------------|
| helsinki_cbd   | Helsingin kantakaupunki                         | 0 - 999          |
| helsinki_other | Muu Helsinki                                    | 1 000 - 1 999    |
| espoo_vant_kau | Muu pääkaupunkiseutu                            | 2 000 - 5 999    |
| surrounding    | Kehyskunnat                                     | 6 000 - 15 999   |
| surround_train | Junaliikenteeseen <br /> tukeutuvat kehyskunnat | 6 000 - 6 999 <br /> 10 000 - 11 999 <br /> 13 000 - 14 999 <br /> 15 500 - 15 999 |
| surround_other | Muut kehyskunnat                                | 7 000 - 9 999 <br /> 12 000 - 12 999 <br /> 15 000 - 15 499 |
| peripheral     | Ympäryskunnat                                   | 16 000 - 30 999  |

### Tiedostot

| Tiedoston nimi                               | Selite | Tarkempi kuvaus |
|----------------------------------------------|--------|-----------------|
| accessibility.txt                            | Kysyntämallin logsum-muuttujat sijoittelualueittain, joita voidaan tulkita saavutettavuusmittareiksi | Logsumit ovat kiertomatkatyyppi- ja kulkutapakohtaisia. Kulkutapamalleista saadaan yhdistetyt logsumit kaikille kulkutavoille. |
| aggregated_demand.txt aggregated_demand.xlsx | Suuraluetasolle aggregoidut koko vuorokauden kysyntämatriisit |
| attraction.txt                               | Alueiden kiertomatka-attraktiot, eli kuinka monessa kiertomatkassa kyseinen alue on päämäärä |
| car_accessibility.txt                        | Kysyntämallin logsum-muuttuja-aggregointi autokulkutavalla sijoittelualueittain | :exclamation: Uusi versiossa 4.0.5 |
| car_density.txt                              | Sijoittelualueiden autotiheysluvut (auto/asukas) |
| car_density_areas.txt                        | Suuralueiden autotiheysluvut (auto/asukas) |
| car_density_municipalities.txt               | Kuntien autotiheysluvut (auto/asukas) |
| car_use.txt                                  | Sijoittelualueiden henkilöauton pääasialliset käyttäjät (HAP) osuuksina väestöstä |
| car_density_areas.txt                        | Suuralueiden henkilöauton pääasialliset käyttäjät (HAP) osuuksina väestöstä |
| car_density_municipalities.txt               | Kuntien henkilöauton pääasialliset käyttäjät (HAP) osuuksina väestöstä |
| generation.txt                               | Koko vuorokauden kiertomatkatuotokset kiertomatkatyyppeittäin ja sijoittelualueittain | :exclamation: Nimi muutettu versiossa 4.0.4, aikasemmin tours.txt |
| impedance_ratio.txt                          | Joukkoliikenteen ja henkilöautoliikenteen matka-aika- ja matkakustannussuhteet aamuruuhkassa alueittain | Eri matkakohteiden matka-ajat ja -kustannukset on painotettu työmatkojen määrillä kulkutavoittain. Lukuja käytetään autonomistusmallin muuttujina. |
| mode_share.txt                               | Kokonaiskulkutapajakaumat kiertomatkatyyppeittäin |
| noise_areas.txt                              | Suuralueiden melualueiden pinta-alat ja väestömäärät | :exclamation: Uusi versiossa 4.0.4 |
| origins_demand.txt                           | Sijoittelualueiden koko vuorokauden kiertomatkatuotokset kulkutavoittain |
| origins_demand_areas.txt                     | Suuralueiden koko vuorokauden kiertomatkatuotokset kulkutavoittain |
| origins_shares.txt                           | Kokonaiskulkutapajakaumat sijoittelualueittain |
| own_zone_demand.txt                          | Sijoittelualueiden sisäisten kiertomatkojen (joiden alkupiste ja loppupiste ovat samalla sijoittelualueella) määrät suuralueittain |
| savu.txt                                     | Sijoittelualueiden SAVU-vyöhykejäsenyydet | :exclamation: Uusi versiossa 4.0.4, määrittely muutettu versiossa 4.0.5 |
| sustainable_accessibility.txt                | Kysyntämallin logsum-muuttujat ilman autokulkutapaa sijoittelualueittain | :exclamation: Uusi versiossa 4.0.4, määrittely muutettu versiossa 4.0.5 |
| tour_combinations.txt<br />tour_combinations.xlsx | Koko vuorokauden kiertomatkayhdistelmien tuotosluvut ikäryhmittäin | :exclamation: Nimi muutettu versiossa 4.0.4, aikaisemmin generation.txt |
| transit_kms.txt                              | Koko vuorokauden etäisyys- ja ajo-aikasuoritteet (km, min) joukkoliikenteen ajoneuovoille |
| trip_lengths.txt                             | Koko vuorokauden kiertomatkatuotokset tyyppeittäin, kulkutavoittain ja etäisyysluokittain | Etäisyysluokka perustuu henkilöauton ajoetäisyyteen kilometreissa. |
| trips_areas.txt                              | Suuralueiden koko vuorokauden (meno+paluu)matkatuotokset kulkutavoittain | :exclamation: Uusi versiossa 4.0.5 |
| vehicle_kms_areas.txt                        | Kulkumuotojen etäisyyssuoritteet (km) koko vuorokaudelle suuralueittain | :exclamation: Uusi versiossa 4.0.4 |
| vehicle_kms_vdfs.txt                         | Kulkumuotojen etäisyyssuoritteet (km) koko vuorokaudelle väylätyypeittäin | :exclamation: Nimi muutettu versiossa 4.0.4, aikasemmin vehicle_kms.txt |
| vehicle_kms_vdfs_areas.txt                   | Kokonaisetäisyyssuoritteet (km) koko vuorokaudelle väylätyypeittäin ja suuralueittain | :exclamation: Uusi versiossa 4.0.4 |
| workforce_accessibility.txt                  | Työ-koti-mallin logsum-muuttuja sijoittelualueittain muunnettu henkilömääräksi | :exclamation: Uusi versiossa 4.0.4, määrittely muutettu versiossa 4.0.5 |

## Tuloskansion matriisitiedostojen kuvaukset

Matriisitiedostot ovat [omx-formaatissa](https://github.com/osPlanning/omx/wiki) alakansiossa *Matrices*.
Sekä kysyntä- että vastusmatriisit ovat tuntimatriiseja.

| Koodi | Tunti           |
|-------|-----------------|
| aht   | aamuhuipputunti |
| pt    | päivätunti      |
| iht   | iltahuipputunti |

Tuntimatriisit aggregoidaan mallijärjestelmässä koko vuorokauteen kiinteillä kertoimilla (ks. [sijoitteluskripti](https://github.com/HSLdevcom/helmet-model-system/blob/master/Scripts/parameters/assignment.py#L122)).

| Tiedoston nimi (jossa xxx on tunnin koodi) | Selite | Tarkempi kuvaus |
|--------------------------------------------|--------|-----------------|
| demand_xxx.txt | Kysyntämatriisit kulkumuodoittain | Henkilöauto-, joukkoliikenne- ja polkupyörämatriisit on jaettu työ- ja vapaa-ajan matkojen matriiseihin. |
| time_xxx.txt   | Matka-aikamatriisit [min] kulkumuodoittain | Henkilöauto- ja joukkoliikennematriisit on jaettu työ- ja vapaa-ajan matkojen matriiseihin. |
| dist_xxx.txt   | Matkaetäisyysmatriisit [km] kulkumuodoittain | Henkilöauto- ja joukkoliikennematriisit on jaettu työ- ja vapaa-ajan matkojen matriiseihin. |
| cost_xxx.txt   | Tiemaksu- sekä joukkoliikenteen kuukausilippukustannusmatriisit [eur] kulkumuodoittain | Henkilöauto- ja joukkoliikennematriisit on jaettu työ- ja vapaa-ajan matkojen matriiseihin. |
