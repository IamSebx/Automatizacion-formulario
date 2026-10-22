import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

const RUTA_PLANTILLA = `${import.meta.env.BASE_URL}plantillas/sin-seguro.pdf`

const TINTA = rgb(0.05, 0.08, 0.25)

function desdeAbajo(altoPagina: number, yDesdeArriba: number): number {
  return altoPagina - yDesdeArriba
}

export async function generarPrueba(): Promise<Uint8Array> {

  const respuesta = await fetch(RUTA_PLANTILLA)
  if (!respuesta.ok) {
    throw new Error(`No se encontró la plantilla (HTTP ${respuesta.status}). ¿Está en public/plantillas/sin-seguro.pdf?`)
  }
  const bytesPlantilla = await respuesta.arrayBuffer()

  const pdf = await PDFDocument.load(bytesPlantilla)

  const fuente = await pdf.embedFont(StandardFonts.Helvetica)

  const [pagina1] = pdf.getPages()
  const altoPagina = pagina1.getHeight() // 841.89 en A4

  const casilla = { x: 28.5, y: 371.1, alto: 14.2 } 
  const tamanoLetra = 8
  const lineaBase = casilla.y + casilla.alto / 2 + 2.6 


  //PROBANDO CON MI APELLIDO
  pagina1.drawText('ROCHA', {
    x: casilla.x + 3,                          
    y: desdeAbajo(altoPagina, lineaBase),    
    size: tamanoLetra,
    font: fuente,
    color: TINTA,
  })

  return pdf.save()
}