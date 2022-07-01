---
sort: 10
---

# Emme-verkon kuvaus

## Solmut

### Solmunumerot

Taulukoissa mainitut ”villit solmut” ja ”villit sentroidit” ovat vapaasti käytettävissä olevia numeroita
eri tahojen omiin tarkasteluihin ja hankkeisiin, joita ei ole tarkoituskaan viedä virallisiin HSL:n verkkoihin.
Työn loputtua HSL päivittää tarvittaessa valitun vaihtoehdon osaksi virallisia kuvauksia.

HSL:n virallisia verkkoja muokattaessa on pyydettävä HSL:stä solmunumerot, joita tietyn hankkeen koodaamiseen käytetään.
Virallisissa verkoissa käytettävät solmunumerot ovat taulukoiden sol-muavaruuksissa, joiden kohdalla lukee ”HSL:n hankkeiden” solmut.

HUOM: HLJ-työn yhteydessä voidaan koodata muutoksia suoraan verkon virallisille solmunume-roille.
Tästä on sovittava HSL:n yhteyshenkilöiden kanssa erikseen.

*Taulukko 1. Solmuavaruuden jako, sentroidit*

| numeroavaruus	| selitys |	aliavaruudet | selitys ja huomiot |
|---------------|---------|--------------|--------------------|
| 1-30 999 | sentroidit, tavalliset (aiemmin 1-38 999) | | kunnittain tuhatluvun (1 tai 2 ensimmäisen numeron) perusteella, ks. tarkemmin kohta "Ennuste- ja sijoittelualueiden numerointi" |
| 31 000–31 999 | sentroidit, ulkosyötöt (aiemmin 39 000 -> 39 999) | 31 000–31 299 (käytössä 31 000–31 036) | ulkosyötöt, autoväylät |
| | | 31 300–31 399 (käytössä 31 300–31 302) | ulkosyötöt, junaradat |
| | | 31 400–31 499 |	ulkosyötöt, lentoasema(t) |
| | | 31 500–31 599 |	ulkosyötöt, satamat |
| | | 31 600–31 999 |	tyhjää tilaa vielä tuntemattomien kulkumuotojen  ulkosyötöille |
| 32 000–34 999 |	varautuminen mm. liityntäpysäköintialueisiin, muihin pysäköintialueisiin, kauppakeskuksiin, urheilulaitoksiin jne. | 32 000–32 999 | liityntäpysäköintialueet (varautuminen) |
| | | 33 000–34 999	| tyhjää tilaa muille pysäköintilaitoksille, kauppakeskuksille ja urheilulaitoksille yms. (varautuminen)
| 35 000–39 999 |	”villit sentroidit” | 35 000–39 999	| tilaa vapaisiin tarkasteluihin, joissa halutaan lisätä sentroideja olemassa olevien sentroidien perään |

Erikoissentroideista verkolle on lisätty omat sentroidit Helsinki-Vantaan lentoasemalle ja Helsingin satamille:
-	Lentoasema: i = 30 400
-	Katajanokka: i = 30 500
-	Eteläsatama: i = 30 501
-	Länsisatama: i = 30 502
-	Vuosaaren satama: i = 30 503

*Taulukko 2. Solmuavaruuden jako, muut solmut kuin sentroidit*

| numeroavaruus	| selitys |	aliavaruudet | selitys ja huomiot |
|---------------|---------|--------------|--------------------|
| 40 000–799 999 | solmut, katu- ja tieverkko (sisältää myös erilliset kevyen liikenteen yhteydet) |	40 000–599 999 | |
| | | 600 000–799 999 |	”villit” solmut |
| 800 000–800 999	| metroverkon solmut | 800 000–800 499 | ”HSL:n hankkeiden” solmut |
| | | 800 500–800 999 |	”villit” solmut |
| 801 000–801 999 |	junaverkon solmut | 801 000–801 499 |	”HSL:n hankkeiden” solmut |
| | | 801 500–801 999	| ”villit” solmut |
| 802 000–819 999 | raitiovaunuverkon solmut + pikaraitiotieverkon solmut | 802 000–805 999 | nykyinen ja nykyisenkaltainen raitiovaunuverkko |
| | | 806 000–809 999 |	”villit” solmut |
| | | 810 000–815 999 | erillinen pikaraitiotieverkko (tiedossa olevat erilliset hankkeet kuten Raide-Jokeri(t), Tiederatikka)* |
| | | 816 000–819 999 |	”villit” solmut |

* Käytännössä tulee eteen tilanteita, joissa (pika)raitiolinja halutaan koodata ajamaan reittiä,
joka sisältää sekä nykyisenkaltaista raitiotieverkkoa että pikaraitiotieverkkoa.
Silloin valitaan käytettäväksi jommankumman solmunumerot uusien reittien osalta.

### Solmujen ominaisuudet

Pysäkkityypit on koodattava erityisen huolellisesti, sillä raitiovaunu- ja bussilinjojen pysähtyminen perustuu solmuihin koodattuihin pysäkkityyppeihin.
Tietoja käytetään pysähtymistietoskriptissä.

*Taulukko 3. Solmujen attribuuttitiedot*

| attribuutti | | selitys |
|-------------|-|---------|
| solmuattribuutti | ui1 | väliaikainen tieto, VAPAA |
| solmuattribuutti | ui2 | solmun tyyppi, ks. taulukko 4 |
| solmuattribuutti | ui3 | sen kunnan kelakoodi, jossa solmu sijaitsee (ks. taulukko 5) |
| solmuattribuutti | label | joukkoliikenteen lippuvyöhyke (A, B, C tai D) tai tieto muista kunnista joilla on omat lipputuotteensa: Järvenpää (J), Nurmijärvi (N), Vihti (V), Mäntsälä/Hyvinkää (M), Pornainen (P) |

*Taulukko 4. Solmutyypit (ui2) ja niiden selitykset*

| koodi (ui2) |	kuvaus |
|-------------|--------|
| 0	|	muu solmu |
| | |	
| 1	|	raitiovaunupysäkki |
| | |	
| 2	|	bussipysäkki paikallisliikenne (sis. vakiovuorot)
| 3	|	bussipysäkki paikallis- ja runkoliikenne
| 4	|	bussipysäkki paikallis- ja pikavuoroliikenne 
| 5	|	bussipysäkki paikallis-, runko- ja pikavuoroliikenne
| 6	|	bussipysäkki muu 
| 7 |	pikavuoropysäkki
| 8	| raitiovaunu- ja pikaratikkapysäkki
| 11	|	bussiterminaali
| | |	
| 12	|	varaus ratikka- tai pikaratikkaterminaalille
| 13	|	metroasema (myös asemavaraus)
| 14	|	rautatieasema (myös asemavaraus)
| | |	
| 20	|	liittymä (ei pysäkki)
| (21-39)	|	(varalla, jos liittymien tyyppejä tai osia halutaan eritellä tarkemmin)
| | |	
| 40		|	liityntäpysäköinti (sentroidi)
| (41-49)		|	(varalla, jos pysäköintialueiden tyyppejä halutaan eritellä tarkemmin)
| | |	
| 50	|	kauppakeskus (sentroidi)
| 60	|	urheilulaitos (sentroidi)
| 70	|	satama (sentroidi)
| 80	|	lentoasema (sentroidi) (huom. lentomatkustajille)
| | |	
| 90	|	normaali sentroidi (sijoittelualueita vastaavat)
| 91	|	ulkosyöttö, autoväylät (sentroidi)
| 92	|	ulkosyöttö, junaradat (sentroidi)

*Taulukko 5. Mallialueen kuntien kelakoodit (ui3) (vuoden 2019 kuntajako)*

| kunta |	kelakoodi (ui3) |	kunta |	kelakoodi (ui3) |	kunta	| kelakoodi (ui3) |
|-------|-----------------|-------|-----------------|-------|-----------------|
| Askola	| 18	| Kauniainen	| 235	| Pornainen	| 611
| Espoo	| 49	| Kerava	| 245	| Porvoo	| 638
| Hanko	| 78	| Kirkkonummi	| 257	| Pukkila	| 616
| Hattula	| 82	| Kärkölä	| 316	| Raasepori	| 710
| Hausjärvi	| 86	| Lahti	| 398	| Riihimäki	| 694
| Helsinki	| 91	| Lapinjärvi	| 407	| Salo	| 734
| Hollola	| 98	| Lohja	| 444	| Sipoo	| 753
| Hyvinkää	| 106	| Loppi	| 433	| Siuntio	| 755
| Hämeenlinna	| 109	| Loviisa	| 434	| Somero	| 761
| Inkoo	| 149	| Myrskylä	| 504	| Tammela	| 834
| Janakkala	| 165	| Mäntsälä	| 505	| Tuusula	| 858
| Järvenpää	| 186	| Nurmijärvi	| 543	| Vantaa	| 92
| Karkkila	| 224	| Orimattila	| 560	| Vihti	| 927
