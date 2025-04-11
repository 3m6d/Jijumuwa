import React, { createContext, useState, useContext } from 'react';
import { Medication, MedicationFormData } from '../types/caretaker';
import { initialMedications } from '../constants/mockCaretakerData';


interface MedicationsContextType {
  medications: Medication[];
  addMedication: (data: MedicationFormData) => void;
  updateMedication: (id: string, data: MedicationFormData) => void;
  deleteMedication: (id: string) => void;
}

const MedicationsContext = createContext<MedicationsContextType | undefined>(undefined);

export const MedicationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [medications, setMedications] = useState<Medication[]>(initialMedications);

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
    <MedicationsContext.Provider value={{ medications, addMedication, updateMedication, deleteMedication }}>
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