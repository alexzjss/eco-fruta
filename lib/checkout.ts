import { OrderPayload } from '../types';

export async function processCheckout(orderPayload: OrderPayload): Promise<{ orderId: string }> {
  if (!orderPayload.items.length) throw new Error('Seu carrinho está vazio.');
  if (!orderPayload.shippingAddress.trim()) throw new Error('Informe um endereço de entrega.');
  await new Promise((resolve) => setTimeout(resolve, 500));
  return { orderId: `ECO-${Date.now().toString(36).toUpperCase()}` };
}
