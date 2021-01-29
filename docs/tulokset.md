# Malliajon tulokset

Tulosten kansiopolku määritellään Helmet-käyttöliittymän projektiasetuksissa. 
Tähän Helmet-skenaarion (malliajon) tulokset tallentuvat Helmet-skenaarion nimellä nimettyyn alakansioon. 
Tulokset jotka tallentuvat tähän kansioon ovat kahdentyyppisiä: matriiseja ja tekstitiedostoja.
Näiden lisäksi tulokset jäävät Emme-pankkiin talteen sijoitteluista.
Lisää tietoja sijoittelun tuloksista ja niiden analysoinnista löytyy Emmen dokumentaatiosta.

Lisää tietoja kysyntämallien toiminnallisuuksista ja niiden tulosten merkityksestä saadaan
[malliraportista](https://hslfi.azureedge.net/globalassets/julkaisuarkisto/2020/6_2020_helsingin_seudun_tyossakayntialueen_liikenne-ennustejarjestelman_kysyntamallit.pdf).

## Tuloskansion tekstitiedostojen kuvaukset

### Tiedostoissa käytetyt lyhenteet ja termit

Helsingin seudulla alkavien kiertomatkojen päätyypit
- hw: koti - työ
- hc: koti - koulu
- hu: koti - opiskelu
- hs: koti - ostos/asiointi
- ho: koti - muu
- wo: työ - joku
- oo: muu kiertomatka

Ympäryskunnissa alkavien kiertomatkojen päätyypit
- hwp: koti - työ
- hop: koti - muu
- oop: muu kiertomatka

Kulkutavat
- c: auto
- t: joukkoliikenne
- b: polkupyörä
- w: jalankulku

Väylätyypit
1. Moottoritiet
2. Maantiet / Useampikaistaiset kaupunkiväylät eritasoliittymin
3. Useampikaistaiset pääkadut tasoliittymin valoilla
4. Pääkadut
5. Kokooja-/tonttikadut

Suuralueet

| Koodi | Selitys | Sijoittelualueet |
|---|---|---|
| helsinki_cbd | Helsingin kantakaupunki | 0 - 999
| helsinki_other | muu Helsinki | 1 000 - 1 999
| espoo_vant_kau | muu Pääkaupunkiseutu | 2 000 - 5 999
| surrounding | Kehyskunnat | 6 000 - 15 999
| peripheral | Ympäryskunnat | 16 000 - 30 999

### accessibility.txt

Tiedosto sisältää kysyntämallin logsum-muuttujia sijoittelualueittain, joita voidaan tulkita saavutettavuusmittareiksi.
Logsumit ovat kiertomatkatyyppi- ja kulkutapakohtaisia. Kulkutapamalleista saadaan yhdistetyt logsumit kaikille kulkutavoille.

### aggregated_demand.txt ja aggregated_demand.xlsx

Tiedostot sisältävät suuraluetasolle aggregoituja koko vuorokauden kysyntämatriiseja.

### attraction.txt

Tiedosto sisältää alueiden kiertomatka-attraktioita, eli kuinka monessa kiertomatkassa kyseinen alue on päämäärä.

### car_density.txt

Tiedosto sisältää sijoittelualueiden autotiheyslukuja (auto/asukas).

### car_density_per_areas.txt

Tiedosto sisältää suuralueiden autotiheyslukuja (auto/asukas).

### car_density_per_municipalities.txt

Tiedosto sisältää kuntien autotiheyslukuja (auto/asukas).

### car_use.txt

Tiedosto sisältää sijoittelualueiden osuuksia väestöstä, jotka ovat henkilöauton pääasiallinen käyttäjä (HAP).

### car_density_per_areas.txt

Tiedosto sisältää suuralueiden osuuksia väestöstä, jotka ovat henkilöauton pääasiallinen käyttäjä (HAP).

### car_density_per_municipalities.txt

Tiedosto sisältää kuntien osuuksia väestöstä, jotka ovat henkilöauton pääasiallinen käyttäjä (HAP).

### generation.txt ja generation.xlsx

Tiedostot sisältävät koko vuorokauden kiertomatkayhdistelmien tuotoslukuja ikäryhmittäin.

### impedance_ratio.txt

Tiedosto sisältää joukkoliikenteen ja henkilöautoliikenteen matka-aika- ja matkakustannussuhteet aamuruuhkassa alueittain.
Eri matkakohteiden matka-ajat ja -kustannukset on painotettu työmatkojen määrillä kulkutavoittain.
Lukuja käytetään autonomistusmallin muuttujana.

### mode_share.txt

Tiedosto sisältää kokonaiskulkutapajakaumia kiertomatkatyyppeittäin.

### origins_demand.txt

Tiedosto sisältää koko vuorokauden kiertomatkatuotoksia kulkutavoittain ja sijoittelualueittain.

### origins_shares.txt

Tiedosto sisältää kokonaiskulkutapajakaumia sijoittelualueittain.

### own_zone_demand.txt

Tiedosto sisältää sijoittelualueiden sisäisten kiertomatkojen (matkan alkupiste ja loppupiste ovat samalla sijoittelualueella) määriä suuralueittain.

### tours.txt

Tiedosto sisältää koko vuorokauden kiertomatkatuotoksia kiertomatkatyyppeittäin ja sijoittelualueittain.

### transit_kms.txt

Tiedosto sisältää koko vuorokauden etäisyys- ja ajo-aikasuoritteita (km, min) joukkoliikenteen ajoneuovoille.

### trip_lengths.txt

Tiedosto sisältää koko vuorokauden kiertomatkatuotoksia tyyppeittäin, kulkutavoittain ja etäisyysluokittain.
Etäisyysluokka perustuu henkilöauton ajoetäisyyteen kilometreissa.

### vehicle.kms

Tiedosto sisältää kulkumuotojen etäisyyssuoritteita (km) koko vuorokaudelle väylätyypeittäin. 

## Tuloskansion matriisitiedostojen kuvaukset

Matriisitiedostot ovat [omx-formaatissa](https://github.com/osPlanning/omx/wiki) alakansiossa *Matrices*.
Sekä kysyntä- että vastusmatriisit ovat tuntimatriiseja:
- aht: aamuhuipputunti
- pt: päivätunti
- iht: iltahuipputunti

Tuntimatriisit aggregoidaan mallijärjestelmässä koko vuorokauteen kiinteillä kertoimilla.

### demand_xxx.txt (jossa xxx on tunnin tunnus)

Kysyntämatriisit kulkumuodoittain.
Henkilöauto-, joukkoliikenne- ja polkupyörämatriisit on jaetta työ- ja vapaa-ajan matkojen matriiseihin.

### time_xxx.txt (jossa xxx on tunnin tunnus)

Matka-aikamatriisit [min] kulkumuodoittain.
Henkilöauto- ja joukkoliikennematriisit on jaetta työ- ja vapaa-ajan matkojen matriiseihin.

### dist_xxx.txt (jossa xxx on tunnin tunnus)

Matkaetäisyysmatriisit [km] kulkumuodoittain.
Henkilöauto- ja joukkoliikennematriisit on jaetta työ- ja vapaa-ajan matkojen matriiseihin.

### cost_xxx.txt (jossa xxx on tunnin tunnus)

Tiemaksukustannusmatriisit kulkumuodoittain sekä joukkoliikenteen kuukausilippukustannus [eur].
Henkilöauto- ja joukkoliikennematriisit on jaetta työ- ja vapaa-ajan matkojen matriiseihin.
