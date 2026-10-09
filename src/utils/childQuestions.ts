/**
 * Genera preguntas detonantes dirigidas exclusivamente al niño/a (voz infantil, asombro,
 * curiosidad y juego), erradicando formulaciones adultocéntricas o técnicas del docente.
 */
export function createChildDetonatingQuestion(topic: string, teacherPrompt?: string): string {
  const clean = topic.trim().toLowerCase();

  // Si el docente escribió explícitamente una pregunta infantil con signos de interrogación:
  if (teacherPrompt) {
    const questionMatch = teacherPrompt.match(/¿([^?]+)\?/);
    if (questionMatch) {
      const q = questionMatch[1].trim();
      // Si ya está dirigida al niño (no contiene 'podemos investigar y vivenciar')
      if (!q.toLowerCase().includes('investigar y vivenciar') && !q.toLowerCase().includes('autonomía y afecto')) {
        return `¿${q}?`;
      }
    }
  }

  // Casos pedagógicos emblemáticos de Primera Infancia (asombro y vivencia directa del niño/a):
  if (clean.includes('cometa')) {
    return '¿Por qué las cometas vuelan en el cielo?';
  }

  if (clean.includes('viento') || clean.includes('aire')) {
    return '¿Por qué el viento nos hace cosquillitas y hace volar las cometas y las hojas si no lo podemos ver?';
  }

  if (clean.includes('agua') || clean.includes('lluvia') || clean.includes('charco')) {
    return '¿De dónde viene la lluvia y por qué el agua es tan fresca y divertida al tocarla con nuestras manos?';
  }

  if (clean.includes('mariposa') || clean.includes('oruga')) {
    return '¿Cómo hacen las mariposas para pintar sus alitas de colores y volar de flor en flor?';
  }

  if (clean.includes('hormiga') || clean.includes('bicho') || clean.includes('insecto') || clean.includes('caracol')) {
    return '¿Por qué las hormiguitas caminan en fila y qué buscan debajo de las piedras?';
  }

  if (clean.includes('planta') || clean.includes('semilla') || clean.includes('árbol') || clean.includes('jardín')) {
    return '¿Cómo duermen las semillitas en la tierra y por qué se convierten en flores de colores cuando les damos agua y sol?';
  }

  if (clean.includes('animal') || clean.includes('mascota') || clean.includes('perro') || clean.includes('gato')) {
    return '¿Qué nos dicen los animalitos con sus miradas, caricias y sonidos cuando jugamos con ellos?';
  }

  if (clean.includes('cuerpo') || clean.includes('manos') || clean.includes('pies')) {
    return '¿Quién soy yo, qué sienten mis manitas y cómo abrazo a quienes quiero en mi casa y mi escuela?';
  }

  if (clean.includes('movimiento') || clean.includes('baile') || clean.includes('danza')) {
    return '¿Cómo se mueve mi cuerpo cuando salto como un sapito, ruedo por el pasto o bailo como el viento?';
  }

  if (clean.includes('emocion') || clean.includes('sentimiento') || clean.includes('alegr') || clean.includes('coraz')) {
    return '¿Dónde siente mi cuerpo la alegría y qué hace mi corazón cuando juego con mis amigos?';
  }

  if (clean.includes('familia') || clean.includes('abuelo') || clean.includes('mamá') || clean.includes('papá') || clean.includes('casa')) {
    return '¿Quiénes viven en mi casita y qué historias y abrazos me llenan de amor antes de dormir?';
  }

  if (clean.includes('color') || clean.includes('pintur') || clean.includes('arte')) {
    return '¿De dónde salen todos los colores del mundo y qué pasa cuando los mezclamos con nuestras manos?';
  }

  if (clean.includes('sonido') || clean.includes('música') || clean.includes('canto') || clean.includes('ritmo')) {
    return '¿Por qué cuando escuchamos música nuestro cuerpo tiene tantas ganas de cantar y bailar?';
  }

  if (clean.includes('sol') || clean.includes('luna') || clean.includes('estrella') || clean.includes('noche')) {
    return '¿Por qué el sol nos da calorcito en el día y la luna nos cuida desde el cielo en la noche?';
  }

  if (clean.includes('cuadrado') || clean.includes('figura') || clean.includes('triángulo') || clean.includes('círculo')) {
    return '¿Dónde se esconden las esquinas y qué juguetes y cosas de mi aula tienen forma divertida?';
  }

  if (clean.includes('alimento') || clean.includes('fruta') || clean.includes('comida') || clean.includes('sabor')) {
    return '¿A qué saben las frutas dulces y cómo nos dan energía para correr y jugar todo el día?';
  }

  // Formulación general infantil según la estructura del tema:
  if (clean.startsWith('el ') || clean.startsWith('la ') || clean.startsWith('los ') || clean.startsWith('las ')) {
    return `¿Por qué ${clean} despiertan tanta curiosidad y cómo podemos jugar y descubrirlos en nuestro rincón mágico?`;
  }

  return `¿Por qué ${clean} es tan especial y qué cosas maravillosas podemos descubrir explorándolo hoy?`;
}
