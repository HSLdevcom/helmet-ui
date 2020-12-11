# HSL:n mallitöiden dokumentointiohje

Tässä ohjeessa kuvataan mallitöiden dokumentointi HSL:n tilaamissa töissä. Ohjeita voi toki soveltaa myös muissa projekteissa.

HSL:n tilaamissa töissä kaikki tehdyt muutokset tulee dokumentoida mallitekniseen muistioon ja tallentaa lisäksi muutostiedostot ja/tai muokatut lähtötiedot.

## Luovutettavat aineistot

Työn päättyessä toimita HSL:n yhteyshenkilölle tässä luetellut aineistot. Tämän dokumentoinnin tavoitteena on helpottaa tulosten tulkintaa, mahdollistaa tulosten toistettavuus ja helpottaa aineistojen jatkohyödyntämistä.

### Mallitarkastelujen yleiskuvaus

Kirjaa tehdyistä tarkasteluista ja verkkomuutoksista yleiskuvaus taulukon Mallitarkastelujen pikaseloste (liite D) mukaisesti. **mikä tämä on??**
Kirjaa vastaavat asiat myös työn raporttiin. Raportissa on kuvattava lyhyesti myös mm. poikkeavien makrojen ja parametrien käyttö. 

### Mallitekninen muistio

Työn mallitekniseen toteutukseen liittyvät huomiot kirjataan mallitekniseen muistioon, joka luovutetaan työn päättyessä. Kirjaa kaikki tehdyt muutokset mallitekniseen muistioon. Merkinnästä tulee käydä ilmi, mitä kysyntä- ja tarjontakuvauksen tai malliajon osaa ja ominaisuuksia on muokattu. Dokumentoi muistioon myös muutosten perustelut.

Merkitse myös muutosmakro (ems-tiedosto), jolla muutos on toistettavissa ja josta käyvät ilmi käytetyt lukuarvot, tai lähtötietotiedosto, johon muutokset on viety.

### Tallennettavat muutos- ja lähtötietotiedostot 
**tätä listaa olisi hyvä yhtenäistää niin että myös muista muutoksista on selkeät kuvaukset, ei vain verkkomuutoksista??**

* Tallenna kaikista tekemistäsi muutoksista muokatut versiot lähtötietotiedostoista tilaajalle toimitettavaksi
* Tallenna muutosmakrot kaikista tekemistäsi muutoksista: Tallenna kaikista muutoksista ems-tiedostot, ja nimeä tiedostot hankkeen/muutoksen mukaan. Muutokset voi tarvittaessa jakaa useampaan osaan. 
* Tarjontamuutoksista, joista ei ole ems.tiedostoja, toimita tilaajalle muokatut lähtötiedostot, ja kirjaa mallitekniseen muistioon, mitä muutoksia olet tehnyt, esim.:
  * Linja 10141 ja 10142 reittimuutos Töölössä
  * Linja 25501 ja 25502 uudet vuorovälit
  * Solmut 123456 ja 123457 lisätty label-tiedot

### Emme-pankit

Työn päättyessä HSL:lle palautetaan työn Emme-pankki, jossa on kaikki tarkastellut skenaariot sijoiteltuina. Lisäksi palautetaan kaikkien skenaarioiden (osa)matriisit.

### Emmen worksheetit

Tallenna luovutettavaan aineistoon tuloksissa esiteltävistä raporttikuvista Emmen worksheetit sekä mahdolliset tunnuslukujen laskentakaavat, joiden avulla raportit ovat helposti toistettavissa. Kuvaa tunnuslukujen laskentakaavat projektin raportissa, tai ainakin malliteknisessä muistiossa.

### Emmen ulkopuolisten analyysien dokumentointi

Mikäli työn yhteydessä laaditaan lisätarkasteluja esim. paikkatieto-ohjelmalla, tulee myös näissä mahdollisesti käytetyt laskentakaavat dokumentoida mallitekniseen muistioon.

