
import { MercadoPagoConfig, Payment } from 'mercadopago';

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
const payment = new Payment(client);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ erro: 'Método não permitido' });
  }

  try {
    const valor = parseFloat(req.body.valor);

    if (!valor || valor <= 0) {
      return res.status(400).json({ erro: 'Valor inválido' });
    }

    const response = await payment.create({
      body: {
        transaction_amount: valor,
        description: 'Pagamento via Pix',
        payment_method_id: 'pix',
        payer: {
          email: req.body.email || 'cliente@exemplo.com',
          first_name: req.body.nome || 'Nome',
          last_name: req.body.sobrenome || 'Sobrenome',
          identification: {
            type: 'CPF',
            number: req.body.cpf || '00000000000'
          }
        }
      }
    });

    return res.status(200).json({ init_point: response.point_of_interaction.transaction_data.qr_code });
  } catch (error) {
    console.error('Erro ao criar pagamento:', error);
    return res.status(500).json({ erro: 'Erro ao criar pagamento' });
  }
}
