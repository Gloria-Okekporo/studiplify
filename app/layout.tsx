import { Outfit, Plus_Jakarta_Sans } from 'next/font/google'
import './global.css'

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-display',
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-body',
})

export const metadata = {
  title: 'Studiplify',
  description: 'AI Study Planner',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`light ${outfit.variable} ${jakarta.variable}`}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-background text-text-dark font-body antialiased selection:bg-accent-orange/20 min-h-screen">
        <div className="fixed inset-0 pointer-events-none -z-50 overflow-hidden">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-accent-orange/[0.08] rounded-full blur-[120px] mix-blend-multiply translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent-purple/[0.08] rounded-full blur-[100px] mix-blend-multiply -translate-x-1/3 translate-y-1/3"></div>
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px]"></div>
        </div>
        {children}
      </body>
    </html>
  )
}