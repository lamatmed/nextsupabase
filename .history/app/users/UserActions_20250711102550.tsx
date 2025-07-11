/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useTransition, useState } from "react";
import { deleteUser, toggleAdmin, toggleBlocked } from "../../utils/actions";
import { useRouter } from "next/navigation";

export default function UserActions({ user }: { user: any }) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleAction = async (action: () => Promise<any>, confirmMsg?: string) => {
    if (confirmMsg && !window.confirm(confirmMsg)) return;
    setMessage(null);
    startTransition(async () => {
      try {
        await action();
        setMessage("Action réalisée avec succès !");
        router.refresh();
      } catch (e: any) {
        setMessage(e.message || "Erreur lors de l'action");
      }
    });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <button
        onClick={() => handleAction(() => toggleAdmin(user.id))}
        disabled={isPending}
        className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
      >
        {user.isAdmin ? "Rendre User" : "Rendre Admin"}
      </button>
      <button
        onClick={() => handleAction(() => toggleBlocked(user.id))}
        disabled={isPending}
        className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition"
      >
        {user.isBlocked ? "Débloquer" : "Bloquer"}
      </button>
      <button
        onClick={() => handleAction(() => deleteUser(user.id), "Confirmer la suppression de cet utilisateur ?")}
        disabled={isPending}
        className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
      >
        Supprimer
      </button>
      {message && (
        <span className={`text-xs mt-1 ${message.includes("succès") ? "text-green-600" : "text-red-600"}`}>{message}</span>
      )}
    </div>
  );
} 