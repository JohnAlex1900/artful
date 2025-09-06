import { z } from "zod";

// ----------------------
// User Schema & Types
// ----------------------

export const insertUserSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;

export interface User extends InsertUser {
  id: string;
  // You can add createdAt / updatedAt later if needed
}

// ----------------------
// ContactSubmission Schema & Types
// ----------------------

export const insertContactSubmissionSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  projectType: z.string().optional(),
  message: z.string().min(1, "Message is required"),
});

export type InsertContactSubmission = z.infer<
  typeof insertContactSubmissionSchema
>;

export interface ContactSubmission extends InsertContactSubmission {
  id: string;
  createdAt: Date;
}
