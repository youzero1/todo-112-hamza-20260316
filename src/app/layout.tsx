import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Todo App',
  description: 'A fullstack Todo application built with Next.js and TypeORM'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, fontFamily: 'system-ui, -apple-system, sans-serif', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
        {children}
      </body>
    </html>
  );
}
