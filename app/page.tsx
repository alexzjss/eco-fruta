'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Check, Leaf, Minus, Plus, Search, ShoppingCart, Trash2, User, X } from 'lucide-react';
import { products } from '../data/products';
import { producers } from '../data/producers';
import { Product, ProductCategory, Producer } from '../types';
import { useCartStore } from '../lib/cart';

const categories: { key: ProductCategory; label: string; icon: string; description: string }[] = [
  { key: 'frutas', label: 'Frutas', icon: '🍓', description: 'Coloridas, doces e cheias de vida.' },
  { key: 'legumes', label: 'Legumes', icon: '🥕', description: 'Para receitas cheias de sabor.' },
  { key: 'verduras', label: 'Verduras', icon: '🥬', description: 'Folhas fresquinhas para sua mesa.' }
];

const money = (value: number) => `R$ ${value.toFixed(2).replace('.', ',')}`;

function Navbar({ count, onCart, onSearch }: { count: number; onCart: () => void; onSearch: (value: string) => void }) {
  const [searchOpen, setSearchOpen] = useState(false);
  return <header className="navbar"><a href="#inicio" className="brand"><span className="brand-mark"><img src="/mascot.png" alt="" /></span><span><strong>Eco fruta</strong><small>feira virtual de orgânicos</small></span></a><nav><a href="#inicio">HOME</a><a href="#catalogo">CATÁLOGO</a><a href="#produtores">PRODUTORES</a></nav><div className="nav-actions">{searchOpen && <input autoFocus className="search-input" placeholder="Buscar produto..." aria-label="Buscar produto" onChange={(event) => onSearch(event.target.value)} />}{searchOpen ? <button className="nav-icon-button" aria-label="Fechar busca" onClick={() => { onSearch(''); setSearchOpen(false); }}><X size={21} /></button> : <button className="nav-icon-button" aria-label="Buscar produto" onClick={() => setSearchOpen(true)}><Search size={21} /></button>}<button className="icon-button" onClick={onCart} aria-label={`Abrir carrinho${count > 0 ? `, ${count} itens` : ''}`}><ShoppingCart size={21} />{count > 0 && <span className="badge">{count}</span>}</button><button className="nav-icon-button account-button" aria-label="Conta do cliente em breve" title="Conta do cliente em breve" disabled><User size={21} /></button></div></header>;
}

function ProductCard({ product, onAdd }: { product: Product; onAdd: (product: Product, quantity: number) => void }) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const producer = producers.find((item) => item.id === product.producerId);
  const quantityLabel = product.unit === '100g' ? `${quantity * 100}g` : `${quantity} ${product.unit}`;
  const addToCart = () => {
    onAdd(product, quantity);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  };
  return <article className={`product-card ${added ? 'is-added' : ''}`}>
    <div className="product-image">
      <img src={product.imageUrl} alt={product.name} loading="lazy" decoding="async" />
      <span className="product-category">{product.category}</span>
      <span className="product-stock"><Leaf size={12} /> {product.stock} em estoque</span>
    </div>
    <div className="product-info">
      <div className="product-heading"><h3>{product.name}</h3><span className="product-unit">por {product.unit}</span></div>
      {producer && <span className="product-producer">Produzido por <b>{producer.name}</b></span>}
      <div className="product-buy-row"><p className="product-price">{money(product.price)} <small>/ {product.unit}</small></p><div className="quantity" aria-label={`Quantidade: ${quantityLabel}`}><button aria-label={`Diminuir quantidade de ${product.name}`} onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus size={14} /></button><b>{quantityLabel}</b><button aria-label={`Aumentar quantidade de ${product.name}`} onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}><Plus size={14} /></button></div></div>
      <button className={`add-button ${added ? 'added' : ''}`} onClick={addToCart} aria-label={`Adicionar ${quantityLabel} de ${product.name}`}>{added ? <><Check size={17} /><span>adicionado ao carrinho</span></> : <><ShoppingCart size={17} /><span>adicionar ao carrinho</span></>}</button>
    </div>
  </article>;
}

function ProducerCard({ producer, onContact }: { producer: Producer; onContact: (producer: Producer) => void }) {
  return <article className="producer-card" role="button" tabIndex={0} onClick={() => onContact(producer)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') onContact(producer); }}><img src={producer.photoUrl} alt={`Foto de ${producer.name}`} loading="lazy" decoding="async" /><div><h3>{producer.name}</h3><p>{producer.bio}</p><small>{producer.yearsExperience} anos cultivando com amor</small><button className="outline-button" onClick={(event) => { event.stopPropagation(); onContact(producer); }}>Ver produtor <ArrowRight size={15} /></button></div></article>;
}

function CartPanel({ onClose }: { onClose: () => void }) {
  const { items, updateQuantity, removeItem } = useCartStore();
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);
  const groupedItems = items.reduce<Record<string, typeof items>>((groups, item) => {
    (groups[item.product.producerId] ||= []).push(item);
    return groups;
  }, {});
  const contactProducer = (producer: Producer, producerItems: typeof items) => {
    const selectedProducts = producerItems.map(({ product, quantity }) => `- ${product.name}: ${product.unit === '100g' ? `${quantity * 100}g` : `${quantity} ${product.unit}`}`).join('\n');
    const message = `Olá ${producer.name}! Gostaria de falar sobre estes produtos do Eco Fruta:\n${selectedProducts}`;
    window.open(`https://wa.me/${producer.whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };
  return <div className="cart-overlay" onClick={onClose}><aside className="cart-panel" role="dialog" aria-modal="true" aria-labelledby="cart-title" onClick={(event) => event.stopPropagation()}><div className="panel-heading"><div><span className="eyebrow">SEU PEDIDO</span><h2 id="cart-title">Seu carrinho</h2><small className="cart-caption">{items.length ? `${items.length} ${items.length === 1 ? 'produto' : 'produtos'} selecionado${items.length === 1 ? '' : 's'}` : 'Escolha seus favoritos'}</small></div><button className="close-button" onClick={onClose} aria-label="Fechar carrinho"><X /></button></div>{items.length === 0 ? <div className="empty-cart"><span>🧺</span><h3>Seu carrinho está vazio</h3><p>Escolha produtos fresquinhos para começar.</p></div> : <><div className="cart-items">{items.map((item) => <div className="cart-item" key={item.product.id}><img className="cart-emoji" src={item.product.imageUrl} alt="" loading="lazy" decoding="async" /><div className="cart-item-main"><div className="cart-item-heading"><div><h3>{item.product.name}</h3><small>{money(item.product.price)} / {item.product.unit}</small></div><strong>{money(item.product.price * item.quantity)}</strong></div><div className="cart-line"><div className="quantity" aria-label={`Quantidade de ${item.product.name}`}><button aria-label={`Diminuir ${item.product.name}`} onClick={() => updateQuantity(item.product.id, item.quantity - 1)}><Minus size={13} /></button><b>{item.product.unit === '100g' ? `${item.quantity * 100}g` : item.quantity}</b><button aria-label={`Aumentar ${item.product.name}`} onClick={() => updateQuantity(item.product.id, item.quantity + 1)}><Plus size={13} /></button></div><button className="remove-button" onClick={() => removeItem(item.product.id)}><Trash2 size={13} /> remover</button></div></div></div>)}</div><div className="order-summary"><div className="address-heading"><span className="eyebrow">FALE DIRETO</span><strong>Compre de quem cultiva</strong><small>Escolha um produtor para enviar seu pedido pelo WhatsApp.</small></div><div className="producer-contact-list">{Object.entries(groupedItems).map(([producerId, producerItems]) => { const producer = producers.find((item) => item.id === producerId); return producer ? <div className="producer-contact" key={producer.id}><div><strong>{producer.name}</strong><small>{producerItems.length} {producerItems.length === 1 ? 'produto selecionado' : 'produtos selecionados'}</small></div><button className="primary-button" onClick={() => contactProducer(producer, producerItems)}>falar pelo WhatsApp</button></div> : null; })}</div></div></>}</aside></div>;
}

export default function Home() {
  const [category, setCategory] = useState<ProductCategory | 'todas'>('todas');
  const [search, setSearch] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const [contact, setContact] = useState<Producer | null>(null);
  const [toast, setToast] = useState('');
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clear);
  const addItem = useCartStore((state) => state.addItem);
  const visibleProducts = useMemo(() => products.filter((product) => (category === 'todas' || product.category === category) && product.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())), [category, search]);
  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(''), 3200); };
  useEffect(() => {
    const checkoutStatus = new URLSearchParams(window.location.search).get('checkout');
    if (!checkoutStatus) return;
    if (checkoutStatus === 'success') {
      clearCart();
      notify('Pagamento aprovado! Obrigado por comprar com a Eco fruta.');
    } else if (checkoutStatus === 'failure') {
      notify('O pagamento não foi concluído. Seu carrinho foi preservado.');
    } else if (checkoutStatus === 'pending') {
      notify('Pagamento pendente. Aguarde a confirmação do Mercado Pago.');
    }
    window.history.replaceState({}, '', window.location.pathname);
  }, [clearCart]);
  const add = (product: Product, quantity: number) => { addItem(product, quantity); notify(`${product.name} adicionado ao carrinho`); };
  const contactProducer = (producer: Producer) => { setContact(producer); };
  return <><Navbar count={items.reduce((sum, item) => sum + item.quantity, 0)} onCart={() => setCartOpen(true)} onSearch={setSearch} /><main><section className="hero" id="inicio"><div className="hero-copy"><span className="eyebrow">FRESCO. LOCAL. ORGÂNICO.</span><h1>Aproximando você dos pequenos <em>produtores orgânicos</em></h1><p>Uma feira virtual para você receber alimentos cheios de sabor, direto de quem planta com cuidado.</p><button className="primary-button" onClick={() => document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' })}>seja mais saudável <ArrowRight size={18} /></button></div><div className="main-collage" role="img" aria-label="Cesta com frutas e folhas frescas"><div className="main-collage-paper"></div><div className="main-polaroid"><div className="main-polaroid-image"></div><div className="main-polaroid-caption"><span>Cesta da Estação</span><small>— seleção de hoje —</small></div></div><div className="main-organic-sticker">100%<small>orgânico</small></div><div className="main-harvest-sticker">🌿 Colhido hoje 🚜</div><span className="main-doodle main-doodle-one">✦</span><span className="main-doodle main-doodle-two">✳</span></div></section><section className="section categories-section"><SectionHeading eyebrow="NOSSO CATÁLOGO" title="Conheça nosso catálogo" /><div className="category-grid">{categories.map((item) => <button className={`category-card ${category === item.key ? 'selected' : ''}`} key={item.key} onClick={() => { setCategory(item.key); document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' }); }}><span className="category-icon">{item.icon}</span><h3>{item.label}</h3><p>{item.description}</p><span className="category-link">comprar agora <ArrowRight size={15} /></span></button>)}</div></section><section className="section catalog-section" id="catalogo"><div className="catalog-intro"><div><span className="eyebrow">FEIRA DA SEMANA</span><h2>{category === 'todas' ? 'Escolha o que vai para a sua mesa' : `Nossas ${category}`}</h2><p>Produtos selecionados, frescos e vendidos por quem cultiva.</p></div><span className="catalog-count"><b>{visibleProducts.length}</b> itens<br />disponíveis hoje</span></div><div className="filter-row"><div className="filters"><button className={category === 'todas' ? 'active' : ''} onClick={() => setCategory('todas')}>todos</button>{categories.map((item) => <button className={category === item.key ? 'active' : ''} key={item.key} onClick={() => setCategory(item.key)}>{item.label}</button>)}</div><span className="result-count" aria-live="polite">{visibleProducts.length} produtos encontrados</span></div><div className="product-grid">{visibleProducts.map((product) => <ProductCard key={product.id} product={product} onAdd={add} />)}</div></section><section className="section producers-section" id="produtores"><SectionHeading eyebrow="QUEM PLANTA, COLHE" title="Conheça nossos produtores" /><div className="producer-grid">{producers.map((producer) => <ProducerCard key={producer.id} producer={producer} onContact={contactProducer} />)}</div></section></main><footer><div className="brand footer-brand"><span className="brand-mark"><img src="/mascot.png" alt="" /></span><span><strong>Eco fruta</strong><small>comida boa, de verdade</small></span></div><p>Feito com carinho para conectar você à terra.</p><span>© 2024 Eco fruta</span></footer>{cartOpen && <CartPanel onClose={() => setCartOpen(false)} />}{contact && <div className="modal-backdrop" onClick={() => setContact(null)}><div className="contact-modal" role="dialog" aria-modal="true" aria-labelledby="contact-title" onClick={(event) => event.stopPropagation()}><button className="close-button modal-close" onClick={() => setContact(null)} aria-label="Fechar contato"><X /></button><img src={contact.photoUrl} alt={`Foto de ${contact.name}`} /><span className="eyebrow">FALAR COM PRODUTOR</span><h2 id="contact-title">{contact.name}</h2><p>{contact.bio}</p><small>{contact.yearsExperience} anos cultivando com amor</small><div className="producer-modal-products"><strong>Produtos deste produtor</strong><ul>{products.filter((product) => product.producerId === contact.id).map((product) => <li key={product.id}>{product.name} <span>{money(product.price)} / {product.unit}</span></li>)}</ul></div><a className="primary-button full" href={`https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(`Olá ${contact.name}, vi seus produtos no Eco Fruta e gostaria de tirar uma dúvida!`)}`} target="_blank" rel="noopener noreferrer">conversar pelo WhatsApp</a><small>{contact.contactEmail}</small></div></div>}{toast && <div className="toast" role="status" aria-live="polite">{toast}</div>}</>;
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return <div className="section-heading"><span className="accent-line"></span><span className="eyebrow">{eyebrow}</span><h2>{title}</h2></div>;
}
