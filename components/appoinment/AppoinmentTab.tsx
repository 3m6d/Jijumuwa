import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppointments } from "../../context/AppoinmentContext";
import { Appointment } from "../../types/caretaker";
import AppointmentForm from "./AppoinmentForm";
import { ItemCard } from "../ItemCard";

export const AppointmentTab: React.FC = () => {
  const { appointments, addAppointment, updateAppointment, deleteAppointment } =
    useAppointments();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentAppointment, setCurrentAppointment] =
    useState<Appointment | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleAddNew = () => {
    setCurrentAppointment(null);
    setIsEditMode(false);
    setIsModalVisible(true);
  };

  const handleEdit = (appointment: Appointment) => {
    setCurrentAppointment(appointment);
    setIsEditMode(true);
    setIsModalVisible(true);
  };

  const handleDelete = (id: number) => {
    deleteAppointment(id);
  };

  const handleSubmit = (
    data:
      | Appointment
      | Pick<
          Appointment,
          "doctor_name" | "specialty" | "appointment_time" | "location"
        >
  ) => {
    if (isEditMode && currentAppointment) {
      updateAppointment(currentAppointment.id, data as Appointment);
    } else {
      addAppointment(
        data as Pick<
          Appointment,
          "doctor_name" | "specialty" | "appointment_time" | "location"
        >
      );
    }
    setIsModalVisible(false);
  };

  return (
    <View className="flex-1">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-xl font-bold text-gray-800">
          Doctor Appointments
        </Text>
        <TouchableOpacity
          className="bg-blue-500 p-2 rounded-full"
          onPress={handleAddNew}
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1">
        {appointments.length > 0 ? (
          appointments.map((appointment) => (
            <ItemCard
              key={appointment.id}
              item={appointment}
              section="appointments"
              onEdit={() => handleEdit(appointment)}
              onDelete={() => handleDelete(appointment.id)}
            />
          ))
        ) : (
          <Text className="text-gray-500 text-center py-6">
            No appointments scheduled.
          </Text>
        )}
      </ScrollView>

      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View className="flex-1 justify-end bg-black bg-opacity-50">
          <View className="bg-white rounded-t-lg">
            <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
              <Text className="text-xl font-bold">
                {isEditMode ? "Edit Appointment" : "Add New Appointment"}
              </Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Ionicons name="close" size={24} />
              </TouchableOpacity>
            </View>

            <AppointmentForm
              initialData={currentAppointment || undefined}
              onSubmit={handleSubmit}
              onCancel={() => setIsModalVisible(false)}
              isEditMode={isEditMode}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};
