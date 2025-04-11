import apiService from './api';
import { Contact, ContactFormData } from '../../types/caretaker';

const CONTACTS_URL = '/emergency-contacts/';

export const contactService = {
  getAllContacts: async (): Promise<Contact[]> => {
    return await apiService.get(CONTACTS_URL);
  },
  
  getContactById: async (id: string): Promise<Contact> => {
    return await apiService.get(`${CONTACTS_URL}${id}/`);
  },
  
  createContact: async (contactData: ContactFormData): Promise<Contact> => {
    return await apiService.post(CONTACTS_URL, contactData);
  },
  
  updateContact: async (id: string, contactData: ContactFormData): Promise<Contact> => {
    return await apiService.put(`${CONTACTS_URL}${id}/`, contactData);
  },
  
  deleteContact: async (id: string): Promise<void> => {
    return await apiService.delete(`${CONTACTS_URL}${id}/`);
  },
};