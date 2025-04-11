import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useContacts } from '../../context/ContactContext';
import { Contact, ContactFormData } from '../../types/caretaker';
import ContactForm from './ContactForm';
import { ItemCard } from '../ItemCard';

export const ContactTab: React.FC = () => {
  const { contacts, addContact, updateContact, deleteContact } = useContacts();
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

  const handleDelete = (id: string) => {
    deleteContact(id);
  };

  const handleSubmit = (data: ContactFormData) => {
    if (isEditMode && currentContact) {
      updateContact(currentContact.id, data);
    } else {
      addContact(data);
    }
    setIsModalVisible(false);
  };

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
              onDelete={() => handleDelete(contact.id)}
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


