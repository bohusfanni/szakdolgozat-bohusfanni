# Mobilalkalmazás alapú hallásvizsgálati rendszer fejlesztése

## Szakdolgozat leírása

A szakdolgozat célja egy olyan mobilalkalmazás megtervezése és fejlesztése volt, amely képes alapvető hallásvizsgálatok elvégzésére mobil eszközök segítségével.

Az alkalmazás React Native és Expo technológiák felhasználásával készült, míg a háttérrendszer működését a Firebase felhőalapú szolgáltatásai biztosítják.

A rendszer különböző hangfrekvenciákat játszik le a felhasználó számára, aki visszajelzést ad arról, hogy hallotta-e az adott hangot. Az eredmények mentésre kerülnek, így a korábbi vizsgálatok később is visszanézhetők és exportálhatók.

## Fő funkciók

- Felhasználói regisztráció és bejelentkezés
- Hallásvizsgálatok indítása
- Különböző frekvenciájú hangok lejátszása
- Felhasználói visszajelzések kezelése
- Mérési eredmények mentése
- Hangerő kalibráció
- Korábbi vizsgálatok megtekintése
- Audiogram megjelenítés
- CSV exportálási lehetőség
- Firebase alapú adatkezelés
- Egyszerű és mobilbarát felhasználói felület

## Használt technológiák

- React Native
- Expo
- JavaScript
- Firebase Authentication
- Firebase Firestore
- Expo AV (Audio kezelés)
- React Navigation

## Az alkalmazás futtatható: 
Expo Go alkalmazással
Android emulátoron vagy IOS szimulátoron

## Firebase konfiguráció

A projekt Firebase szolgáltatásokat használ autentikációhoz és adatkezeléshez.

A konfigurációs fájl helye:

src/config/firebase.js

Használt Firebase szolgáltatások:

Firebase Authentication
Cloud Firestore

## Projektstruktúra
src/
├── components/
├── config/
├── hooks/
├── screens/
├── utils/
└── assets/

## Fontosabb mappák
  Mappa	                  Leírás
components	      Újrafelhasználható komponensek
screens	          Az alkalmazás képernyői
services	        Firebase és egyéb szolgáltatások
utils	            Segédfüggvények
config	          Konfigurációs fájlok
assets	          Képek és egyéb statikus fájlok

## Telepítés és futtatás
1. Repository klónozása
git clone https://github.com/bohusfanni/szakdolgozat-bohusfanni.git
2. Függőségek telepítése
npm install
3. Projekt indítása
npx expo start

## Készítette:

Gyüre-Bohus Fanni Réka

## Intézmény

Szegedi Tudományegyetem
Természettudományi és Informatikai Kar

