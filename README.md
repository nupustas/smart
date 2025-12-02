# Išmaniosios sutarties ir decentralizuotos aplikacijos kūrimas

## Decentralizuota universiteto diplomų ir kvalifikacijų patikra

--- 

#### Verslo problema, kurią sprendžia sistema
##### Tradicinėje sistemoje:
* Diplomai ir pažymėjimai gali būti klastojami
* Darbdaviai priversti rankiniu būdu tikrinti dokumentus
* Universitetai patiria didelę administracinę naštą
* Duomenys saugomi centralizuotai, todėl pažeidžiami

##### Blockchain sprendimas leidžia:
* Užtikrinti duomenų nekintamumą.
* Leisti bet kam patikrinti diplomų autentiškumą.
* Sumažinti biurokratiją.
* Padidinti pasitikėjimą tarp visų šalių.


---

### Verslo modelio logika

Sistema veikia kaip decentralizuotas akademinių kvalifikacijų registras, kuriame:
* Universitetai ir dėstytojai yra duomenų teikėjai
* Studentai yra duomenų savininkai
* Darbdaviai yra duomenų tikrintojai
* Išmanioji sutartis veikia kaip nepriklausomas pasitikėjimo garantas

Visi įrašai:
* Yra laiko žymėti
* Yra viešai patikrinami
* Negali būti pakeisti ar ištrinti
* Yra pasiekiami tik su atitinkamomis teisėmis

---
### Pagrindiniai sistemos veikėjai

#### Universitetas
* Registruoja studijų programas
* Tvirtina studentų akademinius rezultatus
* Išduoda diplomus per išmaniąją sutartį
* Veikia kaip oficialus duomenų šaltinis

#### Dėstytojas
* Suveda studentų kurso rezultatus
* Patvirtina įvykdytas studijų dalis
* Priklauso konkrečiam universitetui

#### Studentas
* Yra akademinių duomenų savininkas
* Gali matyti visą savo studijų istoriją
* Gali suteikti prieigą darbdaviui prie savo įrašų

#### Darbdavys
* Tikrina diplomų ir kvalifikacijų autentiškumą
* Neturi galimybės keisti duomenų
* Gali tikrinti tik gavęs studento leidimą

#### Išmanioji sutartis
* Saugo akademinių įrašų „hash“
* Užtikrina duomenų nekintamumą
* Tikrina naudotojų teises
* Automatizuoja visus patvirtinimo procesus

---
### Tipiniai sistemos veikimo scenarijai

#### 1. Universiteto registracija sistemoje
**Dalyviai:** Universitetas, Išmanioji sutartis  
1. Universitetas iškviečia funkciją `registerUniversity()`
2. Išmanioji sutartis patikrina, ar adresas dar neregistruotas
3. Universitetui suteikiamas oficialus statusas
4. Nuo šiol jis gali registruoti studentus ir tvirtinti pažymius

---

#### 2. Studento registracija į studijų programą
**Dalyviai:** Universitetas, Studentas, Išmanioji sutartis  
1. Universitetas iškviečia `enrollStudent()`
2. Studentui priskiriama studijų programa
3. Studentas įtraukiamas į sistemos duomenų bazę

---

#### 3. Kurso rezultato pateikimas
**Dalyviai:** Dėstytojas, Išmanioji sutartis  
1. Dėstytojas pateikia pažymį per `submitGrade()`
2. Išmanioji sutartis patikrina:
   * Ar dėstytojas turi teisę įvesti pažymį
   * Ar studentas priklauso šiam universitetui
3. Pažymys įrašomas į blokų grandinę

---

#### 4. Diplomo išdavimas
**Dalyviai:** Universitetas, Studentas, Išmanioji sutartis  
1. Sistema patikrina, ar visi kursai yra išlaikyti
2. Universitetas iškviečia `issueDiploma()`
3. Studentui priskiriamas skaitmeninis diplomas
4. Diplomo būsena pažymima kaip „Galiojantis“

---

#### 5. Prieigos suteikimas darbdaviui
**Dalyviai:** Studentas, Darbdavys, Išmanioji sutartis  
1. Studentas iškviečia `grantAccess()`
2. Darbdaviui suteikiama laikina prieiga prie duomenų
3. Darbdavys gali peržiūrėti tik leistiną informaciją

---

#### 6. Diplomo autentiškumo tikrinimas
**Dalyviai:** Darbdavys, Išmanioji sutartis  
1. Darbdavys iškviečia `verifyDiploma()`
2. Patikrinama:
   * Ar diplomas išduotas registruoto universiteto
   * Ar nebuvo atšauktas
   * Ar nėra pakeistas
3. Grąžinamas patvirtinimo rezultatas

---

#### 7. Diplomo atšaukimas
**Dalyviai:** Universitetas, Išmanioji sutartis  
1. Universitetas inicijuoja `revokeDiploma()`
2. Diplomo būsena pakeičiama į „Atšauktas“
3. Bet kokia vėlesnė patikra rodys nebegaliojantį diplomą

---


### Verslo modelio sekų diagrama

![sequence diagrama](img/image.png)