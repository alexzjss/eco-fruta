import { OrderPayload } from '../types';

export async function processCheckout(orderPayload: OrderPayload): Promise<{ orderId: string; initPoint: string }> {
  if (!orderPayload.items.length) throw new Error('Seu carrinho está vazio.');
  if (!orderPayload.deliveryAddress.number.trim()) throw new Error('Informe o número do endereço.');
  if (!orderPayload.shippingAddress.trim()) throw new Error('Informe um endereço de entrega.');

  const response = await fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderPayload)
  });
  const result: { orderId?: string; initPoint?: string; error?: string } = await response.json();
  if (!response.ok || !result.initPoint || !result.orderId) {
    throw new Error(result.error || 'Não foi possível iniciar o pagamento.');
  }
  return { orderId: result.orderId, initPoint: result.initPoint };
}
