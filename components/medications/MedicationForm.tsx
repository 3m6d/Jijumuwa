import React, { useState } from 'react';
import { View, Text, TextInput } from 'react-native';
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
    if (field === 'name' && !value.trim()) {
      errorMessage = 'Medication name is required.';
    } else if (field === 'dosage' && !value.trim()) {
      errorMessage = 'Dosage is required.';
    } else if (field === 'schedule' && !value.trim()) {
      errorMessage = 'Schedule is required.';
    }

    setErrors((prevErrors) => ({ ...prevErrors, [field]: errorMessage }));
  };

  return (
    <View>
      <Text className="text-lg font-semibold mb-2">Medication Details</Text>

      <TextInput
        className="border border-gray-300 rounded-lg p-2 mb-1"
        placeholder="Medication Name"
        value={formData.name}
        onChangeText={(text) => {
          setFormData({ ...formData, name: text });
          validateField('name', text);
        }}
        onBlur={() => validateField('name', formData.name)}
      />
      {errors.name ? <Text className="text-red-500 mb-3">{errors.name}</Text> : null}

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
        placeholder="Schedule"
        value={formData.schedule}
        onChangeText={(text) => {
          setFormData({ ...formData, schedule: text });
          validateField('schedule', text);
        }}
        onBlur={() => validateField('schedule', formData.schedule)}
      />
      {errors.schedule ? <Text className="text-red-500 mb-3">{errors.schedule}</Text> : null}

      <TextInput
        className="border border-gray-300 rounded-lg p-2 mb-3"
        placeholder="Notes (optional)"
        value={formData.notes}
        onChangeText={(text) => setFormData({ ...formData, notes: text })}
        multiline
      />
    </View>
  );
};
