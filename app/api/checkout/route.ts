import { NextResponse } from 'next/server';
import { products } from '../../../data/products';
import { OrderPayload } from '../../../types';

const ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN;

function isOrderPayload(value: unknown): value is OrderPayload {
  if (!value || typeof value !== 'object') return false;
  const order = value as Partial<OrderPayload>;
  const address = order.deliveryAddress;
  return Array.isArray(order.items) &&
    typeof order.shippingAddress === 'string' &&
    order.shippingAddress.trim().length >= 8 &&
    !!address &&
    typeof address === 'object' &&
    /^\d{8}$/.test(address.cep.replace(/\D/g, '')) &&
    typeof address.street === 'string' &&
    typeof address.number === 'string' &&
    address.number.trim().length > 0 &&
    typeof address.complement === 'string' &&
    typeof address.neighborhood === 'string' &&
    typeof address.city === 'string' &&
    typeof address.state === 'string';
}

export async function POST(request: Request) {
  if (!ACCESS_TOKEN) {
    return NextResponse.json({ error: 'Pagamento ainda não configurado. Adicione MERCADOPAGO_ACCESS_TOKEN na Vercel.' }, { status: 503 });
  }

  try {
    const payload: unknown = await request.json();
    if (!isOrderPayload(payload) || payload.items.length === 0) {
      return NextResponse.json({ error: 'Pedido inválido. Verifique os itens e o endereço.' }, { status: 400 });
    }

    const items = payload.items.map((item) => {
      const product = products.find((candidate) => candidate.id === item.product.id);
      if (!product || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > product.stock) {
        throw new Error('Um dos produtos não está disponível.');
      }
      return { id: product.id, title: product.name, quantity: item.quantity, currency_id: 'BRL', unit_price: product.price };
    });
    const subtotal = items.reduce((total, item) => total + item.unit_price * item.quantity, 0);
    const shippingFee = 8;
    const origin = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
    const preference = {
      items: [...items, { id: 'frete', title: 'Entrega Eco fruta', quantity: 1, currency_id: 'BRL', unit_price: shippingFee }],
      external_reference: `eco-${Date.now().toString(36)}`,
      back_urls: { success: `${origin}/?checkout=success`, failure: `${origin}/?checkout=failure`, pending: `${origin}/?checkout=pending` },
      auto_return: 'approved',
      notification_url: `${origin}/api/checkout/webhook`,
      metadata: {
        shipping_address: payload.shippingAddress,
        delivery_address: payload.deliveryAddress,
        subtotal,
        shipping_fee: shippingFee
      }
    };

    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: { Authorization: `Bearer ${ACCESS_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(preference),
      cache: 'no-store'
    });
    const result: { id?: string; init_point?: string; message?: string } = await response.json();
    if (!response.ok || !result.id || !result.init_point) {
      return NextResponse.json({ error: result.message || 'O Mercado Pago não aceitou o pedido.' }, { status: 502 });
    }
    return NextResponse.json({ orderId: result.id, initPoint: result.init_point });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Erro ao preparar o pagamento.' }, { status: 400 });
  }
}
