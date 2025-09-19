"use client"

import { useState } from "react"

export default function PrenotaPage() {
  const [status, setStatus] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus("Invio in corso…")
    const form = new FormData(e.currentTarget)
    const res = await fetch("/api/prenota", { method: "POST", body: form })
    if (res.ok) {
      setStatus("Prenotazione salvata ✅")
      e.currentTarget.reset()
    } else {
      const data = await res.json().catch(() => ({}))
      setStatus("Errore: " + (data?.message ?? "controlla i campi"))
    }
  }

  return (
    <main>
      <h1>Prenota</h1>
      <form onSubmit={onSubmit}>
        <div><label>Nome completo <input name="fullName" required minLength={2} /></label></div>
        <div><label>Telefono <input name="phone" required /></label></div>
        <div><label>Email <input name="email" type="email" /></label></div>
        <div><label>Data <input name="date" type="date" required /></label></div>
        <div><label>Ora <input name="time" type="time" required /></label></div>
        <div><label>Ospiti <input name="guests" type="number" min={1} max={20} required defaultValue={2} /></label></div>
        <div><label>Note <textarea name="notes" maxLength={500} /></label></div>
        <button type="submit">Invia</button>
      </form>
      {status && <p>{status}</p>}
    </main>
  )
}
