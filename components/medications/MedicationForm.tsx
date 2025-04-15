import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { MedicationFormData } from '../../types/caretaker';

interface MedicationFormProps {
  formData: MedicationFormData;
  setFormData: React.Dispatch<React.SetStateAction<MedicationFormData>>;
}

export const MedicationForm: React.FC<MedicationFormProps> = ({ formData, setFormData }) => {
  // Local state to hold validation error messages per field.
  const [errors, setErrors] = useState<Partial<Record<keyof MedicationFormData, string>>>({});

  // Helper function to validate a particular field.
  const validateField = (field: keyof MedicationFormData, value: string) => {
    let errorMessage = '';

    // Validate required fields; adjust logic as needed.
    if (field === 'medication_name' && !value.trim()) {
      errorMessage = 'Medication name is required.';
    } else if (field === 'dosage' && !value.trim()) {
      errorMessage = 'Dosage is required.';
    } else if (field === 'frequency' && !value.trim()) {
      errorMessage = 'Frequency is required.';
    } else if (field === 'duration' && !value.trim()) {
      errorMessage = 'Duration is required.';
    }

    setErrors((prevErrors) => ({ ...prevErrors, [field]: errorMessage }));
  };

  return (
    <View>
      <Text className="text-lg font-semibold mb-2">Medication Details</Text>

      <TextInput
        className="border border-gray-300 rounded-lg p-2 mb-1"
        placeholder="Medication Name"
        value={formData.medication_name}
        onChangeText={(text) => {
          setFormData({ ...formData, medication_name: text });
          validateField('medication_name', text);
        }}
        onBlur={() => validateField('medication_name', formData.medication_name)}
      />
      {errors.medication_name ? <Text className="text-red-500 mb-3">{errors.medication_name}</Text> : null}

      <TextInput
        className="border border-gray-300 rounded-lg p-2 mb-1"
        placeholder="Dosage"
        value={formData.dosage}
        onChangeText={(text) => {
          setFormData({ ...formData, dosage: text });
          validateField('dosage', text);
        }}
        onBlur={() => validateField('dosage', formData.dosage)}
      />
      {errors.dosage ? <Text className="text-red-500 mb-3">{errors.dosage}</Text> : null}

      <TextInput
        className="border border-gray-300 rounded-lg p-2 mb-1"
        placeholder="Frequency"
        value={formData.frequency}
        onChangeText={(text) => {
          setFormData({ ...formData, frequency: text });
          validateField('frequency', text);
        }}
        onBlur={() => validateField('frequency', formData.frequency)}
      />
      {errors.frequency ? <Text className="text-red-500 mb-3">{errors.frequency}</Text> : null}

      <View className="flex-row justify-between mb-3">
        <TouchableOpacity
          className={`flex-1 p-2 rounded-lg border mr-2 ${
            formData.appropriate === 'Before Food' ? 'bg-blue-100 border-blue-500' : 'bg-white border-gray-300'
          }`}
          onPress={() => setFormData({ ...formData, appropriate: 'Before Food' })}
        >
          <Text className="text-center">Before Food</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 p-2 rounded-lg border ${
            formData.appropriate === 'After Food' ? 'bg-blue-100 border-blue-500' : 'bg-white border-gray-300'
          }`}
          onPress={() => setFormData({ ...formData, appropriate: 'After Food' })}
        >
          <Text className="text-center">After Food</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        className="border border-gray-300 rounded-lg p-2 mb-1"
        placeholder="Duration"
        value={formData.duration}
        onChangeText={(text) => {
          setFormData({ ...formData, duration: text });
          validateField('duration', text);
        }}
        onBlur={() => validateField('duration', formData.duration)}
      />
      {errors.duration ? <Text className="text-red-500 mb-3">{errors.duration}</Text> : null}

      <TextInput
        className="border border-gray-300 rounded-lg p-2 mb-1"
        placeholder="Remarks (optional)"
        value={formData.remarks || ''}
        onChangeText={(text) => setFormData({ ...formData, remarks: text })}
        multiline
      />
    </View>
  );
};
