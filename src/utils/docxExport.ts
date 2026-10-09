import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  ImageRun,
  PageOrientation,
  ShadingType
} from 'docx';
import { saveAs } from 'file-saver';
import { Planification } from '../types';
import { getArticulatedPropositos } from './propositosHelper';
import { getRectorActivitiesDetails } from './rectorActivitiesHelper';
import { 
  getSynchronizedMomentsSocioemotional, 
  getSynchronizedRectorasSocioemotional, 
  getSocioemotionalCrossMatrix 
} from './socioemotionalHelper';

interface ExportDocxOptions {
  headerImageUrl?: string;
  productImageUrl?: string;
  phaseImageUrls?: (string | undefined)[];
}

// Helper to convert base64 or remote URL into Uint8Array for docx ImageRun
async function fetchImageBytes(url: string | undefined): Promise<Uint8Array | null> {
  if (!url) return null;
  try {
    if (url.startsWith('data:image/')) {
      const parts = url.split(',');
      if (parts.length < 2) return null;
      const base64Data = parts[1];
      const binaryString = atob(base64Data);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes;
    } else {
      const response = await fetch(url, { referrerPolicy: 'no-referrer' });
      if (!response.ok) return null;
      const arrayBuffer = await response.arrayBuffer();
      return new Uint8Array(arrayBuffer);
    }
  } catch (err) {
    console.warn('No se pudo procesar la imagen para la descarga en Word:', err);
    return null;
  }
}

export async function exportPlanToDocx(plan: Planification, options?: ExportDocxOptions) {
  // Fetch main images as bytes
  const headerBytes = await fetchImageBytes(options?.headerImageUrl);
  const productBytes = await fetchImageBytes(options?.productImageUrl);

  // Fetch phase images as bytes
  const phaseImageBytesList = await Promise.all(
    (options?.phaseImageUrls || []).map(url => fetchImageBytes(url))
  );

  const doc = new Document({
    creator: 'Sistema de Planificación Pedagógica de Educación Inicial',
    title: plan.title,
    description: 'Documento oficial de planificación para la Primera Infancia de acuerdo con el marco normativo colombiano.',
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1000,
              bottom: 1000,
              left: 1000,
              right: 1000
            }
          }
        },
        children: [
          // 1. TOP HEADER INSTITUCIONAL (I.E. DEL MUNICIPIO DE SAN PEDRO)
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 40 },
            children: [
              new TextRun({
                text: 'INSTITUCIÓN EDUCATIVA DEL MUNICIPIO DE SAN PEDRO',
                bold: true,
                size: 26,
                color: '1E3A8A'
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: 'PROYECTO PEDAGÓGICO DE EDUCACIÓN INICIAL (PPEI 2026)',
                bold: true,
                size: 20,
                color: '1E40AF'
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 220 },
            children: [
              new TextRun({
                text: 'DANE: 370001003871 | NIT: 892.200.599-4 | MARCO NORMATIVO: DECRETO 1411 DE 2022 | LEY 2503 DE 2025',
                bold: true,
                size: 16,
                color: '64748B'
              })
            ]
          }),

          // 2. TÍTULO PRINCIPAL DE LA PLANIFICACIÓN
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 200 },
            children: [
              new TextRun({
                text: plan.title.toUpperCase(),
                bold: true,
                size: 32,
                color: '0F172A'
              })
            ]
          }),

          // 3. ILUSTRACIÓN DE ENCABEZADO (HERO IMAGE)
          ...(headerBytes ? [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { after: 220 },
              children: [
                new ImageRun({
                  data: headerBytes,
                  transformation: {
                    width: 540,
                    height: 240
                  },
                  type: 'png'
                })
              ]
            })
          ] : []),

          // 4. TABLA RESUMEN DE LA PLANEACIÓN (LINEAMIENTOS DE EDUCACIÓN INICIAL - VER IMAGEN 1)
          new Paragraph({
            spacing: { before: 140, after: 80 },
            children: [
              new TextRun({
                text: 'RESUMEN TIPO TABLA • MATRIZ PEDAGÓGICA SINTÉTICA (5 MOMENTOS):',
                bold: true,
                size: 22,
                color: '1E3A8A'
              })
            ]
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                tableHeader: true,
                children: [
                  new TableCell({
                    width: { size: 20, type: WidthType.PERCENTAGE },
                    margins: { top: 120, bottom: 120, left: 100, right: 100 },
                    borders: {
                      top: { style: BorderStyle.SINGLE, size: 8, color: '1E3A8A' },
                      bottom: { style: BorderStyle.SINGLE, size: 8, color: '1E3A8A' },
                      left: { style: BorderStyle.SINGLE, size: 8, color: '1E3A8A' },
                      right: { style: BorderStyle.SINGLE, size: 8, color: '1E3A8A' }
                    },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'MOMENTO 1 • INDAGAR\n(Escuchar, observar e indagar)', bold: true, size: 16, color: '1E3A8A' })
                        ]
                      })
                    ]
                  }),
                  new TableCell({
                    width: { size: 20, type: WidthType.PERCENTAGE },
                    margins: { top: 120, bottom: 120, left: 100, right: 100 },
                    borders: {
                      top: { style: BorderStyle.SINGLE, size: 8, color: '1E3A8A' },
                      bottom: { style: BorderStyle.SINGLE, size: 8, color: '1E3A8A' },
                      left: { style: BorderStyle.SINGLE, size: 8, color: '1E3A8A' },
                      right: { style: BorderStyle.SINGLE, size: 8, color: '1E3A8A' }
                    },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'MOMENTO 2 • PROYECTAR\n(Ambientes, acuerdos y propósitos)', bold: true, size: 16, color: '1E3A8A' })
                        ]
                      })
                    ]
                  }),
                  new TableCell({
                    width: { size: 20, type: WidthType.PERCENTAGE },
                    margins: { top: 120, bottom: 120, left: 100, right: 100 },
                    borders: {
                      top: { style: BorderStyle.SINGLE, size: 8, color: '1E3A8A' },
                      bottom: { style: BorderStyle.SINGLE, size: 8, color: '1E3A8A' },
                      left: { style: BorderStyle.SINGLE, size: 8, color: '1E3A8A' },
                      right: { style: BorderStyle.SINGLE, size: 8, color: '1E3A8A' }
                    },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'MOMENTO 3 • VIVIR LA EXPERIENCIA\n(Acción vivencial y talleres activos)', bold: true, size: 16, color: '1E3A8A' })
                        ]
                      })
                    ]
                  }),
                  new TableCell({
                    width: { size: 20, type: WidthType.PERCENTAGE },
                    margins: { top: 120, bottom: 120, left: 100, right: 100 },
                    borders: {
                      top: { style: BorderStyle.SINGLE, size: 8, color: '1E3A8A' },
                      bottom: { style: BorderStyle.SINGLE, size: 8, color: '1E3A8A' },
                      left: { style: BorderStyle.SINGLE, size: 8, color: '1E3A8A' },
                      right: { style: BorderStyle.SINGLE, size: 8, color: '1E3A8A' }
                    },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'MOMENTO 4 • CONSOLIDACIÓN\n(Recoger, socializar y tejer)', bold: true, size: 16, color: '1E3A8A' })
                        ]
                      })
                    ]
                  }),
                  new TableCell({
                    width: { size: 20, type: WidthType.PERCENTAGE },
                    margins: { top: 120, bottom: 120, left: 100, right: 100 },
                    borders: {
                      top: { style: BorderStyle.SINGLE, size: 8, color: '047857' },
                      bottom: { style: BorderStyle.SINGLE, size: 8, color: '047857' },
                      left: { style: BorderStyle.SINGLE, size: 8, color: '047857' },
                      right: { style: BorderStyle.SINGLE, size: 8, color: '047857' }
                    },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'MOMENTO 5 • VALORACIÓN\n(Valorar el proceso y seguimiento)', bold: true, size: 16, color: '047857' })
                        ]
                      })
                    ]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 20, type: WidthType.PERCENTAGE },
                    margins: { top: 100, bottom: 100, left: 100, right: 100 },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Experiencia de Interés:\n', bold: true, size: 16, color: '1E40AF' }),
                          new TextRun({ text: `"${plan.theExperience || plan.problematizingQuestion}"\n\n`, italics: true, size: 15, color: '1E40AF' }),
                          new TextRun({ text: `Acción: ${plan.phases[0]?.description || 'Provocación sensorial y acogida inicial.'}`, size: 15, color: '334155' })
                        ]
                      })
                    ]
                  }),
                  new TableCell({
                    width: { size: 20, type: WidthType.PERCENTAGE },
                    margins: { top: 100, bottom: 100, left: 100, right: 100 },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: '• Acuerdos de convivencia y cuidado.\n', size: 15, color: '334155' }),
                          new TextRun({ text: '• 4 Propósitos articulados con Imprescindibles.\n', size: 15, color: '334155' }),
                          new TextRun({ text: `• Rutas: ${plan.phases[1]?.description || 'Diseño de estaciones y materiales concretos.'}\n`, size: 15, color: '334155' }),
                          new TextRun({ text: '• Actividades Rectoras: Juego, Arte, Literatura y Exploración.', size: 15, color: '334155' })
                        ]
                      })
                    ]
                  }),
                  new TableCell({
                    width: { size: 20, type: WidthType.PERCENTAGE },
                    margins: { top: 100, bottom: 100, left: 100, right: 100 },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: `Talleres y Estaciones: ${plan.phases[2]?.description || 'Juego cooperativo, manipulación y exploración.'}\n\n`, size: 15, color: '334155' }),
                          new TextRun({ text: `Ajustes DUA: ${plan.inclusionPIAR}`, size: 14, color: '64748B' })
                        ]
                      })
                    ]
                  }),
                  new TableCell({
                    width: { size: 20, type: WidthType.PERCENTAGE },
                    margins: { top: 100, bottom: 100, left: 100, right: 100 },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: `Socialización: ${plan.phases[3]?.description || 'Encuentro colectivo y muestra de creaciones.'}\n\n`, size: 15, color: '334155' }),
                          new TextRun({ text: `Producto Final: ${plan.expectedResult}\n\n`, bold: true, size: 15, color: 'B45309' }),
                          new TextRun({ text: `Familia: ${plan.familyInvolvement}`, size: 14, color: '64748B' })
                        ]
                      })
                    ]
                  }),
                  new TableCell({
                    width: { size: 20, type: WidthType.PERCENTAGE },
                    margins: { top: 100, bottom: 100, left: 100, right: 100 },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: '• Seguimiento al desarrollo infantil continuo y dialógico.\n', size: 15, color: '065F46' }),
                          new TextRun({ text: `• ${plan.phases[4]?.description || 'Círculo de valoración con los niños.'}\n\n`, size: 15, color: '065F46' }),
                          new TextRun({ text: '• Instrumentos: Diarios de campo, Bitácoras, Portafolio y Estudio de casos.', bold: true, size: 15, color: '047857' })
                        ]
                      })
                    ]
                  })
                ]
              })
            ]
          }),

          // 5. EXPERIENCIA DE INTERÉS (DETONANTE PEDAGÓGICO)
          new Paragraph({
            spacing: { before: 140, after: 60 },
            children: [
              new TextRun({
                text: 'EXPERIENCIA DE INTERÉS (DETONANTE PEDAGÓGICO CENTRAL):',
                bold: true,
                size: 22,
                color: '1E3A8A'
              })
            ]
          }),
          new Paragraph({
            spacing: { after: 180 },
            children: [
              new TextRun({
                text: `"${plan.theExperience || plan.problematizingQuestion}"`,
                italics: true,
                bold: true,
                size: 21,
                color: '334155'
              })
            ]
          }),

          // 6. DURACIÓN ESTIMADA
          new Paragraph({
            spacing: { before: 80, after: 180 },
            children: [
              new TextRun({
                text: 'DURACIÓN ESTIMADA: ',
                bold: true,
                size: 22,
                color: '0F172A'
              }),
              new TextRun({
                text: plan.duration,
                size: 22,
                color: '334155'
              })
            ]
          }),

          // 7. JUSTIFICACIÓN
          new Paragraph({
            spacing: { before: 100, after: 60 },
            children: [
              new TextRun({
                text: 'JUSTIFICACIÓN:',
                bold: true,
                size: 22,
                color: '0F172A'
              })
            ]
          }),
          new Paragraph({
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: plan.justification,
                size: 21,
                color: '334155'
              })
            ]
          }),

          ...(plan.teacherPrompt ? [
            new Paragraph({
              spacing: { before: 100, after: 60 },
              children: [
                new TextRun({
                  text: 'IDEAS PEDAGÓGICAS Y PROMPT PERSONALIZADO DEL DOCENTE:',
                  bold: true,
                  size: 22,
                  color: '1E3A8A'
                })
              ]
            }),
            new Paragraph({
              spacing: { after: 200 },
              children: [
                new TextRun({
                  text: `"${plan.teacherPrompt}"`,
                  italics: true,
                  size: 21,
                  color: '334155'
                })
              ]
            })
          ] : []),

          // 6. OBJETIVO GENERAL
          new Paragraph({
            spacing: { before: 100, after: 60 },
            children: [
              new TextRun({
                text: 'OBJETIVO GENERAL:',
                bold: true,
                size: 22,
                color: '0F172A'
              })
            ]
          }),
          new Paragraph({
            spacing: { after: 220 },
            children: [
              new TextRun({
                text: plan.generalObjective,
                size: 21,
                color: '334155'
              })
            ]
          }),

          // 7. PRODUCTO FINAL ACUMULATIVO (REFERENCIA VISUAL)
          new Paragraph({
            spacing: { before: 140, after: 100 },
            children: [
              new TextRun({
                text: 'PRODUCTO FINAL ACUMULATIVO (REFERENCIA VISUAL):',
                bold: true,
                size: 22,
                color: '0F172A'
              })
            ]
          }),

          ...(productBytes ? [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { before: 80, after: 120 },
              children: [
                new ImageRun({
                  data: productBytes,
                  transformation: {
                    width: 540,
                    height: 260
                  },
                  type: 'png'
                })
              ]
            })
          ] : []),

          new Paragraph({
            spacing: { after: 260 },
            children: [
              new TextRun({
                text: plan.expectedResult,
                italics: true,
                bold: true,
                size: 21,
                color: '1E293B'
              })
            ]
          }),

          // 8. ACTIVIDADES RECTORAS DE LA EDUCACIÓN INICIAL (DECRETO 1411 DE 2022)
          new Paragraph({
            spacing: { before: 200, after: 120 },
            children: [
              new TextRun({
                text: 'ACTIVIDADES RECTORAS DE LA EDUCACIÓN INICIAL (DECRETO 1411 DE 2022):',
                bold: true,
                size: 24,
                color: '0F172A'
              })
            ]
          }),

          ...(plan.rectorActivities && plan.rectorActivities.length >= 4 ? plan.rectorActivities : [
            {
              activity: 'Exploración del Medio',
              description: `Indagación directa y recolección de materiales sensoriales del entorno cotidiano en torno a "${plan.topic}". Los niños observan detalles con lupas, recolectan muestras y formulan hipótesis guiadas.`,
              howChildApplies: `El niño/a toca, huele, compara texturas, usa recipientes para clasificar elementos de la naturaleza y hace preguntas espontáneas sobre el tema.`
            },
            {
              activity: 'Juego',
              description: `Experiencias de juego libre, simbólico y cooperativo con circuitos psicomotores estructurados a partir de "${plan.topic}".`,
              howChildApplies: `El niño/a asume personajes, inventa reglas y acuerdos con sus pares, negocia turnos y disfruta del movimiento corporal coordinado.`
            },
            {
              activity: 'Arte',
              description: `Expresión plástica, dactilopintura, modelado en arcilla o plastilina, música y danza inspiradas en "${plan.topic}".`,
              howChildApplies: `El niño/a plasma sus emociones con trazos libres, estampa colores con esponjas y manos, moldea figuras y canta o baila al ritmo de melodías.`
            },
            {
              activity: 'Literatura',
              description: `Lectura dialógica de cuentos ilustrados, rincón de libros táctiles, rimas, nanas y relatos orales vinculados a "${plan.topic}".`,
              howChildApplies: `El niño/a hojea libros con curiosidad, "lee" a través de las ilustraciones, anticipa finales e inventa relatos orales con sus compañeros.`
            }
          ]).flatMap(item => [
            new Paragraph({
              spacing: { before: 100, after: 60 },
              children: [
                new TextRun({
                  text: `• ${item.activity.toUpperCase()}: `,
                  bold: true,
                  size: 21,
                  color: '1E3A8A'
                }),
                new TextRun({
                  text: item.description,
                  size: 20,
                  color: '334155'
                })
              ]
            }),
            new Paragraph({
              spacing: { before: 40, after: 120 },
              children: [
                new TextRun({
                  text: `   ¿Cómo lo aplica y vivencia el niño/a?: `,
                  bold: true,
                  italics: true,
                  size: 19,
                  color: '047857'
                }),
                new TextRun({
                  text: item.howChildApplies,
                  italics: true,
                  size: 19,
                  color: '065F46'
                })
              ]
            })
          ]),

          // 9. RUTA METODOLÓGICA (FASES)
          new Paragraph({
            spacing: { before: 180, after: 160 },
            children: [
              new TextRun({
                text: 'RUTA METODOLÓGICA (FASES):',
                bold: true,
                size: 24,
                color: '0F172A'
              })
            ]
          }),

          ...plan.phases.flatMap((phase, idx) => {
            const phaseImgBytes = phaseImageBytesList[idx];
            return [
              // Encabezado de la Fase
              new Paragraph({
                spacing: { before: 140, after: 80 },
                children: [
                  new TextRun({
                    text: `${phase.timeframe ? phase.timeframe.toUpperCase() + ': ' : ''}${phase.name}: ${phase.title}`,
                    bold: true,
                    size: 22,
                    color: '0F172A'
                  })
                ]
              }),

              // Imagen de la Fase (si está disponible)
              ...(phaseImgBytes ? [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 60, after: 120 },
                  children: [
                    new ImageRun({
                      data: phaseImgBytes,
                      transformation: {
                        width: 520,
                        height: 230
                      },
                      type: 'png'
                    })
                  ]
                })
              ] : []),

              // Descripción de la Fase
              new Paragraph({
                spacing: { after: 100 },
                children: [
                  new TextRun({
                    text: phase.description,
                    size: 21,
                    color: '334155'
                  })
                ]
              }),

              // Hito (si aplica)
              ...(phase.milestone ? [
                new Paragraph({
                  spacing: { after: 80 },
                  children: [
                    new TextRun({ text: 'Hito de Desarrollo / Logro: ', bold: true, color: 'D97706', size: 20 }),
                    new TextRun({ text: phase.milestone, size: 20, color: '334155' })
                  ]
                })
              ] : []),

              // Estrategias de mediación
              new Paragraph({
                spacing: { before: 60, after: 60 },
                children: [
                  new TextRun({
                    text: 'Estrategias de mediación:',
                    bold: true,
                    size: 21,
                    color: '0F172A'
                  })
                ]
              }),

              ...phase.strategiesAndVoices.map(strat => new Paragraph({
                bullet: { level: 0 },
                spacing: { after: 40 },
                children: [
                  new TextRun({
                    text: strat,
                    size: 20,
                    color: '334155'
                  })
                ]
              })),

              new Paragraph({ text: '', spacing: { after: 160 } })
            ];
          }),

          // 9. AJUSTES RAZONABLES E INCLUSIÓN (PIAR)
          new Paragraph({
            spacing: { before: 180, after: 80 },
            children: [
              new TextRun({
                text: 'AJUSTES RAZONABLES E INCLUSIÓN (PIAR):',
                bold: true,
                size: 22,
                color: '0F172A'
              })
            ]
          }),
          new Paragraph({
            spacing: { after: 240 },
            children: [
              new TextRun({
                text: plan.inclusionPIAR,
                size: 21,
                color: '334155'
              })
            ]
          }),

          // 10. MARCO CURRICULAR COMPLEMENTARIO & ALINEACIONES COLOMBIA
          new Paragraph({
            spacing: { before: 180, after: 80 },
            children: [
              new TextRun({
                text: 'EJE RELACIONAL Y PREGUNTA PROBLEMATIZADORA:',
                bold: true,
                size: 22,
                color: '1E3A8A'
              })
            ]
          }),
          new Paragraph({
            spacing: { after: 60 },
            children: [
              new TextRun({ text: 'Eje Curricular Relacional: ', bold: true, color: '1E3A8A', size: 20 }),
              new TextRun({ text: plan.relationalAxis, size: 20, color: '334155' })
            ]
          }),
          new Paragraph({
            spacing: { after: 200 },
            children: [
              new TextRun({ text: 'Experiencia de Interés (Pregunta Detonante en Indagar): ', bold: true, color: '1E40AF', size: 20 }),
              new TextRun({ text: `"${plan.theExperience || plan.problematizingQuestion}"`, italics: true, size: 20, color: '1E40AF' })
            ]
          }),

          // Propósitos MEN
          ...(plan.propositosMEN && plan.propositosMEN.length > 0 ? [
            new Paragraph({
              spacing: { before: 140, after: 80 },
              children: [
                new TextRun({
                  text: 'ALINEACIÓN CON LOS PROPÓSITOS DE LA EDUCACIÓN INICIAL (MEN COLOMBIA):',
                  bold: true,
                  size: 22,
                  color: '1E3A8A'
                })
              ]
            }),
            ...plan.propositosMEN.map(prop => new Paragraph({
              bullet: { level: 0 },
              spacing: { after: 40 },
              children: [new TextRun({ text: prop, size: 20, color: '334155' })]
            })),
            new Paragraph({ text: '', spacing: { after: 180 } })
          ] : []),

          // Aprendizajes Imprescindibles y Capacidades
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    shading: { fill: '1E3A8A' },
                    margins: { top: 120, bottom: 120, left: 140, right: 140 },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'APRENDIZAJES IMPRESCINDIBLES', bold: true, color: 'FFFFFF', size: 19 })
                        ]
                      })
                    ]
                  }),
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    shading: { fill: '1E40AF' },
                    margins: { top: 120, bottom: 120, left: 140, right: 140 },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'CAPACIDADES A DESARROLLAR', bold: true, color: 'FFFFFF', size: 19 })
                        ]
                      })
                    ]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    shading: { fill: 'F0F7FF' },
                    borders: {
                      bottom: { style: BorderStyle.SINGLE, size: 8, color: 'BFDBFE' },
                      left: { style: BorderStyle.SINGLE, size: 8, color: 'BFDBFE' },
                      right: { style: BorderStyle.SINGLE, size: 8, color: 'BFDBFE' }
                    },
                    margins: { top: 140, bottom: 140, left: 140, right: 140 },
                    children: plan.essentialLearnings.map(item => new Paragraph({
                      bullet: { level: 0 },
                      spacing: { after: 60 },
                      children: [new TextRun({ text: item, size: 18 })]
                    }))
                  }),
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    shading: { fill: 'F0F7FF' },
                    borders: {
                      bottom: { style: BorderStyle.SINGLE, size: 8, color: 'BFDBFE' },
                      left: { style: BorderStyle.SINGLE, size: 8, color: 'BFDBFE' },
                      right: { style: BorderStyle.SINGLE, size: 8, color: 'BFDBFE' }
                    },
                    margins: { top: 140, bottom: 140, left: 140, right: 140 },
                    children: plan.capacitiesToDevelop.map(item => new Paragraph({
                      bullet: { level: 0 },
                      spacing: { after: 60 },
                      children: [new TextRun({ text: item, size: 18 })]
                    }))
                  })
                ]
              })
            ]
          }),

          new Paragraph({ text: '', spacing: { after: 200 } }),

          // Vinculación Familiar
          new Paragraph({
            spacing: { before: 140, after: 60 },
            children: [
              new TextRun({ text: 'VINCULACIÓN FAMILIAR Y COMUNITARIA:', bold: true, color: '1E3A8A', size: 22 })
            ]
          }),
          new Paragraph({
            spacing: { after: 200 },
            children: [new TextRun({ text: plan.familyInvolvement, size: 21, color: '334155' })]
          }),

          // VALORAR EL PROCESO (LINEAMIENTOS DE EDUCACIÓN INICIAL - MEN COLOMBIA)
          new Paragraph({
            spacing: { before: 140, after: 80 },
            children: [
              new TextRun({ text: 'VALORAR EL PROCESO (LINEAMIENTOS DE EDUCACIÓN INICIAL - MEN COLOMBIA):', bold: true, color: '047857', size: 22 })
            ]
          }),
          new Paragraph({
            spacing: { after: 60 },
            children: [
              new TextRun({ text: 'Seguimiento al Desarrollo Infantil: ', bold: true, color: '047857', size: 20 }),
              new TextRun({ text: 'Observación atenta y escucha pedagógica activa de los procesos singulares de cada niña y niño, reconociendo sus ritmos y avances sin calificar numéricamente ni rotular.', size: 20, color: '334155' })
            ]
          }),
          new Paragraph({
            spacing: { after: 60 },
            children: [
              new TextRun({ text: 'Instrumentos Técnicos de Registro: ', bold: true, color: '047857', size: 20 }),
              new TextRun({ text: 'Diarios de campo pedagógicos, bitácora de aula y viajera, portafolio de creaciones infantiles y estudio de casos.', size: 20, color: '334155' })
            ]
          }),
          new Paragraph({
            spacing: { after: 200 },
            children: [
              new TextRun({ text: 'Momento 5 de Valoración Dialógica: ', bold: true, color: '047857', size: 20 }),
              new TextRun({ text: 'Círculo de la palabra donde los niños relatan sus descubrimientos con palabras, gestos y obras, valorando el proceso vivido en comunidad.', size: 20, color: '334155' })
            ]
          }),

          // Contexto Territorial (si aplica)
          ...(plan.ethnicAndTerritorialContext ? [
            new Paragraph({
              spacing: { before: 140, after: 60 },
              children: [
                new TextRun({ text: 'CONTEXTO TERRITORIAL Y SABERES ANCESTRALES:', bold: true, color: 'B45309', size: 22 })
              ]
            }),
            new Paragraph({
              spacing: { after: 200 },
              children: [new TextRun({ text: plan.ethnicAndTerritorialContext, size: 21, color: '334155' })]
            })
          ] : []),

          // FIRMAS Y VALIDACIÓN PEDAGÓGICA
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    margins: { top: 320, bottom: 100, left: 100, right: 100 },
                    borders: {
                      top: { style: BorderStyle.SINGLE, size: 12, color: '0F172A' }
                    },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({ text: 'DOCENTE / AGENTE EDUCATIVO', bold: true, size: 18, color: '0F172A' })
                        ]
                      }),
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({ text: 'Firma y Documento de Identidad', size: 16, color: '64748B' })
                        ]
                      })
                    ]
                  }),
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    margins: { top: 320, bottom: 100, left: 100, right: 100 },
                    borders: {
                      top: { style: BorderStyle.SINGLE, size: 12, color: '0F172A' }
                    },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({ text: 'COORDINACIÓN PEDAGÓGICA / LÍDER INSTITUCIONAL', bold: true, size: 18, color: '0F172A' })
                        ]
                      }),
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({ text: 'Validación Curricular y Seguimiento', size: 16, color: '64748B' })
                        ]
                      })
                    ]
                  })
                ]
              })
            ]
          })
        ]
      }
    ]
  });

  const blob = await Packer.toBlob(doc);
  const cleanTitle = plan.title
    .substring(0, 35)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '_');
  
  const fileName = `${cleanTitle}_planeacion_primera_infancia.docx`;
  saveAs(blob, fileName);
}

/**
 * Exporta exclusivamente la TABLA MATRIZ PEDAGÓGICA SINTÉTICA en formato Word (.docx)
 * Configurado exactamente según los requerimientos solicitados:
 * - Hoja Legal Horizontal (Legal Landscape: 14" x 8.5" = 20160 x 12240 dxa)
 * - Márgenes Estrechos (0.5 pulgadas = 720 dxa)
 * - Tipo de letra Calibri
 * - Tamaño de fuente Calibri 10 (size: 20 en docx half-points)
 * - Detalle exhaustivo de las Actividades Rectoras (Exploración del Medio, Juego, Arte, Literatura)
 * - Matriz de los 5 Momentos Pedagógicos
 * - Articulación de Propósitos de Educación Inicial con Imprescindibles
 */
export async function exportMatrizLegalDocx(plan: Planification) {
  const rectoras = getRectorActivitiesDetails(plan);
  const articulados = getArticulatedPropositos(plan);
  const momentosSocio = getSynchronizedMomentsSocioemotional(plan);
  const rectorasSocio = getSynchronizedRectorasSocioemotional(plan);
  const crossSocio = getSocioemotionalCrossMatrix(plan);

  const momento1 = plan.phases.find((p) => p.phaseNumber === 1) || plan.phases[0];
  const momento2 = plan.phases.find((p) => p.phaseNumber === 2) || plan.phases[1];
  const momento3 = plan.phases.find((p) => p.phaseNumber === 3) || plan.phases[2];
  const momento4 = plan.phases.find((p) => p.phaseNumber === 4) || plan.phases[3];
  const momento5 = plan.phases.find((p) => p.phaseNumber === 5) || plan.phases[4];

  const theExperienceText = plan.theExperience || plan.problematizingQuestion;

  const fontCalibri = 'Calibri';
  const size10 = 20; // 10pt = 20 half-points
  const size11 = 22; // 11pt
  const size12 = 24; // 12pt
  const size9 = 18;  // 9pt

  const borderNavy = {
    top: { style: BorderStyle.SINGLE, size: 8, color: '1E3A8A' },
    bottom: { style: BorderStyle.SINGLE, size: 8, color: '1E3A8A' },
    left: { style: BorderStyle.SINGLE, size: 8, color: '1E3A8A' },
    right: { style: BorderStyle.SINGLE, size: 8, color: '1E3A8A' }
  };

  const borderMuted = {
    top: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' },
    bottom: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' },
    left: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' },
    right: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' }
  };

  const doc = new Document({
    creator: 'Sistema de Planificación Pedagógica de Educación Inicial',
    title: `Matriz Pedagógica Legal - ${plan.title}`,
    description: 'Matriz pedagógica sintética en hoja legal horizontal con márgenes estrechos y fuente Calibri 10',
    sections: [
      {
        properties: {
          page: {
            size: {
              orientation: PageOrientation.LANDSCAPE,
              width: 20160,  // 14 pulgadas (Legal)
              height: 12240   // 8.5 pulgadas
            },
            margin: {
              top: 720,    // 0.5 pulgadas = margen estrecho
              bottom: 720,
              left: 720,
              right: 720
            }
          }
        },
        children: [
          // 1. ENCABEZADO INSTITUCIONAL
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 40 },
            children: [
              new TextRun({
                text: 'INSTITUCIÓN EDUCATIVA DEL MUNICIPIO DE SAN PEDRO',
                bold: true,
                font: fontCalibri,
                size: size12,
                color: '1E3A8A'
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 40 },
            children: [
              new TextRun({
                text: 'RESUMEN TIPO TABLA • MATRIZ PEDAGÓGICA SINTÉTICA Y ACTIVIDADES RECTORAS',
                bold: true,
                font: fontCalibri,
                size: size11,
                color: '1E40AF'
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: 'Educación Inicial • Decreto 1411 de 2022 • Ley 2503 de 2025 • Formato Hoja Legal Horizontal • Márgenes Estrechos (0.5") • Fuente Calibri 10pt',
                italics: true,
                font: fontCalibri,
                size: size9,
                color: '64748B'
              })
            ]
          }),

          // 2. TABLA DE IDENTIFICACIÓN GENERAL
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 35, type: WidthType.PERCENTAGE },
                    margins: { top: 80, bottom: 80, left: 100, right: 100 },
                    borders: borderNavy,
                    shading: { type: ShadingType.CLEAR, fill: 'F1F5F9' },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'PLANEACIÓN / PROYECTO: ', bold: true, font: fontCalibri, size: size10, color: '1E3A8A' }),
                          new TextRun({ text: plan.title, bold: true, font: fontCalibri, size: size10, color: '0F172A' })
                        ]
                      })
                    ]
                  }),
                  new TableCell({
                    width: { size: 25, type: WidthType.PERCENTAGE },
                    margins: { top: 80, bottom: 80, left: 100, right: 100 },
                    borders: borderNavy,
                    shading: { type: ShadingType.CLEAR, fill: 'F1F5F9' },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'TIPO Y EDAD: ', bold: true, font: fontCalibri, size: size10, color: '1E3A8A' }),
                          new TextRun({
                            text: `${plan.type === 'proyecto' ? 'Proyecto de Aula' : plan.type === 'contenido' ? 'Planeación de Contenidos' : 'Planeación de Experiencias'} • ${plan.ageRange}`,
                            font: fontCalibri,
                            size: size10,
                            color: '0F172A'
                          })
                        ]
                      })
                    ]
                  }),
                  new TableCell({
                    width: { size: 20, type: WidthType.PERCENTAGE },
                    margins: { top: 80, bottom: 80, left: 100, right: 100 },
                    borders: borderNavy,
                    shading: { type: ShadingType.CLEAR, fill: 'F1F5F9' },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'DURACIÓN: ', bold: true, font: fontCalibri, size: size10, color: '1E3A8A' }),
                          new TextRun({ text: plan.duration, font: fontCalibri, size: size10, color: '0F172A' })
                        ]
                      })
                    ]
                  }),
                  new TableCell({
                    width: { size: 20, type: WidthType.PERCENTAGE },
                    margins: { top: 80, bottom: 80, left: 100, right: 100 },
                    borders: borderNavy,
                    shading: { type: ShadingType.CLEAR, fill: 'F1F5F9' },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'EJE RELACIONAL: ', bold: true, font: fontCalibri, size: size10, color: '1E3A8A' }),
                          new TextRun({ text: plan.relationalAxis, font: fontCalibri, size: size10, color: '0F172A' })
                        ]
                      })
                    ]
                  })
                ]
              })
            ]
          }),

          // 3. EXPERIENCIA DE INTERÉS (DETONANTE PEDAGÓGICO)
          new Paragraph({ spacing: { before: 80, after: 30 }, children: [] }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    margins: { top: 100, bottom: 100, left: 120, right: 120 },
                    borders: {
                      top: { style: BorderStyle.SINGLE, size: 10, color: '2563EB' },
                      bottom: { style: BorderStyle.SINGLE, size: 10, color: '2563EB' },
                      left: { style: BorderStyle.SINGLE, size: 10, color: '2563EB' },
                      right: { style: BorderStyle.SINGLE, size: 10, color: '2563EB' }
                    },
                    shading: { type: ShadingType.CLEAR, fill: 'EFF6FF' },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: 'EXPERIENCIA DE INTERÉS (DETONANTE PEDAGÓGICO CENTRAL): ',
                            bold: true,
                            font: fontCalibri,
                            size: size10,
                            color: '1E3A8A'
                          }),
                          new TextRun({
                            text: `"${theExperienceText}"`,
                            italics: true,
                            bold: true,
                            font: fontCalibri,
                            size: size10,
                            color: '1E40AF'
                          })
                        ]
                      }),
                      new Paragraph({
                        spacing: { before: 40 },
                        children: [
                          new TextRun({
                            text: 'Moviliza la curiosidad y el asombro infantil vinculando las 4 actividades rectoras (Juego, Arte, Literatura, Exploración del Medio) con los 4 propósitos del MEN.',
                            font: fontCalibri,
                            size: size9,
                            color: '334155'
                          })
                        ]
                      })
                    ]
                  })
                ]
              })
            ]
          }),

          // 4. SECCIÓN I: TABLA MATRIZ DE LOS 5 MOMENTOS PEDAGÓGICOS (5 COLUMNAS HORIZONTALES)
          new Paragraph({
            spacing: { before: 140, after: 60 },
            children: [
              new TextRun({
                text: 'I. MATRIZ HORIZONTAL DE LOS 5 MOMENTOS DE LA EXPERIENCIA PEDAGÓGICA (DECRETO 1411 / MEN)',
                bold: true,
                font: fontCalibri,
                size: size11,
                color: '1E3A8A'
              })
            ]
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              // ENCABEZADOS DE LOS 5 MOMENTOS
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 20, type: WidthType.PERCENTAGE },
                    margins: { top: 100, bottom: 100, left: 80, right: 80 },
                    borders: borderNavy,
                    shading: { type: ShadingType.CLEAR, fill: 'DBEAFE' },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({ text: 'MOMENTO 1\nINDAGAR', bold: true, font: fontCalibri, size: size10, color: '1E3A8A' }),
                          new TextRun({ text: '\n(Escuchar y Asombrar)', italics: true, font: fontCalibri, size: size9, color: '1E40AF' })
                        ]
                      })
                    ]
                  }),
                  new TableCell({
                    width: { size: 20, type: WidthType.PERCENTAGE },
                    margins: { top: 100, bottom: 100, left: 80, right: 80 },
                    borders: borderNavy,
                    shading: { type: ShadingType.CLEAR, fill: 'E0E7FF' },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({ text: 'MOMENTO 2\nPROYECTAR', bold: true, font: fontCalibri, size: size10, color: '3730A3' }),
                          new TextRun({ text: '\n(Diseñar Ambientes)', italics: true, font: fontCalibri, size: size9, color: '4338CA' })
                        ]
                      })
                    ]
                  }),
                  new TableCell({
                    width: { size: 20, type: WidthType.PERCENTAGE },
                    margins: { top: 100, bottom: 100, left: 80, right: 80 },
                    borders: borderNavy,
                    shading: { type: ShadingType.CLEAR, fill: 'FEF3C7' },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({ text: 'MOMENTO 3\nVIVIR LA EXPERIENCIA', bold: true, font: fontCalibri, size: size10, color: '92400E' }),
                          new TextRun({ text: '\n(Acción y Vivencia)', italics: true, font: fontCalibri, size: size9, color: 'B45309' })
                        ]
                      })
                    ]
                  }),
                  new TableCell({
                    width: { size: 20, type: WidthType.PERCENTAGE },
                    margins: { top: 100, bottom: 100, left: 80, right: 80 },
                    borders: borderNavy,
                    shading: { type: ShadingType.CLEAR, fill: 'F3E8FF' },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({ text: 'MOMENTO 4\nCONSOLIDACIÓN', bold: true, font: fontCalibri, size: size10, color: '6B21A8' }),
                          new TextRun({ text: '\n(Socializar y Tejer)', italics: true, font: fontCalibri, size: size9, color: '7E22CE' })
                        ]
                      })
                    ]
                  }),
                  new TableCell({
                    width: { size: 20, type: WidthType.PERCENTAGE },
                    margins: { top: 100, bottom: 100, left: 80, right: 80 },
                    borders: borderNavy,
                    shading: { type: ShadingType.CLEAR, fill: 'D1FAE5' },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({ text: 'MOMENTO 5\nVALORACIÓN', bold: true, font: fontCalibri, size: size10, color: '065F46' }),
                          new TextRun({ text: '\n(Valorar el Proceso)', italics: true, font: fontCalibri, size: size9, color: '047857' })
                        ]
                      })
                    ]
                  })
                ]
              }),

              // CONTENIDO DE LOS 5 MOMENTOS (CALIBRI 10)
              new TableRow({
                children: [
                  // CELDA MOMENTO 1
                  new TableCell({
                    width: { size: 20, type: WidthType.PERCENTAGE },
                    margins: { top: 90, bottom: 90, left: 80, right: 80 },
                    borders: borderMuted,
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: `${momento1?.title || 'Provocación Sensorial e Indagación'}\n\n`, bold: true, font: fontCalibri, size: size10, color: '0F172A' }),
                          new TextRun({ text: 'Acción Pedagógica:\n', bold: true, font: fontCalibri, size: size10, color: '1E3A8A' }),
                          new TextRun({ text: `${momento1?.description || 'Provocación sensorial y escucha atenta de hipótesis infantiles.'}\n\n`, font: fontCalibri, size: size10, color: '334155' }),
                          new TextRun({ text: 'Estrategias y Voces:\n', bold: true, font: fontCalibri, size: size10, color: '1E3A8A' }),
                          new TextRun({
                            text: (momento1?.strategiesAndVoices || ['Círculo de la palabra', 'Caja misteriosa', 'Juego de asombro']).map(s => `• ${s}`).join('\n'),
                            font: fontCalibri,
                            size: size10,
                            color: '334155'
                          })
                        ]
                      })
                    ]
                  }),

                  // CELDA MOMENTO 2
                  new TableCell({
                    width: { size: 20, type: WidthType.PERCENTAGE },
                    margins: { top: 90, bottom: 90, left: 80, right: 80 },
                    borders: borderMuted,
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: `${momento2?.title || 'Acuerdos de Convivencia y Organización'}\n\n`, bold: true, font: fontCalibri, size: size10, color: '0F172A' }),
                          new TextRun({ text: 'Acción Pedagógica:\n', bold: true, font: fontCalibri, size: size10, color: '3730A3' }),
                          new TextRun({ text: `${momento2?.description || 'Diseño de rutas de aprendizaje, pactos de aula y estaciones exploratorias.'}\n\n`, font: fontCalibri, size: size10, color: '334155' }),
                          new TextRun({ text: 'Acuerdos Pedagógicos:\n', bold: true, font: fontCalibri, size: size10, color: '3730A3' }),
                          new TextRun({
                            text: '• Cuidado mutuo y buen trato\n• Uso compartido de materiales\n• Rutas de trabajo y turnos',
                            font: fontCalibri,
                            size: size10,
                            color: '334155'
                          })
                        ]
                      })
                    ]
                  }),

                  // CELDA MOMENTO 3
                  new TableCell({
                    width: { size: 20, type: WidthType.PERCENTAGE },
                    margins: { top: 90, bottom: 90, left: 80, right: 80 },
                    borders: borderMuted,
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: `${momento3?.title || 'Vivencia Lúdica y Talleres Activos'}\n\n`, bold: true, font: fontCalibri, size: size10, color: '0F172A' }),
                          new TextRun({ text: 'Acción Vivencial:\n', bold: true, font: fontCalibri, size: size10, color: '92400E' }),
                          new TextRun({ text: `${momento3?.description || 'Estaciones de juego simbólico, manipulación directa de texturas y exploración del medio.'}\n\n`, font: fontCalibri, size: size10, color: '334155' }),
                          new TextRun({ text: 'Inclusión DUA en la Vivencia:\n', bold: true, font: fontCalibri, size: size10, color: '92400E' }),
                          new TextRun({ text: `${plan.inclusionPIAR}`, font: fontCalibri, size: size10, color: '334155' })
                        ]
                      })
                    ]
                  }),

                  // CELDA MOMENTO 4
                  new TableCell({
                    width: { size: 20, type: WidthType.PERCENTAGE },
                    margins: { top: 90, bottom: 90, left: 80, right: 80 },
                    borders: borderMuted,
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: `${momento4?.title || 'Consolidación Creativa y Encuentro'}\n\n`, bold: true, font: fontCalibri, size: size10, color: '0F172A' }),
                          new TextRun({ text: 'Tejido Colectivo:\n', bold: true, font: fontCalibri, size: size10, color: '6B21A8' }),
                          new TextRun({ text: `${momento4?.description || 'Puesta en común de descubrimientos, ensamble del producto vivencial y diálogo con familias.'}\n\n`, font: fontCalibri, size: size10, color: '334155' }),
                          new TextRun({ text: 'Producto Final Acumulado:\n', bold: true, font: fontCalibri, size: size10, color: '6B21A8' }),
                          new TextRun({ text: `${plan.expectedResult}\n\n`, font: fontCalibri, size: size10, color: '334155' }),
                          new TextRun({ text: `Vínculo Familiar: ${plan.familyInvolvement}`, font: fontCalibri, size: size10, color: '475569' })
                        ]
                      })
                    ]
                  }),

                  // CELDA MOMENTO 5
                  new TableCell({
                    width: { size: 20, type: WidthType.PERCENTAGE },
                    margins: { top: 90, bottom: 90, left: 80, right: 80 },
                    borders: borderMuted,
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: `${momento5?.title || 'Valorar el Proceso: Escucha Pedagógica'}\n\n`, bold: true, font: fontCalibri, size: size10, color: '0F172A' }),
                          new TextRun({ text: 'Seguimiento Formativo:\n', bold: true, font: fontCalibri, size: size10, color: '065F46' }),
                          new TextRun({ text: `${momento5?.description || 'Círculo dialógico donde los niños relatan sus descubrimientos, valorando avances sin calificaciones.'}\n\n`, font: fontCalibri, size: size10, color: '334155' }),
                          new TextRun({ text: 'Instrumentos Cualitativos:\n', bold: true, font: fontCalibri, size: size10, color: '065F46' }),
                          new TextRun({
                            text: '• Diarios de campo pedagógicos\n• Bitácora de aula y viajera\n• Portafolio de producciones\n• Estudio de casos formativo',
                            font: fontCalibri,
                            size: size10,
                            color: '065F46'
                          })
                        ]
                      })
                    ]
                  })
                ]
              })
            ]
          }),

          // 5. SECCIÓN II: TABLA MATRIZ DETALLADA DE LAS 4 ACTIVIDADES RECTORAS (4 COLUMNAS HORIZONTALES)
          new Paragraph({
            spacing: { before: 160, after: 60 },
            children: [
              new TextRun({
                text: 'II. MATRIZ DETALLADA DE LAS ACTIVIDADES RECTORAS (JUEGO, ARTE, LITERATURA Y EXPLORACIÓN DEL MEDIO)',
                bold: true,
                font: fontCalibri,
                size: size11,
                color: '1E3A8A'
              })
            ]
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              // ENCABEZADOS DE LAS 4 ACTIVIDADES RECTORAS
              new TableRow({
                children: rectoras.map((rec) => {
                  const isExploracion = rec.activity.toLowerCase().includes('explor');
                  const isJuego = rec.activity.toLowerCase().includes('juego');
                  const isArte = rec.activity.toLowerCase().includes('arte');
                  const headerBg = isExploracion ? 'D1FAE5' : isJuego ? 'FEF3C7' : isArte ? 'F3E8FF' : 'E0E7FF';
                  const headerColor = isExploracion ? '065F46' : isJuego ? '92400E' : isArte ? '6B21A8' : '3730A3';

                  return new TableCell({
                    width: { size: 25, type: WidthType.PERCENTAGE },
                    margins: { top: 90, bottom: 90, left: 80, right: 80 },
                    borders: borderNavy,
                    shading: { type: ShadingType.CLEAR, fill: headerBg },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: `ACTIVIDAD RECTORA\n${rec.activity.toUpperCase()}`,
                            bold: true,
                            font: fontCalibri,
                            size: size10,
                            color: headerColor
                          })
                        ]
                      })
                    ]
                  });
                })
              }),

              // FILA 1: MEDIACIÓN PEDAGÓGICA Y DOCENTE (CALIBRI 10)
              new TableRow({
                children: rectoras.map((rec) => {
                  return new TableCell({
                    width: { size: 25, type: WidthType.PERCENTAGE },
                    margins: { top: 90, bottom: 90, left: 80, right: 80 },
                    borders: borderMuted,
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: 'Propuesta y Mediación Pedagógica Docente:\n',
                            bold: true,
                            font: fontCalibri,
                            size: size10,
                            color: '1E3A8A'
                          }),
                          new TextRun({
                            text: `${rec.description}\n`,
                            font: fontCalibri,
                            size: size10,
                            color: '334155'
                          })
                        ]
                      })
                    ]
                  });
                })
              }),

              // FILA 2: CÓMO LO VIVENCIA, EXPERIMENTA Y APLICA LA NIÑA O NIÑO (CALIBRI 10)
              new TableRow({
                children: rectoras.map((rec) => {
                  return new TableCell({
                    width: { size: 25, type: WidthType.PERCENTAGE },
                    margins: { top: 90, bottom: 90, left: 80, right: 80 },
                    borders: borderMuted,
                    shading: { type: ShadingType.CLEAR, fill: 'F8FAFC' },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: 'Vivencia, Aplicación y Experiencia del Niño/a:\n',
                            bold: true,
                            font: fontCalibri,
                            size: size10,
                            color: '0F766E'
                          }),
                          new TextRun({
                            text: `${rec.howChildApplies}\n`,
                            font: fontCalibri,
                            size: size10,
                            color: '1E293B'
                          })
                        ]
                      })
                    ]
                  });
                })
              }),

              // FILA 3: DIMENSIÓN Y DESARROLLO SOCIOEMOCIONAL SINCRONIZADO (LEY 2503 • CALIBRI 10)
              new TableRow({
                children: rectoras.map((rec, rIdx) => {
                  const socio = rectorasSocio[rIdx];
                  return new TableCell({
                    width: { size: 25, type: WidthType.PERCENTAGE },
                    margins: { top: 90, bottom: 90, left: 80, right: 80 },
                    borders: borderMuted,
                    shading: { type: ShadingType.CLEAR, fill: 'FFF1F2' },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: 'Dimensión Socioemocional Sincronizada (Ley 2503):\n',
                            bold: true,
                            font: fontCalibri,
                            size: size10,
                            color: '9F1239'
                          }),
                          new TextRun({
                            text: `${socio?.coreEmotion || ''}\n`,
                            bold: true,
                            font: fontCalibri,
                            size: size10,
                            color: '881337'
                          }),
                          new TextRun({
                            text: `${rec.socioemotionalAspect || socio?.description || ''}\n\n`,
                            font: fontCalibri,
                            size: size10,
                            color: '1E293B'
                          }),
                          new TextRun({
                            text: `⇄ Sincronizado con: ${rec.momentSync || socio?.syncedMomentos || ''}`,
                            italics: true,
                            font: fontCalibri,
                            size: size9,
                            color: '9F1239'
                          })
                        ]
                      })
                    ]
                  });
                })
              })
            ]
          }),

          // 6. SECCIÓN III: TABLA DE ARTICULACIÓN Y SINCRONIZACIÓN SOCIOEMOCIONAL (5 MOMENTOS ↔ 4 RECTORAS)
          new Paragraph({
            spacing: { before: 160, after: 60 },
            children: [
              new TextRun({
                text: 'III. MATRIZ DE ARTICULACIÓN Y SINCRONIZACIÓN SOCIOEMOCIONAL (5 MOMENTOS ↔ 4 ACTIVIDADES RECTORAS - LEY 2503)',
                bold: true,
                font: fontCalibri,
                size: size11,
                color: '9F1239'
              })
            ]
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 20, type: WidthType.PERCENTAGE },
                    margins: { top: 90, bottom: 90, left: 80, right: 80 },
                    borders: borderNavy,
                    shading: { type: ShadingType.CLEAR, fill: 'FFE4E6' },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [new TextRun({ text: 'MOMENTO PEDAGÓGICO', bold: true, font: fontCalibri, size: size10, color: '881337' })]
                      })
                    ]
                  }),
                  new TableCell({
                    width: { size: 25, type: WidthType.PERCENTAGE },
                    margins: { top: 90, bottom: 90, left: 80, right: 80 },
                    borders: borderNavy,
                    shading: { type: ShadingType.CLEAR, fill: 'FFE4E6' },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [new TextRun({ text: 'FOCO SOCIOEMOCIONAL (LEY 2503)', bold: true, font: fontCalibri, size: size10, color: '881337' })]
                      })
                    ]
                  }),
                  new TableCell({
                    width: { size: 25, type: WidthType.PERCENTAGE },
                    margins: { top: 90, bottom: 90, left: 80, right: 80 },
                    borders: borderNavy,
                    shading: { type: ShadingType.CLEAR, fill: 'FFE4E6' },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [new TextRun({ text: 'ACTIVIDADES RECTORAS ARTICULADAS', bold: true, font: fontCalibri, size: size10, color: '881337' })]
                      })
                    ]
                  }),
                  new TableCell({
                    width: { size: 30, type: WidthType.PERCENTAGE },
                    margins: { top: 90, bottom: 90, left: 80, right: 80 },
                    borders: borderNavy,
                    shading: { type: ShadingType.CLEAR, fill: 'FFE4E6' },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [new TextRun({ text: 'SINERGIA EN EL AULA Y BUEN TRATO', bold: true, font: fontCalibri, size: size10, color: '881337' })]
                      })
                    ]
                  })
                ]
              }),
              ...momentosSocio.map((mSocio, mIdx) => {
                const cross = crossSocio[mIdx];
                return new TableRow({
                  children: [
                    new TableCell({
                      width: { size: 20, type: WidthType.PERCENTAGE },
                      margins: { top: 80, bottom: 80, left: 80, right: 80 },
                      borders: borderMuted,
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({ text: `${mSocio.momentoName}\n`, bold: true, font: fontCalibri, size: size10, color: '1E3A8A' }),
                            new TextRun({ text: mSocio.subTitle, italics: true, font: fontCalibri, size: size9, color: '64748B' })
                          ]
                        })
                      ]
                    }),
                    new TableCell({
                      width: { size: 25, type: WidthType.PERCENTAGE },
                      margins: { top: 80, bottom: 80, left: 80, right: 80 },
                      borders: borderMuted,
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({ text: `${mSocio.coreEmotion}\n\n`, bold: true, font: fontCalibri, size: size10, color: '9F1239' }),
                            new TextRun({ text: mSocio.description, font: fontCalibri, size: size10, color: '334155' })
                          ]
                        })
                      ]
                    }),
                    new TableCell({
                      width: { size: 25, type: WidthType.PERCENTAGE },
                      margins: { top: 80, bottom: 80, left: 80, right: 80 },
                      borders: borderMuted,
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({ text: `${mSocio.syncedRectoras}\n\n`, bold: true, font: fontCalibri, size: size10, color: '0F766E' }),
                            new TextRun({
                              text: mSocio.socioemotionalPractices.map(p => `• ${p}`).join('\n'),
                              font: fontCalibri,
                              size: size9,
                              color: '475569'
                            })
                          ]
                        })
                      ]
                    }),
                    new TableCell({
                      width: { size: 30, type: WidthType.PERCENTAGE },
                      margins: { top: 80, bottom: 80, left: 80, right: 80 },
                      borders: borderMuted,
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({ text: `"${cross?.synergy || ''}"`, italics: true, font: fontCalibri, size: size10, color: '1E293B' })
                          ]
                        })
                      ]
                    })
                  ]
                });
              })
            ]
          }),

          // 7. SECCIÓN IV: TABLA DE ARTICULACIÓN DE LOS 4 PROPÓSITOS MEN CON APRENDIZAJES IMPRESCINDIBLES
          new Paragraph({
            spacing: { before: 160, after: 60 },
            children: [
              new TextRun({
                text: 'IV. ARTICULACIÓN DE PROPÓSITOS DE LA EDUCACIÓN INICIAL CON APRENDIZAJES IMPRESCINDIBLES',
                bold: true,
                font: fontCalibri,
                size: size11,
                color: '1E3A8A'
              })
            ]
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              // ENCABEZADOS DE LOS 4 PROPÓSITOS
              new TableRow({
                children: articulados.map((item, idx) => {
                  return new TableCell({
                    width: { size: 25, type: WidthType.PERCENTAGE },
                    margins: { top: 90, bottom: 90, left: 80, right: 80 },
                    borders: borderNavy,
                    shading: { type: ShadingType.CLEAR, fill: 'EEF2FF' },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: `PROPÓSITO ${idx + 1}\n${item.shortTitle || `Propósito ${idx + 1}`}`,
                            bold: true,
                            font: fontCalibri,
                            size: size10,
                            color: '1E3A8A'
                          })
                        ]
                      })
                    ]
                  });
                })
              }),

              // CONTENIDO DE LOS PROPÓSITOS E IMPRESCINDIBLES (CALIBRI 10)
              new TableRow({
                children: articulados.map((item) => {
                  return new TableCell({
                    width: { size: 25, type: WidthType.PERCENTAGE },
                    margins: { top: 90, bottom: 90, left: 80, right: 80 },
                    borders: borderMuted,
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: `"${item.proposito}"\n\n`,
                            italics: true,
                            font: fontCalibri,
                            size: size10,
                            color: '475569'
                          }),
                          new TextRun({
                            text: 'Aprendizajes Imprescindibles Articulados:\n',
                            bold: true,
                            font: fontCalibri,
                            size: size10,
                            color: '1E3A8A'
                          }),
                          new TextRun({
                            text: item.imprescindibles.map(imp => `• ${imp}`).join('\n'),
                            font: fontCalibri,
                            size: size10,
                            color: '1E293B'
                          })
                        ]
                      })
                    ]
                  });
                })
              })
            ]
          }),

          // 7. INCLUSIÓN DUA Y VINCULACIÓN FAMILIAR EN FILA HORIZONTAL
          new Paragraph({ spacing: { before: 120, after: 40 }, children: [] }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    margins: { top: 80, bottom: 80, left: 100, right: 100 },
                    borders: borderNavy,
                    shading: { type: ShadingType.CLEAR, fill: 'F8FAFC' },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'AJUSTES RAZONABLES DUA / PIAR: ', bold: true, font: fontCalibri, size: size10, color: '1E3A8A' }),
                          new TextRun({ text: plan.inclusionPIAR, font: fontCalibri, size: size10, color: '334155' })
                        ]
                      })
                    ]
                  }),
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    margins: { top: 80, bottom: 80, left: 100, right: 100 },
                    borders: borderNavy,
                    shading: { type: ShadingType.CLEAR, fill: 'F8FAFC' },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'ALIANZA CON LAS FAMILIAS: ', bold: true, font: fontCalibri, size: size10, color: '1E3A8A' }),
                          new TextRun({ text: plan.familyInvolvement, font: fontCalibri, size: size10, color: '334155' })
                        ]
                      })
                    ]
                  })
                ]
              })
            ]
          }),

          // 8. FIRMAS INSTITUCIONALES
          new Paragraph({ spacing: { before: 180, after: 80 }, children: [] }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    margins: { top: 120, bottom: 60, left: 100, right: 100 },
                    borders: { top: { style: BorderStyle.SINGLE, size: 8, color: '1E3A8A' } },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({ text: 'DOCENTE DE EDUCACIÓN INICIAL', bold: true, font: fontCalibri, size: size10, color: '1E3A8A' })
                        ]
                      }),
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({ text: 'I.E. del Municipio de San Pedro • Grado / Grupo', font: fontCalibri, size: size9, color: '64748B' })
                        ]
                      })
                    ]
                  }),
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    margins: { top: 120, bottom: 60, left: 100, right: 100 },
                    borders: { top: { style: BorderStyle.SINGLE, size: 8, color: '1E3A8A' } },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({ text: 'COORDINACIÓN PEDAGÓGICA', bold: true, font: fontCalibri, size: size10, color: '1E3A8A' })
                        ]
                      }),
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({ text: 'Aprobación Curricular Decreto 1411 / MEN', font: fontCalibri, size: size9, color: '64748B' })
                        ]
                      })
                    ]
                  })
                ]
              })
            ]
          })
        ]
      }
    ]
  });

  const blob = await Packer.toBlob(doc);
  const cleanTitle = plan.title
    .substring(0, 30)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '_');

  const fileName = `matriz_legal_calibri10_${cleanTitle}.docx`;
  saveAs(blob, fileName);
}

