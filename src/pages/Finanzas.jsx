import { useEffect, useState } from 'react'
import { supabase } from '../supabase.js'
import { s, colores } from '../estilos.js'

const c = colores.finanzas

function Finanzas() {
  const [movimientos, setMovimientos] = useState([])
  const [cuentas, setCuentas] = useState([])
  const [loading, setLoading] = useState(true)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [mostrarCuenta, setMostrarCuenta] = useState(false)
  const [filtroMes, setFiltroMes] = useState(new Date().toISOString().slice(0, 7))
  const [form, setForm] = useState({ fecha: new Date().toISOString().split('T')[0], tipo: 'ingreso', categoria: '', descripcion: '', monto: '', cuenta_id: '', comprobante: '' })
  const [formCuenta, setFormCuenta] = useState({ banco: '', tipo: 'caja_ahorro', numero: '', cbu: '', saldo: '0' })

  const categorias = { ingreso: ['cobro_cliente','otro_ingreso'], egreso: ['sueldos','insumos','transporte','servicios','impuestos','alquiler','otro_egreso'] }

  useEffect(() => { cargarDatos() }, [])

  async function cargarDatos() {
    setLoading(true)
    const [{ data: movData }, { data: cuentasData }] = await Promise.all([
      supabase.from('movimientos_financieros').select('*').order('fecha', { ascending: false }),
      supabase.from('cuentas_bancarias').select('*').eq('activa', true)
    ])
    if (movData) setMovimientos(movData)
    if (cuentasData) setCuentas(cuentasData)
    setLoading(false)
  }

  async function guardarMovimiento(e) {
    e.preventDefault()
    const { error } = await supabase.from('movimientos_financieros').insert([{ ...form, monto: parseFloat(form.monto), cuenta_id: form.cuenta_id || null }])
    if (error) { alert('Error: ' + error.message); return }
    setMostrarForm(false)
    setForm({ fecha: new Date().toISOString().split('T')[0], tipo: 'ingreso', categoria: '', descripcion: '', monto: '', cuenta_id: '', comprobante: '' })
    cargarDatos()
  }

  async function guardarCuenta(e) {
    e.preventDefault()
    const { error } = await supabase.from('cuentas_bancarias').insert([{ ...formCuenta, saldo: parseFloat(formCuenta.saldo)||0 }])
    if (error) { alert('Error: ' + error.message); return }
    setMostrarCuenta(false)
    setFormCuenta({ banco:'', tipo:'caja_ahorro', numero:'', cbu:'', saldo:'0' })
    cargarDatos()
  }

  const movMes = movimientos.filter(m => m.fecha && m.fecha.startsWith(filtroMes))
  const totalIngresos = movMes.filter(m => m.tipo === 'ingreso').reduce((a, m) => a + Number(m.monto), 0)
  const totalEgresos = movMes.filter(m => m.tipo === 'egreso').reduce((a, m) => a + Number(m.monto), 0)
  const balance = totalIngresos - totalEgresos
  const saldoTotal = cuentas.reduce((a, ct) => a + Number(ct.saldo), 0)

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={s.cabecera(c.gradient)}>
        <div>
          <h3 style={s.cabeceraTexto}>📊 Finanzas</h3>
          <p style={s.cabeceraSubtexto}>{movimientos.length} movimientos registrados</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button style={{ ...s.btnPrimario('rgba(255,255,255,0.2)'), border: '1px solid rgba(255,255,255,0.4)' }} onClick={() => setMostrarCuenta(true)}>+ Cuenta</button>
          <button style={s.btnPrimario('rgba(255,255,255,0.25)')} onClick={() => setMostrarForm(!mostrarForm)}>{mostrarForm ? '✕ Cancelar' : '+ Movimiento'}</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px', marginBottom: '20px' }}>
        <div style={{ ...s.card, background: '#f0fdf4' }}><p style={{ ...s.label, color: '#059669' }}>Ingresos del mes</p><p style={{ fontSize: '20px', fontWeight: '800', color: '#059669', margin: 0 }}>{totalIngresos.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}</p></div>
        <div style={{ ...s.card, background: '#fff1f2' }}><p style={{ ...s.label, color: '#dc2626' }}>Egresos del mes</p><p style={{ fontSize: '20px', fontWeight: '800', color: '#dc2626', margin: 0 }}>{totalEgresos.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}</p></div>
        <div style={{ ...s.card, background: balance >= 0 ? '#eff6ff' : '#fff7ed' }}><p style={{ ...s.label, color: balance >= 0 ? '#1d4ed8' : '#d97706' }}>Balance del mes</p><p style={{ fontSize: '20px', fontWeight: '800', color: balance >= 0 ? '#1d4ed8' : '#d97706', margin: 0 }}>{balance.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}</p></div>
        <div style={s.card}><p style={{ ...s.label, color: '#64748b' }}>Saldo en cuentas</p><p style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: 0 }}>{saldoTotal.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}</p></div>
      </div>

      {mostrarForm && (
        <div style={s.card}>
          <h4 style={{ margin: '0 0 20px', color: c.main, fontWeight: '700' }}>Nuevo movimiento</h4>
          <form onSubmit={guardarMovimiento}>
            <div style={s.grid2}>
              <div><label style={s.label}>Fecha</label><input type="date" style={s.input} value={form.fecha} onChange={e => setForm({...form, fecha: e.target.value})} required onFocus={e => e.target.style.borderColor = c.main} onBlur={e => e.target.style.borderColor = '#e2e8f0'} /></div>
              <div><label style={s.label}>Tipo</label><select style={s.input} value={form.tipo} onChange={e => setForm({...form, tipo: e.target.value, categoria: ''})}><option value="ingreso">Ingreso</option><option value="egreso">Egreso</option></select></div>
              <div><label style={s.label}>Categoría</label><select style={s.input} value={form.categoria} onChange={e => setForm({...form, categoria: e.target.value})} required><option value="">Seleccionar</option>{categorias[form.tipo].map(cat => <option key={cat} value={cat}>{cat.replace(/_/g,' ')}</option>)}</select></div>
              <div><label style={s.label}>Cuenta bancaria</label><select style={s.input} value={form.cuenta_id} onChange={e => setForm({...form, cuenta_id: e.target.value})}><option value="">Sin cuenta</option>{cuentas.map(ct => <option key={ct.id} value={ct.id}>{ct.banco} — {ct.tipo}</option>)}</select></div>
              <div><label style={s.label}>Monto ($)</label><input type="number" style={s.input} value={form.monto} onChange={e => setForm({...form, monto: e.target.value})} required onFocus={e => e.target.style.borderColor = c.main} onBlur={e => e.target.style.borderColor = '#e2e8f0'} /></div>
              <div><label style={s.label}>Comprobante</label><input style={s.input} value={form.comprobante} onChange={e => setForm({...form, comprobante: e.target.value})} placeholder="Nro. factura, recibo..." onFocus={e => e.target.style.borderColor = c.main} onBlur={e => e.target.style.borderColor = '#e2e8f0'} /></div>
              <div style={{ gridColumn: '1 / -1' }}><label style={s.label}>Descripción</label><input style={s.input} value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})} onFocus={e => e.target.style.borderColor = c.main} onBlur={e => e.target.style.borderColor = '#e2e8f0'} /></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
              <button type="button" style={s.btnSecundario} onClick={() => setMostrarForm(false)}>Cancelar</button>
              <button type="submit" style={s.btnPrimario(c.main)}>Guardar movimiento</button>
            </div>
          </form>
        </div>
      )}

      {mostrarCuenta && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ background: '#fff', borderRadius: '20px', padding: '28px', width: '100%', maxWidth: '400px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h4 style={{ margin: 0, fontWeight: '700', color: '#0f172a' }}>Nueva cuenta bancaria</h4>
              <button onClick={() => setMostrarCuenta(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#94a3b8' }}>✕</button>
            </div>
            <form onSubmit={guardarCuenta}>
              <div style={s.grid2}>
                <div style={{ gridColumn: '1 / -1' }}><label style={s.label}>Banco</label><input style={s.input} value={formCuenta.banco} onChange={e => setFormCuenta({...formCuenta, banco: e.target.value})} required onFocus={e => e.target.style.borderColor = c.main} onBlur={e => e.target.style.borderColor = '#e2e8f0'} /></div>
                <div><label style={s.label}>Tipo</label><select style={s.input} value={formCuenta.tipo} onChange={e => setFormCuenta({...formCuenta, tipo: e.target.value})}><option value="caja_ahorro">Caja de ahorro</option><option value="cuenta_corriente">Cuenta corriente</option><option value="caja_chica">Caja chica</option></select></div>
                <div><label style={s.label}>Saldo inicial ($)</label><input type="number" style={s.input} value={formCuenta.saldo} onChange={e => setFormCuenta({...formCuenta, saldo: e.target.value})} onFocus={e => e.target.style.borderColor = c.main} onBlur={e => e.target.style.borderColor = '#e2e8f0'} /></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
                <button type="button" style={s.btnSecundario} onClick={() => setMostrarCuenta(false)}>Cancelar</button>
                <button type="submit" style={s.btnPrimario(c.main)}>Guardar cuenta</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
        <input type="month" style={{ ...s.buscador, maxWidth: '200px' }} value={filtroMes} onChange={e => setFiltroMes(e.target.value)} />
        <span style={{ color: '#64748b', fontSize: '13px' }}>{movMes.length} movimientos este mes</span>
      </div>

      <div style={{ ...s.card, padding: 0, overflow: 'hidden' }}>
        {loading ? <div style={s.empty}>Cargando...</div>
        : movMes.length === 0 ? <div style={s.empty}>No hay movimientos este mes</div>
        : (
          <table style={s.tabla}>
            <thead><tr>{['Fecha','Tipo','Categoría','Descripción','Comprobante','Monto'].map(h => <th key={h} style={s.tablaCabecera(c.main)}>{h}</th>)}</tr></thead>
            <tbody>
              {movMes.map((m, i) => (
                <tr key={m.id} style={s.tablaFila(i)}>
                  <td style={s.tablaCell}>{new Date(m.fecha + 'T00:00:00').toLocaleDateString('es-AR')}</td>
                  <td style={s.tablaCell}><span style={s.badge(m.tipo === 'ingreso' ? '#d1fae5' : '#fee2e2', m.tipo === 'ingreso' ? '#059669' : '#dc2626')}>{m.tipo}</span></td>
                  <td style={s.tablaCell}>{(m.categoria||'').replace(/_/g,' ')}</td>
                  <td style={s.tablaCell}>{m.descripcion || '—'}</td>
                  <td style={{ ...s.tablaCell, fontSize: '12px', color: '#94a3b8' }}>{m.comprobante || '—'}</td>
                  <td style={{ ...s.tablaCellBold, textAlign: 'right', color: m.tipo === 'ingreso' ? '#059669' : '#dc2626' }}>
                    {m.tipo === 'ingreso' ? '+' : '-'}{Number(m.monto).toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default Finanzas
