
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  const handleAdd = (produto) => {
    router.push(`/finalizar?produto=${encodeURIComponent(produto.nome)}&valor=${produto.valor}`);
  };

  const produtos = [
    { nome: 'Açaí 300ml', descricao: 'Delicioso açaí na tigela com frutas', valor: 10 },
    { nome: 'Açaí 500ml', descricao: 'Açaí completo com banana e granola', valor: 15 },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h1>Produtos</h1>
      {produtos.map((produto, i) => (
        <div key={i} style={{ marginBottom: 20, border: '1px solid #ccc', padding: 10 }}>
          <h2>{produto.nome}</h2>
          <p>{produto.descricao}</p>
          <p><strong>R${produto.valor}</strong></p>
          <button onClick={() => handleAdd(produto)}>Adicionar</button>
        </div>
      ))}
    </div>
  );
}
