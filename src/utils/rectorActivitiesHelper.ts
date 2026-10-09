import { Planification, RectorActivityDetail } from '../types';

/**
 * Obtiene las 4 actividades rectoras detalladas para cualquier planeación,
 * garantizando la presencia completa de Exploración del Medio, Juego, Arte y Literatura
 * con mediación docente y cómo lo aplica/vivencia la niña o niño.
 */
export function getRectorActivitiesDetails(plan: Planification): RectorActivityDetail[] {
  const existing = plan.rectorActivities || [];
  const topic = plan.topic || 'la temática de indagación';
  const age = plan.ageRange || 'la primera infancia';

  const defaultTemplates: RectorActivityDetail[] = [
    {
      activity: 'Exploración del Medio',
      description: `Mediación docente mediante la disposición de ambientes provocadores, mesas de indagación y recorridos por el aula, el patio y el entorno natural para indagar sobre "${topic}". El docente promueve la curiosidad, formula preguntas abiertas ("¿Cómo se siente?", "¿Qué pasará si...?"), suministra lupas, bandejas sensoriales y facilita el contacto directo con elementos reales y tangibles.`,
      howChildApplies: `La niña y el niño exploran con todos sus sentidos (tacto, vista, olfato, oído), tocan texturas, comparan pesos y temperaturas, observan cambios en los elementos de su entorno, clasifican objetos concretos de acuerdo a sus criterios y formulan hipótesis espontáneas sobre "${topic}", asombrándose ante lo nuevo.`,
      socioemotionalAspect: `Fortalecimiento de la seguridad afectiva ante lo desconocido; desarrollo del asombro espontáneo, tolerancia a la frustración e incertidumbre en sus indagaciones, y cultivo de la empatía y cuidado respetuoso por los seres vivos y el entorno.`,
      momentSync: `Sincronizado con Momento 1 (Indagar • Asombro y acogida) y Momento 3 (Vivir la Experiencia • Estaciones sensoriales).`
    },
    {
      activity: 'Juego',
      description: `Mediación lúdica activa a través del juego libre, juego simbólico de roles, juegos de construcción y circuitos psicomotores vinculados a "${topic}". El maestro proyecta rincones de inmersión lúdica donde las niñas y los niños pactan acuerdos, asumen roles afectivos, comparten materiales y resuelven desafíos de movimiento y convivencia.`,
      howChildApplies: `La niña y el niño asumen y transforman roles lúdicos (de cuidado, exploración y fantasía), acuerdan reglas sencillas de participación, respetan turnos, cooperan con sus pares para construir escenarios con bloques y telas, y experimentan el goce del movimiento libre con saltos, desplazamientos y risas compartidas.`,
      socioemotionalAspect: `Desarrollo de la autorregulación emocional, toma de perspectiva afectiva (ponerse en el lugar del otro en el juego de roles), respeto de acuerdos y turnos, resolución dialógica de discrepancias y goce solidario compartido.`,
      momentSync: `Sincronizado con Momento 2 (Proyectar • Acuerdos de convivencia) y Momento 3 (Vivir la Experiencia • Juego cooperativo).`
    },
    {
      activity: 'Arte',
      description: `Mediación estética y multisensorial que integra lenguajes plásticos, expresión musical, danza y dramatización. El docente dispone talleres con arcilla, dactilopintura con pigmentos caseros, collage de texturas, modelado tridimensional, rondas rítmicas e instrumentos de percusión menor para plasmar vivencias sobre "${topic}".`,
      howChildApplies: `La niña y el niño moldean, estampan, mezclan colores, descubren huellas, danzan libremente al ritmo de cantos infantiles, elaboran piezas plásticas singulares sin plantillas restrictivas y exteriorizan sus mundos internos y emociones hacia "${topic}" a través del trazo, el gesto y la creación colectiva.`,
      socioemotionalAspect: `Canalización y catarsis saludable de emociones profundas (alegrías, miedos, anhelos); consolidación del autoconcepto positivo, libertad de crear sin temor a la censura o al juicio y disfrute del goce estético fraterno.`,
      momentSync: `Sincronizado con Momento 3 (Vivir la Experiencia • Expresión plástica) y Momento 4 (Consolidación • Muestra colectiva).`
    },
    {
      activity: 'Literatura',
      description: `Mediación poética y narrativa que aproxima a las niñas y niños al acervo literario infantil, libros álbum, rimas, adivinanzas, arrullos y tradición oral de la región sobre "${topic}". El docente anima círculos de la palabra, lectura compartida en voz alta y la construcción del "Libro Viajero de la Experiencia".`,
      howChildApplies: `La niña y el niño escuchan atentamente las narraciones, leen imágenes con sentido propio, recrean historias imaginando nuevos finales, repiten estribillos y rimas sonoras, formulan preguntas curiosas sobre los relatos y enriquecen su lenguaje expresando ideas y anécdotas de su cotidianidad familiar.`,
      socioemotionalAspect: `Identificación y nombramiento de emociones complejas mediante personajes y relatos; desarrollo de la empatía narrativa, serenidad y contención afectiva en los círculos de escucha y arrullo poético.`,
      momentSync: `Sincronizado con Momento 1 (Indagar • Círculos de palabra) y Momento 5 (Valoración • Narración y memoria reflexiva).`
    }
  ];

  return defaultTemplates.map((template) => {
    const found = existing.find(
      (e) => e.activity.toLowerCase().trim() === template.activity.toLowerCase().trim()
    );
    if (found && found.description && found.howChildApplies) {
      return {
        ...found,
        socioemotionalAspect: found.socioemotionalAspect || template.socioemotionalAspect,
        momentSync: found.momentSync || template.momentSync
      };
    }
    if (found) {
      return {
        activity: template.activity,
        description: found.description || template.description,
        howChildApplies: found.howChildApplies || template.howChildApplies,
        socioemotionalAspect: found.socioemotionalAspect || template.socioemotionalAspect,
        momentSync: found.momentSync || template.momentSync
      };
    }
    return template;
  });
}
