export const metadata = {
  title: "CrepeSnap Van",
  description: "Prenotazioni e menu",
}

export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props
  return (
    <html lang="it">
      <body style={{ fontFamily: "system-ui, sans-serif", margin: 0, padding: 16 }}>
        {children}
      </body>
    </html>
  )
}
