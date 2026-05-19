import { doc, getDoc } from "firebase/firestore";

import { db } from "@/app/services/firebase";

export async function buscarTecnico( email: string ) {
  const emailId = email.toLowerCase().replace(/\./g, "_");

  const ref = doc(db, "tecnicos", emailId);

  const snap = await getDoc(ref);

  if (!snap.exists()) {
    return null;
  }

  return snap.data();
}