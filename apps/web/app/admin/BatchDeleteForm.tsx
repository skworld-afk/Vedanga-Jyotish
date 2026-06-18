'use client';

import { ReactNode } from 'react';

interface BatchDeleteFormProps {
  action: (formData: FormData) => void | Promise<void>;
  message?: string;
  buttonText?: string;
  children: ReactNode;
}

export function BatchDeleteForm({ 
  action, 
  message = "Are you sure you want to delete the selected items? This cannot be undone.",
  buttonText = "Delete Selected",
  children 
}: BatchDeleteFormProps) {
  return (
    <form action={action} onSubmit={(e) => {
      const form = e.currentTarget;
      const checkboxes = form.querySelectorAll('input[type="checkbox"]:checked');
      if (checkboxes.length === 0) {
        e.preventDefault();
        alert("Please select at least one item to delete.");
        return;
      }
      if (!window.confirm(message)) {
        e.preventDefault();
      }
    }}>
      <div className="flex justify-end mb-4">
        <button type="submit" className="px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/20 text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-red-500/20 hover:border-red-500/30 transition-all shadow-sm">
          {buttonText}
        </button>
      </div>
      {children}
    </form>
  );
}