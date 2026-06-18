'use client';

import { ReactNode } from 'react';

interface DeleteFormProps {
  action: (formData: FormData) => void | Promise<void>;
  idName: string;
  idValue: string;
  message?: string;
  children: ReactNode;
}

export function DeleteForm({ 
  action, 
  idName, 
  idValue, 
  message = "Are you sure you want to delete this item?",
  children 
}: DeleteFormProps) {
  return (
    <div className="inline-block" onClick={(e) => {
      e.preventDefault();
      e.stopPropagation(); // Stop click from reaching parent forms
      if (window.confirm(message)) {
        const formData = new FormData();
        formData.append(idName, idValue);
        action(formData);
      }
    }}>
      {children}
    </div>
  );
}