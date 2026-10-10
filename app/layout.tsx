import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = { title: 'Eco fruta | Feira virtual de orgânicos', description: 'Orgânicos frescos direto de pequenos produtores.' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
