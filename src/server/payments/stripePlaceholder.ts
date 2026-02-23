export type CheckoutInput = {
  currency: string;
  items: Array<{ productId: string; quantity: number }>;
};

export type CheckoutResult = {
  checkoutUrl: string;
  sessionId: string;
};

/**
 * Placeholder Stripe integration point.
 * In el futuro, este método creará una sesión de Stripe Checkout y devolverá la URL.
 */
export async function createCheckoutSession(_input: CheckoutInput): Promise<CheckoutResult> {
  void _input;
  throw new Error("Stripe aún no está integrado. Implementar createCheckoutSession().");
}

