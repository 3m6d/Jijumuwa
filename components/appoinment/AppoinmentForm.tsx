import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { AppointmentFormData } from '../../types/caretaker';

interface AppointmentFormProps {
  initialData?: AppointmentFormData;
  onSubmit: (data: AppointmentFormData) => void;
  onCancel: () => void;
  isEditMode?: boolean;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({ 
  initialData, 
  onSubmit, 
  onCancel, 
  isEditMode = false 
}) => {
  const [formData, setFormData] = useState<AppointmentFormData>(initialData || {
    doctor: '',
    specialty: '',
    date: '',
    time: '',
    location: '',
  });

  const handleChange = (field: keyof AppointmentFormData, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const validateForm = (): boolean => {
    // Validate Doctor's Name
    if (!formData.doctor.trim()) {
      Alert.alert('Validation Error', 'Doctor Name is required.');
      return false;
    }

    // Validate Date: must be in YYYY-MM-DD format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!formData.date.trim() || !dateRegex.test(formData.date)) {
      Alert.alert('Validation Error', 'Please enter a valid date in YYYY-MM-DD format.');
      return false;
    }

    // Validate Time: expecting HH:mm (24-hour clock)
    const timeRegex = /^\d{2}:\d{2}$/;
    if (!formData.time.trim() || !timeRegex.test(formData.time)) {
      Alert.alert('Validation Error', 'Please enter a valid time in HH:mm format.');
      return false;
    }

    // Optionally, more validations can be added (for example, checking if the appointment is set in the future)
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    // If needed, you can combine date and time into one field here or later in your service layer.
    onSubmit(formData);
  };

  return (
    <View className="p-4">
      <Text className="text-lg font-semibold mb-2">Appointment Details</Text>
      
      <TextInput
        className="border border-gray-300 rounded-lg p-2 mb-3"
        placeholder="Doctor Name"
        value={formData.doctor}
        onChangeText={(text) => handleChange('doctor', text)}
      />
      
      <TextInput
        className="border border-gray-300 rounded-lg p-2 mb-3"
        placeholder="Specialty"
        value={formData.specialty}
        onChangeText={(text) => handleChange('specialty', text)}
      />
      
      <TextInput
        className="border border-gray-300 rounded-lg p-2 mb-3"
        placeholder="Date (YYYY-MM-DD)"
        value={formData.date}
        onChangeText={(text) => handleChange('date', text)}
      />
      
      <TextInput
        className="border border-gray-300 rounded-lg p-2 mb-3"
        placeholder="Time (HH:mm)"
        value={formData.time}
        onChangeText={(text) => handleChange('time', text)}
      />
      
      <TextInput
        className="border border-gray-300 rounded-lg p-2 mb-3"
        placeholder="Location"
        value={formData.location}
        onChangeText={(text) => handleChange('location', text)}
      />

      <View className="flex-row justify-end mt-4">
        <TouchableOpacity 
          onPress={onCancel}
          className="px-4 py-2 mr-2 rounded-lg border border-gray-300"
        >
          <Text>Cancel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={handleSubmit}
          className="px-4 py-2 bg-blue-500 rounded-lg"
        >
          <Text className="text-white">{isEditMode ? 'Update' : 'Save'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AppointmentForm;
