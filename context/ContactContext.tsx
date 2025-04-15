import React, { createContext, useState, useContext, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Contact } from '../types/caretaker';
import { contactService } from '../services/caretaker/contactService';

// Key for storing data in SecureStore
const CONTACTS_STORAGE_KEY = 'caretaker_contacts';

interface ContactsContextType {
  contacts: Contact[];
  addContact: (data: Pick<Contact, "name" | "relationship" | "phone_number" | "email">) => Promise<void>;
  updateContact: (id: number, data: Contact) => Promise<void>;
  deleteContact: (id: number) => Promise<void>;
  isLoading: boolean;
}

const ContactsContext = createContext<ContactsContextType | undefined>(undefined);

export const ContactsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load contacts from SecureStore when component mounts
  useEffect(() => {
    const loadContacts = async () => {
      try {
        const data = await contactService.getAllContacts();
        setContacts(data);
      } catch (error) {
        console.error('Error loading contacts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadContacts();
  }, []);

  // Save contacts to SecureStore whenever they change
  useEffect(() => {
    const saveContacts = async () => {
      try {
        await SecureStore.setItemAsync(
          CONTACTS_STORAGE_KEY,
          JSON.stringify(contacts)
        );
      } catch (error) {
        console.error('Error saving contacts to storage:', error);
      }
    };

    // Don't save initial load or empty array
    if (!isLoading && contacts.length > 0) {
      saveContacts();
    }
  }, [contacts, isLoading]);

  const addContact = async (data: Pick<Contact, "name" | "relationship" | "phone_number" | "email">) => {
    try {
      const newContact = await contactService.createContact(data);
      setContacts(prev => [...prev, newContact]);
    } catch (error) {
      console.error('Error adding contact:', error);
      throw error;
    }
  };

  const updateContact = async (id: number, data: Contact) => {
    try {
      const updatedContact = await contactService.updateContact(id, data);
      setContacts(prev => prev.map(item => 
        item.id === id ? updatedContact : item
      ));
    } catch (error) {
      console.error('Error updating contact:', error);
      throw error;
    }
  };

  const deleteContact = async (id: number) => {
    try {
      await contactService.deleteContact(id);
      setContacts(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting contact:', error);
      throw error;
    }
  };

  return (
    <ContactsContext.Provider value={{ 
      contacts, 
      addContact, 
      updateContact, 
      deleteContact,
      isLoading
    }}>
      {children}
    </ContactsContext.Provider>
  );
};

export const useContacts = () => {
  const context = useContext(ContactsContext);
  if (context === undefined) {
    throw new Error('useContacts must be used within a ContactsProvider');
  }
  return context;
};