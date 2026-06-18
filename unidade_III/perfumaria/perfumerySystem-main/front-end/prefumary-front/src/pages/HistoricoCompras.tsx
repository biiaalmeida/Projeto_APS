import { useNavigate } from 'react-router-dom'

interface Compra { data: string; produtos: string[]; total: number }

const historicoMock: Record<string, Compra[]> = {
  'Maria Silva': [
    { data: '10/05/2025', produtos: ['Floratta Rose', 'Glamour'], total: 169.80 },
    { data: '22/03/2025', produtos: ['Lily'], total: 119.90 },
  ],
  'João Santos': [
    { data: '15/05/2025', produtos: ['Malbec Gold'], total: 149.90 },
  ],
}

export default function HistoricoCompras() {
  const navigate = useNavigate()
  const clientes = Object.keys(historicoMock)

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.topbar}>
          <span>🕐 Histórico de compras</span>
          <button style={styles.navBtn} onClick={() => navigate('/clientes')}>← Voltar</button>
        </div>
        <div style={styles.body}>
          {clientes.map((cliente, i) => (
            <div key={i} style={styles.clienteCard}>
              <div style={styles.clienteHeader}>
                <div style={styles.avatar}>{cliente[0]}</div>
                <span style={styles.clienteNome}>{cliente}</span>
              </div>
              {historicoMock[cliente].map((compra, j) => (
                <div key={j} style={styles.compraRow}>
                  <div>
                    <div style={styles.compraData}>{compra.data}</div>
                    <div style={styles.compraProdutos}>{compra.produtos.join(', ')}</div>
                  </div>
                  <span style={styles.compraTotal}>R$ {compra.total.toFixed(2)}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 },
  container: { background: '#fff', borderRadius: 12, width: '100%', maxWidth: 560, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', overflow: 'hidden' },
  topbar: { background: '#534AB7', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#fff', fontSize: 15, fontWeight: 500 },
  navBtn: { background: 'rgba(255,255,255,0.2)', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 12px', fontSize: 13, cursor: 'pointer' },
  body: { padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 },
  clienteCard: { border: '1px solid #eee', borderRadius: 10, overflow: 'hidden' },
  clienteHeader: { background: '#f9f9f9', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10 },
  avatar: { width: 32, height: 32, borderRadius: '50%', background: '#EEEDFE', color: '#534AB7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 500, fontSize: 14 },
  clienteNome: { fontWeight: 500, fontSize: 14, color: '#333' },
  compraRow: { padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f0f0f0' },
  compraData: { fontSize: 12, color: '#888', marginBottom: 2 },
  compraProdutos: { fontSize: 13, color: '#333' },
  compraTotal: { fontWeight: 500, fontSize: 14, color: '#534AB7' },
}