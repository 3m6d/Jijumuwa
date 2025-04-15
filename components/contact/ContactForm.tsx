import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Contact } from '../../types/caretaker';

interface ContactFormProps {
  initialData?: Contact;
  onSubmit: (data: Contact | Pick<Contact, "name" | "relationship" | "phone_number" | "email">) => void;
  onCancel: () => void;
  isEditMode?: boolean;
}

const ContactForm: React.FC<ContactFormProps> = ({ 
  initialData, 
  onSubmit, 
  onCancel, 
  isEditMode = false 
}) => {
  const [errors, setErrors] = useState<Partial<Record<keyof Contact, string>>>({});
  const [formData, setFormData] = useState<Partial<Contact>>({
    name: initialData?.name || '',
    relationship: initialData?.relationship || '',
    phone_number: initialData?.phone_number || '',
    email: initialData?.email || '',
  });

  const validateField = (field: keyof Contact, value: string) => {
    let errorMessage = '';

    if (field === 'name' && !value.trim()) {
      errorMessage = 'Name is required.';
    } else if (field === 'phone_number' && !value.trim()) {
      errorMessage = 'Phone number is required.';
    } else if (field === 'phone_number' && !/^\d+$/.test(value)) {
      errorMessage = 'Phone number must contain only digits.';
    } else if (field === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      errorMessage = 'Please enter a valid email address.';
    }

    setErrors(prev => ({ ...prev, [field]: errorMessage }));
  };

  const handleSubmit = () => {
    // Validate all required fields
    const requiredFields: (keyof Contact)[] = ['name', 'phone_number'];
    let hasErrors = false;

    requiredFields.forEach(field => {
      if (!formData[field]) {
        validateField(field, '');
        hasErrors = true;
      }
    });

    if (hasErrors) return;

    console.log('Form data being submitted:', formData);
    console.log('Is edit mode:', isEditMode);
    console.log('Initial data:', initialData);

    if (isEditMode && initialData) {
      onSubmit({ ...formData, id: initialData.id } as Contact);
    } else {
      onSubmit(formData as Pick<Contact, "name" | "relationship" | "phone_number" | "email">);
    }
  };

  return (
    <View className="p-4">
      <Text className="text-lg font-semibold mb-2">Contact Details</Text>
      
      <TextInput
        className="border border-gray-300 rounded-lg p-2 mb-1"
        placeholder="Name"
        value={formData.name}
        onChangeText={(text) => {
          setFormData({ ...formData, name: text });
          validateField('name', text);
        }}
        onBlur={() => validateField('name', formData.name || '')}
      />
      {errors.name ? <Text className="text-red-500 mb-3">{errors.name}</Text> : null}
      
      <TextInput
        className="border border-gray-300 rounded-lg p-2 mb-1"
        placeholder="Relationship (optional)"
        value={formData.relationship}
        onChangeText={(text) => setFormData({ ...formData, relationship: text })}
      />
      
      <TextInput
        className="border border-gray-300 rounded-lg p-2 mb-1"
        placeholder="Phone Number"
        value={formData.phone_number}
        onChangeText={(text) => {
          setFormData({ ...formData, phone_number: text });
          validateField('phone_number', text);
        }}
        onBlur={() => validateField('phone_number', formData.phone_number || '')}
        keyboardType="phone-pad"
      />
      {errors.phone_number ? <Text className="text-red-500 mb-3">{errors.phone_number}</Text> : null}
      
      <TextInput
        className="border border-gray-300 rounded-lg p-2 mb-1"
        placeholder="Email (optional)"
        value={formData.email}
        onChangeText={(text) => {
          setFormData({ ...formData, email: text });
          validateField('email', text);
        }}
        onBlur={() => validateField('email', formData.email || '')}
        keyboardType="email-address"
      />
      {errors.email ? <Text className="text-red-500 mb-3">{errors.email}</Text> : null}

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
