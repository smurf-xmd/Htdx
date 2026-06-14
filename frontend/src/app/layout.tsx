import type { Metadata } from 'next';
import './globals.css';
import ToastContainer from '@/components/common/Toast';

export const metadata: Metadata = {
  title: 'Host TalkDrive Pro - WhatsApp Bot Hosting',
  description: 'Manage and deploy WhatsApp bots on your VPS with ease',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background text-white">
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
