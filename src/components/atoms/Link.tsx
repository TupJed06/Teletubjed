// src/components/atoms/Link.tsx
import NextLink from 'next/link';
import { ReactNode } from 'react';

interface LinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void; 
}

export const Link = ({ href, children, className, onClick }: LinkProps) => {
  return (
    <NextLink 
      href={href} 
      className={className} 
      onClick={onClick} 
    >
      {children}
    </NextLink>
  );
};