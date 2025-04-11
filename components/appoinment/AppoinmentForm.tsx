import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
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
  const [formData, setFormData] = useState<AppointmentFormData>(
    initialData || {
      doctor: '',
      specialty: '',
      date: '',
      time: '',
      location: '',
    }
  );

  const handleChange = (field: keyof AppointmentFormData, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSubmit = () => {
    // Basic validation
    if (!formData.doctor.trim() || !formData.date.trim()) {
      // You could add more sophisticated validation or error messages here
      return;
    }
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
        placeholder="Time"
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
