import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMedications } from '../../context/MedicationContext';
import { Medication } from '../../types/caretaker';
import MedicationForm from './MedicationForm';
import { ItemCard } from '../ItemCard';

export const MedicationTab: React.FC = () => {
  const { medications, addMedication, updateMedication, deleteMedication, isLoading } = useMedications();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentMedication, setCurrentMedication] = useState<Medication | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleAddNew = () => {
    setCurrentMedication(null);
    setIsEditMode(false);
    setIsModalVisible(true);
  };

  const handleEdit = (medication: Medication) => {
    setCurrentMedication(medication);
    setIsEditMode(true);
    setIsModalVisible(true);
  };

  const handleDelete = (id: number) => {
    deleteMedication(id);
  };

  const handleSubmit = (
    data: Medication | Pick<Medication, "medication_name" | "dosage" | "frequency" | "appropriate" | "duration" | "remarks">
  ) => {
    if (isEditMode && currentMedication) {
      updateMedication(currentMedication.id, data as Medication);
    } else {
      addMedication(
        data as Pick<Medication, "medication_name" | "dosage" | "frequency" | "appropriate" | "duration" | "remarks">
      );
    }
    setIsModalVisible(false);
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-gray-600">Loading medications...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-xl font-bold text-gray-800">Medications</Text>
        <TouchableOpacity
          className="bg-blue-500 p-2 rounded-full"
          onPress={handleAddNew}
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1">
        {medications.length > 0 ? (
          medications.map((medication) => (
            <ItemCard
              key={medication.id}
              item={medication}
              section="medications"
              onEdit={() => handleEdit(medication)}
              onDelete={() => handleDelete(medication.id)}
            />
          ))
        ) : (
          <Text className="text-gray-500 text-center py-6">
            No medications added yet.
          </Text>
        )}
      </ScrollView>

      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View className="flex-1 justify-end bg-black bg-opacity-50">
          <View className="bg-white rounded-t-lg">
            <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
              <Text className="text-xl font-bold">
                {isEditMode ? "Edit Medication" : "Add New Medication"}
              </Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Ionicons name="close" size={24} />
              </TouchableOpacity>
            </View>

            <MedicationForm
              initialData={currentMedication || undefined}
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
