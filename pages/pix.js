import React, { useEffect, useState } from 'react';

export default function Pix() {
  const [qr, setQr] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false); // Novo estado para feedback de cópia

  useEffect(() => {
    // Obter o parâmetro 'qr' diretamente da URL do navegador
    const params = new URLSearchParams(window.location.search);
    const qrCode = params.get('qr');
    setQr(qrCode);
    setIsLoading(false);
  }, []);

  // Função para copiar o texto para a área de transferência
  const copyToClipboard = () => {
    if (qr) {
      const el = document.createElement('textarea');
      el.value = qr;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true); // Define o estado para mostrar a mensagem de copiado
      setTimeout(() => {
        setCopied(false); // Esconde a mensagem após 2 segundos
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-800 flex items-center justify-center p-4 font-inter">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center transform transition-all duration-500 hover:scale-105">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6 tracking-tight">
          Pagamento via Pix
        </h1>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 mb-4"></div>
            <p className="text-xl text-gray-600">Carregando QR Code...</p>
          </div>
        ) : qr ? (
          <>
            <p className="text-lg text-gray-700 mb-4">
              Escaneie o QR Code abaixo para realizar o pagamento:
            </p>
            <div className="flex justify-center mb-6">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?data=${qr}&size=300x300`}
                alt="QR Code Pix"
                className="rounded-lg shadow-lg border-4 border-purple-300 transition-all duration-300 hover:shadow-xl"
                onError={(e) => {
                  e.target.onerror = null; // Evita loop infinito
                  e.target.src = 'https://placehold.co/300x300/E0BBE4/FFFFFF?text=QR+Code+Indisponível'; // Imagem de fallback
                }}
              />
            </div>
            <div className="bg-gray-100 p-4 rounded-lg break-all text-gray-800 text-sm font-mono select-all border border-gray-200 cursor-pointer" onClick={copyToClipboard}>
              {qr}
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Clique no código acima para copiá-lo.
            </p>

            <button
              onClick={copyToClipboard}
              className="mt-6 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
            >
              Copiar Código Pix
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
