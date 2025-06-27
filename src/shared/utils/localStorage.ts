export const safeLocalStorage = {
    getItem: (key: string): string | null => {
      if (typeof window === 'undefined') return null;
      try {
        return localStorage.getItem(key);
      } catch {
        return null;
      }
    },
    
    setItem: (key: string, value: string): void => {
      if (typeof window === 'undefined') return;
      try {
        localStorage.setItem(key, value);
      } catch {
        // 실패해도 조용히 넘어감
      }
    },
    
    removeItem: (key: string): void => {
      if (typeof window === 'undefined') return;
      try {
        localStorage.removeItem(key);
      } catch {
        // 실패해도 조용히 넘어감
      }
    }
  };