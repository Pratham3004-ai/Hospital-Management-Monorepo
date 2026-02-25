import {
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

// =========================
// HOSPITALS
// =========================
export const hospitals = pgTable("hospitals", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  address: text("address"),
  city: text("city"),
  createdAt: timestamp("created_at").defaultNow(),
});

// =========================
// DOCTORS
// =========================
export const doctors = pgTable("doctors", {
  id: uuid("id").defaultRandom().primaryKey(),
  hospitalId: uuid("hospital_id")
    .notNull()
    .references(() => hospitals.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  specialization: text("specialization").notNull(),
  available: boolean("available").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// =========================
// PATIENTS
// =========================
export const patients = pgTable("patients", {
  id: uuid("id").defaultRandom().primaryKey(),
  fullName: text("full_name").notNull(),
  phone: text("phone"),
  createdAt: timestamp("created_at").defaultNow(),
});

// =========================
// APPOINTMENTS
// =========================
export const appointments = pgTable("appointments", {
  id: uuid("id").defaultRandom().primaryKey(),
  doctorId: uuid("doctor_id")
    .notNull()
    .references(() => doctors.id, { onDelete: "cascade" }),
  patientId: uuid("patient_id")
    .notNull()
    .references(() => patients.id, { onDelete: "cascade" }),
  appointmentDate: timestamp("appointment_date").notNull(),
  status: text("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});