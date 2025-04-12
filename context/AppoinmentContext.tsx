import React, { createContext, useState, useContext, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Appointment, AppointmentFormData } from '../types/caretaker';
import { initialAppointments } from '../constants/mockCaretakerData';

// Key for storing data in SecureStore
const APPOINTMENTS_STORAGE_KEY = 'caretaker_appointments';

interface AppointmentContextType {
  appointments: Appointment[];
  addAppointment: (data: AppointmentFormData) => void;
  updateAppointment: (id: string, data: AppointmentFormData) => void;
  deleteAppointment: (id: string) => void;
  isLoading: boolean;
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

export const AppointmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load appointments from SecureStore when component mounts
  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const storedAppointments = await SecureStore.getItemAsync(APPOINTMENTS_STORAGE_KEY);
        if (storedAppointments) {
          setAppointments(JSON.parse(storedAppointments));
        } else {
          // Use initial data if nothing is stored
          setAppointments(initialAppointments);
        }
      } catch (error) {
        console.error('Error loading appointments from storage:', error);
        setAppointments(initialAppointments);
      } finally {
        setIsLoading(false);
      }
    };

    loadAppointments();
  }, []);

  // Save appointments to SecureStore whenever they change
  useEffect(() => {
    const saveAppointments = async () => {
      try {
        await SecureStore.setItemAsync(
          APPOINTMENTS_STORAGE_KEY,
          JSON.stringify(appointments)
        );
      } catch (error) {
        console.error('Error saving appointments to storage:', error);
      }
    };

    // Don't save initial load or empty array
    if (!isLoading && appointments.length > 0) {
      saveAppointments();
    }
  }, [appointments, isLoading]);

  const addAppointment = (data: AppointmentFormData) => {
    const newId = Math.random().toString(36).substring(7);
    setAppointments([...appointments, { ...data, id: newId }]);
  };

  const updateAppointment = (id: string, data: AppointmentFormData) => {
    setAppointments(appointments.map(item => 
      item.id === id ? { ...data, id } : item
    ));
  };

  const deleteAppointment = (id: string) => {
    setAppointments(appointments.filter(item => item.id !== id));
  };

  return (
    <AppointmentContext.Provider value={{ 
      appointments, 
      addAppointment, 
      updateAppointment, 
      deleteAppointment,
      isLoading
    }}>
      {children}
    </AppointmentContext.Provider>
  );
};

export const useAppointments = () => {
  const context = useContext(AppointmentContext);
  if (context === undefined) {
    throw new Error('useAppointments must be used within an AppointmentProvider');
  }
  return context;
};