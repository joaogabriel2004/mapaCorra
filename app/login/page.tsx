"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/app/services/firebase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, senha);
      router.push("/");
    } catch (error) {
      console.error(error);
      alert("Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f4f0e8] flex items-center justify-center p-6">
      <form
        onSubmit={login}
        className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md"
      >
        <h1 className="text-3xl font-black text-[#ef7d00] mb-6">
          Corra Pro Abraço
        </h1>

        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border-2 rounded-2xl px-4 py-3 mb-4 text-black"
        />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="w-full border-2 rounded-2xl px-4 py-3 mb-4 text-black"
        />

        <button
          disabled={loading}
          className="w-full bg-[#009640] text-white py-4 rounded-2xl font-bold disabled:opacity-50"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </main>
  );
}