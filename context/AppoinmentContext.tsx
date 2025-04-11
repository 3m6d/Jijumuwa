import React, { createContext, useState, useContext } from 'react';
import { Appointment,AppointmentFormData } from '../types/caretaker';
import { initialAppointments } from '../constants/mockCaretakerData';

interface AppointmentContextType {
  appointments: Appointment[];
  addAppointment: (data: AppointmentFormData) => void;
  updateAppointment: (id: string, data: AppointmentFormData) => void;
  deleteAppointment: (id: string) => void;
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

export const AppointmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);

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
      deleteAppointment 
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