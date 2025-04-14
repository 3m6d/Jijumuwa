import apiService from './api';
import { Appointment, AppointmentDTO, AppointmentFormData } from '../../types/caretaker';

const APPOINTMENTS_URL = '/doctor-appointments/';

export const appointmentService = {
  getAllAppointments: async (): Promise<Appointment[]> => {
    return await apiService.get(APPOINTMENTS_URL);
  },
  
  getAppointmentById: async (id: number): Promise<Appointment> => {
    return await apiService.get(`${APPOINTMENTS_URL}${id}/`);
  },
  
  createAppointment: async (appointmentData: AppointmentDTO): Promise<Appointment> => {
    return await apiService.post(APPOINTMENTS_URL, appointmentData);
  },
  
  updateAppointment: async (id: number, appointmentData: AppointmentFormData): Promise<Appointment> => {
    return await apiService.put(`${APPOINTMENTS_URL}${id}/`, appointmentData);
  },
  
  deleteAppointment: async (id: number): Promise<void> => {
    return await apiService.delete(`${APPOINTMENTS_URL}${id}/`);
  },
};