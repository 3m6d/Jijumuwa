import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Medication, Appointment, Contact, SectionType } from '../types/caretaker';

interface ItemCardProps {
  item: Medication | Appointment | Contact;
  section: SectionType;
  onEdit: () => void;
  onDelete: () => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, section, onEdit, onDelete }) => {
  // Render different card layouts based on section type
  if (section === 'medications') {
    const medication = item as Medication;
    return (
      <View className="bg-white p-4 rounded-lg shadow mb-3">
        <View className="flex-row justify-between">
          <Text className="text-lg font-bold">{medication.name}</Text>
          <View className="flex-row">
            <TouchableOpacity onPress={onEdit} className="mr-2">
              <Ionicons name="create-outline" size={22} color="#4b5563" />
            </TouchableOpacity>
            <TouchableOpacity onPress={onDelete}>
              <Ionicons name="trash-outline" size={22} color="#ef4444" />
            </TouchableOpacity>
          </View>
        </View>
        <Text className="text-gray-600">Dosage: {medication.dosage}</Text>
        <Text className="text-gray-600">Schedule: {medication.schedule}</Text>
        {medication.notes && <Text className="text-gray-500 mt-1">Notes: {medication.notes}</Text>}
      </View>
    );
  }

  // Implementation for appointments card
  else if (section === 'appointments') {
    const appointment = item as Appointment;
    return (
      <View className="bg-white p-4 rounded-lg shadow mb-3">
        <View className="flex-row justify-between">
          <Text className="text-lg font-bold">{appointment.doctor_name}</Text>
          <View className="flex-row">
            <TouchableOpacity onPress={onEdit} className="mr-2">
              <Ionicons name="create-outline" size={22} color="#4b5563" />
            </TouchableOpacity>
            <TouchableOpacity onPress={onDelete}>
              <Ionicons name="trash-outline" size={22} color="#ef4444" />
            </TouchableOpacity>
          </View>
        </View>
        <Text className="text-gray-600">{appointment.specialty}</Text>
        <Text className="text-gray-600">{appointment.appointment_time}</Text>
        <Text className="text-gray-500">{appointment.location}</Text>
      </View>
    );
  }

  // Implementation for contacts card
  else if (section === 'contacts') {
    const contact = item as Contact;
    return (
      <View className="bg-white p-4 rounded-lg shadow mb-3">
        <View className="flex-row justify-between">
          <Text className="text-lg font-bold">{contact.name}</Text>
          <View className="flex-row">
            <TouchableOpacity onPress={onEdit} className="mr-2">
              <Ionicons name="create-outline" size={22} color="#4b5563" />
            </TouchableOpacity>
            <TouchableOpacity onPress={onDelete}>
              <Ionicons name="trash-outline" size={22} color="#ef4444" />
            </TouchableOpacity>
          </View>
        </View>
        <Text className="text-gray-600">{contact.relationship}</Text>
        <Text className="text-gray-600">{contact.phone}</Text>
        {contact.isEmergency && (
          <View className="flex-row items-center mt-1">
            <Ionicons name="alert-circle" size={16} color="#ef4444" />
            <Text className="text-red-500 ml-1">Emergency Contact</Text>
          </View>
        )}
      </View>
    );
  }

  return null;
};