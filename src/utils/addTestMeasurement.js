import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "../config/firebase";

export async function addTestMeasurement() {
  const user = auth.currentUser;
  if (!user) {
    console.warn("Nincs bejelentkezett felhasználó");
    return;
  }

  try {
    await addDoc(collection(db, "measurements"), {
      userId: user.uid,
      createdAt: Date.now(),
      ear: "L",
      freqsHz: [125, 250, 500, 1000, 2000, 4000, 8000],
      thresholdsDbHL: [10, 15, 20, 25, 20, 30, 35],
      note: "teszt mérés",
    });

    console.log("Teszt mérés elmentve");
  } catch (e) {
    console.warn("Teszt mérés mentése sikertelen:", e);
  }
}
