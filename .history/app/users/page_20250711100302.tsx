/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAllUsers, deleteUser, toggleAdmin, toggleBlocked } from '../../utils/actions';
import ProtectedRoute from '../../components/ProtectedRoute';
import Link from 'next/link';
import {u getSearchParams } from 'next/navigation';

const PAGE_SIZE = 10;

export default async function UsersPage() {
  const searchParams = await getSearchParams();
  const page = Number(searchParams.get('page')) > 0 ? Number(searchParams.get('page')) : 1;
  const { users, total } = await getAllUsers(page, PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  // Générer la liste des numéros de page (max 7 boutons, ... si beaucoup de pages)
  let pageNumbers: (number | string)[] = [];
  if (totalPages <= 7) {
    pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  } else {
    if (page <= 4) {
      pageNumbers = [1, 2, 3, 4, 5, '...', totalPages];
    } else if (page >= totalPages - 3) {
      pageNumbers = [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    } else {
      pageNumbers = [1, '...', page - 1, page, page + 1, '...', totalPages];
    }
  }

  return (
    <ProtectedRoute requireAuth={true} adminOnly={true}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl w-full bg-white/80 backdrop-blur-lg rounded-2xl p-6 sm:p-8 shadow-xl border border-white/20">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 text-center">
            Administration des utilisateurs
          </h1>
          <div className="text-center text-gray-700 mb-4">
            {total} utilisateur{total > 1 ? 's' : ''} au total
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Téléphone</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Rôle</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user: any) => (
                  <tr key={user.id}>
                    <td className="px-4 py-2 whitespace-nowrap">{user.fullName}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{user.phone}</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {user.isAdmin ? (
                        <span className="inline-block px-2 py-1 text-xs font-semibold text-white bg-blue-600 rounded">Admin</span>
                      ) : (
                        <span className="inline-block px-2 py-1 text-xs font-semibold text-gray-700 bg-gray-200 rounded">User</span>
                      )}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {user.isBlocked ? (
                        <span className="inline-block px-2 py-1 text-xs font-semibold text-white bg-red-500 rounded">Bloqué</span>
                      ) : (
                        <span className="inline-block px-2 py-1 text-xs font-semibold text-white bg-green-500 rounded">Actif</span>
                      )}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap flex flex-col sm:flex-row gap-2">
                      <form action={async () => { 'use server'; await toggleAdmin(user.id); }}>
                        <button type="submit" className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition">{user.isAdmin ? 'Rendre User' : 'Rendre Admin'}</button>
                      </form>
                      <form action={async () => { 'use server'; await toggleBlocked(user.id); }}>
                        <button type="submit" className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition">{user.isBlocked ? 'Débloquer' : 'Bloquer'}</button>
                      </form>
                      <form action={async () => { 'use server'; await deleteUser(user.id); }}>
                        <button type="submit" className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition">Supprimer</button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination avancée */}
          <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
            <Link href={`?page=${page - 1}`}>
              <button disabled={page <= 1} className="px-3 py-2 rounded bg-gray-200 text-gray-700 font-medium disabled:opacity-50">Précédent</button>
            </Link>
            {pageNumbers.map((num, idx) =>
              typeof num === 'number' ? (
                <Link key={num} href={`?page=${num}`}>
                  <button
                    className={`px-3 py-2 rounded font-medium ${num === page ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-blue-100'}`}
                  >
                    {num}
                  </button>
                </Link>
              ) : (
                <span key={"ellipsis-" + idx} className="px-2 text-gray-400">…</span>
              )
            )}
            <Link href={`?page=${page + 1}`}>
              <button disabled={page >= totalPages} className="px-3 py-2 rounded bg-gray-200 text-gray-700 font-medium disabled:opacity-50">Suivant</button>
            </Link>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 