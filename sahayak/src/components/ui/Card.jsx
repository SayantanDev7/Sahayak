import React from 'react';
import { cn } from './Button';

export function Card({ children, className, ...props }) {
  return (
    <article 
      className={cn("bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden", className)}
      {...props}
    >
      {children}
    </article>
  );
}

export function CardHeader({ children, className, ...props }) {
  return (
    <div className={cn("p-6 border-b border-gray-100", className)} {...props}>
      {children}
    </div>
  );
}

export function CardContent({ children, className, ...props }) {
  return (
    <div className={cn("p-6", className)} {...props}>
      {children}
    </div>
  );
}