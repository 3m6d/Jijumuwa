import { Medication, Appointment } from "@/types/caretaker";

export const formatToNepaliSummary = (
    appointments: Appointment[],
    medications: Medication[]
  ): string => {
    const apptTexts = appointments.map((appt) => {
      const dateObj = new Date(appt.appointment_time);
      const timeStr = dateObj.toLocaleTimeString("ne-NP", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      const dateStr = dateObj.toLocaleDateString("ne-NP");
      return `तपाईंको अपोइन्टमेन्ट ${appt.doctor_name} (${appt.specialty}) सँग ${dateStr} मा ${timeStr} बजे ${appt.location} मा छ।`;
    });
  
    const medTexts = medications.map((med) => {
      return `${med.medication_name} (${med.dosage}) ${med.appropriate} ${med.frequency} का लागि लिनुहोस् (${med.duration})।`;
    });
  
    return [...apptTexts, ...medTexts].join("\n");
  };