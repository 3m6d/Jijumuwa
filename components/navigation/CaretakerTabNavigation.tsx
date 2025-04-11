import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SectionType } from '../../types/caretaker';

interface TabNavigationProps {
  activeTab: SectionType;
  setActiveTab: (tab: SectionType) => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, setActiveTab }) => {
  return (
    <View className="flex-row bg-white border-b border-gray-200">
      <TouchableOpacity 
        className={`flex-1 py-4 ${activeTab === 'medications' ? 'border-b-2 border-blue-500' : ''}`}
        onPress={() => setActiveTab('medications')}
      >
        <Text className={`text-center font-medium ${activeTab === 'medications' ? 'text-blue-500' : 'text-gray-500'}`}>Medications</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        className={`flex-1 py-4 ${activeTab === 'appointments' ? 'border-b-2 border-blue-500' : ''}`}
        onPress={() => setActiveTab('appointments')}
      >
        <Text className={`text-center font-medium ${activeTab === 'appointments' ? 'text-blue-500' : 'text-gray-500'}`}>Appointments</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        className={`flex-1 py-4 ${activeTab === 'contacts' ? 'border-b-2 border-blue-500' : ''}`}
        onPress={() => setActiveTab('contacts')}
      >
        <Text className={`text-center font-medium ${activeTab === 'contacts' ? 'text-blue-500' : 'text-gray-500'}`}>Contacts</Text>
      </TouchableOpacity>
    </View>
  );
};