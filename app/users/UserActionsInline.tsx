/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import Swal from "sweetalert2";
import { deleteUser, toggleAdmin, toggleBlocked } from "../../utils/actions";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function UserActionsInline({ user }: { user: any }) {
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <button
        onClick={async () => {
          const result = await Swal.fire({
            title: user.isAdmin ? 'Rétrograder cet admin ?' : 'Promouvoir administrateur ?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Oui',
            cancelButtonText: 'Annuler',
          });
          if (!result.isConfirmed) return;
          try {
            await toggleAdmin(user.id);
            await Swal.fire({ title: user.isAdmin ? 'Utilisateur rétrogradé' : 'Utilisateur promu administrateur', icon: 'success', timer: 1500, showConfirmButton: false });
            window.location.reload();
          } catch (e: any) {
            await Swal.fire({ title: 'Erreur', text: e.message || 'Erreur lors de l\'action', icon: 'error' });
          }
        }}
        className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
      >
        {user.isAdmin ? "Rendre User" : "Rendre Admin"}
      </button>
      <button
        onClick={async () => {
          const result = await Swal.fire({
            title: user.isBlocked ? 'Débloquer cet utilisateur ?' : 'Bloquer cet utilisateur ?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Oui',
            cancelButtonText: 'Annuler',
          });
          if (!result.isConfirmed) return;
          try {
            await toggleBlocked(user.id);
            await Swal.fire({ title: user.isBlocked ? 'Utilisateur débloqué' : 'Utilisateur bloqué', icon: 'success', timer: 1500, showConfirmButton: false });
            window.location.reload();
          } catch (e: any) {
            await Swal.fire({ title: 'Erreur', text: e.message || 'Erreur lors de l\'action', icon: 'error' });
          }
        }}
        className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition"
      >
        {user.isBlocked ? "Débloquer" : "Bloquer"}
      </button>
      <button
        onClick={async () => {
          const result = await Swal.fire({
            title: 'Confirmer la suppression de cet utilisateur ?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Oui',
            cancelButtonText: 'Annuler',
          });
          if (!result.isConfirmed) return;
          try {
            await deleteUser(user.id);
            await Swal.fire({ title: 'Utilisateur supprimé', icon: 'success', timer: 1500, showConfirmButton: false });
            window.location.reload();
          } catch (e: any) {
            await Swal.fire({ title: 'Erreur', text: e.message || 'Erreur lors de la suppression', icon: 'error' });
          }
        }}
        className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
      >
        Supprimer
      </button>
    </div>
  );
} 