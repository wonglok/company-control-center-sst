import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'

export const metadata: Metadata = {
    title: 'Company Control Center',
    description: 'Company Control Center',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang='en'>
            <body className={`antialiased`}>
                {children}
                <Toaster />
            </body>
        </html>
    )
}
