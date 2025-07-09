// pages/api/pix.js
import { MercadoPagoConfig, Payment } from 'mercadopago';

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});
const payment = new Payment(client);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ erro: 'Método não permitido' });
  }

  try {
    const { valor, email, nome, sobrenome, cpf } = req.body;

    if (!valor || isNaN(valor) || parseFloat(valor) <= 0) {
      return res.status(400).json({ erro: 'Valor inválido' });
    }

    const response = await payment.create({
      body: {
        transaction_amount: parseFloat(valor),
        description: 'Pagamento via Pix',
        payment_method_id: 'pix',
        payer: {
          email: email || 'cliente@exemplo.com',
          first_name: nome || 'Nome',
          last_name: sobrenome || 'Sobrenome',
          identification: {
            type: 'CPF',
            number: cpf || '00000000000',
          },
        },
      },
    });

    return res.status(200).json({
      qr_code: response.point_of_interaction.transaction_data.qr_code,
      qr_code_base64: response.point_of_interaction.transaction_data.qr_code_base64,
      status: response.status,
    });
  } catch (error) {
    console.error('Erro ao criar pagamento:', error);
    return res.status(500).json({ erro: 'Erro ao criar pagamento' });
  }
}
