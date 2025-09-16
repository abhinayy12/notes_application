import './globals.css'

export const metadata = {
  title: 'Notes SaaS',
  description: 'Multi-tenant Notes SaaS App',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">{children}</body>
    </html>
  )
}