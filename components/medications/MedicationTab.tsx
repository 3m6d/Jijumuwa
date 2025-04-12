import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMedications } from '../../context/MedicationContext';
import { MedicationForm } from './MedicationForm';
import { ItemCard } from '../ItemCard';
import { MedicationFormData } from '../../types/caretaker';

export const MedicationsTab: React.FC = () => {
  const { medications, addMedication, updateMedication, deleteMedication, isLoading } = useMedications();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentItemId, setCurrentItemId] = useState<string | null>(null);
  const [formData, setFormData] = useState<MedicationFormData>({
    name: '',
    dosage: '',
    schedule: '',
    notes: '',
  });

  const openAddModal = () => {
    setIsEditMode(false);
    setFormData({ name: '', dosage: '', schedule: '', notes: '' });
    setIsModalVisible(true);
  };

  const openEditModal = (id: string) => {
    const medication = medications.find(item => item.id === id);
    if (medication) {
      setFormData({
        name: medication.name,
        dosage: medication.dosage,
        schedule: medication.schedule,
        notes: medication.notes,
      });
      setCurrentItemId(id);
      setIsEditMode(true);
      setIsModalVisible(true);
    }
  };

  const handleSave = () => {
    if (isEditMode && currentItemId) {
      updateMedication(currentItemId, formData);
    } else {
      addMedication(formData);
    }
    setIsModalVisible(false);
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-2 text-gray-600">Loading medications...</Text>
      </View>
    );
  }

  return (
    <View>
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-xl font-bold text-gray-800">Medications</Text>
        <TouchableOpacity 
          className="bg-blue-500 p-2 rounded-full"
          onPress={openAddModal}
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>
      
      {medications.map(item => (
        <ItemCard 
          key={item.id}
          item={item}
          section="medications"
          onEdit={() => openEditModal(item.id)}
          onDelete={() => deleteMedication(item.id)}
        />
      ))}
      
      {medications.length === 0 && (
        <Text className="text-gray-500 text-center py-6">No medications added yet.</Text>
      )}

      {/* Add/Edit Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
      >
        <View className="flex-1 justify-end bg-black bg-opacity-50">
          <View className="bg-white rounded-t-lg p-5">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold">
                {isEditMode ? 'Edit' : 'Add'} Medication
              </Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Ionicons name="close" size={24} />
              </TouchableOpacity>
            </View>
            
            <MedicationForm formData={formData} setFormData={setFormData} />
            
            <TouchableOpacity 
              className="bg-blue-500 p-4 rounded-lg mt-4"
              onPress={handleSave}
            >
              <Text className="text-white text-center font-bold">Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};
