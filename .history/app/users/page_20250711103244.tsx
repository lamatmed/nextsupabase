/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAllUsers, deleteUser, toggleAdmin, toggleBlocked } from '../../utils/actions';
import ProtectedRoute from '../../components/ProtectedRoute';
import Link from 'next/link';

const PAGE_SIZE = 10;

export default async function UsersPage({ searchParams }: { searchParams: { page?: string } }) {
  const page = Number(searchParams?.page) > 0 ? Number(searchParams.page) : 1;
  const { users, total } = await getAllUsers(page, PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <ProtectedRoute requireAuth={true} adminOnly={true}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl w-full bg-white/80 backdrop-blur-lg rounded-2xl p-4 sm:p-6 shadow-xl border border-white/20">
          <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 text-center">
            Administration des utilisateurs
          </h1>
          <div className="text-center text-gray-700 mb-4 text-sm sm:text-base">
            {total} utilisateur{total > 1 ? 's' : ''} au total
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-3 py-2 sm:px-4 sm:py-2 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                  <th className="px-3 py-2 sm:px-4 sm:py-2 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Téléphone</th>
                  <th className="px-3 py-2 sm:px-4 sm:py-2 text-left text-xs font-medium text-gray-500 uppercase">Rôle</th>
                  <th className="px-3 py-2 sm:px-4 sm:py-2 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                  <th className="px-3 py-2 sm:px-4 sm:py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user: any) => (
                  <tr key={user.id}>
                    <td className="px-3 py-2 sm:px-4 sm:py-2 whitespace-nowrap text-sm">{user.fullName}</td>
                    <td className="px-3 py-2 sm:px-4 sm:py-2 whitespace-nowrap text-sm hidden sm:table-cell">{user.phone}</td>
                    <td className="px-3 py-2 sm:px-4 sm:py-2 whitespace-nowrap">
                      {user.isAdmin ? (
                        <span className="inline-block px-2 py-1 text-xs font-semibold text-white bg-blue-600 rounded">Admin</span>
                      ) : (
                        <span className="inline-block px-2 py-1 text-xs font-semibold text-gray-700 bg-gray-200 rounded">User</span>
                      )}
                    </td>
                    <td className="px-3 py-2 sm:px-4 sm:py-2 whitespace-nowrap">
                      {user.isBlocked ? (
                        <span className="inline-block px-2 py-1 text-xs font-semibold text-white bg-red-500 rounded">Bloqué</span>
                      ) : (
                        <span className="inline-block px-2 py-1 text-xs font-semibold text-white bg-green-500 rounded">Actif</span>
                      )}
                    </td>
                    <td className="px-3 py-2 sm:px-4 sm:py-2 whitespace-nowrap flex flex-col sm:flex-row gap-1 sm:gap-2">
                      <form action={async () => { 'use server'; await toggleAdmin(user.id); }}>
                        <button type="submit" className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition w-full sm:w-auto">
                          {user.isAdmin ? 'Rendre User' : 'Admin'}
                        </button>
                      </form>
                      <form action={async () => { 'use server'; await toggleBlocked(user.id); }}>
                        <button type="submit" className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition w-full sm:w-auto">
                          {user.isBlocked ? 'Débloquer' : 'Bloquer'}
                        </button>
                      </form>
                      <form action={async () => { 'use server'; await deleteUser(user.id); }}>
                        <button type="submit" className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition w-full sm:w-auto">
                          Supprimer
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination simplifiée pour mobile */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
            <div className="text-sm text-gray-600">
              Page {page} sur {totalPages}
            </div>
            
            <div className="flex items-center gap-2">
              <Link href={`?page=${page - 1}`} className={page <= 1 ? 'pointer-events-none opacity-50' : ''}>
                <button 
                  disabled={page <= 1}
                  className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-medium disabled:opacity-50 hover:bg-gray-300 transition"
                >
                  Précédent
                </button>
              </Link>
              
              <div className="flex gap-1">
                {page > 1 && (
                  <Link href={`?page=${1}`}>
                    <button className={`px-3 py-2 rounded font-medium ${1 === page ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                      1
                    </button>
                  </Link>
                )}
                
                {page > 2 && <span className="px-2 text-gray-400">...</span>}
                
                {page > 1 && page !== totalPages && (
                  <Link href={`?page=${page}`}>
                    <button className="px-3 py-2 rounded font-medium bg-blue-600 text-white">
                      {page}
                    </button>
                  </Link>
                )}
                
                {page < totalPages - 1 && <span className="px-2 text-gray-400">...</span>}
                
                {page < totalPages && (
                  <Link href={`?page=${totalPages}`}>
                    <button className={`px-3 py-2 rounded font-medium ${totalPages === page ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                      {totalPages}
                    </button>
                  </Link>
                )}
              </div>
              
              <Link href={`?page=${page + 1}`} className={page >= totalPages ? 'pointer-events-none opacity-50' : ''}>
                <button 
                  disabled={page >= totalPages}
                  className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-medium disabled:opacity-50 hover:bg-gray-300 transition"
                >
                  Suivant
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}