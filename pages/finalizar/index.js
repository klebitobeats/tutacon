import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'; // Reintroduzido o useRouter

export default function Finalizar() {
  const router = useRouter(); // Inicializado o useRouter
  const [valorTotalPedido, setValorTotalPedido] = useState(0); // Valor total do pedido vindo da URL
  const [activeTab, setActiveTab] = useState('delivery'); // 'delivery' ou 'retirada'
  const [isAddressSaved, setIsAddressSaved] = useState(false); // Estado para controlar se o endereço foi salvo
  const [savedAddressSummary, setSavedAddressSummary] = useState(''); // Resumo do endereço salvo

  const [addressForm, setAddressForm] = useState({
    cep: '',
    rua: '',
    numero: '',
    bairro: '',
    referencia: '',
  });

  const [personalDataForm, setPersonalDataForm] = useState({
    nome: '',
    whatsapp: '', // Alterado de 'numero' para 'whatsapp'
    email: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('pix'); // 'pix' ou 'dinheiro'
  const freteValue = 0.00; // Valor do frete fixo em R$ 0,00 por enquanto

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' ou 'error'

  // Endereço da loja para retirada
  const storeAddress = "Rua das Flores, 123, Centro, Recife - PE";

  // Efeito para obter o parâmetro 'valor' da URL e calcular o valor total
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const valorFromUrl = parseFloat(params.get('valor')) || 0;
    setValorTotalPedido(valorFromUrl);
  }, []);

  // Atualiza as opções de pagamento ao mudar a aba
  useEffect(() => {
    if (activeTab === 'delivery') {
      setPaymentMethod('pix'); // Apenas Pix para delivery
    } else {
      setPaymentMethod('pix'); // Define Pix como padrão para retirada, mas ambas as opções estarão visíveis
    }
  }, [activeTab]);

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
  };

  const handleAddressChange = (e) => {
    setAddressForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePersonalDataChange = (e) => {
    setPersonalDataForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSaveAddress = () => {
    // Validação básica para garantir que os campos não estão vazios
    const { cep, rua, numero, bairro } = addressForm;
    if (!cep || !rua || !numero || !bairro) {
      showMessage("Por favor, preencha todos os campos obrigatórios do endereço.", 'error');
      return;
    }

    // Cria um resumo do endereço para exibir quando recolhido
    const summary = `${addressForm.rua}, ${addressForm.numero}, ${addressForm.bairro}, CEP: ${addressForm.cep}`;
    setSavedAddressSummary(summary);
    setIsAddressSaved(true);
    showMessage("Endereço salvo com sucesso!", 'success');
  };

  const handleEditAddress = () => {
    setIsAddressSaved(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    // Validação dos dados pessoais
    const { nome, whatsapp, email } = personalDataForm;
    if (!nome || !whatsapp || !email) {
      showMessage("Por favor, preencha todos os seus dados pessoais.", 'error');
      return;
    }

    // Validação do endereço para delivery
    if (activeTab === 'delivery' && !isAddressSaved) {
      showMessage("Por favor, salve o endereço para continuar.", 'error');
      return;
    }

    // Lógica de envio para a API Pix
    try {
      const res = await fetch('/api/pix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...personalDataForm,
          valor: (valorTotalPedido + freteValue).toFixed(2),
          tipoEntrega: activeTab,
          endereco: activeTab === 'delivery' ? addressForm : storeAddress,
          formaPagamento: paymentMethod,
        })
      });
      const data = await res.json();
      if (data && data.init_point) {
        // Redireciona para a página pix com o QR Code e o valor usando router.push
        router.push(`/pix?qr=${encodeURIComponent(data.init_point)}&valor=${(valorTotalPedido + freteValue).toFixed(2)}`);
      } else {
        showMessage("Erro ao gerar QR Code. Tente novamente.", 'error');
      }
    } catch (error) {
      console.error("Erro na requisição da API Pix:", error);
      showMessage("Erro de conexão. Verifique sua internet e tente novamente.", 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-800 flex items-center justify-center p-4 font-inter">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center transform transition-all duration-500 hover:scale-105">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6 tracking-tight"> {/* Diminuído para text-3xl */}
          Finalizar Pedido
        </h1>

        {/* Abas de Delivery/Retirada */}
        <div className="flex justify-center mb-6 bg-gray-100 rounded-xl p-1 shadow-inner">
          <button
            onClick={() => setActiveTab('delivery')}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all duration-300 ${
              activeTab === 'delivery' ? 'bg-purple-600 text-white shadow-md' : 'bg-transparent text-gray-600 hover:bg-gray-200'
            }`}
          >
            Delivery
          </button>
          <button
            onClick={() => setActiveTab('retirada')}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all duration-300 ${
              activeTab === 'retirada' ? 'bg-purple-600 text-white shadow-md' : 'bg-transparent text-gray-600 hover:bg-gray-200'
            }`}
          >
            Retirada
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6"> {/* Aumentado space-y para melhor espaçamento */}
          {/* Seção de Endereço (apenas para Delivery) */}
          {activeTab === 'delivery' && (
            <div className="p-4 border border-gray-200 rounded-xl bg-gray-50 shadow-sm text-left">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex justify-between items-center">
                Endereço de Entrega
                {isAddressSaved && (
                  <button
                    type="button"
                    onClick={handleEditAddress}
                    className="text-blue-600 hover:text-blue-800 text-sm font-semibold flex items-center focus:outline-none"
                  >
                    Editar <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-edit ml-1"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                )}
              </h2>
              {isAddressSaved ? (
                <div className="animate-fade-in">
                  <p className="text-gray-700 font-medium">{savedAddressSummary}</p>
                  <button
                    type="button"
                    onClick={handleEditAddress}
                    className="text-gray-600 hover:text-gray-900 text-sm mt-2 flex items-center focus:outline-none"
                  >
                    Ver Detalhes
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down ml-1 transform rotate-0 transition-transform duration-300">
                      <path d="m6 9 6 6 6-6"/>
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="space-y-3 animate-fade-in">
                  <input
                    required
                    type="text"
                    name="cep"
                    placeholder="CEP"
                    value={addressForm.cep}
                    onChange={handleAddressChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                  />
                  <input
                    required
                    type="text"
                    name="rua"
                    placeholder="Rua"
                    value={addressForm.rua}
                    onChange={handleAddressChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                  />
                  <input
                    required
                    type="text"
                    name="numero"
                    placeholder="Número"
                    value={addressForm.numero}
                    onChange={handleAddressChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                  />
                  <input
                    required
                    type="text"
                    name="bairro"
                    placeholder="Bairro"
                    value={addressForm.bairro}
                    onChange={handleAddressChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                  />
                  <input
                    type="text"
                    name="referencia"
                    placeholder="Ponto de Referência (Opcional)"
                    value={addressForm.referencia}
                    onChange={handleAddressChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={handleSaveAddress}
                    className="mt-4 bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-lg shadow-md text-sm transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50"
                  >
                    Salvar Endereço
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Seção de Endereço da Loja (apenas para Retirada) */}
          {activeTab === 'retirada' && (
            <div className="p-4 border border-gray-200 rounded-xl bg-gray-50 shadow-sm text-left animate-fade-in">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Endereço da Loja</h2>
              <p className="text-gray-700 font-medium">{storeAddress}</p>
              <p className="text-sm text-gray-500 mt-2">Seu pedido estará pronto para retirada neste endereço.</p>
            </div>
          )}

          {/* Seção de Forma de Pagamento */}
          <div className="p-4 border border-gray-200 rounded-xl bg-gray-50 shadow-sm text-left">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Forma de Pagamento</h2>
            <div className="space-y-3">
              <label className="flex items-center text-gray-700">
                <input
                  type="radio"
                  name="payment"
                  value="pix"
                  checked={paymentMethod === 'pix'}
                  onChange={() => setPaymentMethod('pix')}
                  className="form-radio h-5 w-5 text-purple-600 focus:ring-purple-500"
                />
                <span className="ml-2">Pix</span>
              </label>
              {activeTab === 'retirada' && (
                <label className="flex items-center text-gray-700">
                  <input
                    type="radio"
                    name="payment"
                    value="dinheiro"
                    checked={paymentMethod === 'dinheiro'}
                    onChange={() => setPaymentMethod('dinheiro')}
                    className="form-radio h-5 w-5 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="ml-2">Dinheiro (pagamento na retirada)</span>
                </label>
              )}
            </div>
          </div>

          {/* Seção de Dados Pessoais */}
          <div className="p-4 border border-gray-200 rounded-xl bg-gray-50 shadow-sm text-left">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Seus Dados</h2>
            <div className="space-y-3">
              <input
                required
                type="text"
                name="nome"
                placeholder="Nome Completo"
                value={personalDataForm.nome}
                onChange={handlePersonalDataChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
              />
              <input
                required
                type="tel"
                name="whatsapp"
                placeholder="WhatsApp (DDD + Número)"
                value={personalDataForm.whatsapp}
                onChange={handlePersonalDataChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
              />
              <input
                required
                type="email"
                name="email"
                placeholder="E-mail"
                value={personalDataForm.email}
                onChange={handlePersonalDataChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
              />
            </div>
          </div>

          {/* Resumo do Pedido e Frete */}
          <div className="mt-6 text-xl font-bold text-gray-800 flex justify-between items-center">
            <p>Frete:</p>
            <p>R$ {freteValue.toFixed(2).replace('.', ',')}</p>
          </div>
          <div className="text-2xl font-bold text-gray-900 flex justify-between items-center">
            <p>Valor Total:</p>
            <p className="text-purple-700">R$ {(valorTotalPedido + freteValue).toFixed(2).replace('.', ',')}</p>
          </div>
          
          {message && (
            <div className={`mt-4 p-3 rounded-lg text-white ${messageType === 'error' ? 'bg-red-500' : 'bg-green-500'} animate-fade-in`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            className="mt-6 w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50"
          >
            Finalizar Pedido
          </button>
        </form>
      </div>

      {/* Estilos de Animação para Tailwind CSS */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

