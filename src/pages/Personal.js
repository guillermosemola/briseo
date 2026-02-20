import { useEffect, useState } from 'react'
import { supabase } from '../supabase.js'

function Personal() {
  const [empleados, setEmpleados] = useState([])
  const [loading, setLoading] = useState(true)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [busqueda, setBusqueda] = useState('')
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    cuil: '',
    fecha_nacimiento: '',
    fecha_ingreso: '',
    puesto: '',
    categoria: '',
    salario_base: '',
    costo_hora: '',
    email: '',
    telefono: '',
    direccion: '',
    tipo_contrato: 'relacion_dependencia',
    observaciones: ''
  })

  useEffect(() => {
    cargarEmpleados()
  }, [])

  async function cargarEmpleados() {
    setLoading(true)
    const { data, error } = await supabase
      .from('empleados')
      .select('*')
      .eq('activo', true)
      .order('apellido', { ascending: true })
    if (!error) setEmpleados(data)
    setLoading(false)
  }

  async function guardarEmpleado(e) {
    e.preventDefault()
    const { error } = await supabase.from('empleados').insert([{
      ...form,
      salario_base: form.salario_base ? parseFloat(form.salario_base) : null,
      costo_hora: form.costo_hora ? parseFloat(form.costo_hora) : null,
    }])
    if (error) {
      alert('Error al guardar: ' + error.message)
    } else {
      setMostrarForm(false)
      setForm({
        nombre: '', apellido: '', dni: '', cuil: '',
        fecha_nacimiento: '', fecha_ingreso: '', puesto: '',
        categoria: '', salario_base: '', costo_hora: '',
        email: '', telefono: '', direccion: '',
        tipo_contrato: 'relacion_dependencia', observaciones: ''
      })
      cargarEmpleados()
    }
  }

  async function darDeBaja(id) {
    if (!confirm('¿Seguro que queres dar de baja este empleado?')) return
    await supabase.from('empleados').update({ activo: false }).eq('id', id)
    cargarEmpleados()
  }

  const empleadosFiltrados = empleados.filter(e =>
    (e.nombre + ' ' + e.apellido).toLowerCase().includes(busqueda.toLowerCase()) ||
    (e.dni || '').includes(busqueda) ||
    (e.puesto || '').toLowerCase().includes(busqueda.toLowerCase())
  )

  const tipoContrato = {
    relacion_dependencia: 'Relacion de dependencia',
    monotributo: 'Monotributo',
    eventual: 'Eventual'
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-700">Personal</h3>
          <p className="text-sm text-gray-400">{empleados.length} empleados activos</p>
        </div>
        <button
          onClick={() => setMostrarForm(!mostrarForm)}
          className="bg-blue-800 hover:bg-blue-900 text-white px-5 py-2 rounded-lg font-medium transition"
        >
          {mostrarForm ? 'Cancelar' : '+ Nuevo empleado'}
        </button>
      </div>

      {mostrarForm && (
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h4 className="font-semibold text-gray-700 mb-4">Nuevo empleado</h4>
          <form onSubmit={guardarEmpleado} className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Nombre</label>
              <input type="text" value={form.nombre}
                onChange={e => setForm({ ...form, nombre: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Apellido</label>
              <input type="text" value={form.apellido}
                onChange={e => setForm({ ...form, apellido: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">DNI</label>
              <input type="text" value={form.dni}
                onChange={e => setForm({ ...form, dni: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">CUIL</label>
              <input type="text" value={form.cuil}
                onChange={e => setForm({ ...form, cuil: e.target.value })}
                placeholder="20-12345678-9"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Fecha de nacimiento</label>
              <input type="date" value={form.fecha_nacimiento}
                onChange={e => setForm({ ...form, fecha_nacimiento: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Fecha de ingreso</label>
              <input type="date" value={form.fecha_ingreso}
                onChange={e => setForm({ ...form, fecha_ingreso: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Puesto</label>
              <input type="text" value={form.puesto}
                onChange={e => setForm({ ...form, puesto: e.target.value })}
                placeholder="Ej: Operario de limpieza"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Tipo de contrato</label>
              <select value={form.tipo_contrato}
                onChange={e => setForm({ ...form, tipo_contrato: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="relacion_dependencia">Relacion de dependencia</option>
                <option value="monotributo">Monotributo</option>
                <option value="eventual">Eventual</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Salario base ($)</label>
              <input type="number" value={form.salario_base}
                onChange={e => setForm({ ...form, salario_base: e.target.value })}
                placeholder="0.00"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Costo por hora ($)</label>
              <input type="number" value={form.costo_hora}
                onChange={e => setForm({ ...form, costo_hora: e.target.value })}
                placeholder="0.00"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Telefono</label>
              <input type="text" value={form.telefono}
                onChange={e => setForm({ ...form, telefono: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
              <input type="email" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-600 mb-1">Direccion</label>
              <input type="text" value={form.direccion}
                onChange={e => setForm({ ...form, direccion: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-600 mb-1">Observaciones</label>
              <textarea value={form.observaciones}
                onChange={e => setForm({ ...form, observaciones: e.target.value })}
                rows={2}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div className="md:col-span-2 flex justify-end gap-3">
              <button type="button" onClick={() => setMostrarForm(false)}
                className="px-5 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition">
                Cancelar
              </button>
              <button type="submit"
                className="px-5 py-2 bg-blue-800 hover:bg-blue-900 text-white rounded-lg font-medium transition">
                Guardar empleado
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre, DNI o puesto..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          className="w-full md:w-96 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-gray-400">Cargando...</div>
        ) : empleadosFiltrados.length === 0 ? (
          <div className="p-10 text-center text-gray-400">
            {busqueda ? 'No se encontraron resultados' : 'No hay empleados registrados aun'}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-blue-900 text-white">
              <tr>
                <th className="px-4 py-3 text-left">Empleado</th>
                <th className="px-4 py-3 text-left">DNI</th>
                <th className="px-4 py-3 text-left">Puesto</th>
                <th className="px-4 py-3 text-left">Contrato</th>
                <th className="px-4 py-3 text-left">Salario</th>
                <th className="px-4 py-3 text-left">Costo/hora</th>
                <th className="px-4 py-3 text-left">Telefono</th>
                <th className="px-4 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {empleadosFiltrados.map((e, i) => (
                <tr key={e.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {e.apellido}, {e.nombre}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{e.dni}</td>
                  <td className="px-4 py-3 text-gray-600">{e.puesto || '—'}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{tipoContrato[e.tipo_contrato] || e.tipo_contrato}</td>
                  <td className="px-4 py-3 text-gray-700">
                    {e.salario_base ? Number(e.salario_base).toLocaleString('es-AR', { style: 'currency', currency: 'ARS' }) : '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {e.costo_hora ? Number(e.costo_hora).toLocaleString('es-AR', { style: 'currency', currency: 'ARS' }) : '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{e.telefono || '—'}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => darDeBaja(e.id)}
                      className="text-red-400 hover:text-red-600 transition text-xs">
                      Dar de baja
                    </button>
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

export default Personal
