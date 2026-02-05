import * as React from 'react';

interface SectionProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Section({ title, children, className = '' }: SectionProps) {
  return (
    <section className={`rounded-lg bg-white p-6 shadow dark:bg-gray-800 ${className}`}>
      {title && <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>}
      {children}
    </section>
  );
}
