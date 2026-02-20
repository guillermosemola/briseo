// Estilos compartidos para todos los módulos de Briseo

export const colores = {
  clientes:     { main: '#1e90ff', light: '#e0f0ff', gradient: 'linear-gradient(135deg, #1e90ff, #00b4d8)' },
  contratos:    { main: '#7c3aed', light: '#ede9fe', gradient: 'linear-gradient(135deg, #7c3aed, #a78bfa)' },
  personal:     { main: '#059669', light: '#d1fae5', gradient: 'linear-gradient(135deg, #059669, #34d399)' },
  agenda:       { main: '#d97706', light: '#fef3c7', gradient: 'linear-gradient(135deg, #d97706, #fbbf24)' },
  presupuestos: { main: '#0891b2', light: '#e0f7ff', gradient: 'linear-gradient(135deg, #0891b2, #22d3ee)' },
  facturacion:  { main: '#dc2626', light: '#fee2e2', gradient: 'linear-gradient(135deg, #dc2626, #f87171)' },
  insumos:      { main: '#0284c7', light: '#e0f2fe', gradient: 'linear-gradient(135deg, #0284c7, #38bdf8)' },
  finanzas:     { main: '#16a34a', light: '#dcfce7', gradient: 'linear-gradient(135deg, #16a34a, #4ade80)' },
  reportes:     { main: '#9333ea', light: '#f3e8ff', gradient: 'linear-gradient(135deg, #9333ea, #c084fc)' },
}

export const s = {
  // Cabecera del módulo
  cabecera: (gradient) => ({
    background: gradient,
    borderRadius: '16px',
    padding: '20px 24px',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
  }),
  cabeceraTexto: {
    color: '#ffffff',
    margin: 0,
    fontSize: '20px',
    fontWeight: '800'
  },
  cabeceraSubtexto: {
    color: 'rgba(255,255,255,0.8)',
    margin: '4px 0 0',
    fontSize: '13px'
  },

  // Botón primario
  btnPrimario: (color) => ({
    background: color,
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    padding: '10px 20px',
    fontWeight: '700',
    fontSize: '14px',
    cursor: 'pointer',
    boxShadow: `0 4px 12px ${color}55`,
    transition: 'all 0.2s',
    whiteSpace: 'nowrap'
  }),
  btnSecundario: {
    background: '#ffffff',
    color: '#64748b',
    border: '1.5px solid #e2e8f0',
    borderRadius: '10px',
    padding: '10px 20px',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  btnPeligro: {
    background: '#fff1f2',
    color: '#ef4444',
    border: '1px solid #fecdd3',
    borderRadius: '8px',
    padding: '6px 12px',
    fontWeight: '600',
    fontSize: '12px',
    cursor: 'pointer'
  },

  // Formulario
  card: {
    background: '#ffffff',
    borderRadius: '16px',
    padding: '24px',
    marginBottom: '20px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    border: '1px solid #f1f5f9'
  },
  label: {
    display: 'block',
    color: '#374151',
    fontSize: '12px',
    fontWeight: '700',
    marginBottom: '6px',
    textTransform: 'uppercase',
    letterSpacing: '0.4px'
  },
  input: {
    width: '100%',
    padding: '11px 14px',
    boxSizing: 'border-box',
    background: '#f8fafc',
    border: '1.5px solid #e2e8f0',
    borderRadius: '10px',
    color: '#0f172a',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
    fontFamily: "'Segoe UI', sans-serif"
  },
  grid2: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px'
  },
  grid3: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '16px'
  },

  // Tabla
  tabla: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: '0',
    fontSize: '13px'
  },
  tablaCabecera: (color) => ({
    background: color,
    color: '#ffffff',
    padding: '12px 16px',
    textAlign: 'left',
    fontWeight: '700',
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.4px'
  }),
  tablaFila: (i) => ({
    background: i % 2 === 0 ? '#ffffff' : '#f8fafc',
    transition: 'background 0.15s'
  }),
  tablaCell: {
    padding: '13px 16px',
    color: '#374151',
    borderBottom: '1px solid #f1f5f9'
  },
  tablaCellBold: {
    padding: '13px 16px',
    color: '#0f172a',
    fontWeight: '600',
    borderBottom: '1px solid #f1f5f9'
  },

  // Badge de estado
  badge: (bg, color) => ({
    background: bg,
    color: color,
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '700',
    display: 'inline-block'
  }),

  // Buscador
  buscador: {
    width: '100%',
    maxWidth: '320px',
    padding: '10px 16px',
    background: '#ffffff',
    border: '1.5px solid #e2e8f0',
    borderRadius: '10px',
    fontSize: '14px',
    outline: 'none',
    color: '#0f172a',
    fontFamily: "'Segoe UI', sans-serif"
  },

  // Empty state
  empty: {
    padding: '48px',
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: '14px'
  }
}
