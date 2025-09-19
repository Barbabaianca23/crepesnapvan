import { z } from "zod"

/**
 * Normalizza stringhe opzionali: "" -> undefined
 */
const emptyToUndefined = z.literal("").transform(() => undefined)

/**
 * Oggi (a mezzanotte) per validare che la data non sia nel passato
 */
const today = new Date()
today.setHours(0, 0, 0, 0)

/**
 * Schema prenotazione (form “Prenotazioni”)
 * - fullName: obbligatorio, min 2
 * - phone: obbligatorio, formato semplice internazionale
 * - email: opzionale
 * - date: obbligatoria, oggi o futura
 * - time: obbligatoria, formato HH:MM 24h
 * - guests: 1–20
 * - notes: opzionale, max 500
 * - eventId: opzionale (se prenoti per un evento specifico)
 * - items: opzionale, righe d’ordine (es. pre-ordine menù)
 */
export const reservationSchema = z.object({
  fullName: z
    .string({ required_error: "Il nome è obbligatorio" })
    .trim()
    .min(2, "Inserisci almeno 2 caratteri")
    .max(80, "Massimo 80 caratteri"),

  phone: z
    .string({ required_error: "Il telefono è obbligatorio" })
    .trim()
    .regex(/^\+?[0-9\s\-().]{7,20}$/, "Inserisci un numero di telefono valido"),

  email: z
    .string()
    .email("Email non valida")
    .optional()
    .or(emptyToUndefined),

  date: z
    .coerce
    .date({ required_error: "La data è obbligatoria" })
    .refine(d => {
      const onlyDate = new Date(d)
      onlyDate.setHours(0, 0, 0, 0)
      return onlyDate >= today
    }, "La data deve essere oggi o futura"),

  time: z
    .string({ required_error: "L’orario è obbligatorio" })
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Usa il formato 24h HH:MM"),

  guests: z
    .coerce
    .number({ required_error: "Numero ospiti obbligatorio" })
    .int("Deve essere un intero")
    .min(1, "Minimo 1 ospite")
    .max(20, "Massimo 20 ospiti"),

  notes: z
    .string()
    .max(500, "Massimo 500 caratteri")
    .optional()
    .or(emptyToUndefined),

  // Se hai Event con id INT autoincrement
  eventId: z
    .number()
    .int()
    .positive()
    .optional(),

  // Pre-ordini di menu (compatibile col tuo modello MenuItem con id INT)
  items: z.array(
    z.object({
      menuItemId: z.number().int().positive(),
      qty: z.coerce.number().int().min(1).max(20),
    })
  ).optional().default([]),
})

/**
 * Tipo TypeScript derivato dallo schema
 */
export type ReservationInput = z.infer<typeof reservationSchema>

/**
 * Helper: valida in sicurezza e torna { success, data?, errors? }
 */
export function validateReservation(input: unknown) {
  const result = reservationSchema.safeParse(input)
  if (result.success) {
    return { success: true as const, data: result.data }
  }
  const errors = result.error.flatten().fieldErrors
  return { success: false as const, errors }
}
