import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Appointment } from "../../types/caretaker";

interface AppointmentFormProps {
  initialData?: Appointment;
  onSubmit: (
    data:
      | Appointment
      | Pick<
          Appointment,
          "doctor_name" | "specialty" | "appointment_time" | "location"
        >
  ) => void;
  onCancel: () => void;
  isEditMode?: boolean;
}

// Define the form data type without ID for new appointments
type AppointmentFormData = Omit<Appointment, "id">;

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isEditMode = false,
}) => {
  const [formData, setFormData] = useState<AppointmentFormData>({
    doctor_name: initialData?.doctor_name || "",
    specialty: initialData?.specialty || "",
    appointment_time: initialData?.appointment_time || "",
    location: initialData?.location || "",
  });
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [mode, setMode] = useState<"date" | "time">("date");

  const handleChange = (field: keyof AppointmentFormData, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const showMode = (currentMode: "date" | "time") => {
    setShowDateTimePicker(true);
    setMode(currentMode);
  };

  const onDateTimeChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setSelectedDate(selectedDate);

      if (mode === "date") {
        // After date is selected, show time picker
        showMode("time");
      } else {
        // After time is selected, format and update the form
        setShowDateTimePicker(false);
        const formattedDateTime = selectedDate
          .toISOString()
          .slice(0, 16)
          .replace("T", " ");
        handleChange("appointment_time", formattedDateTime);
      }
    } else {
      setShowDateTimePicker(false);
    }
  };

  const showDateTimePickerModal = () => {
    showMode("date");
  };

  const validateForm = (): boolean => {
    // Validate Doctor's Name
    if (!formData.doctor_name.trim()) {
      Alert.alert("Validation Error", "Doctor Name is required.");
      return false;
    }

    // Validate Appointment Time
    if (!formData.appointment_time.trim()) {
      Alert.alert(
        "Validation Error",
        "Please select an appointment date and time."
      );
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    // const appointmentData: Appointment = {
    //   ...formData,
    //   id: isEditMode && initialData ? initialData.id : 0,
    // };
    const appointmentData = isEditMode
      ? { ...formData, id: initialData?.id }
      : formData;

    onSubmit(appointmentData);
  };

  return (
    <View className="p-4">
      <Text className="text-lg font-semibold mb-2">Appointment Details</Text>

      <TextInput
        className="border border-gray-300 rounded-lg p-2 mb-3"
        placeholder="Doctor Name"
        value={formData.doctor_name}
        onChangeText={(text) => handleChange("doctor_name", text)}
      />

      <TextInput
        className="border border-gray-300 rounded-lg p-2 mb-3"
        placeholder="Specialty"
        value={formData.specialty}
        onChangeText={(text) => handleChange("specialty", text)}
      />

      <TouchableOpacity
        className="border border-gray-300 rounded-lg p-2 mb-3"
        onPress={showDateTimePickerModal}
      >
        <Text
          className={formData.appointment_time ? "text-black" : "text-gray-400"}
        >
          {formData.appointment_time || "Select Appointment Date and Time"}
        </Text>
      </TouchableOpacity>

      {showDateTimePicker && (
        <DateTimePicker
          value={selectedDate}
          mode={mode}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onDateTimeChange}
          minimumDate={new Date()}
        />
      )}

      <TextInput
        className="border border-gray-300 rounded-lg p-2 mb-3"
        placeholder="Location"
        value={formData.location}
        onChangeText={(text) => handleChange("location", text)}
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
          <Text className="text-white">{isEditMode ? "Update" : "Save"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AppointmentForm;
