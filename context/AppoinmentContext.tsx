import React, { createContext, useState, useContext, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { Appointment } from "../types/caretaker";
import { appointmentService } from "../services/caretaker/appoinmentService";

// Key for storing data in SecureStore
const APPOINTMENTS_STORAGE_KEY = "caretaker_appointments";

interface AppointmentContextType {
  appointments: Appointment[];
  addAppointment: (
    data: Pick<
      Appointment,
      "doctor_name" | "specialty" | "appointment_time" | "location"
    >
  ) => Promise<void>;
  updateAppointment: (id: number, data: Appointment) => Promise<void>;
  deleteAppointment: (id: number) => Promise<void>;
  isLoading: boolean;
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(
  undefined
);

export const AppointmentProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load appointments from backend when component mounts
  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const fetchedAppointments =
          await appointmentService.getAllAppointments();
        setAppointments(fetchedAppointments);
      } catch (error) {
        console.error("Error loading appointments from backend:", error);
        // Fallback to stored appointments if backend fails
        try {
          const storedAppointments = await SecureStore.getItemAsync(
            APPOINTMENTS_STORAGE_KEY
          );
          if (storedAppointments) {
            setAppointments(JSON.parse(storedAppointments));
          }
        } catch (storageError) {
          console.error(
            "Error loading appointments from storage:",
            storageError
          );
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadAppointments();
  }, []);

  // Save appointments to SecureStore whenever they change
  useEffect(() => {
    const saveAppointments = async () => {
      try {
        await SecureStore.setItemAsync(
          APPOINTMENTS_STORAGE_KEY,
          JSON.stringify(appointments)
        );
      } catch (error) {
        console.error("Error saving appointments to storage:", error);
      }
    };

    // Don't save initial load or empty array
    if (!isLoading && appointments.length > 0) {
      saveAppointments();
    }
  }, [appointments, isLoading]);

  const addAppointment = async (
    data: Pick<
      Appointment,
      "doctor_name" | "specialty" | "appointment_time" | "location"
    >
  ): Promise<void> => {
    try {
      console.log(
        "Creating appointment with data:",
        JSON.stringify(data, null, 2)
      );
      const newAppointment = await appointmentService.createAppointment(data);
      console.log("Appointment created successfully:", newAppointment);
      setAppointments((prev) => [...prev, newAppointment]);
      // Don't return anything - just void
    } catch (error: any) {
      const errorMessage = error.message || "Failed to create appointment";
      console.error("Error creating appointment:", errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateAppointment = async (id: number, data: Appointment) => {
    try {
      const updatedAppointment = await appointmentService.updateAppointment(
        id,
        data
      );
      setAppointments(
        appointments.map((item) => (item.id === id ? updatedAppointment : item))
      );
    } catch (error) {
      console.error("Error updating appointment:", error);
      throw error;
    }
  };

  const deleteAppointment = async (id: number) => {
    try {
      await appointmentService.deleteAppointment(id);
      setAppointments(appointments.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting appointment:", error);
      throw error;
    }
  };

  return (
    <AppointmentContext.Provider
      value={{
        appointments,
        addAppointment,
        updateAppointment,
        deleteAppointment,
        isLoading,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
};

export const useAppointments = () => {
  const context = useContext(AppointmentContext);
  if (context === undefined) {
    throw new Error(
      "useAppointments must be used within an AppointmentProvider"
    );
  }
  return context;
};
