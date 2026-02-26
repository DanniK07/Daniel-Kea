export type CheckoutLineItem = {
  name: string;
  priceCents: number;
  quantity: number;
};

export type CheckoutInput = {
  orderId: string;
  currency: string;
  items: CheckoutLineItem[];
};

export type CheckoutResult = {
  checkoutUrl: string;
  sessionId: string;
  provider: "stripe-test";
};

/**
 * Punto de integración con Stripe (modo test).
 *
 * Implementación actual:
 * - Modo test: genera una URL interna de prueba y un sessionId determinista.
 * - Lista para ser sustituida por la integración real de Stripe sin tocar el resto del código.
 */
export async function createCheckoutSession(
  input: CheckoutInput,
): Promise<CheckoutResult> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const sessionId = `stripe_test_session_${input.orderId}`;
  const checkoutUrl = `${baseUrl}/checkout/test?sessionId=${encodeURIComponent(
    sessionId,
  )}&orderId=${encodeURIComponent(input.orderId)}`;

  void input.items;
  void input.currency;

  return {
    checkoutUrl,
    sessionId,
    provider: "stripe-test",
  };
}

export default createCheckoutSession;