import { doc, getDoc } from "firebase/firestore";
import { db } from "@/app/services/firebase";
import { Equipe } from "@/app/types/equipe";

export async function buscarEquipe(equipeId: string): Promise<Equipe | null> {
  try {
    const docRef = doc(db, "equipes", equipeId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    const data = docSnap.data() as Omit<Equipe, "id">;

    return {
      id: docSnap.id,
      ...data,
    };
  } catch (error) {
    console.error("Erro ao buscar equipe:", error);
    return null;
  }
}