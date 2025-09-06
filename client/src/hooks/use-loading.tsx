import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';

export function usePageLoading() {
  const [location] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [previousLocation, setPreviousLocation] = useState(location);

  useEffect(() => {
    // If location changed, show loading and scroll to top
    if (location !== previousLocation) {
      setIsLoading(true);
      
      // Scroll to top immediately when navigation starts
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Simulate loading time to prevent flash and provide smooth experience
      const timer = setTimeout(() => {
        setIsLoading(false);
        setPreviousLocation(location);
        // Ensure we're at the top after loading completes
        window.scrollTo({ top: 0, behavior: 'auto' });
      }, 500); // 500ms minimum loading time for smooth experience

      return () => clearTimeout(timer);
    }
  }, [location, previousLocation]);

  return isLoading;
}