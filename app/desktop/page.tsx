import Link from 'next/link';
import {
  ArrowUpRight,
  Leaf,
  ShoppingBasket,
  Sparkles,
  Star,
} from 'lucide-react';
import './desktop.css';

const customers = [
  { initials: 'MA', color: '#e76f51' },
  { initials: 'JS', color: '#52b788' },
  { initials: 'LP', color: '#8f5ea8' },
  { initials: 'AC', color: '#f4a261' },
];

export default function DesktopHeroPreview() {
  return (
    <main className="desktop-preview">
      <header className="desktop-nav">
        <Link href="/" className="desktop-brand">
          <span className="desktop-brand-mark"><img src="/mascot.svg" alt="" /></span>
          <span><strong>Eco fruta</strong><small>feira virtual de orgânicos</small></span>
        </Link>
        <nav aria-label="Navegação principal">
          <a href="#inicio">INÍCIO</a>
          <a href="#catalogo">CATÁLOGO</a>
          <a href="#produtores">PRODUTORES</a>
        </nav>
      </header>

      <section className="desktop-hero" id="inicio">
        <div className="desktop-hero-copy">
          <span className="desktop-eyebrow"><Leaf size={15} /> frescor que aproxima</span>
          <h1>O melhor da terra,<br /><span>direto na sua mesa.</span></h1>
          <p>Conectamos você aos melhores pequenos produtores locais. Alimentos 100% orgânicos, colhidos no dia e entregues com cuidado na sua porta.</p>
          <div className="desktop-actions">
            <a className="desktop-primary" href="#catalogo">Explorar a Feira <ShoppingBasket size={18} /></a>
            <a className="desktop-secondary" href="#produtores">Conhecer Produtores <ArrowUpRight size={17} /></a>
          </div>
          <div className="desktop-social-proof">
            <div className="avatar-stack" aria-label="Clientes da Eco fruta">
              {customers.map((customer) => <span key={customer.initials} style={{ backgroundColor: customer.color }}>{customer.initials}</span>)}
            </div>
            <div className="proof-copy"><span><Star size={13} fill="currentColor" /> <b>4.9/5</b></span><small>Mais de 1.000 pedidos nesta semana</small></div>
          </div>
        </div>

        <div className="collage" aria-label="Cesta da estação com frutas e folhas frescas" role="img">
          <div className="collage-paper" />
          <div className="collage-scribble scribble-one" />
          <div className="collage-scribble scribble-two" />
          <Sparkles className="pop-star star-one" size={31} fill="#f4a261" />
          <Sparkles className="pop-star star-two" size={20} fill="#e76f51" />
          <span className="leaf-doodle doodle-one">✦</span>
          <span className="leaf-doodle doodle-two">✳</span>
          <div className="polaroid">
            <div className="polaroid-image" />
            <div className="polaroid-caption"><span>Cesta da Estação</span><small>— seleção de hoje —</small></div>
          </div>
          <div className="organic-sticker">100%<br /><span>orgânico</span></div>
          <div className="harvest-sticker"><Leaf size={16} /> Colhido Hoje <span>🚜</span></div>
        </div>
      </section>

      <section className="desktop-preview-note" id="catalogo">
        <span className="desktop-eyebrow">PRÉVIA DE DIREÇÃO VISUAL</span>
        <h2>Uma identidade mais madura, natural e próxima.</h2>
        <p>Escolha alimentos com história e fortaleça quem cultiva a nossa terra.</p>
      </section>
    </main>
  );
}
