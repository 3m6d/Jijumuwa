//constants/mockCaretakerData.ts
import { Medication, Appointment, Contact } from '../types/caretaker';

export const initialMedications: Medication[] = [
  { id: '1', name: 'Lisinopril', dosage: '10mg', schedule: 'Once daily', notes: 'Take with food' },
  { id: '2', name: 'Metformin', dosage: '500mg', schedule: 'Twice daily', notes: 'Take with meals' },
];

export const initialAppointments: Appointment[] = [
  { id: '1', doctor: 'Dr. Smith', specialty: 'Cardiology', date: '2025-04-20', time: '10:00 AM', location: 'Heart Center' },
  { id: '2', doctor: 'Dr. Johnson', specialty: 'Neurology', date: '2025-05-15', time: '02:30 PM', location: 'City Hospital' },
];

export const initialContacts: Contact[] = [
  { id: '1', name: 'Jane Smith', relationship: 'Daughter', phone: '123-456-7890', isEmergency: true },
  { id: '2', name: 'John Smith', relationship: 'Son', phone: '987-654-3210', isEmergency: true },
];