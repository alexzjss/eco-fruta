'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Minus, Plus, Search, ShoppingCart, Trash2, User, X } from 'lucide-react';
import { products } from '../data/products';
import { producers } from '../data/producers';
import { processCheckout } from '../lib/checkout';
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
  return <header className="navbar"><a href="#" className="brand"><span className="brand-mark">🌱</span><span><strong>Eco fruta</strong><small>feira virtual de orgânicos</small></span></a><nav><a href="#inicio">HOME</a><a href="#catalogo">CATÁLOGO</a><a href="#produtores">PRODUTORES</a></nav><div className="nav-actions">{searchOpen && <input autoFocus className="search-input" placeholder="Buscar produto..." onChange={(event) => onSearch(event.target.value)} />}{searchOpen ? <X size={21} onClick={() => setSearchOpen(false)} /> : <Search size={21} onClick={() => setSearchOpen(true)} />}<button className="icon-button" onClick={onCart} aria-label="Abrir carrinho"><ShoppingCart size={21} />{count > 0 && <span className="badge">{count}</span>}</button><User size={21} /></div></header>;
}

function ProductCard({ product, onAdd }: { product: Product; onAdd: (product: Product, quantity: number) => void }) {
  const [quantity, setQuantity] = useState(1);
  const step = product.unit === '100g' ? 1 : 1;
  return <article className="product-card"><div className="product-image">{product.imageUrl}</div><div className="product-info"><span className="product-category">{product.category}</span><h3>{product.name}</h3><p>{money(product.price)} <small>/ {product.unit}</small></p><div className="product-bottom"><div className="quantity"><button onClick={() => setQuantity(Math.max(1, quantity - step))}><Minus size={14} /></button><b>{quantity}</b><button onClick={() => setQuantity(Math.min(product.stock, quantity + step))}><Plus size={14} /></button></div><button className="add-button" onClick={() => onAdd(product, quantity)} aria-label={`Adicionar ${product.name}`}><ShoppingCart size={18} /></button></div></div></article>;
}

function ProducerCard({ producer, onContact }: { producer: Producer; onContact: (producer: Producer) => void }) {
  return <article className="producer-card"><img src={producer.photoUrl} alt={`Foto de ${producer.name}`} /><div><h3>{producer.name}</h3><p>{producer.bio}</p><small>{producer.yearsExperience} anos cultivando com amor</small><button className="outline-button" onClick={() => onContact(producer)}>Contatar produtor <ArrowRight size={15} /></button></div></article>;
}

function CartPanel({ onClose, onSuccess }: { onClose: () => void; onSuccess: (message: string) => void }) {
  const { items, updateQuantity, removeItem, subtotal, clear } = useCartStore();
  const [address, setAddress] = useState('');
  const [busy, setBusy] = useState(false);
  const shipping = items.length ? 8 : 0;
  const total = subtotal() + shipping;
  const checkout = async () => { setBusy(true); try { const result = await processCheckout({ items, shippingAddress: address, shippingFee: shipping, subtotal: subtotal(), total }); window.location.assign(result.initPoint); } catch (error) { onSuccess(error instanceof Error ? error.message : 'Não foi possível finalizar a compra.'); } finally { setBusy(false); } };
  return <div className="cart-overlay" onClick={onClose}><aside className="cart-panel" onClick={(event) => event.stopPropagation()}><div className="panel-heading"><div><span className="eyebrow">SEU PEDIDO</span><h2>Seu carrinho</h2></div><button className="close-button" onClick={onClose}><X /></button></div>{items.length === 0 ? <div className="empty-cart"><span>🧺</span><h3>Seu carrinho está vazio</h3><p>Escolha produtos fresquinhos para começar.</p></div> : <><div className="cart-items">{items.map((item) => <div className="cart-item" key={item.product.id}><span className="cart-emoji">{item.product.imageUrl}</span><div className="cart-item-main"><h3>{item.product.name}</h3><small>{money(item.product.price)} / {item.product.unit}</small><div className="cart-line"><div className="quantity"><button onClick={() => updateQuantity(item.product.id, item.quantity - 1)}><Minus size={13} /></button><b>{item.quantity}</b><button onClick={() => updateQuantity(item.product.id, item.quantity + 1)}><Plus size={13} /></button></div><strong>{money(item.product.price * item.quantity)}</strong></div><button className="remove-button" onClick={() => removeItem(item.product.id)}><Trash2 size={13} /> remover</button></div></div>)}</div><div className="order-summary"><div className="summary-row"><span>subtotal</span><strong>{money(subtotal())}</strong></div><div className="summary-row"><span>frete</span><strong>{money(shipping)}</strong></div><div className="summary-total"><span>total</span><strong>{money(total)}</strong></div><label htmlFor="address">Endereço de entrega</label><textarea id="address" value={address} onChange={(event) => setAddress(event.target.value)} placeholder="adicione seu endereço" /><button className="primary-button full" disabled={busy} onClick={checkout}>{busy ? 'processando...' : 'finalizar compra'}</button></div></>}</aside></div>;
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
  return <><Navbar count={items.reduce((sum, item) => sum + item.quantity, 0)} onCart={() => setCartOpen(true)} onSearch={setSearch} /><main><section className="hero" id="inicio"><div className="hero-copy"><span className="eyebrow">FRESCO. LOCAL. ORGÂNICO.</span><h1>Aproximando você dos pequenos <em>produtores orgânicos</em></h1><p>Uma feira virtual para você receber alimentos cheios de sabor, direto de quem planta com cuidado.</p><button className="primary-button" onClick={() => document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' })}>seja mais saudável <ArrowRight size={18} /></button></div><div className="hero-art"><div className="sun"></div><span className="hero-fruit fruit-one">🍊</span><span className="hero-fruit fruit-two">🥬</span><span className="hero-fruit fruit-three">🍅</span><div className="market-card"><span>☀️</span><b>colhido hoje</b><small>com carinho</small></div></div></section><section className="section categories-section"><SectionHeading eyebrow="NOSSO CATÁLOGO" title="Conheça nosso catálogo" /><div className="category-grid">{categories.map((item) => <button className={`category-card ${category === item.key ? 'selected' : ''}`} key={item.key} onClick={() => { setCategory(item.key); document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' }); }}><span className="category-icon">{item.icon}</span><h3>{item.label}</h3><p>{item.description}</p><span className="category-link">comprar agora <ArrowRight size={15} /></span></button>)}</div></section><section className="section catalog-section" id="catalogo"><SectionHeading eyebrow="FEIRA DA SEMANA" title={category === 'todas' ? 'Produtos fresquinhos' : `Nossas ${category}`} /><div className="filter-row"><div className="filters"><button className={category === 'todas' ? 'active' : ''} onClick={() => setCategory('todas')}>todos</button>{categories.map((item) => <button className={category === item.key ? 'active' : ''} key={item.key} onClick={() => setCategory(item.key)}>{item.label}</button>)}</div><span className="result-count">{visibleProducts.length} produtos encontrados</span></div><div className="product-grid">{visibleProducts.map((product) => <ProductCard key={product.id} product={product} onAdd={add} />)}</div></section><section className="section producers-section" id="produtores"><SectionHeading eyebrow="QUEM PLANTA, COLHE" title="Conheça nossos produtores" /><div className="producer-grid">{producers.map((producer) => <ProducerCard key={producer.id} producer={producer} onContact={contactProducer} />)}</div></section></main><footer><div className="brand footer-brand"><span className="brand-mark">🌱</span><span><strong>Eco fruta</strong><small>comida boa, de verdade</small></span></div><p>Feito com carinho para conectar você à terra.</p><span>© 2024 Eco fruta</span></footer>{cartOpen && <CartPanel onClose={() => setCartOpen(false)} onSuccess={notify} />}{contact && <div className="modal-backdrop" onClick={() => setContact(null)}><div className="contact-modal" onClick={(event) => event.stopPropagation()}><button className="close-button modal-close" onClick={() => setContact(null)}><X /></button><img src={contact.photoUrl} alt="" /><span className="eyebrow">FALAR COM PRODUTOR</span><h2>{contact.name}</h2><p>{contact.bio}</p><a className="primary-button full" href={`https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(`Olá ${contact.name}, vi seus produtos no Eco Fruta e gostaria de tirar uma dúvida!`)}`} target="_blank" rel="noreferrer">conversar pelo WhatsApp</a><small>{contact.contactEmail}</small></div></div>}{toast && <div className="toast">{toast}</div>}</>;
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return <div className="section-heading"><span className="accent-line"></span><span className="eyebrow">{eyebrow}</span><h2>{title}</h2></div>;
}
