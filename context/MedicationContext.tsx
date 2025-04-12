import React, { createContext, useState, useContext, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Medication, MedicationFormData } from '../types/caretaker';
import { initialMedications } from '../constants/mockCaretakerData';

// Key for storing data in SecureStore
const MEDICATIONS_STORAGE_KEY = 'caretaker_medications';

interface MedicationsContextType {
  medications: Medication[];
  addMedication: (data: MedicationFormData) => void;
  updateMedication: (id: string, data: MedicationFormData) => void;
  deleteMedication: (id: string) => void;
  isLoading: boolean;
}

const MedicationsContext = createContext<MedicationsContextType | undefined>(undefined);

export const MedicationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load medications from SecureStore when component mounts
  useEffect(() => {
    const loadMedications = async () => {
      try {
        const storedMedications = await SecureStore.getItemAsync(MEDICATIONS_STORAGE_KEY);
        if (storedMedications) {
          setMedications(JSON.parse(storedMedications));
        } else {
          // Use initial data if nothing is stored
          setMedications(initialMedications);
        }
      } catch (error) {
        console.error('Error loading medications from storage:', error);
        setMedications(initialMedications);
      } finally {
        setIsLoading(false);
      }
    };

    loadMedications();
  }, []);

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

  const addMedication = (data: MedicationFormData) => {
    const newId = Math.random().toString(36).substring(7);
    setMedications([...medications, { ...data, id: newId }]);
  };

  const updateMedication = (id: string, data: MedicationFormData) => {
    setMedications(medications.map(item => 
      item.id === id ? { ...data, id } : item
    ));
  };

  const deleteMedication = (id: string) => {
    setMedications(medications.filter(item => item.id !== id));
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