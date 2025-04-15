import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useContacts } from '../../context/ContactContext';
import { Contact } from '../../types/caretaker';
import ContactForm from './ContactForm';
import { ItemCard } from '../ItemCard';

export const ContactTab: React.FC = () => {
  const { contacts, addContact, updateContact, deleteContact, isLoading } = useContacts();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentContact, setCurrentContact] = useState<Contact | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleAddNew = () => {
    setCurrentContact(null);
    setIsEditMode(false);
    setIsModalVisible(true);
  };

  const handleEdit = (contact: Contact) => {
    setCurrentContact(contact);
    setIsEditMode(true);
    setIsModalVisible(true);
  };

  const handleDelete = (id: number) => {
    if (id) {
      deleteContact(id);
    }
  };

  const handleSubmit = (data: Contact | Pick<Contact, "name" | "relationship" | "phone_number" | "email">) => {
    console.log('ContactTab - Data received from form:', data);
    console.log('ContactTab - Is edit mode:', isEditMode);
    console.log('ContactTab - Current contact:', currentContact);

    if (isEditMode && currentContact?.id) {
      console.log('ContactTab - Updating contact:', currentContact.id, data);
      updateContact(currentContact.id, data as Contact);
    } else {
      console.log('ContactTab - Creating new contact:', data);
      addContact(data as Pick<Contact, "name" | "relationship" | "phone_number" | "email">);
    }
    setIsModalVisible(false);
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-gray-600">Loading contacts...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-xl font-bold text-gray-800">Emergency Contacts</Text>
        <TouchableOpacity 
          className="bg-blue-500 p-2 rounded-full"
          onPress={handleAddNew}
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>
      
      <ScrollView className="flex-1">
        {contacts.length > 0 ? (
          contacts.map((contact) => (
            <ItemCard
              key={contact.id}
              item={contact}
              section="contacts"
              onEdit={() => handleEdit(contact)}
              onDelete={() => contact.id && handleDelete(contact.id)}
            />
          ))
        ) : (
          <Text className="text-gray-500 text-center py-6">No contacts added yet.</Text>
        )}
      </ScrollView>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
      >
        <View className="flex-1 justify-end bg-black bg-opacity-50">
          <View className="bg-white rounded-t-lg">
            <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
              <Text className="text-xl font-bold">
                {isEditMode ? 'Edit Contact' : 'Add New Contact'}
              </Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Ionicons name="close" size={24} />
              </TouchableOpacity>
            </View>
            
            <ContactForm
              initialData={currentContact || undefined}
              onSubmit={handleSubmit}
              onCancel={() => setIsModalVisible(false)}
              isEditMode={isEditMode}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};


