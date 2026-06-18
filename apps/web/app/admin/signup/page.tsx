'use client';

import { useState, useActionState } from 'react';
import { adminSignup } from '../actions';
import Link from 'next/link';

export default function AdminSignupPage() {
  const [message, setMessage] = useState<{ error?: string; success?: string }>({});
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    const res = await adminSignup(formData);
    setMessage(res);
    setIsPending(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-md border border-gray-100">
        <h1 className="text-2xl font-bold text-center text-gray-900">Admin Signup</h1>
        
        {message.error && <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">{message.error}</p>}
        {message.success && <p className="text-green-600 text-sm text-center bg-green-50 p-2 rounded">{message.success}</p>}

        <form action={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" name="email" required className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-black focus:border-black" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" name="password" required className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-black focus:border-black" />
          </div>
          <button 
            type="submit" 
            disabled={isPending}
            className="w-full px-4 py-2 text-white bg-black rounded-md hover:bg-gray-800 disabled:opacity-50"
          >
            {isPending ? 'Signing up...' : 'Request Access'}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600">
          Already approved?{' '}
          <Link href="/admin/login" className="text-blue-600 hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  );
}