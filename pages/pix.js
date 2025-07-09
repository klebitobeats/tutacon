// pages/pix.js
import React, { useEffect, useState } from 'react';

export default function Pix() {
  const [qr, setQr] = useState(null);
  const [value, setValue] = useState(null);
  const [receiverName, setReceiverName] = useState(null);
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setQr(params.get('qr'));
      setValue(params.get('valor'));
      setReceiverName(params.get('receiverName'));
      setIsBrowser(true);
    }
  }, []);

  if (!isBrowser) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Pagamento via Pix</h1>
        {receiverName && <p className="mb-2">Para: {receiverName}</p>}
        {value && <p className="mb-4">Valor: R$ {parseFloat(value).toFixed(2).replace('.', ',')}</p>}
        {qr ? (
          <>
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?data=${qr}&size=300x300`}
              alt="QR Code Pix"
              className="mx-auto mb-4"
            />
            <p className="text-sm text-gray-500 break-all">{qr}</p>
          </>
        ) : (
          <p className="text-red-500">QR Code não encontrado.</p>
        )}
      </div>
    </div>
  );
}
