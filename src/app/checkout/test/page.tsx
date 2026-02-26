import { notFound } from "next/navigation";
import { Container } from "@/ui/components/Container";
import { markOrderPaid } from "@/server/orders/orders.repo";

export const revalidate = 0;

type SearchParams = {
  sessionId?: string;
  orderId?: string;
};

export default async function CheckoutTestPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { sessionId, orderId } = await searchParams;

  if (!sessionId || !orderId) {
    notFound();
  }

  // En modo test, marcamos la orden como pagada al aterrizar en esta página.
  await markOrderPaid({ orderId, stripePaymentIntentId: sessionId });

  return (
    <main>
      <Container>
        <section
          style={{
            paddingBlock: "80px",
            minHeight: "60vh",
            display: "grid",
            gap: "32px",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: "color-mix(in oklab, var(--color-ink) 60%, transparent)",
            }}
          >
            Checkout
          </div>
          <div
            style={{
              maxWidth: "32rem",
              display: "grid",
              gap: "20px",
            }}
          >
            <h1
              style={{
                margin: 0,
                fontFamily: "var(--font-serif)",
                fontWeight: 400,
                fontSize: "clamp(32px, 4vw, 44px)",
                lineHeight: "var(--leading-tight)",
                letterSpacing: "-0.015em",
              }}
            >
              Pedido confirmado en modo test.
            </h1>
            <p
              style={{
                margin: 0,
                color:
                  "color-mix(in oklab, var(--color-ink) 70%, transparent)",
                lineHeight: "var(--leading-loose)",
                letterSpacing: "0.005em",
              }}
            >
              Esta pantalla simula la página de retorno de Stripe en modo
              desarrollo. Tu pedido se ha marcado como{" "}
              <strong>pagado</strong> en la base de datos y puedes seguir
              trabajando el flujo visual y de backoffice.
            </p>
          </div>
        </section>
      </Container>
    </main>
  );
}

