// app/api/prenota/route.ts
import { NextResponse } from "next/server"
import { prisma } from "../../../src/lib/db"
import { validateReservation } from "../../../src/lib/validations"

export async function POST(req: Request) {
  try {
    const form = await req.formData()

    const payload = {
      fullName: String(form.get("fullName") ?? ""),
      phone: String(form.get("phone") ?? ""),
      email: (form.get("email") ?? "") as string,
      date: String(form.get("date") ?? ""),
      time: String(form.get("time") ?? ""),
      guests: String(form.get("guests") ?? ""),
      notes: (form.get("notes") ?? "") as string,
    }

    const result = validateReservation(payload)
    if (!result.success) {
      return NextResponse.json(
        { message: "Dati non validi", errors: result.errors },
        { status: 400 }
      )
    }

    const d = result.data

    await prisma.booking.create({
      data: {
        fullName: d.fullName,
        phone: d.phone,
        email: d.email,
        date: new Date(d.date),
        time: d.time,
        guests: d.guests,
        notes: d.notes,
        eventId: d.eventId ?? null,
      },
    })

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ message: "Errore server" }, { status: 500 })
  }
}
