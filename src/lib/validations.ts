// src/lib/validations.ts
import { z } from "zod"

export const reservationSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, { message: "Il nome è obbligatorio (min 2 caratteri)" }),

  phone: z
    .string()
    .trim()
    .min(7, { message: "Telefono non valido" }),

  // email facoltativa: consenti stringa vuota e trasformala in undefined
  email: z
    .string()
    .trim()
    .email({ message: "Email non valida" })
    .optional()
    .or(z.literal(""))
    .transform((v) => (v === "" ? undefined : v)),

  date: z.coerce.date(), // accetta "YYYY-MM-DD" e la converte in Date

  time: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: "Usa formato HH:MM" }),

  guests: z.coerce.number().int().min(1).max(20),

  // note facoltative: consenti vuoto
  notes: z
    .string()
    .max(500, { message: "Max 500 caratteri" })
    .optional()
    .or(z.literal(""))
    .transform((v) => (v === "" ? undefined : v)),

  // collegamento opzionale a Event
  eventId: z.coerce.number().int().positive().optional(),
})

export type ReservationInput = z.infer<typeof reservationSchema>

export function validateReservation(input: unknown) {
  const result = reservationSchema.safeParse(input)
  if (result.success) return { success: true as const, data: result.data }
  return {
    success: false as const,
    errors: result.error.flatten().fieldErrors,
  }
}
