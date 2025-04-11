import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SectionType } from '../../types/caretaker';
import { DashboardHeader } from '../../components/CaretakerDasHeader';
import { TabNavigation } from '../../components/navigation/CaretakerTabNavigation';
import { MedicationsTab } from '../../components/medications/MedicationTab';
import { AppointmentTab } from '../../components/appoinment/AppoinmentTab';
import { ContactTab } from '../../components/contact/ContactTab';

// Context providers
import { MedicationsProvider } from '../../context/MedicationContext';
import { AppointmentProvider } from '../../context/AppoinmentContext';
import { ContactsProvider } from '../../context/ContactContext';

export default function CaretakerDashboard() {
  const [activeTab, setActiveTab] = useState<SectionType>('medications');

  return (
    <MedicationsProvider>
      <AppointmentProvider>
        <ContactsProvider>
          <View className="flex-1 bg-gray-100">
            {/* Header */}
            <DashboardHeader patientName="John Doe" />

            {/* Tab Navigation */}
            <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Content Area */}
            <ScrollView className="flex-1 px-4 pt-4">
              {/* Tabs */}
              {activeTab === 'medications' && <MedicationsTab />}
              {activeTab === 'appointments' && <AppointmentTab />}
              {activeTab === 'contacts' && <ContactTab />}
            </ScrollView>

            {/* FAB */}
            <TouchableOpacity 
              className="absolute bottom-6 right-6 bg-blue-500 w-14 h-14 rounded-full items-center justify-center shadow-lg"
              onPress={() => {
                // Handle FAB press - opens add modal for current active tab
                // This could be handled by a custom hook or context
              }}
            >
              <Ionicons name="add" size={30} color="white" />
            </TouchableOpacity>
          </View>
        </ContactsProvider>
      </AppointmentProvider>
    </MedicationsProvider>
  );
}