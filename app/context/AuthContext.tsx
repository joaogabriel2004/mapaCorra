"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/app/services/firebase";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
});

const TEMPO_INATIVIDADE_MS = 5 * 60 * 1000; // 5 minutos

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = async () => {
    localStorage.removeItem("ultima_atividade");
    await signOut(auth);
  };

  // 1. Salva a hora ao sair/fechar a aba
  useEffect(() => {
    const salvarHoraSaida = () => {
      localStorage.setItem("ultima_atividade", Date.now().toString());
    };

    window.addEventListener("pagehide", salvarHoraSaida);
    return () => {
      window.removeEventListener("pagehide", salvarHoraSaida);
    };
  }, []);

  // 2. Valida o tempo decorrido no carregamento da autenticação
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const ultimaAtividade = localStorage.getItem("ultima_atividade");

        if (ultimaAtividade) {
          const tempoDecorrido = Date.now() - Number(ultimaAtividade);

          // Se ficou mais de 10 minutos longe/fechado, força o logout
          if (tempoDecorrido > TEMPO_INATIVIDADE_MS) {
            await logout();
            setUser(null);
            setLoading(false);
            return;
          }
        }

        // Se esteve dentro do tempo limite, atualiza o status do usuário
        setUser(firebaseUser);
        localStorage.removeItem("ultima_atividade");
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return () => unsub();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}