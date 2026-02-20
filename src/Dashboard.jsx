import { useState, useEffect } from 'react'
import { supabase } from './supabase.js'
import Clientes from './pages/Clientes.jsx'
import Contratos from './pages/Contratos.jsx'
import Personal from './pages/Personal.jsx'
import Agenda from './pages/Agenda.jsx'
import Presupuestos from './pages/Presupuestos.jsx'
import Facturacion from './pages/Facturacion.jsx'
import Insumos from './pages/Insumos.jsx'
import Finanzas from './pages/Finanzas.jsx'
import Costos from './pages/Costos.jsx'
import Sueldos from './pages/Sueldos.jsx'
import Proveedores from './pages/Proveedores.jsx'
import Reportes from './pages/Reportes.jsx'
import Usuarios from './pages/Usuarios.jsx'

const menuItems = [
  { id: 'inicio',       icon: '🏠', label: 'Inicio' },
  { id: 'clientes',     icon: '👥', label: 'Clientes' },
  { id: 'contratos',    icon: '📄', label: 'Contratos' },
  { id: 'personal',     icon: '👷', label: 'Personal' },
  { id: 'agenda',       icon: '📅', label: 'Agenda' },
  { id: 'presupuestos', icon: '💰', label: 'Presupuestos' },
  { id: 'facturacion',  icon: '🧾', label: 'Facturación' },
  { id: 'insumos',      icon: '🧴', label: 'Insumos' },
  { id: 'finanzas',     icon: '📊', label: 'Finanzas' },
  { id: 'costos',       icon: '📋', label: 'Costos' },
  { id: 'sueldos',      icon: '💼', label: 'Sueldos' },
  { id: 'proveedores',  icon: '🏭', label: 'Proveedores' },
  { id: 'reportes',     icon: '📈', label: 'Reportes' },
  { id: 'usuarios',     icon: '👤', label: 'Usuarios' },
]

const appCards = [
  { id: 'clientes',     icon: '👥', label: 'Clientes',     sub: 'Gestión de clientes',        gradient: 'linear-gradient(135deg, #1e90ff, #00b4d8)' },
  { id: 'contratos',    icon: '📄', label: 'Contratos',    sub: 'Contratos activos',           gradient: 'linear-gradient(135deg, #7c3aed, #a78bfa)' },
  { id: 'personal',     icon: '👷', label: 'Personal',     sub: 'Empleados y legajos',         gradient: 'linear-gradient(135deg, #059669, #34d399)' },
  { id: 'agenda',       icon: '📅', label: 'Agenda',       sub: 'Servicios programados',       gradient: 'linear-gradient(135deg, #d97706, #fbbf24)' },
  { id: 'presupuestos', icon: '💰', label: 'Presupuestos', sub: 'Cotizaciones y rentabilidad', gradient: 'linear-gradient(135deg, #0891b2, #22d3ee)' },
  { id: 'facturacion',  icon: '🧾', label: 'Facturación',  sub: 'Facturas y cobros',           gradient: 'linear-gradient(135deg, #dc2626, #f87171)' },
  { id: 'insumos',      icon: '🧴', label: 'Insumos',      sub: 'Stock y movimientos',         gradient: 'linear-gradient(135deg, #0284c7, #38bdf8)' },
  { id: 'finanzas',     icon: '📊', label: 'Finanzas',     sub: 'Ingresos y egresos',          gradient: 'linear-gradient(135deg, #16a34a, #4ade80)' },
  { id: 'costos',       icon: '📋', label: 'Costos',       sub: 'Fijos, variables, margen',    gradient: 'linear-gradient(135deg, #0f766e, #14b8a6)' },
  { id: 'sueldos',      icon: '💼', label: 'Sueldos',      sub: 'Liquidación de sueldos',      gradient: 'linear-gradient(135deg, #7c3aed, #a78bfa)' },
  { id: 'proveedores',  icon: '🏭', label: 'Proveedores',  sub: 'Gestión de proveedores',      gradient: 'linear-gradient(135deg, #b45309, #f59e0b)' },
  { id: 'reportes',     icon: '📈', label: 'Reportes',     sub: 'Estadísticas y análisis',     gradient: 'linear-gradient(135deg, #9333ea, #c084fc)' },
]

function Dashboard({ user }) {
  const [seccionActiva, setSeccionActiva] = useState('inicio')
  const [menuAbierto, setMenuAbierto] = useState(true)
  const [kpis, setKpis] = useState({ clientes:0, contratos:0, empleados:0, serviciosHoy:0, ingresosMes:0, facturasPendientes:0 })
  const [alertas, setAlertas] = useState([])

  useEffect(() => { if (seccionActiva === 'inicio') { cargarKpis(); cargarAlertas() } }, [seccionActiva])

  async function cargarKpis() {
    const mes = new Date().toISOString().slice(0, 7)
    const hoy = new Date().toISOString().split('T')[0]
    const [{ count: clientes }, { count: contratos }, { count: empleados }, { count: serviciosHoy }, { data: ingresos }, { data: facturas }] = await Promise.all([
      supabase.from('clientes').select('*', { count: 'exact', head: true }).eq('activo', true),
      supabase.from('contratos').select('*', { count: 'exact', head: true }).eq('estado', 'activo'),
      supabase.from('empleados').select('*', { count: 'exact', head: true }).eq('activo', true),
      supabase.from('ordenes_trabajo').select('*', { count: 'exact', head: true }).eq('fecha_programada', hoy),
      supabase.from('movimientos_financieros').select('monto').eq('tipo', 'ingreso').gte('fecha', mes+'-01').lte('fecha', mes+'-31'),
      supabase.from('facturas').select('total').in('estado', ['pendiente','parcial','vencida']),
    ])
    setKpis({ clientes:clientes||0, contratos:contratos||0, empleados:empleados||0, serviciosHoy:serviciosHoy||0, ingresosMes:(ingresos||[]).reduce((a,m)=>a+Number(m.monto),0), facturasPendientes:(facturas||[]).reduce((a,f)=>a+Number(f.total),0) })
  }

  async function cargarAlertas() {
    const hoy = new Date()
    const en7dias = new Date(hoy); en7dias.setDate(hoy.getDate() + 7)
    const en30dias = new Date(hoy); en30dias.setDate(hoy.getDate() + 30)
    const mes = hoy.toISOString().slice(0, 7)
    const nuevasAlertas = []

    // Facturas vencidas
    const { data: facVencidas } = await supabase.from('facturas').select('numero_factura, total, fecha_vencimiento, clientes(razon_social,nombre_contacto)').eq('estado','pendiente').lt('fecha_vencimiento', hoy.toISOString().split('T')[0])
    ;(facVencidas||[]).forEach(f => nuevasAlertas.push({ tipo:'danger', icono:'🔴', titulo:'Factura vencida', detalle:`${f.numero_factura} — ${f.clientes?.razon_social||f.clientes?.nombre_contacto}`, monto: Number(f.total), modulo:'facturacion' }))

    // Facturas por vencer en 7 días
    const { data: facPorVencer } = await supabase.from('facturas').select('numero_factura, total, fecha_vencimiento, clientes(razon_social,nombre_contacto)').eq('estado','pendiente').gte('fecha_vencimiento', hoy.toISOString().split('T')[0]).lte('fecha_vencimiento', en7dias.toISOString().split('T')[0])
    ;(facPorVencer||[]).forEach(f => nuevasAlertas.push({ tipo:'warning', icono:'🟡', titulo:'Factura vence en 7 días', detalle:`${f.numero_factura} — ${f.clientes?.razon_social||f.clientes?.nombre_contacto}`, monto: Number(f.total), modulo:'facturacion' }))

    // Sueldos pendientes del mes
    const { data: empleadosActivos } = await supabase.from('empleados').select('id, nombre, apellido').eq('activo', true)
    const { data: liquidacionesMes } = await supabase.from('liquidaciones_sueldo').select('empleado_id').eq('periodo', mes)
    const liquidados = (liquidacionesMes||[]).map(l => l.empleado_id)
    const sinLiquidar = (empleadosActivos||[]).filter(e => !liquidados.includes(e.id))
    if (sinLiquidar.length > 0) nuevasAlertas.push({ tipo:'warning', icono:'💼', titulo:`${sinLiquidar.length} sueldo(s) sin liquidar`, detalle: sinLiquidar.map(e => e.apellido + ' ' + e.nombre).join(', '), modulo:'sueldos' })

    // Stock bajo mínimo
    const { data: stockBajo } = await supabase.from('insumos').select('nombre, stock_actual, stock_minimo').eq('activo', true).filter('stock_actual','lte','stock_minimo')
    if ((stockBajo||[]).length > 0) nuevasAlertas.push({ tipo:'warning', icono:'🧴', titulo:`${stockBajo.length} insumo(s) bajo stock mínimo`, detalle: stockBajo.map(i => i.nombre).join(', '), modulo:'insumos' })

    // Contratos por vencer en 30 días
    const { data: contVencer } = await supabase.from('contratos').select('numero_contrato, fecha_fin, clientes(razon_social,nombre_contacto)').eq('estado','activo').not('fecha_fin','is',null).lte('fecha_fin', en30dias.toISOString().split('T')[0]).gte('fecha_fin', hoy.toISOString().split('T')[0])
    ;(contVencer||[]).forEach(ct => nuevasAlertas.push({ tipo:'info', icono:'📄', titulo:'Contrato vence en 30 días', detalle:`${ct.numero_contrato} — ${ct.clientes?.razon_social||ct.clientes?.nombre_contacto}`, modulo:'contratos' }))

    setAlertas(nuevasAlertas)
  }

  const tarjetas = [
    { label:'Clientes activos',    valor:kpis.clientes,           tipo:'numero', color:'#1e90ff', bg:'#e0f0ff', modulo:'clientes',    icon:'👥' },
    { label:'Contratos activos',   valor:kpis.contratos,          tipo:'numero', color:'#7c3aed', bg:'#ede9fe', modulo:'contratos',   icon:'📄' },
    { label:'Empleados activos',   valor:kpis.empleados,          tipo:'numero', color:'#059669', bg:'#d1fae5', modulo:'personal',    icon:'👷' },
    { label:'Servicios hoy',       valor:kpis.serviciosHoy,       tipo:'numero', color:'#d97706', bg:'#fef3c7', modulo:'agenda',      icon:'📅' },
    { label:'Ingresos del mes',    valor:kpis.ingresosMes,        tipo:'dinero', color:'#059669', bg:'#d1fae5', modulo:'finanzas',    icon:'💰' },
    { label:'Facturas pendientes', valor:kpis.facturasPendientes, tipo:'dinero', color:'#ef4444', bg:'#fee2e2', modulo:'facturacion', icon:'🧾' },
  ]

  return (
    <div style={{ minHeight:'100vh', background:'#f0f8ff', display:'flex', fontFamily:"'Segoe UI', sans-serif" }}>
      <div style={{ width:menuAbierto?'220px':'64px', background:'#ffffff', borderRight:'1px solid #bfdbfe', display:'flex', flexDirection:'column', transition:'width 0.3s ease', boxShadow:'2px 0 12px rgba(30,144,255,0.08)', flexShrink:0 }}>
        <div style={{ padding:menuAbierto?'20px 16px':'20px 10px', borderBottom:'1px solid #bfdbfe', display:'flex', alignItems:'center', justifyContent:'space-between', minHeight:'80px' }}>
          {menuAbierto ? <img src="/logo.jpg" alt="Briseo" style={{ height:'72px', width:'auto', objectFit:'contain' }} />
            : <div style={{ width:'38px', height:'38px', borderRadius:'10px', background:'linear-gradient(135deg, #1e90ff, #0ea5e9)', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:'900', fontSize:'18px' }}>b</div>}
          <button onClick={() => setMenuAbierto(!menuAbierto)} style={{ background:'#e0f0ff', border:'none', borderRadius:'8px', color:'#1e90ff', cursor:'pointer', width:'26px', height:'26px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'11px', flexShrink:0 }}>{menuAbierto?'◀':'▶'}</button>
        </div>
        <nav style={{ flex:1, padding:'12px 8px', overflowY:'auto' }}>
          {menuItems.map(item => (
            <button key={item.id} onClick={() => setSeccionActiva(item.id)} style={{ width:'100%', display:'flex', alignItems:'center', gap:'10px', padding:menuAbierto?'10px 12px':'10px', justifyContent:menuAbierto?'flex-start':'center', background:seccionActiva===item.id?'#e0f0ff':'transparent', border:seccionActiva===item.id?'1.5px solid #bfdbfe':'1.5px solid transparent', borderRadius:'10px', cursor:'pointer', marginBottom:'2px', transition:'all 0.15s' }}>
              <span style={{ fontSize:'17px' }}>{item.icon}</span>
              {menuAbierto && <span style={{ color:seccionActiva===item.id?'#1e90ff':'#475569', fontSize:'13px', fontWeight:seccionActiva===item.id?'700':'400' }}>{item.label}</span>}
            </button>
          ))}
        </nav>
        <div style={{ padding:menuAbierto?'14px 16px':'14px 10px', borderTop:'1px solid #bfdbfe' }}>
          {menuAbierto && <p style={{ color:'#94a3b8', fontSize:'11px', marginBottom:'10px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user.email}</p>}
          <button onClick={() => supabase.auth.signOut()} style={{ width:'100%', display:'flex', alignItems:'center', gap:'8px', justifyContent:menuAbierto?'flex-start':'center', background:'#fff1f2', border:'1px solid #fecdd3', borderRadius:'8px', padding:'8px 10px', color:'#ef4444', cursor:'pointer', fontSize:'13px', fontWeight:'500' }}>
            <span>🚪</span>{menuAbierto && <span>Cerrar sesión</span>}
          </button>
        </div>
      </div>

      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        <div style={{ background:'#ffffff', padding:'14px 32px', borderBottom:'1px solid #bfdbfe', display:'flex', alignItems:'center', justifyContent:'space-between', boxShadow:'0 2px 8px rgba(30,144,255,0.06)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
            <span style={{ fontSize:'20px' }}>{menuItems.find(m=>m.id===seccionActiva)?.icon}</span>
            <h2 style={{ margin:0, fontSize:'17px', fontWeight:'700', color:'#0f172a' }}>{menuItems.find(m=>m.id===seccionActiva)?.label}</h2>
          </div>
          <span style={{ color:'#64748b', fontSize:'13px', background:'#f0f8ff', padding:'6px 14px', borderRadius:'20px', border:'1px solid #bfdbfe' }}>
            {new Date().toLocaleDateString('es-AR', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}
          </span>
        </div>

        <div style={{ flex:1, padding:'28px 32px', overflowY:'auto' }}>
          {seccionActiva === 'inicio' && (
            <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:'24px', alignItems:'start' }}>
            <div>
              <p style={{ color:'#64748b', marginBottom:'20px', fontSize:'14px' }}>Bienvenido al sistema de gestión de <strong style={{ color:'#1e90ff' }}>Briseo Limpieza</strong>.</p>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'14px', marginBottom:'28px' }}>
                {tarjetas.map((t,i) => (
                  <button key={i} onClick={() => setSeccionActiva(t.modulo)} style={{ background:'#ffffff', border:'1.5px solid #e0f0ff', borderRadius:'16px', padding:'22px', cursor:'pointer', textAlign:'left', boxShadow:'0 2px 8px rgba(30,144,255,0.06)', transition:'all 0.2s', position:'relative', overflow:'hidden' }}
                    onMouseEnter={e=>{e.currentTarget.style.boxShadow='0 8px 24px rgba(30,144,255,0.15)';e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.borderColor=t.color}}
                    onMouseLeave={e=>{e.currentTarget.style.boxShadow='0 2px 8px rgba(30,144,255,0.06)';e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.borderColor='#e0f0ff'}}>
                    <div style={{ position:'absolute', top:'-15px', right:'-15px', width:'80px', height:'80px', borderRadius:'50%', background:t.bg, opacity:0.6 }} />
                    <div style={{ width:'44px', height:'44px', borderRadius:'12px', background:t.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px', marginBottom:'12px' }}>{t.icon}</div>
                    <p style={{ color:'#64748b', fontSize:'11px', fontWeight:'600', marginBottom:'4px', textTransform:'uppercase', letterSpacing:'0.5px' }}>{t.label}</p>
                    <p style={{ color:'#0f172a', fontSize:'26px', fontWeight:'800', margin:0 }}>
                      {t.tipo==='dinero' ? t.valor.toLocaleString('es-AR',{style:'currency',currency:'ARS'}) : t.valor}
                    </p>
                    <p style={{ color:t.color, fontSize:'12px', marginTop:'8px', fontWeight:'600' }}>Ver módulo →</p>
                  </button>
                ))}
              </div>
              <p style={{ color:'#64748b', fontSize:'12px', fontWeight:'600', marginBottom:'14px', textTransform:'uppercase', letterSpacing:'0.5px' }}>Módulos del sistema</p>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:'10px' }}>
                {appCards.map((card,i) => (
                  <button key={i} onClick={() => setSeccionActiva(card.id)} style={{ background:'#ffffff', border:'1px solid #e0f0ff', borderRadius:'14px', padding:'0', cursor:'pointer', boxShadow:'0 2px 8px rgba(0,0,0,0.05)', transition:'all 0.2s', overflow:'hidden' }}
                    onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-3px)';e.currentTarget.style.boxShadow='0 10px 24px rgba(0,0,0,0.1)'}}
                    onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='0 2px 8px rgba(0,0,0,0.05)'}}>
                    <div style={{ background:card.gradient, padding:'14px 10px', display:'flex', flexDirection:'column', alignItems:'center', gap:'6px' }}>
                      <span style={{ fontSize:'24px' }}>{card.icon}</span>
                      <p style={{ color:'#fff', fontWeight:'800', fontSize:'12px', margin:0, textAlign:'center' }}>{card.label}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* PANEL DE ALERTAS */}
            <div style={{ position:'sticky', top:'0' }}>
              <div style={{ background:'#ffffff', borderRadius:'16px', padding:'20px', boxShadow:'0 2px 12px rgba(30,144,255,0.08)', border:'1px solid #bfdbfe' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'16px' }}>
                  <span style={{ fontSize:'18px' }}>🔔</span>
                  <h3 style={{ margin:0, fontSize:'15px', fontWeight:'800', color:'#0f172a' }}>Alertas</h3>
                  {alertas.length > 0 && <span style={{ background:'#ef4444', color:'white', borderRadius:'99px', fontSize:'11px', fontWeight:'700', padding:'2px 8px', marginLeft:'auto' }}>{alertas.length}</span>}
                </div>

                {alertas.length === 0 ? (
                  <div style={{ textAlign:'center', padding:'30px 0' }}>
                    <p style={{ fontSize:'28px', margin:'0 0 8px' }}>✅</p>
                    <p style={{ color:'#64748b', fontSize:'13px', margin:0, fontWeight:'500' }}>Todo en orden, sin alertas pendientes</p>
                  </div>
                ) : (
                  <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
                    {alertas.map((a, i) => {
                      const colores = {
                        danger:  { bg:'#fff1f2', border:'#fecdd3', color:'#dc2626' },
                        warning: { bg:'#fffbeb', border:'#fde68a', color:'#d97706' },
                        info:    { bg:'#eff6ff', border:'#bfdbfe', color:'#1d4ed8' },
                      }
                      const col = colores[a.tipo] || colores.info
                      return (
                        <button key={i} onClick={() => setSeccionActiva(a.modulo)}
                          style={{ background:col.bg, border:`1.5px solid ${col.border}`, borderRadius:'12px', padding:'12px 14px', cursor:'pointer', textAlign:'left', transition:'all 0.15s', width:'100%' }}
                          onMouseEnter={e => e.currentTarget.style.transform='translateX(3px)'}
                          onMouseLeave={e => e.currentTarget.style.transform='translateX(0)'}>
                          <div style={{ display:'flex', alignItems:'flex-start', gap:'8px' }}>
                            <span style={{ fontSize:'16px', flexShrink:0 }}>{a.icono}</span>
                            <div style={{ flex:1, minWidth:0 }}>
                              <p style={{ margin:'0 0 3px', fontSize:'12px', fontWeight:'700', color:col.color }}>{a.titulo}</p>
                              <p style={{ margin:0, fontSize:'11px', color:'#64748b', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{a.detalle}</p>
                              {a.monto && <p style={{ margin:'3px 0 0', fontSize:'12px', fontWeight:'700', color:col.color }}>{a.monto.toLocaleString('es-AR',{style:'currency',currency:'ARS'})}</p>}
                            </div>
                            <span style={{ fontSize:'11px', color:col.color, flexShrink:0, fontWeight:'600' }}>→</span>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}

                <button onClick={() => { cargarAlertas() }} style={{ width:'100%', marginTop:'14px', padding:'8px', background:'#f0f8ff', border:'1px solid #bfdbfe', borderRadius:'8px', color:'#1e90ff', fontSize:'12px', fontWeight:'600', cursor:'pointer' }}>
                  🔄 Actualizar alertas
                </button>
              </div>
            </div>

            </div>
          )}
          {seccionActiva === 'clientes' && <Clientes />}
          {seccionActiva === 'contratos' && <Contratos />}
          {seccionActiva === 'personal' && <Personal />}
          {seccionActiva === 'agenda' && <Agenda />}
          {seccionActiva === 'presupuestos' && <Presupuestos />}
          {seccionActiva === 'facturacion' && <Facturacion />}
          {seccionActiva === 'insumos' && <Insumos />}
          {seccionActiva === 'finanzas' && <Finanzas />}
          {seccionActiva === 'costos' && <Costos />}
          {seccionActiva === 'sueldos' && <Sueldos />}
          {seccionActiva === 'proveedores' && <Proveedores />}
          {seccionActiva === 'reportes' && <Reportes />}
          {seccionActiva === 'usuarios' && <Usuarios />}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
