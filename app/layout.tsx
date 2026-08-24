import './globals.css';

export const metadata = {
  title: 'Resident Service Platform',
  description: 'Staff case accountability and trusted knowledge platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
