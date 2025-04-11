import apiService from './api';
import { Medication, MedicationFormData } from '../../types/caretaker';

const MEDICATIONS_URL = '/medication-reminders/';

export const medicationService = {
  getAllMedications: async (): Promise<Medication[]> => {
    return await apiService.get(MEDICATIONS_URL);
  },
  
  getMedicationById: async (id: string): Promise<Medication> => {
    return await apiService.get(`${MEDICATIONS_URL}${id}/`);
  },
  
  createMedication: async (medicationData: MedicationFormData): Promise<Medication> => {
    return await apiService.post(MEDICATIONS_URL, medicationData);
  },
  
  updateMedication: async (id: string, medicationData: MedicationFormData): Promise<Medication> => {
    return await apiService.put(`${MEDICATIONS_URL}${id}/`, medicationData);
  },
  
  deleteMedication: async (id: string): Promise<void> => {
    return await apiService.delete(`${MEDICATIONS_URL}${id}/`);
  },
};