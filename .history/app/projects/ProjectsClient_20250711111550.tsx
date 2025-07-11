/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from 'react';
import { useAuth } from '../../components/useAuth';
import ActionProject from './ActionProject';

export default function ProjectsClient() {
  const { user, loading } = useAuth();
  const [projects, setProjects] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');

  const { getUserProjects, createProject } = require('../../utils/actions');

  const fetchProjects = async () => {
    if (!user) return;
    setIsLoading(true);
    const data = await getUserProjects(user.id);
    setProjects(data);
    setIsLoading(false);
  };

  React.useEffect(() => {
    if (user) fetchProjects();
  }, [user]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      await createProject(user.id, { name, description });
      setName('');
      setDescription('');
      await fetchProjects();
    } catch (e: any) {
      alert(e.message || 'Erreur lors de la création');
    }
  };

  if (loading || isLoading) return();
  if (!user) return <div className="p-4">Non autorisé</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Mes projets</h1>
      <form onSubmit={handleCreate} className="mb-6 flex flex-col gap-2">
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Nom du projet" className="border p-2 rounded" required />
        <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" className="border p-2 rounded" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Créer</button>
      </form>
      <ul className="space-y-2">
        {projects.map((project: any) => (
          <li key={project.id} className="border rounded p-3 flex justify-between items-center">
            <div>
              <div className="font-semibold">{project.name}</div>
              <div className="text-sm text-gray-600">{project.description}</div>
            </div>
            <ActionProject project={project} userId={user.id} refresh={fetchProjects} />
          </li>
        ))}
        {projects.length === 0 && <li className="text-gray-500">Aucun projet</li>}
      </ul>
    </div>
  );
} 