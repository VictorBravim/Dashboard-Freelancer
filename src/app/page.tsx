'use client';
import React, { useState, useEffect } from "react";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/services/firebaseConfig";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace("/dashboard");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/dashboard");
    } catch {
      setError("Erro ao fazer login. Verifique suas credenciais.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#3E5063]">
      <div className="w-full max-w-md bg-[#081E33] p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-white text-center mb-6">Login</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <div className="mb-4">
          <label className="block text-sm font-medium text-white mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 bg-[#2C394A] text-white border border-[#2C394A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#334655]"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-white mb-2">Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 bg-[#2C394A] text-white border border-[#2C394A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#334655]"
          />
        </div>

        <button
          onClick={handleLogin}
          className="w-full p-3 bg-[#2C394A] hover:bg-[#081E33] text-white rounded-lg shadow-md focus:outline-none"
        >
          Entrar
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
