export type SectionType = 'medications' | 'appointments' | 'contacts';

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  schedule: string;
  notes: string;
}

export interface Appointment {
  id: number;
  doctor_name: string;
  specialty: string;
  date: string;  
  time: string;
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
  name: string;
  dosage: string;
  schedule: string;
  notes: string;
}

export interface AppointmentFormData {
  doctor_name: string;
  specialty: string;
  date: string;
  time: string;
  location: string;
}

export interface AppointmentDTO {
  doctor_name: string;
  specialty: string;
  appointment_time: string;
  location: string;
}

export interface ContactFormData {
  name: string;
  relationship: string;
  phone: string;
  isEmergency: boolean;
}