import { NextResponse } from "next/server";
import { getSession } from "@/server/auth/session";
import {
  createOrderFromCart,
  attachCheckoutSessionToOrder,
} from "@/server/orders/orders.repo";
import {
  createCheckoutSession,
  type CheckoutLineItem,
} from "@/server/payments/stripePlaceholder";
import { checkoutSchema } from "@/lib/validation/schemas";
import { handleError, ValidationError } from "@/lib/errors/handler";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = checkoutSchema.safeParse(body);

    if (!parsed.success) {
      throw new ValidationError("Payload inválido", parsed.error.errors);
    }

    const session = await getSession();

    const { order, lineItems } = await createOrderFromCart({
      userId: session?.user?.id,
      currency: parsed.data.currency,
      items: parsed.data.items,
    });

    const checkoutItems: CheckoutLineItem[] = lineItems.map((item) => ({
      name: item.title,
      priceCents: item.unitPriceCents,
      quantity: item.quantity,
    }));

    const checkout = await createCheckoutSession({
      orderId: order.id,
      currency: order.currency,
      items: checkoutItems,
    });

    await attachCheckoutSessionToOrder({
      orderId: order.id,
      sessionId: checkout.sessionId,
    });

    return NextResponse.json(
      {
        orderId: order.id,
        status: order.status,
        totalCents: order.totalCents,
        currency: order.currency,
        checkoutUrl: checkout.checkoutUrl,
        sessionId: checkout.sessionId,
      },
      { status: 201 },
    );
  } catch (error) {
    const handled = handleError(error);
    return NextResponse.json(
      {
        error: handled.message,
        ...(handled.details ? { details: handled.details } : {}),
      },
      { status: handled.statusCode },
    );
  }
}
