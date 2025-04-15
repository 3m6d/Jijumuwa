import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SectionType } from '../../types/caretaker';
import { DashboardHeader } from '../../components/CaretakerDasHeader';
import { TabNavigation } from '../../components/navigation/CaretakerTabNavigation';
import { MedicationTab } from '../../components/medications/MedicationTab';
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
            <DashboardHeader patientName="Jijumuwa" />

            {/* Tab Navigation */}
            <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Content Area */}
            <ScrollView className="flex-1 px-4 pt-4">
              {/* Tabs */}
              {activeTab === 'medications' && <MedicationTab />}
              {activeTab === 'appointments' && <AppointmentTab />}
              {activeTab === 'contacts' && <ContactTab />}
            </ScrollView>
          </View>
        </ContactsProvider>
      </AppointmentProvider>
    </MedicationsProvider>
  );
}