import './globals.css';

export const metadata = {
  title: 'Muhammad Iqbal - Cybersecurity CV',
  description: 'Portfolio CV Muhammad Iqbal - Cybersecurity Expert',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}