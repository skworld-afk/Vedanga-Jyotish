import { verifyAdminSession, adminLogout, deleteUserAction, deleteProfileAction, deleteMultipleUsersAction, deleteMultipleProfilesAction, deleteVisitorAction, deleteMultipleVisitorsAction } from '../actions';
import Link from 'next/link';
import { DeleteForm } from '../DeleteForm';
import { BatchDeleteForm } from '../BatchDeleteForm';

// Using relative path to match your project structure
import prisma from '../../../src/lib/prisma';

export default async function AdminDashboard() {
  const admin = await verifyAdminSession();
  
  // Fetching standard users (Adjust 'user' if your schema differs)
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
  });

  // Fetching profiles casted by users
  const profiles = await prisma.profile.findMany({
    orderBy: { createdAt: 'desc' },
    include: { user: true } // Include the relation to show which user owns the profile
  });

  // Fetching website visitors
  const visitors = await prisma.visitor.findMany({
    orderBy: { visitedAt: 'desc' },
    take: 200, // Limit to 200 recent visitors for performance
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center bg-zinc-900 p-6 rounded-xl border border-zinc-800 shadow-sm">
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-zinc-400">{admin.email}</span>
            <form action={adminLogout}>
              <button className="text-sm px-4 py-2 bg-red-500/10 text-red-500 rounded-md hover:bg-red-500/20 transition-colors">
                Logout
              </button>
            </form>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Users Grid */}
          <div className="bg-zinc-900/60 rounded-xl border border-zinc-800/80 overflow-hidden flex flex-col h-[700px] shadow-xl">
            <div className="px-6 py-5 border-b border-zinc-800/80 bg-zinc-900 flex justify-between items-center">
              <h2 className="font-bold text-zinc-100 flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                Platform Users
              </h2>
              <span className="bg-zinc-800 text-zinc-300 py-1 px-3 rounded-full text-xs font-bold shadow-sm">{users.length}</span>
            </div>
            <div className="overflow-y-auto flex-1 p-4">
              <BatchDeleteForm action={deleteMultipleUsersAction} buttonText="Delete Selected Users">
                <ul className="space-y-3">
                {users.map((user) => (
                  <li key={user.id} className="p-4 bg-zinc-900 rounded-xl border border-zinc-800 hover:border-zinc-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all shadow-sm hover:shadow-md">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" name="userIds" value={user.id} className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 accent-indigo-500 cursor-pointer" />
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                          <p className="font-semibold text-zinc-200 text-sm">{user.email || 'No email'}</p>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          <span>Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link 
                        href={`/admin/dashboard/${user.id}`}
                        className="px-3 py-1.5 bg-zinc-800 text-zinc-300 border border-zinc-700 text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-zinc-700 hover:text-white transition-all shadow-sm"
                      >
                        Details
                      </Link>
                      <DeleteForm 
                        action={deleteUserAction} 
                        idName="userId" 
                        idValue={user.id}
                        message="Are you sure you want to delete this user? This action cannot be undone."
                      >
                        <button type="button" className="px-3 py-1.5 bg-red-500/10 text-red-500 border border-red-500/20 text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-red-500/20 hover:border-red-500/30 transition-all shadow-sm">
                          Delete
                        </button>
                      </DeleteForm>
                    </div>
                  </li>
                ))}
                {users.length === 0 && (
                  <p className="text-center text-zinc-500 py-8">No users found.</p>
                )}
                </ul>
              </BatchDeleteForm>
            </div>
          </div>

          {/* Profiles Grid */}
          <div className="bg-zinc-900/60 rounded-xl border border-zinc-800/80 overflow-hidden flex flex-col h-[700px] shadow-xl">
            <div className="px-6 py-5 border-b border-zinc-800/80 bg-zinc-900 flex justify-between items-center">
              <h2 className="font-bold text-zinc-100 flex items-center gap-2">
                <svg className="w-5 h-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                Cast Profiles
              </h2>
              <span className="bg-zinc-800 text-zinc-300 py-1 px-3 rounded-full text-xs font-bold shadow-sm">{profiles.length}</span>
            </div>
            <div className="overflow-y-auto flex-1 p-4">
              <BatchDeleteForm action={deleteMultipleProfilesAction} buttonText="Delete Selected Profiles">
                <ul className="space-y-3">
                {profiles.map((profile) => (
                  <li key={profile.id} className="p-4 bg-zinc-900 rounded-xl border border-zinc-800 hover:border-zinc-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all shadow-sm hover:shadow-md">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" name="profileIds" value={profile.id} className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 accent-orange-500 cursor-pointer" />
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-zinc-100 text-sm">{profile.displayName}</p>
                          {profile.gender && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-zinc-800 text-zinc-400 border border-zinc-700/50">
                              {profile.gender}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            <span>{new Date(profile.birthDate).toLocaleDateString()}</span>
                          </div>
                          
                          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            <span>{profile.placeName}</span>
                          </div>

                          {profile.user?.email && (
                            <div className="flex items-center gap-1.5 text-xs text-indigo-400/90 font-medium mt-1">
                               <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                               <span>By: {profile.user.email}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link 
                        href={`/dashboard/${profile.id}`}
                        target="_blank"
                        className="flex items-center gap-1 px-3 py-1.5 bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-orange-500/20 hover:border-orange-500/30 transition-all shadow-sm"
                      >
                        View Chart ↗
                      </Link>
                      <DeleteForm 
                        action={deleteProfileAction} 
                        idName="profileId" 
                        idValue={profile.id}
                        message="Are you sure you want to delete this cast profile? This action cannot be undone."
                      >
                        <button type="button" className="flex items-center gap-1 px-3 py-1.5 bg-red-500/10 text-red-500 border border-red-500/20 text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-red-500/20 hover:border-red-500/30 transition-all shadow-sm">
                          Delete
                        </button>
                      </DeleteForm>
                    </div>
                  </li>
                ))}
                {profiles.length === 0 && (
                  <p className="text-center text-zinc-500 py-8">No profiles found.</p>
                )}
                </ul>
              </BatchDeleteForm>
            </div>
          </div>

        </div>

        {/* Visitors Grid (Full Width) */}
        <div className="bg-zinc-900/60 rounded-xl border border-zinc-800/80 overflow-hidden flex flex-col h-[500px] shadow-xl">
          <div className="px-6 py-5 border-b border-zinc-800/80 bg-zinc-900 flex justify-between items-center">
            <h2 className="font-bold text-zinc-100 flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              Recent Visitors
            </h2>
            <span className="bg-zinc-800 text-zinc-300 py-1 px-3 rounded-full text-xs font-bold shadow-sm">{visitors.length}</span>
          </div>
          <div className="overflow-y-auto flex-1 p-4">
            <BatchDeleteForm action={deleteMultipleVisitorsAction} buttonText="Delete Selected Visitors">
              <ul className="space-y-3">
                {visitors.map((visitor) => (
                  <li key={visitor.id} className="p-4 bg-zinc-900 rounded-xl border border-zinc-800 hover:border-zinc-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all shadow-sm hover:shadow-md">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" name="visitorIds" value={visitor.id} className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 accent-emerald-500 cursor-pointer" />
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-zinc-200 text-sm">{visitor.ip}</p>
                          <span className="text-xs text-zinc-500">• {new Date(visitor.visitedAt).toLocaleString()}</span>
                        </div>
                        <div className="text-xs text-zinc-400 truncate max-w-xl">
                          {visitor.userAgent}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <DeleteForm action={deleteVisitorAction} idName="visitorId" idValue={visitor.id} message="Are you sure you want to delete this visitor log?">
                <button type="button" className="px-3 py-1.5 bg-red-500/10 text-red-500 border border-red-500/20 text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-red-500/20 hover:border-red-500/30 transition-all shadow-sm">
                          Delete
                        </button>
                      </DeleteForm>
                    </div>
                  </li>
                ))}
                {visitors.length === 0 && (
                  <p className="text-center text-zinc-500 py-8">No visitor logs found.</p>
                )}
              </ul>
            </BatchDeleteForm>
          </div>
        </div>

      </div>
    </div>
  );
}