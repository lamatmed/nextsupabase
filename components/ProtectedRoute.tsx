"use client";
import { useAuth } from "./useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean; // true = besoin d'être connecté, false = besoin d'être déconnecté
  adminOnly?: boolean; // true = seulement admin
}

export default function ProtectedRoute({ children, requireAuth = true, adminOnly = false }: ProtectedRouteProps) {
  const { isLoggedIn, user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !isLoggedIn) {
        // Si la page nécessite une connexion mais l'utilisateur n'est pas connecté
        router.push("/login");
      } else if (!requireAuth && isLoggedIn) {
        // Si la page nécessite d'être déconnecté mais l'utilisateur est connecté
        router.push("/dashboard");
      } else if (adminOnly && (!user || !user.isAdmin)) {
        // Si la page nécessite d'être admin mais l'utilisateur n'est pas admin
        router.push("/dashboard");
      }
    }
  }, [isLoggedIn, loading, requireAuth, adminOnly, user, router]);

  // Afficher un loader pendant la vérification
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  // Si la page nécessite une connexion et l'utilisateur n'est pas connecté
  if (requireAuth && !isLoggedIn) {
    return null; // Ne rien afficher, la redirection se fait dans useEffect
  }

  // Si la page nécessite d'être déconnecté et l'utilisateur est connecté
  if (!requireAuth && isLoggedIn) {
    return null; // Ne rien afficher, la redirection se fait dans useEffect
  }

  // Si la page nécessite d'être admin et l'utilisateur n'est pas admin
  if (adminOnly && (!user || !user.isAdmin)) {
    return null; // Ne rien afficher, la redirection se fait dans useEffect
  }

  // Afficher le contenu si les conditions sont remplies
  return <>{children}</>;
} 