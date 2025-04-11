import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ContactFormData } from '../../types/caretaker';

interface ContactFormProps {
  initialData?: ContactFormData;
  onSubmit: (data: ContactFormData) => void;
  onCancel: () => void;
  isEditMode?: boolean;
}

const ContactForm: React.FC<ContactFormProps> = ({ 
  initialData, 
  onSubmit, 
  onCancel, 
  isEditMode = false 
}) => {
  const [formData, setFormData] = useState<ContactFormData>(
    initialData || {
      name: '',
      relationship: '',
      phone: '',
      isEmergency: false,
    }
  );

  const handleChange = (field: keyof ContactFormData, value: string | boolean) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSubmit = () => {
    // Basic validation
    if (!formData.name.trim() || !formData.phone.trim()) {
      // You could add more sophisticated validation or error messages here
      return;
    }
    onSubmit(formData);
  };

  return (
    <View className="p-4">
      <Text className="text-lg font-semibold mb-2">Contact Details</Text>
      
      <TextInput
        className="border border-gray-300 rounded-lg p-2 mb-3"
        placeholder="Contact Name"
        value={formData.name}
        onChangeText={(text) => handleChange('name', text)}
      />
      
      <TextInput
        className="border border-gray-300 rounded-lg p-2 mb-3"
        placeholder="Relationship"
        value={formData.relationship}
        onChangeText={(text) => handleChange('relationship', text)}
      />
      
      <TextInput
        className="border border-gray-300 rounded-lg p-2 mb-3"
        placeholder="Phone Number"
        value={formData.phone}
        onChangeText={(text) => handleChange('phone', text)}
        keyboardType="phone-pad"
      />
      
      <View className="flex-row items-center mb-4">
        <TouchableOpacity
          onPress={() => handleChange('isEmergency', !formData.isEmergency)}
          className="flex-row items-center"
        >
          <View className={`w-6 h-6 border border-gray-400 rounded mr-2 ${formData.isEmergency ? 'bg-blue-500' : 'bg-white'}`}>
            {formData.isEmergency && (
              <Ionicons name="checkmark" size={20} color="white" />
            )}
          </View>
          <Text>Emergency Contact</Text>
        </TouchableOpacity>
      </View>

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

export default ContactForm;
