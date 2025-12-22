import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Fixoo',
  description: 'Professional ustalar va mijozlar uchun platform',
  icons: {
    icon: '/fixoo_icon.png',
    shortcut: '/fixoo_icon.png',
    apple: '/fixoo_icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
