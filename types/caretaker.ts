export type SectionType = "medications" | "appointments" | "contacts";

export interface Medication {
  id: string;
  elderly: string; // User ID
  medication_name: string;
  dosage: string;
  frequency: string;
  appropriate: 'Before Food' | 'After Food';
  duration: string;
  remarks?: string;
}

export interface Appointment {
  id: number;
  doctor_name: string;
  specialty: string;
  appointment_time: string;
  location: string;
}

export interface Contact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  isEmergency: boolean;
}

export interface MedicationFormData {
  id?: number;
  medication_name: string;
  dosage: string;
  frequency: string;
  appropriate: 'Before Food' | 'After Food';
  duration: string;
  remarks?: string;
}

export interface ContactFormData {
  name: string;
  relationship: string;
  phone: string;
  isEmergency: boolean;
}
