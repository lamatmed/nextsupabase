"use client";
import React, { useState } from "react";
import Swal from "sweetalert2";
import { deleteProject, updateProject } from "../../utils/actions";

export default function ActionProject({ project, userId, refresh }: { project: any, userId: string, refresh: () => void }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description || "");
  const [isPending, setIsPending] = useState(false);

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Supprimer ce projet ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Annuler',
    });
    if (!result.isConfirmed) return;
    setIsPending(true);
    try {
      await deleteProject(userId, project.id);
      await Swal.fire({ title: 'Projet supprimé', icon: 'success', timer: 1200, showConfirmButton: false });
      refresh();
    } catch (e: any) {
      await Swal.fire({ title: 'Erreur', text: e.message || 'Erreur lors de la suppression', icon: 'error' });
    } finally {
      setIsPending(false);
    }
  };

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => {
    setIsEditing(false);
    setName(project.name);
    setDescription(project.description || "");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    try {
      await updateProject(userId, project.id, { name, description });
      await Swal.fire({ title: 'Projet modifié', icon: 'success', timer: 1200, showConfirmButton: false });
      setIsEditing(false);
      refresh();
    } catch (e: any) {
      await Swal.fire({ title: 'Erreur', text: e.message || 'Erreur lors de la modification', icon: 'error' });
    } finally {
      setIsPending(false);
    }
  };

  if (isEditing) {
    return (
      <form onSubmit={handleSave} className="flex flex-col sm:flex-row gap-2 items-center">
        <input value={name} onChange={e => setName(e.target.value)} className="border p-1 rounded" required />
        <input value={description} onChange={e => setDescription(e.target.value)} className="border p-1 rounded" placeholder="Description" />
        <button type="submit" disabled={isPending} className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition">Enregistrer</button>
        <button type="button" onClick={handleCancel} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition">Annuler</button>
      </form>
    );
  }

  return (
    <div className="flex gap-2">
      <button onClick={handleEdit} className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition">Éditer</button>
      <button onClick={handleDelete} disabled={isPending} className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition">Supprimer</button>
    </div>
  );
} 