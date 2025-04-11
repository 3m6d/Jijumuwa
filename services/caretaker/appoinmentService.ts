import apiService from './api';
import { Appointment, AppointmentFormData } from '../../types/caretaker';

const APPOINTMENTS_URL = '/doctor-appointments/';

export const appointmentService = {
  getAllAppointments: async (): Promise<Appointment[]> => {
    return await apiService.get(APPOINTMENTS_URL);
  },
  
  getAppointmentById: async (id: string): Promise<Appointment> => {
    return await apiService.get(`${APPOINTMENTS_URL}${id}/`);
  },
  
  createAppointment: async (appointmentData: AppointmentFormData): Promise<Appointment> => {
    return await apiService.post(APPOINTMENTS_URL, appointmentData);
  },
  
  updateAppointment: async (id: string, appointmentData: AppointmentFormData): Promise<Appointment> => {
    return await apiService.put(`${APPOINTMENTS_URL}${id}/`, appointmentData);
  },
  
  deleteAppointment: async (id: string): Promise<void> => {
    return await apiService.delete(`${APPOINTMENTS_URL}${id}/`);
  },
};