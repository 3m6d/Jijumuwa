import apiService from './api';
import { Contact } from '../../types/caretaker';

const CONTACTS_URL = '/care/emergency-contacts/';

export const contactService = {
  getAllContacts: async (): Promise<Contact[]> => {
    return await apiService.get(CONTACTS_URL);
  },
  
  getContactById: async (id: number): Promise<Contact> => {
    return await apiService.get(`${CONTACTS_URL}${id}/`);
  },
  
  createContact: async (contactData: Pick<Contact, "name" | "relationship" | "phone_number" | "email">): Promise<Contact> => {
    console.log('contactService - Creating contact with data:', contactData);
    try {
      const response = await apiService.post(CONTACTS_URL, contactData);
      console.log('contactService - Create contact response:', response);
      return response;
    } catch (error: any) {
      console.error('contactService - Error creating contact:', error);
      if (error.response) {
        console.error('contactService - Error response data:', error.response.data);
        console.error('contactService - Error response status:', error.response.status);
      }
      throw error;
    }
  },
  
  updateContact: async (id: number, contactData: Contact): Promise<Contact> => {
    return await apiService.put(`${CONTACTS_URL}${id}/`, contactData);
  },
  
  deleteContact: async (id: number): Promise<void> => {
    return await apiService.delete(`${CONTACTS_URL}${id}/`);
  },
};