import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { MedicationFormData } from '../../types/caretaker';

interface MedicationFormProps {
  formData: MedicationFormData;
  setFormData: React.Dispatch<React.SetStateAction<MedicationFormData>>;
}

export const MedicationForm: React.FC<MedicationFormProps> = ({ formData, setFormData }) => {
  return (
    <View>
      <Text className="text-lg font-semibold mb-2">Medication Details</Text>
      <TextInput
        className="border border-gray-300 rounded-lg p-2 mb-3"
        placeholder="Medication Name"
        value={formData.name}
        onChangeText={(text) => setFormData({...formData, name: text})}
      />
      <TextInput
        className="border border-gray-300 rounded-lg p-2 mb-3"
        placeholder="Dosage"
        value={formData.dosage}
        onChangeText={(text) => setFormData({...formData, dosage: text})}
      />
      <TextInput
        className="border border-gray-300 rounded-lg p-2 mb-3"
        placeholder="Schedule"
        value={formData.schedule}
        onChangeText={(text) => setFormData({...formData, schedule: text})}
      />
      <TextInput
        className="border border-gray-300 rounded-lg p-2 mb-3"
        placeholder="Notes"
        value={formData.notes}
        onChangeText={(text) => setFormData({...formData, notes: text})}
        multiline
      />
    </View>
  );
};