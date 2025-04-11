import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';

interface DashboardHeaderProps {
  patientName: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ patientName }) => {
  return (
    <View className="bg-blue-500 pt-12 pb-4 px-4">
      <View className="flex-row justify-between items-center">
        <View>
          <Text className="text-white text-2xl font-bold">Caretaker Dashboard</Text>
          <Text className="text-white opacity-80">Managing care for {patientName}</Text>
        </View>
        <TouchableOpacity className="bg-white rounded-full p-2">
          <Image
            source={{ uri: 'https://via.placeholder.com/150' }}
            className="w-10 h-10 rounded-full"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};