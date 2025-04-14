import apiService from "./api";
import { Appointment } from "../../types/caretaker";

const APPOINTMENTS_URL = "/care/doctor-appointments/";

export const appointmentService = {
  getAllAppointments: async (): Promise<Appointment[]> => {
    return await apiService.get(APPOINTMENTS_URL);
  },

  getAppointmentById: async (id: number): Promise<Appointment> => {
    return await apiService.get(`${APPOINTMENTS_URL}${id}/`);
  },

  createAppointment: async (
    appointmentData: Pick<
      Appointment,
      "doctor_name" | "specialty" | "appointment_time" | "location"
    >
  ): Promise<Appointment> => {
    return await apiService.post(APPOINTMENTS_URL, appointmentData);
  },

  updateAppointment: async (
    id: number,
    appointmentData: Appointment
  ): Promise<Appointment> => {
    return await apiService.put(`${APPOINTMENTS_URL}${id}/`, appointmentData);
  },

  deleteAppointment: async (id: number): Promise<void> => {
    return await apiService.delete(`${APPOINTMENTS_URL}${id}/`);
  },
};
