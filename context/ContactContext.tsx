import React, { createContext, useState, useContext } from 'react';
import { Contact,ContactFormData } from '../types/caretaker';
import { initialContacts } from '../constants/mockCaretakerData';


interface ContactsContextType {
  contacts: Contact[];
  addContact: (data: ContactFormData) => void;
  updateContact: (id: string, data: ContactFormData) => void;
  deleteContact: (id: string) => void;
}

const ContactsContext = createContext<ContactsContextType | undefined>(undefined);

export const ContactsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);

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
    <ContactsContext.Provider value={{ contacts, addContact, updateContact, deleteContact }}>
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