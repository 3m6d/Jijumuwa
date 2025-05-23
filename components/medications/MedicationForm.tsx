import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Medication } from '../../types/caretaker';

interface MedicationFormProps {
  initialData?: Medication;
  onSubmit: (data: Medication | Pick<Medication, "medication_name" | "dosage" | "frequency" | "appropriate" | "duration" | "remarks">) => void;
  onCancel: () => void;
  isEditMode: boolean;
}

const MedicationForm: React.FC<MedicationFormProps> = ({ 
  initialData, 
  onSubmit, 
  onCancel,
  isEditMode 
}) => {
  const [errors, setErrors] = useState<Partial<Record<keyof Medication, string>>>({});
  const [formData, setFormData] = useState<Partial<Medication>>({
    medication_name: initialData?.medication_name || '',
    dosage: initialData?.dosage || '',
    frequency: initialData?.frequency || '',
    appropriate: initialData?.appropriate || 'Before Food',
    duration: initialData?.duration || '',
    remarks: initialData?.remarks || ''
  });

  const validateField = (field: keyof Medication, value: string) => {
    let errorMessage = '';

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

  const handleSubmit = () => {
    // Validate all required fields
    const requiredFields: (keyof Medication)[] = ['medication_name', 'dosage', 'frequency', 'duration'];
    let hasErrors = false;

    requiredFields.forEach(field => {
      if (!formData[field]) {
        validateField(field, '');
        hasErrors = true;
      }
    });

    if (hasErrors) return;

    onSubmit(formData as Medication);
  };

  return (
    <View className="p-4">
      <Text className="text-lg font-semibold mb-2">Medication Details</Text>

      <TextInput
        className="border border-gray-300 rounded-lg p-2 mb-1"
        placeholder="Medication Name"
        value={formData.medication_name}
        onChangeText={(text) => {
          setFormData({ ...formData, medication_name: text });
          validateField('medication_name', text);
        }}
        onBlur={() => validateField('medication_name', formData.medication_name || '')}
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
        onBlur={() => validateField('dosage', formData.dosage || '')}
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
        onBlur={() => validateField('frequency', formData.frequency || '')}
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
        onBlur={() => validateField('duration', formData.duration || '')}
      />
      {errors.duration ? <Text className="text-red-500 mb-3">{errors.duration}</Text> : null}

      <TextInput
        className="border border-gray-300 rounded-lg p-2 mb-1"
        placeholder="Remarks (optional)"
        value={formData.remarks || ''}
        onChangeText={(text) => setFormData({ ...formData, remarks: text })}
        multiline
      />

      <View className="flex-row justify-end mt-4">
        <TouchableOpacity
          className="bg-gray-200 p-3 rounded-lg mr-2"
          onPress={onCancel}
        >
          <Text>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-blue-500 p-3 rounded-lg"
          onPress={handleSubmit}
        >
          <Text className="text-white font-bold">
            {isEditMode ? 'Update' : 'Add'} Medication
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MedicationForm;
