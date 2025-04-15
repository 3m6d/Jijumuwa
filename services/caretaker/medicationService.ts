import apiService from './api';
import { Medication } from '../../types/caretaker';   
const MEDICATIONS_URL = '/care/medication-reminders/';

export const medicationService = {
  getAllMedications: async (): Promise<Medication[]> => {
    return await apiService.get(MEDICATIONS_URL);
  },
  
  getMedicationById: async (id: number): Promise<Medication> => {
    return await apiService.get(`${MEDICATIONS_URL}${id}/`);
  },
  
  createMedication: async (
    medicationData: Pick<Medication, "medication_name" | "dosage" | "frequency" | "appropriate" | "duration" | "remarks">
  ): Promise<Medication> => {
    return await apiService.post(MEDICATIONS_URL, medicationData);
  },
  
  updateMedication: async (
    id: number,
    medicationData: Medication
  ): Promise<Medication> => {
    return await apiService.put(`${MEDICATIONS_URL}${id}/`, medicationData);
  },
  
  deleteMedication: async (id: number): Promise<void> => {
    return await apiService.delete(`${MEDICATIONS_URL}${id}/`);
  },
};