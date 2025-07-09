import { database } from '../firebase';
import { ref, onValue } from 'firebase/database';

import React, { useEffect, useState } from 'react';

export default function Pix() {
  const [qr, setQr] = useState(null);
  const [value, setValue] = useState(null); // Novo estado para o valor
  const [receiverName, setReceiverName] = useState(null); // Novo estado para o nome do recebedor
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false); // Novo estado para feedback de cópia

  useEffect(() => {

const pedidoId = new URLSearchParams(window.location.search).get("id");
if (pedidoId) {
  const pedidoRef = ref(database, `pedidos/${pedidoId}`);
  onValue(pedidoRef, (snapshot) => {
    const pedido = snapshot.val();
    if (pedido?.status === "pago") {
      window.location.href = "/obrigado";
    }
  });
}

    // Obter os parâmetros 'qr', 'valor' e 'receiverName' diretamente da URL do navegador
    const params = new URLSearchParams(window.location.search);
    const qrCode = params.get('qr');
    const paymentValue = params.get('valor');
    const name = params.get('receiverName');

    setQr(qrCode);
    setValue(paymentValue);
    setReceiverName(name);
    setIsLoading(false);
  }, []);

  const copyToClipboard = () => {
    if (qr) {
      const el = document.createElement('textarea');
      el.value = qr;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-800 flex items-center justify-center p-4 font-inter">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center transform transition-all duration-500 hover:scale-105">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6 tracking-tight">
          Pague via Pix
        </h1>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 mb-4"></div>
            <p className="text-xl text-gray-600">Carregando QR Code...</p>
          </div>
        ) : qr ? (
          <>
            {receiverName && (
              <p className="text-xl font-semibold text-gray-800 mb-2">
                Para: {receiverName}
              </p>
            )}
            {value && (
              <p className="text-2xl font-bold text-purple-700 mb-4">
                Valor: R$ {parseFloat(value).toFixed(2).replace('.', ',')}
              </p>
            )}
            <p className="text-lg text-gray-700 mb-4">
              Escaneie o QR Code abaixo para realizar o pagamento:
            </p>
            <div className="flex justify-center mb-6">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?data=${qr}&size=300x300`}
                alt="QR Code Pix"
                className="rounded-lg shadow-lg border-4 border-purple-300 transition-all duration-300 hover:shadow-xl"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://placehold.co/300x300/E0BBE4/FFFFFF?text=QR+Code+Indisponível';
                }}
              />
            </div>

            <button
              onClick={copyToClipboard}
              className="mt-6 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
            >
              Copiar e Colar Código Pix
            </button>

            {copied && (
              <p className="mt-4 text-green-600 font-semibold text-md animate-bounce">
                Código copiado com sucesso!
              </p>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-10">
            <p className="text-xl text-red-500">Nenhum QR Code encontrado na URL.</p>
            <p className="text-md text-gray-600 mt-2">Por favor, verifique se o parâmetro 'qr' está presente na URL.</p>
          </div>
        )}

        <div className="mt-8 text-sm text-gray-500">
          <p>&copy; 2025 Azai Pagamentos. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  );
}
