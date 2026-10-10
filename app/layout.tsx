import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://ecofruta.com.br'),
  title: 'Feira Virtual Orgânica em São Paulo e Região | Eco Fruta',
  description: 'Compre frutas, legumes e verduras orgânicas de pequenos produtores de São Paulo e região, com entrega local e contato direto com quem cultiva.',
  keywords: ['feira orgânica', 'produtos orgânicos', 'São Paulo', 'Franco da Rocha', 'produtores locais', 'cesta orgânica'],
  openGraph: {
    title: 'Feira Virtual Orgânica em São Paulo e Região | Eco Fruta',
    description: 'Alimentos frescos, orgânicos e locais direto de pequenos produtores para a sua mesa.',
    url: 'https://ecofruta.com.br',
    siteName: 'Eco Fruta',
    locale: 'pt_BR',
    type: 'website',
    images: [{ url: '/mascot.svg', alt: 'Eco Fruta — feira virtual de orgânicos' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Feira Virtual Orgânica em São Paulo e Região | Eco Fruta',
    description: 'Alimentos frescos e orgânicos direto de pequenos produtores locais.',
    images: ['/mascot.svg'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
