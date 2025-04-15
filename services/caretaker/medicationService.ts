import apiService from './api';
import { Medication, MedicationFormData } from '../../types/caretaker';

const MEDICATIONS_URL = '/medication-reminders/';

export const medicationService = {
  getAllMedications: async (): Promise<Medication[]> => {
    const response = await apiService.get(MEDICATIONS_URL);
    console.log(response.data);
    return response.data;
  },
  
  getMedicationById: async (id: string): Promise<Medication> => {
    const response = await apiService.get(`${MEDICATIONS_URL}${id}/`);
    console.log(response.data);
    return response.data;
  },
  
  createMedication: async (medicationData: MedicationFormData): Promise<Medication> => {
    const response = await apiService.post(MEDICATIONS_URL, medicationData);
    console.log(response.data);
    return response.data;
  },
  
  updateMedication: async (id: string, medicationData: MedicationFormData): Promise<Medication> => {
    const response = await apiService.put(`${MEDICATIONS_URL}${id}/`, medicationData);
    console.log(response.data);
    return response.data;
  },
  
  deleteMedication: async (id: string): Promise<void> => {
    await apiService.delete(`${MEDICATIONS_URL}${id}/`);
  },
};