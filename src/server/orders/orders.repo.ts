import { prisma } from "@/lib/db/prisma";
import { OrderStatus, type Order } from "@prisma/client";

export type CheckoutItemInput = {
  productId: string;
  quantity: number;
  size?: string;
};

export type ResolvedCheckoutItem = {
  productId: string;
  quantity: number;
  unitPriceCents: number;
  title: string;
  size?: string;
};

export type CreatedOrderResult = {
  order: Order;
  lineItems: ResolvedCheckoutItem[];
};

/**
 * Crea una orden en base de datos a partir del carrito.
 * - Valida existencia y estado activo de los productos.
 * - Valida stock disponible (si el producto tiene stock definido).
 * - Calcula el total en base a los precios actuales.
 * - Crea OrderItems para cada producto.
 * - Deja la orden en estado PENDING (a la espera de pago).
 */
export async function createOrderFromCart(params: {
  userId?: string;
  currency?: string;
  items: CheckoutItemInput[];
}): Promise<CreatedOrderResult> {
  const { userId, currency = "EUR", items } = params;

  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("El carrito está vacío.");
  }

  const normalized = items.map((item) => ({
    productId: String(item.productId),
    quantity: Number(item.quantity) || 0,
    size: item.size ? String(item.size).trim() : undefined,
  }));

  if (normalized.some((item) => item.quantity <= 0)) {
    throw new Error("Todas las cantidades deben ser mayores que cero.");
  }

  const productIds = Array.from(new Set(normalized.map((i) => i.productId)));

  const products = await prisma.product.findMany({
    where: {
      id: { in: productIds },
      isActive: true,
    },
  });

  if (products.length !== productIds.length) {
    throw new Error(
      "Alguno de los productos del carrito no existe o no está disponible.",
    );
  }

  const productMap = new Map(products.map((p) => [p.id, p]));

  const lineItems: ResolvedCheckoutItem[] = [];
  const orderItemsData: Array<{
    productId: string;
    quantity: number;
    priceCents: number;
    size?: string;
  }> = [];

  for (const item of normalized) {
    const product = productMap.get(item.productId);
    if (!product) {
      throw new Error("Producto no encontrado durante el checkout.");
    }

    // Validación de stock: si el producto tiene stock definido (no null), verificar disponibilidad
    if (product.stock != null) {
      if (item.quantity > product.stock) {
        throw new Error(
          `Stock insuficiente para "${product.title}". Disponible: ${product.stock}, solicitado: ${item.quantity}.`,
        );
      }
    }

    lineItems.push({
      productId: product.id,
      quantity: item.quantity,
      unitPriceCents: product.priceCents,
      title: product.title,
      size: item.size,
    });

    orderItemsData.push({
      productId: product.id,
      quantity: item.quantity,
      priceCents: product.priceCents,
      size: item.size,
    });
  }

  const totalCents = lineItems.reduce(
    (sum, item) => sum + item.unitPriceCents * item.quantity,
    0,
  );

  // Crear orden con items en una transacción
  const order = await prisma.order.create({
    data: {
      userId,
      currency,
      totalCents,
      status: OrderStatus.PENDING,
      orderItems: {
        create: orderItemsData,
      },
    },
  });

  return { order, lineItems };
}

export async function attachCheckoutSessionToOrder(params: {
  orderId: string;
  sessionId: string;
}) {
  const { orderId, sessionId } = params;
  return prisma.order.update({
    where: { id: orderId },
    data: { stripeCheckoutSessionId: sessionId },
  });
}

export async function markOrderPaid(params: {
  orderId: string;
  stripePaymentIntentId?: string;
}) {
  const { orderId, stripePaymentIntentId } = params;
  return prisma.order.update({
    where: { id: orderId },
    data: {
      status: OrderStatus.PAID,
      ...(stripePaymentIntentId
        ? { stripePaymentIntentId }
        : {}),
    },
  });
}

export async function markOrderCancelled(orderId: string) {
  return prisma.order.update({
    where: { id: orderId },
    data: {
      status: OrderStatus.CANCELLED,
    },
  });
}
