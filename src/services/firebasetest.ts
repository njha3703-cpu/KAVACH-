import { ref, set } from "firebase/database";
import { database } from "../firebase/firebaseConfig";

export async function testFirebase() {
  try {
    await set(ref(database, "test"), {
      message: "KAVACH connected",
      time: Date.now(),
    });

    console.log("✅ Firebase connected and data written!");
  } catch (error) {
    console.error("❌ Firebase write failed:", error);
  }
}