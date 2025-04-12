import React, { createContext, useState, useContext, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Contact, ContactFormData } from '../types/caretaker';
import { initialContacts } from '../constants/mockCaretakerData';

// Key for storing data in SecureStore
const CONTACTS_STORAGE_KEY = 'caretaker_contacts';

interface ContactsContextType {
  contacts: Contact[];
  addContact: (data: ContactFormData) => void;
  updateContact: (id: string, data: ContactFormData) => void;
  deleteContact: (id: string) => void;
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
        const storedContacts = await SecureStore.getItemAsync(CONTACTS_STORAGE_KEY);
        if (storedContacts) {
          setContacts(JSON.parse(storedContacts));
        } else {
          // Use initial data if nothing is stored
          setContacts(initialContacts);
        }
      } catch (error) {
        console.error('Error loading contacts from storage:', error);
        setContacts(initialContacts);
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

  const addContact = (data: ContactFormData) => {
    const newId = Math.random().toString(36).substring(7);
    setContacts([...contacts, { ...data, id: newId }]);
  };

  const updateContact = (id: string, data: ContactFormData) => {
    setContacts(contacts.map(item => 
      item.id === id ? { ...data, id } : item
    ));
  };

  const deleteContact = (id: string) => {
    setContacts(contacts.filter(item => item.id !== id));
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