import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'

export const metadata: Metadata = {
    title: 'Private AI Cloud',
    description: 'Private AI Cloud',
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
