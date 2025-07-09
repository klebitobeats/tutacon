
export default async function handler(req, res) {
  if (req.method === "POST") {
    console.log("Webhook recebido:", req.body);
    res.status(200).json({ received: true });
  } else {
    res.status(405).end();
  }
}
