import React, { createContext, useState, useContext, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Medication, MedicationFormData } from '../types/caretaker';
import { medicationService } from '../services/caretaker/medicationService';
// import { initialMedications } from '../constants/mockCaretakerData';

// Key for storing data in SecureStore
const MEDICATIONS_STORAGE_KEY = 'caretaker_medications';

interface MedicationsContextType {
  medications: Medication[];
  addMedication: (data: MedicationFormData) => Promise<void>;
  updateMedication: (id: string, data: MedicationFormData) => Promise<void>;
  deleteMedication: (id: string) => Promise<void>;
  isLoading: boolean;
}

const MedicationsContext = createContext<MedicationsContextType | undefined>(undefined);

export const MedicationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMedications();
  }, []);

  const loadMedications = async () => {
    try {
      setIsLoading(true);
      const data = await medicationService.getAllMedications();
      setMedications(data);
    } catch (error) {
      console.error('Error loading medications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Save medications to SecureStore whenever they change
  useEffect(() => {
    const saveMedications = async () => {
      try {
        await SecureStore.setItemAsync(
          MEDICATIONS_STORAGE_KEY,
          JSON.stringify(medications)
        );
      } catch (error) {
        console.error('Error saving medications to storage:', error);
      }
    };

    // Don't save initial load or empty array
    if (!isLoading && medications.length > 0) {
      saveMedications();
    }
  }, [medications, isLoading]);

  const addMedication = async (data: MedicationFormData) => {
    try {
      const newMedication = await medicationService.createMedication(data);
      setMedications(prev => [...prev, newMedication]);
    } catch (error) {
      console.error('Error adding medication:', error);
      throw error;
    }
  };

  const updateMedication = async (id: string, data: MedicationFormData) => {
    try {
      const updatedMedication = await medicationService.updateMedication(id, data);
      setMedications(prev => prev.map(item => 
        item.id === id ? updatedMedication : item
      ));
    } catch (error) {
      console.error('Error updating medication:', error);
      throw error;
    }
  };

  const deleteMedication = async (id: string) => {
    try {
      await medicationService.deleteMedication(id);
      setMedications(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting medication:', error);
      throw error;
    }
  };

  return (
    <MedicationsContext.Provider value={{ 
      medications, 
      addMedication, 
      updateMedication, 
      deleteMedication,
      isLoading
    }}>
      {children}
    </MedicationsContext.Provider>
  );
};

export const useMedications = () => {
  const context = useContext(MedicationsContext);
  if (context === undefined) {
    throw new Error('useMedications must be used within a MedicationsProvider');
  }
  return context;
};