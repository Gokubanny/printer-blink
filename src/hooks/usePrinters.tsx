import { useState, useEffect } from 'react';
import { Printer } from '@/types/printer';

const STORAGE_KEY = 'printers_data';
const ADMIN_EMAIL_KEY = 'admin_email';

export const usePrinters = () => {
  const [printers, setPrinters] = useState<Printer[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setPrinters(JSON.parse(stored));
    } else {
      // Initialize with sample data
      const samplePrinters: Printer[] = [
        {
          id: '1',
          name: 'HP DeskJet 2720',
          price: 45000,
          image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=500&q=80',
          description: 'All-in-one wireless printer with print, scan, and copy features',
          isAvailable: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Canon PIXMA MG3620',
          price: 38000,
          image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=500&q=80',
          description: 'Compact wireless inkjet printer perfect for home use',
          isAvailable: true,
          createdAt: new Date().toISOString(),
        },
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(samplePrinters));
      setPrinters(samplePrinters);
    }
  }, []);

  const savePrinters = (updatedPrinters: Printer[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPrinters));
    setPrinters(updatedPrinters);
  };

  const addPrinter = (printer: Omit<Printer, 'id' | 'createdAt'>) => {
    const newPrinter: Printer = {
      ...printer,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    savePrinters([...printers, newPrinter]);
  };

  const updatePrinter = (id: string, updates: Partial<Printer>) => {
    savePrinters(printers.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deletePrinter = (id: string) => {
    savePrinters(printers.filter(p => p.id !== id));
  };

  const toggleAvailability = (id: string) => {
    savePrinters(printers.map(p => p.id === id ? { ...p, isAvailable: !p.isAvailable } : p));
  };

  return {
    printers,
    addPrinter,
    updatePrinter,
    deletePrinter,
    toggleAvailability,
  };
};

export const useAuth = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const ADMIN_EMAIL = 'omatulemarvellous721@gmail.com';

  useEffect(() => {
    const storedEmail = localStorage.getItem(ADMIN_EMAIL_KEY);
    setIsAdmin(storedEmail === ADMIN_EMAIL);
  }, []);

  const login = (email: string) => {
    if (email === ADMIN_EMAIL) {
      localStorage.setItem(ADMIN_EMAIL_KEY, email);
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem(ADMIN_EMAIL_KEY);
    setIsAdmin(false);
  };

  return { isAdmin, login, logout };
};
