import { ReactNode, useEffect, useState } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Small delay to create smooth transition effect
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);

    return () => clearTimeout(timer);
  }, [children]);

  return (
    <div 
      className={`transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      data-testid="page-transition"
    >
      {children}
    </div>
  );
}