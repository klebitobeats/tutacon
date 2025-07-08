
import { useRouter } from 'next/router';

export default function Pix() {
  const router = useRouter();
  const { qr } = router.query;

  return (
    <div style={{ padding: 20 }}>
      <h1>Pagamento via Pix</h1>
      {qr ? (
        <>
          <p>Escaneie o QR Code abaixo:</p>
          <img src={`https://api.qrserver.com/v1/create-qr-code/?data=${qr}&size=300x300`} alt="QR Code Pix" />
          <p style={{ wordBreak: 'break-all' }}>{qr}</p>
        </>
      ) : (
        <p>Carregando...</p>
      )}
    </div>
  );
}
