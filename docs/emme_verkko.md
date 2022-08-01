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

| numeroavaruus	| selitys |	aliavaruudet  | selitys ja huomiot |
|---------------|---------|---------------|--------------------|
| 1-30 999      | sentroidit, tavalliset (aiemmin 1-38 999) | | kunnittain tuhatluvun (1 tai 2 ensimmäisen numeron) perusteella, ks. tarkemmin kohta "Ennuste- ja sijoittelualueiden numerointi" |
| 31 000–31 999 | sentroidit, ulkosyötöt (aiemmin 39 000 -> 39 999) | 31 000–31 299 (käytössä 31 000–31 036) | ulkosyötöt, autoväylät |
|               |         | 31 300–31 399 (käytössä 31 300–31 302) | ulkosyötöt, junaradat |
|               |         | 31 400–31 499 |	ulkosyötöt, lentoasema(t) |
|               |         | 31 500–31 599 |	ulkosyötöt, satamat |
|               |         | 31 600–31 999 |	tyhjää tilaa vielä tuntemattomien kulkumuotojen  ulkosyötöille |
| 32 000–34 999 |	varautuminen mm. liityntäpysäköintialueisiin, muihin pysäköintialueisiin, kauppakeskuksiin, urheilulaitoksiin jne. | 32 000–32 999 | liityntäpysäköintialueet (varautuminen) |
|               |         | 33 000–34 999	| tyhjää tilaa muille pysäköintilaitoksille, kauppakeskuksille ja urheilulaitoksille yms. (varautuminen) |
| 35 000–39 999 |	”villit sentroidit” | 35 000–39 999	| tilaa vapaisiin tarkasteluihin, joissa halutaan lisätä sentroideja olemassa olevien sentroidien perään |

Erikoissentroideista verkolle on lisätty omat sentroidit Helsinki-Vantaan lentoasemalle ja Helsingin satamille:
-	Lentoasema: i = 30 400
-	Katajanokka: i = 30 500
-	Eteläsatama: i = 30 501
-	Länsisatama: i = 30 502
-	Vuosaaren satama: i = 30 503

*Taulukko 2. Solmuavaruuden jako, muut solmut kuin sentroidit*

| numeroavaruus	  | selitys                                               |	aliavaruudet    | selitys ja huomiot                              |
|-----------------|-------------------------------------------------------|-----------------|-------------------------------------------------|
| 40 000–799 999  | solmut, katu- ja tieverkko (sisältää myös erilliset kevyen liikenteen yhteydet) |	40 000–599 999 |                        |
|                 |                                                       | 600 000–799 999 | ”villit” solmut                                 |
| 800 000–800 999	| metroverkon solmut                                    | 800 000–800 499 | ”HSL:n hankkeiden” solmut                       |
|                 |                                                       | 800 500–800 999 | ”villit” solmut                                 |
| 801 000–801 999 |	junaverkon solmut                                     | 801 000–801 499 | ”HSL:n hankkeiden” solmut                       |
|                 |                                                       | 801 500–801 999 | ”villit” solmut                                 |
| 802 000–819 999 | raitiovaunuverkon solmut + pikaraitiotieverkon solmut | 802 000–805 999 | nykyinen ja nykyisenkaltainen raitiovaunuverkko |
|                 |                                                       | 806 000–809 999 | ”villit” solmut                                 |
|                 |                                                       | 810 000–815 999 | erillinen pikaraitiotieverkko (tiedossa olevat erilliset hankkeet kuten Raide-Jokeri(t), Tiederatikka)* |
|                 |                                                       | 816 000–819 999 | ”villit” solmut                                 |

*) Käytännössä tulee eteen tilanteita, joissa (pika)raitiolinja halutaan koodata ajamaan reittiä,
joka sisältää sekä nykyisenkaltaista raitiotieverkkoa että pikaraitiotieverkkoa.
Silloin valitaan käytettäväksi jommankumman solmunumerot uusien reittien osalta.

### Solmujen ominaisuudet

Pysäkkityypit on koodattava erityisen huolellisesti, sillä raitiovaunu- ja bussilinjojen pysähtyminen perustuu solmuihin koodattuihin pysäkkityyppeihin.
Tietoja käytetään pysähtymistietoskriptissä.

*Taulukko 3. Solmujen attribuuttitiedot*

| attribuutti      |       | selitys                                                      |
|------------------|-------|--------------------------------------------------------------|
| solmuattribuutti | ui1   | väliaikainen tieto, VAPAA                                    |
| solmuattribuutti | ui2   | solmun tyyppi, ks. taulukko 4                                |
| solmuattribuutti | ui3   | sen kunnan kelakoodi, jossa solmu sijaitsee (ks. taulukko 5) |
| solmuattribuutti | label | joukkoliikenteen lippuvyöhyke (A, B, C tai D) tai tieto muista kunnista joilla on omat lipputuotteensa: Järvenpää (J), Nurmijärvi (N), Vihti (V), Mäntsälä/Hyvinkää (M), Pornainen (P) |

*Taulukko 4. Solmutyypit (ui2) ja niiden selitykset*

| koodi (ui2) |	kuvaus                                                                  |
|-------------|-------------------------------------------------------------------------|
| 0	          |	muu solmu                                                               |
|             |                                                                         |	
| 1	          |	raitiovaunupysäkki                                                      |
|             |                                                                         |	
| 2	          |	bussipysäkki paikallisliikenne (sis. vakiovuorot)                       |
| 3	          |	bussipysäkki paikallis- ja runkoliikenne                                |
| 4	          |	bussipysäkki paikallis- ja pikavuoroliikenne                            |
| 5	          |	bussipysäkki paikallis-, runko- ja pikavuoroliikenne                    |
| 6	          |	bussipysäkki muu                                                        |
| 7           |	pikavuoropysäkki                                                        |
| 8	          | raitiovaunu- ja pikaratikkapysäkki                                      |
| 11	        |	bussiterminaali                                                         |
|             |                                                                         |	
| 12	        |	varaus ratikka- tai pikaratikkaterminaalille                            |
| 13	        |	metroasema (myös asemavaraus)                                           |
| 14	        |	rautatieasema (myös asemavaraus)                                        |
|             |                                                                         |	
| 20	        |	liittymä (ei pysäkki)                                                   |
| (21-39)	    | (varalla, jos liittymien tyyppejä tai osia halutaan eritellä tarkemmin) |
|             |                                                                         |	
| 40		      |	liityntäpysäköinti (sentroidi)                                          |
| (41-49)		  |	(varalla, jos pysäköintialueiden tyyppejä halutaan eritellä tarkemmin)  |
|             |                                                                         |	
| 50	        |	kauppakeskus (sentroidi)                                                |
| 60	        |	urheilulaitos (sentroidi)                                               |
| 70	        |	satama (sentroidi)                                                      |
| 80	        |	lentoasema (sentroidi) (huom. lentomatkustajille)                       |
|             |                                                                         |	
| 90	        |	normaali sentroidi (sijoittelualueita vastaavat)                        |
| 91	        |	ulkosyöttö, autoväylät (sentroidi)                                      |
| 92	        |	ulkosyöttö, junaradat (sentroidi)                                       |

*Taulukko 5. Mallialueen kuntien kelakoodit (ui3) (vuoden 2019 kuntajako)*

| kunta       |	kelakoodi (ui3) |	kunta       |	kelakoodi (ui3) |	kunta	    | kelakoodi (ui3) |
|-------------|-----------------|-------------|-----------------|-----------|-----------------|
| Askola	    | 18	            | Kauniainen  | 235	            | Pornainen | 611             |
| Espoo     	| 49	            | Kerava	    | 245	            | Porvoo	  | 638             |
| Hanko     	| 78	            | Kirkkonummi	| 257	            | Pukkila	  | 616             |
| Hattula   	| 82	            | Kärkölä	    | 316	            | Raasepori	| 710             |
| Hausjärvi 	| 86	            | Lahti     	| 398	            | Riihimäki	| 694             |
| Helsinki   	| 91             	| Lapinjärvi	| 407	            | Salo	    | 734             |
| Hollola	    | 98             	| Lohja     	| 444	            | Sipoo	    | 753             |
| Hyvinkää	  | 106           	| Loppi	      | 433	            | Siuntio	  | 755             |
| Hämeenlinna	| 109	            | Loviisa   	| 434	            | Somero	  | 761             |
| Inkoo	      | 149	            | Myrskylä	  | 504	            | Tammela	  | 834             |
| Janakkala  	| 165	            | Mäntsälä	  | 505	            | Tuusula	  | 858             |
| Järvenpää  	| 186	            | Nurmijärvi	| 543	            | Vantaa	  | 92              |
| Karkkila	  | 224	            | Orimattila	| 560	            | Vihti	    | 927             |

## Kulkumuodot ja joukkoliikenteen ajoneuvotyypit

Verkolla käytetyt kulkumuodot (modes) ja joukkoliikenteen ajoneuvotyypit (vehicles):
- Pääkulkumuodon (auto) h on oltava linkillä sallittu, jos halutaan määrittää esim. kääntymiskieltoja.
  Verkon koodauksessa kannattaa aina sallia kulkumuoto h.
  Pääkulkumuoto poistuu automaattisesti linkeiltä sijoittelun yhteydessä:
  - Autosijoittelussa h on sallittu vain autolinkeillä (c)
  - Polkupyöräsijoittelussa h on sallittu vain pyörälinkeillä (f)
- Bussiliikenteessä on erotettu erilaisen pysähtymiskäyttäytymisen linjat:
  HSL:n alueella runko-linjat tavallisista bussilinjoista ja VALLU-linjoissa pikavuorot tavallisista vuoroista.
-	Tavaraliikenteessä on kolme erilaista kulkumuotoa.

*Taulukko 6. Kulkumuotojen (modes) kuvaus*

| kulkumuoto (mode)	| kuvaus                                                              |
|-------------------|---------------------------------------------------------------------|
| h	                | pääkulkumuoto                                                       |
| c	                | auto                                                                |
| b	                | HSL:n bussi                                                         |
| g	                | HSL:n runkolinja                                                    |
| d	                | muu bussi (kaukoliikenne, VALLU-rekisteristä)                       |
| e	                | pikavuoro (kaukoliikenne, VALLU-rekisteristä)                       |
| m	                | metro                                                               |
| r	                | lähijuna                                                            |
| j	                | kaukojuna                                                           |
| t	                | ratikka                                                             |
| p	                | pikaratikka                                                         |
| w	                | vesiliikenne joukkoliikennemuotona (”water”) (varaus)               |
| v	                | pakettiauto (”van”)                                                 |
| k	                | kuorma-autot ilman perävaunua                                       |
| y	                | perävaunulliset kuorma-autot (”yhdistelmä”)                         |
| a	                | kävely sis. vaihtokävely                                            |
| s	                | syöttökävely, ulkosyöttö (vain konnektoreilla)                      |
| f	                | polkupyörä (”fillari”) (kadut, erilliset pyörätiet ja syöttölinkit) |

 *Taulukko 7. Joukkoliikenteen ajoneuvotyypit (vehicles), niitä vastaavat kulkumuodot ja kuvaus*
 
| ajoneuvotyyppi (vehicle) | kulkumuoto (mode) | kuvaus         |
|--------------------------|-------------------|----------------|
| 1	                       | d	               | vakiovuoro     |
| 2	                       | e	               | pikavuoro      |
| 3	                       | b	               | HSL-bussi      |
| 4	                       | m	               | metro          |
| 5	                       | r	               | lähijuna       |
| 6	                       | j	               | kaukojuna      |
| 7	                       | t	               | ratikka        |
| 8	                       | g	               | HSL-runkobussi |
| 9	                       | w	               | lautta         |
| 10                       | p                 | pikaratikka    |

## Linkit

### Linkkien ominaisuudet

*Taulukko 8. Linkkien ominaisuudet*

| kenttä          | huomioita                                                                |
|-----------------|--------------------------------------------------------------------------|
| type            | ks. taulukko 9                                                           |
| length          | linkin pituus kilometreinä                                               |
|	lanes	          | kaistamäärä, bussikaista sisältyy ilmoitettuun kaistamäärään             |
|	modes         	|                                                                          |
|	vdf	            | autoliikenteen sijoittelufunktion nro, muilla kuin autolinkeillä vdf = 0 |
| ul1	            |	autoverkko: linkin yhden kaistan kapasiteetti                            |
|                 | raitiovaunuverkko: aamu-, päivä- ja iltaliikenteen nopeus                |
|                 | juna- ja metroverkko: ei käytössä (0)                                    |
|                 | kävely- ja pyöräilylinkit: ei käytössä (0)                               |
| ul2	            | autoverkko: linkin vapaa nopeus                                          |
|                 | raideliikenne: ei käytössä (0)                                           |
|                 | kävely- ja pyöräilylinkit: ei käytössä (0)                               |
| ul3           	| autoverkko: autoliikenteen linkeille sijoitellaan aluksi raskas liikenne, ja tulokset tallennetaan linkkiattribuuttiin ul3 (oltava link user datassa eikä extra-attribuutissa, jotta tietoa voidaan käyttää sijoittelufunktioissa) |
|                 | raideliikenne: ei käytössä (0)                                           |
|                 | kävely- ja pyöräilylinkit: ei käytössä (0)                               |
| @pyoratieluokka	|	pyöräliikenneverkko: Pyörätien laatuluokka (taulukko 11)                 |

#### Linkkityypit ja väyläluokat

Sijoitteluskripti muuttaa linkien funktio-, nopeus- ja kapasiteettiattribuutit (vdf, ul1, ul2) type-attribuutin perusteella.
Kaikille katu- ja tieverkon linkeille ei ole saatu tuotettua taulukko 10:n mukaista linkkityyppiä.
Näiden linkkien tyypiksi on koodattu 191-195
(sekä 291-295, 391-395, ... linkeille, joilla on bussikaista tai jotka ovat joukkoliikennekatuja, ja jotka eivät noudata taulukkoa 10),
ja niiden ul1-, ja ul2-attribuutit säilyvät sijoittelun aikana.

Sijoitteluskripti muuttaa linkin vdf-attribuutin nollaksi, jos type ei ole taulukko 9 mukaan.

Bussikaista otetaan huomioon sijoittelufunktioissa, jolloin henkilöautoilta vähennetään yksi kaista bussikaistan voimassaoloaikana.
Bussien nopeus bussikaistalla määritetään vapaan nopeuden ja bussien viiveparametrien perusteella.
Bussien nopeus bussikaduilla ja -rampeilla (linkkityypit 6xx), joilla henkilöautoliikenteen nopeutta ei ole, määräytyy kuten bussikaistallisilla linkeillä.
Ne on koodattu kuin aina voimassa olevat bussikaistat, ja funktiomakrot käsittelevät niitä sellaisina.

*Taulukko 9. Linkkityypit (link type)*

| linkkityyppi (link type) | selitys                                                                      | modes                                   |
|--------------------------|------------------------------------------------------------------------------|-----------------------------------------|
| 1	      | poistunut käytöstä (oli käytössä vanhalla verkolla, ei saa koodata)                           |                                         |
| 2	      | ratikka                                                                                       | t, ta, taf                              |
| 3	      | metro                                                                                         | m                                       |
| 4	      | junat                                                                                         | rj                                      |
| 5	      | pikaratikka                                                                                   | p, pa, paf                              |
| 6	      | ratikkahybridi (varaus)                                                                       | tp, tpa, tpaf                           |
| 70	    | kävely ja pyöräily sis. vaihtokävely (pois lukien syötöt eli kumpikaan pää ei ole sentroidi, moottoriajoneuvoliikenne ei ole sallittua) |
|         | **syöttölinkit erikoissentroideihin (84-86 vielä varauksia)**                                 |                                         |
| 84    	| liityntäpysäköinti (vain konnektoreita liipy-solmuihin)                                       | cvkyaf, af                              |
| 85    	| kauppakeskus (vain konnektoreita kauppakeskus-sentroideihin)                                  | cvkyaf, af                              |
| 86	    | urheilulaitos (vain konnektoreita urheilulaitos-sentroideihin)                                | cvkyaf, af                              |
| 87	    | satama (vain konnektoreita satama-sentroideihin)                                              | cvkyaf, af                              |
| 88	    | lentoasema (vain konnektoreita lentoasema-sentroideihin)                                      | cvkyaf, af                              |
|         | **syöttölinkit tavallisiin sentroideihin ja ulkosyöttöihin**                                  | cvkyaf, af                              |
| 98    	| ulkosyöttölinkki                                                                              | cvkyasf, asf                            |
| 99    	| syöttölinkki                                                                                  | cvkyaf, af                              |
|         | **katu- ja tieverkon linkit (pl. vain kevyen liikenteen käytössä olevat linkit), ks. seuraava taulukko** |                              |
| 121–142	| jalankulku, pyöräily, kaikki autot, bussit, ei bussikaistaa                                   | cvkybgdeaf, cvkybgde, cvkbgdeaf, cvkyaf |
| 221–242	| jalankulku, pyöräily, kaikki autot, bussit, bussikaista vain ruuhka-aikoina                   | cvkybgdeaf, cvkybgde, cvkbgdeaf         |
| 321–342	| jalankulku, pyöräily, kaikki autot, bussit, bussikaista koko päivän                           | cvkybgdeaf, cvkybgde, cvkbgdeaf         |
| 421–442	| jalankulku, pyöräily, kaikki autot, bussit, bussikaista vain aamuruuhkassa (varaus)           | cvkybgdeaf, cvkybgde, cvkbgdeaf         |
| 521–542	| jalankulku, pyöräily, kaikki autot, bussit, bussikaista vain iltaruuhkassa (varaus)           | cvkybgdeaf, cvkybgde, cvkbgdeaf         |
| 621–642	| joukkoliikenneväylä busseille (henkilöautoilu kielletty) (bussikadut, bussirampit yms.)       | bgde, bgdeaf                            |
| x9v–x9v (esim. 191–195, 199) | linkit ja bussikadut, joilla on taulukosta poikkeavat ul1- ja ul2-arvot verkolla (x = sataluku kuten edellä). Käytetään viivytysfunktiota v=1–5. | |
| 999    	| vanhan verkon ”poikkeava linkki”, jonka dokumentaatio puuttuu (tätä linkkityyppiä ei saa koodata enää) |                                |

Taulukko 10. Sijoittelufunktioiden jako väylätyyppeihin

| | Väyläluokka	| Tarkennus	| Sijoittelu- funktio (suluissa bussi- kaista- linkkien funktio) | Nopeus- rajoitus | Vapaa nopeus (km/h, ul2) | Kapasi- teetti (S, ul1) | Linkkityyppi: ei bussi-kaistaa, bussikaista ruuhka-aikana, bussikaista koko päivän, bussikaista vain aamuruuhkassa, bussikaista vain iltaruuhkassa, bussiväylä |
|----|--------------------------|----------------------------------------------|------------|-----|---------|----------|-------------------------|
| 21 | Moottoritiet             | moottoritie                                  | fd1 (fd6)  | 120 | 113     | 2100 *   | 121 221 321 421 521 621 |
| 22 |                          | moottoritie, kaistoja=>3                     |            | 120 | 113     | 1900 **  | 122 222 322 422 522 622 |
| 23 |                          |	moottoritie	                                 |            | 100 |  97     | 2000	   | 123 223 323 423 523 623 |
| 24 |                          |	moottoritie, kaistoja=>3                     |            | 100 |  97     | 1800 **  | 124 224 324 424 524 624 |
| 25 |                          |	moottoritie	                                 |            |  80 |  81     | 2000	   | 125 225 325 425 525 625 |
| 26 |                          |	moottoritie, kaistoja=>3                     |            |  80 |  81     | 1800 **  | 126 226 326 426 526 626 |
| 27 | Maantiet / Useampikaistaiset kaupunkiväylät eritasoliittymin | maantie, 2 kaistaa | fd2 (fd7) | 100 | 97	| 1900 | 127 227 327 427 527 627 |
| 28 |                          | maantie, kaistoja=>3                         |            | 100 |  97     | 1800 **  | 128 228 328 428 528 628 |
| 29 |                          | maantie, 2 kaistaa	                         |            |  80 |  81     | 1850	   | 129 229 329 429 529 629 |
| 30 |                          | maantie, kaistoja=>3                         |            |  80 |  81     | 1800 **  | 130 230 330 430 530 630 |
| 31 |                          | maantie, 2 kaistaa                           |            |  70 |  73     | 1600	   | 131 231 331 431 531 631 |
| 32 |                          | maantie, 2 kaistaa                           |            |  60 |  63 *** | 1600	   | 132 232 332 432 532 632 |
| 33 | Useampikaistaiset pääkadut tasoliittymin valoilla | usea kaista, valot	 | fd3 (fd8)	|  70 |  61	    | 1450     | 133 233 333 433 533 633 |
| 34 |                          | usea kaista, valot                           |            |  60 |  54     | 1250     | 134 234 334 434 534 634 |
| 35 | Pääkadut	                | esik,pääk, ei valoja                         | fd4 (fd9)  |  50 |  48     | 1150	   | 135 235 335 435 535 635 |
| 36 |                          | esik.pääk,valot/kesk.ei valoja               |            |  50 |  44     | 1000	   | 136 236 336 436 536 636 |
| 37 |                          | esik. pääkatu, valot tai keskusta,.ei valoja |            |  40	|  41     | 1000	   | 137 237 337 437 537 637 |
| 38 | Kokooja-/tonttikadut	    | kesk.pääkatu, valot	                         | fd5 (fd10) |  50	|  41	    |  900	   | 138 238 338 438 538 638 |
| 39 |                          | kesk.kokooja                                 |            |  40 |  36     |  750     | 139 239 339 439 539 639 |
| 40 |                          | keskusta, hidas pääkatu	                     |            |  40 |  36     |  900	   | 140 240 340 440 540 640 |
| 41 |                          | pienet tonttikadut	                         |            |  30 |  30     |  600	   | 141 241 341 441 541 641 |
| 42 |                          | keskusta, pienet kadut	                     |            |  30 |  23     |  500	   | 142 242 342 442 542 642 |

*) Alun perin 2200, mutta verkolla on käytetty johdonmukaisesti kapasiteettia 2100, Trafixin mukaan siksi,
että 2200 on epärealistisen suuri kapasiteetti normaaleissa olosuhteissa, ja tekee moottoriteistä liian houkuttelevia vaihtoehtoja.

**) Helmet 3.1:ssä linkin kapasiteettia kasvatettu 1700:sta arvoon 1800 ajon/h (paitsi linkkityypillä x22 ar-voon 1900 ajon/h),
jos autoliikenteen käytössä on vähintään kolme kaistaa ko. aikajakson aikana.

***) Helmet 3.1:ssä linkin vapaata nopeutta kasvatettu 54:stä arvoon 63 km/h.

#### Yleisimmät linkkityyppi- ja kulkumuotoyhdistelmät

Muilla kuin autolinkeillä noudatetaan yleisesti periaatetta vdf = 0, ul1 = 0, ul2 = 0, ul3 = 0, ellei näillä ole jotain erikoismerkitystä (kuten ul1 ratikoilla). 

Kävely ja pyöräily on lähtökohtaisesti sallittua autolinkeillä ja kiellettyä raideliikenteen linkeillä.
Ratikka- ja pikaratikkalinkeille voi koodata kävelyn/pyöräilyn (”taf”, ”paf”, ”tpaf”), jos ei ole rinnakkaista ajoneuvolinkkiä, jolle kävelyn voisi koodata.
Metro- ja junaradoilla kävelyä/pyöräilyä ei kuitenkaan voi sallia (eli ”maf”, ”rjaf” eivät ole sallittuja).
Autolinkkejä, joilla kävely ja pyöräily eivät ole sallittuja, voi koodata poikkeustapauksissa, kuten tunnelit (esimerkiksi Kampin terminaalissa).

#### Pyörätieluokat

Pyöräliikenneverkossa, kaikille linkeille on määritelty pyörätieluokka (0-4) extra atribuuttiin @pyoratieluokka.
Pyörätien miellyttävyyteen vaikuttaa sekä määritelty pyörätieluokka että linkki-tyyppi seuraavan taulukon mukaan.
Baanan määritelmä on tässä seuraava: (1) ei juuri tasoristeyk-siä eikä muita esteitä (esim. bussipysäkkejä), 
(2) oma tarpeeksi leveä tila selvästi eroteltu jalanku-lusta, (3) tasainen, asfaltoitu pinta, ei jyrkkiä mäkiä.
Jos moottoritien varressa on pyörätie, sen luokka on yleensä 3 (erillinen pyörätie).
Pyörätiet käyttävät autoverkon solmuja.

Taulukko 11. Pyörätieluokkien vaikutus

|                                     |	@pyoratieluokka | Linkkityypit | Miellyttävyys |
|-------------------------------------|-----------------|--------------|---------------|
| Baana	                              | 4	              |              | 19            |
| Erillinen pyörätie	                | 3		            |              | 17            |
| Pyörätie kadun varressa, maantie	  | 2	              | 27-32	       | 17            |
| Pyörätie kadun varressa, pääkatu	  | 2	              | 33-37	       | 16            |
| Pyörätie kadun varressa, pieni katu	| 2	              | 38-42	       | 15            |
| Pyöräkaista	                        | 1		            |              | 15            |
| Sekaliikenne, maantie	              | 0	              | 27-32	       | 12            |
| Sekaliikenne, pääkatu	              | 0	              | 33-40	       | 10            |
| Sekaliikenne, pieni katu	          | 0	              | 41-42	       | 12            |

### Kaksiajorataiset kadut

Kaksiajorataiset tiet ja kadut kuvataan verkossa jatkossa siten, että kummankin ajoradan linkeillä käytetään samoja solmupareja.
Poikkeuksen tähän muodostavat moottoritiet, kehätiet ja muut moottoritiemäiset (esim. eritasoliittymin varustetut) väylät.

### Eritasoliittymät ja moottoritiemäiset väylät

Eritasoliittymien ja moottoritiemäisten väylien ajoradat kuvataan erillisinä.
”Tavoitteena on ylläpitää kuvausta, joka vastaa mahdollisimman hyvin fyysistä todellisuutta tai eritasoliittymistä laadittuja suunnitelmia.
Liittymät, joista suunnitelmia ei ole tehty, voidaan kuvata yksinkertaistettuina (esimerkiksi ns. salmiakkikuvaus).”

Seuraavat väylät on verkossa kuvattu kaksiajorataisina:
- Sisääntulotiet / moottoritiet
  - Länsiväylä (kt51): 2-ajoratainen kuvaus Kirkkonummelta Ruoholahteen (Purokummuntie–Porkkalankatu)
  - Turunväylä (vt1): 2-ajoratainen kuvaus verkon ulkoreunalta Huopalahdentielle
  - Vihdintie (mt 120): 2-ajoratainen kuvaus Kehä III:lta Vihdintien ympyrään (Pitäjänmäen ympyrään) – (Tiilipojanlenkki–Pitäjänmäentie)
  - Hämeenlinnanväylä (vt3): 2-ajoratainen kuvaus verkon ulkoreunalta Hakamäentielle
  - Tuusulanväylä (kt45): 2-ajoratainen kuvaus Tuusulasta (Vanhan Tuusulantien liittymästä) Pohjolankadulle
  - Lahdenväylä (vt4): 2-ajoratainen kuvaus verkon ulkoreunalta Koskelantielle
  - Porvoonväylä (vt7): 2-ajoratainen kuvaus verkon ulkoreunalta Lahdenväylälle
  - Itäväylä: 2-ajoratainen kuvaus Itäkeskuksesta Kehä I:n liittymästä Kalasatamaan.
- Kehätiet
  - Kehä I: 2-ajoratainen kuvaus koko matkan Länsiväylältä (Karhusaarensolmusta) Itäkes-kukseen (Itäväylän liittymään)
  - Kehä II: 2-ajoratainen kuvaus koko matkan Länsiväylältä (Matinsolmusta) Turuntielle (tie 110)
  - Kehä III: 2-ajoratainen kuvaus Mankinsolmusta (Kauklahdenväylältä) Vuosaaren sata-maan.
- Moottoritiemäiset väylät
  - Lentoasemantie Kehä III:lta pohjoiseen (Virkatie – Helsinki-Vantaan lentoasema), koska sen kaikki liittymät tuolla välillä ovat eritasoliittymiä.

