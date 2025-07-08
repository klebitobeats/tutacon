
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function Finalizar() {
  const router = useRouter();
  const { produto, valor } = router.query;

  const [form, setForm] = useState({
    nome: '', sobrenome: '', numero: '', cpf: '', email: ''
  });

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/pix', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, produto, valor })
    });
    const data = await res.json();
    if (data && data.init_point) {
      router.push(`/pix?qr=${encodeURIComponent(data.init_point)}`);
    } else {
      alert("Erro ao gerar QR Code.");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Finalizar Pedido</h1>
      <form onSubmit={handleSubmit}>
        <input required name="nome" placeholder="Nome" onChange={handleChange} /><br/>
        <input required name="sobrenome" placeholder="Sobrenome" onChange={handleChange} /><br/>
        <input required name="numero" placeholder="Número" onChange={handleChange} /><br/>
        <input required name="cpf" placeholder="CPF" onChange={handleChange} /><br/>
        <input required name="email" placeholder="E-mail" onChange={handleChange} /><br/><br/>
        <p><strong>Produto:</strong> {produto}</p>
        <p><strong>Valor:</strong> R${valor}</p>
        <button type="submit">Finalizar</button>
      </form>
    </div>
  );
}
