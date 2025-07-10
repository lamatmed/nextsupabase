/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, phone }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur d'inscription");
      }
      window.location.href = "/login";
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto p-8 mt-16 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Créer un compte</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Nom complet"
          value={fullName}
          onChange={e => setFullName(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Numéro de téléphone"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? "Création..." : "Créer le compte"}
        </button>
        {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
      </form>
      <p className="mt-6 text-center text-sm">
        Déjà inscrit ? <a href="/login" className="text-blue-600 hover:underline">Se connecter</a>
      </p>
    </div>
  );
} 