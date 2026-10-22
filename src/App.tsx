import { useState } from 'react'
import { generarPrueba } from './pdf/generar'

function descargarPdf(bytes: Uint8Array, nombreArchivo: string): void {
  const blob = new Blob([new Uint8Array(bytes)], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)

  const enlace = document.createElement('a')
  enlace.href = url
  enlace.download = nombreArchivo
  enlace.click()

  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function App() {
  const [generando, setGenerando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function manejarClick() {
    setGenerando(true)
    setError(null)
    try {
      const bytes = await generarPrueba()
      descargarPdf(bytes, 'prueba.pdf')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ocurrió un error desconocido')
    } finally {
      setGenerando(false)
    }
  }

  return (
    <main>
      <h1>Formulario de convenios</h1>

      <button onClick={manejarClick} disabled={generando}>
        {generando ? 'Generando…' : 'Generar PDF de prueba'}
      </button>

      {error && <p style={{ color: 'crimson' }}>{error}</p>}
    </main>
  )
}

export default App