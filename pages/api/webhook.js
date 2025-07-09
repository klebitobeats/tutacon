import { initializeApp } from 'firebase/app';
import { getDatabase, ref, update } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyAJoQx2wZon4EnSJTXBXZMnZ7f7K2aJQao",
  authDomain: "appfuncional-47d81.firebaseapp.com",
  databaseURL: "https://appfuncional-47d81-default-rtdb.firebaseio.com",
  projectId: "appfuncional-47d81",
  storageBucket: "appfuncional-47d81.appspot.com",
  messagingSenderId: "457133115242",
  appId: "1:457133115242:web:12d13f303afa05e8c18713",
  measurementId: "G-SCZSPQK4ZL"
};

// Inicializa o Firebase apenas uma vez
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      console.log("🔔 Webhook recebido:", req.body);

      const body = req.body;

      // Verifica se é notificação de pagamento aprovado
      if (body.type === 'payment' && body.data?.id) {
        const paymentId = body.data.id;

        // Busca os detalhes do pagamento no Mercado Pago
        const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
          headers: {
            Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}` // token real ou test no Vercel
          }
        });

        const paymentInfo = await mpRes.json();

        if (paymentInfo.status === 'approved') {
          // O campo external_reference contém o ID do pedido no Firebase
          const pedidoId = paymentInfo.external_reference;

          if (pedidoId) {
            const pedidoRef = ref(db, `pedidos/${pedidoId}`);

            await update(pedidoRef, { status: 'pago' });

            console.log(`✅ Status do pedido ${pedidoId} atualizado para "pago"`);
          } else {
            console.warn("❗ Pedido sem external_reference, não atualizado.");
          }
        }
      }

      res.status(200).json({ received: true });
    } catch (error) {
      console.error("❌ Erro no webhook:", error);
      res.status(500).json({ error: 'Erro no webhook' });
    }
  } else {
    res.status(405).end();
  }
}
