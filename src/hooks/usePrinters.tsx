import { useState, useEffect } from 'react';
import { Printer } from '@/types/printer';
import { apiClient } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const STORAGE_KEY = 'printers_data';
const ADMIN_TOKEN_KEY = 'admin_token';

export const usePrinters = () => {
  const [printers, setPrinters] = useState<Printer[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadPrinters();
  }, []);

  const loadPrinters = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getPrinters();
      setPrinters(response.data);
    } catch (error: any) {
      console.error('Failed to load printers:', error);
      // Use localStorage as fallback if backend is not available
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setPrinters(JSON.parse(stored));
      }
      toast({
        title: 'Error',
        description: error.message || 'Failed to load printers',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addPrinter = async (printer: Omit<Printer, 'id' | 'createdAt'>) => {
    try {
      const response = await apiClient.createPrinter(printer);
      const newPrinter = response.data;
      setPrinters(prev => [...prev, newPrinter]);
      
      // Update localStorage as backup
      const updatedPrinters = [...printers, newPrinter];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPrinters));
      
      toast({
        title: 'Success',
        description: 'Printer added successfully',
      });
      return newPrinter;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add printer',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updatePrinter = async (id: string, updates: Partial<Printer>) => {
    try {
      const response = await apiClient.updatePrinter(id, updates);
      const updatedPrinter = response.data;
      setPrinters(prev => prev.map(p => p.id === id ? updatedPrinter : p));
      
      // Update localStorage as backup
      const updatedPrinters = printers.map(p => p.id === id ? updatedPrinter : p);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPrinters));
      
      toast({
        title: 'Success',
        description: 'Printer updated successfully',
      });
      return updatedPrinter;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update printer',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const deletePrinter = async (id: string) => {
    try {
      await apiClient.deletePrinter(id);
      setPrinters(prev => prev.filter(p => p.id !== id));
      
      // Update localStorage as backup
      const updatedPrinters = printers.filter(p => p.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPrinters));
      
      toast({
        title: 'Success',
        description: 'Printer deleted successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete printer',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const toggleAvailability = async (id: string) => {
    try {
      const response = await apiClient.toggleAvailability(id);
      const updatedPrinter = response.data;
      setPrinters(prev => prev.map(p => p.id === id ? updatedPrinter : p));
      
      // Update localStorage as backup
      const updatedPrinters = printers.map(p => p.id === id ? updatedPrinter : p);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPrinters));
      
      toast({
        title: 'Success',
        description: `Printer ${updatedPrinter.isAvailable ? 'enabled' : 'disabled'}`,
      });
      return updatedPrinter;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update availability',
        variant: 'destructive',
      });
      throw error;
    }
  };

  return {
    printers,
    loading,
    addPrinter,
    updatePrinter,
    deletePrinter,
    toggleAvailability,
    refreshPrinters: loadPrinters,
  };
};

export const useAuth = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (token) {
      try {
        await apiClient.getMe();
        setIsAdmin(true);
      } catch (error) {
        localStorage.removeItem(ADMIN_TOKEN_KEY);
        setIsAdmin(false);
      }
    }
    setLoading(false);
  };

  const login = async (email: string) => {
    try {
      const response = await apiClient.login(email);
      localStorage.setItem(ADMIN_TOKEN_KEY, response.data.token);
      setIsAdmin(true);
      toast({
        title: 'Success',
        description: 'Login successful!',
      });
      return true;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Login failed',
        variant: 'destructive',
      });
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    setIsAdmin(false);
    toast({
      title: 'Success',
      description: 'Logged out successfully',
    });
  };

  return { isAdmin, loading, login, logout };
};