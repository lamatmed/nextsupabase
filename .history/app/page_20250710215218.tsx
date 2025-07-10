"use client";

export default function HeroPage() {
  function handleLogout() {
    window.location.href = "/login";
  }
  return (
    <div className="max-w-2xl mx-auto p-12 mt-20 bg-white rounded shadow-md text-center">
      <h1 className="text-3xl font-bold mb-4">Bienvenue sur l'application !</h1>
      <p className="text-lg mb-8">Vous êtes connecté.</p>
      <button
        onClick={handleLogout}
        className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition-colors"
      >
        Se déconnecter
      </button>
    </div>
  );
} 