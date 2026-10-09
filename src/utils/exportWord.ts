import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle, AlignmentType, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';
import { Student, DiarioEntry, ActaConvivenciaData, ConsentimientoInformadoData } from '../types';
import { ConceptPlanUnit } from '../data/conceptosData';

/**
 * Genera y descarga la FICHA DEL OBSERVADOR DEL ESTUDIANTE en formato Word (.docx)
 * Configurado con tipo de letra Calibri, tamaño 12 (24 half-points) y texto justificado.
 */
export async function exportStudentObservadorWord(
  student: Student,
  entries: DiarioEntry[]
) {
  const childrenElements: any[] = [];

  // Título Principal Encabezado
  childrenElements.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: "FICHA DEL OBSERVADOR DEL ESTUDIANTE",
          bold: true,
          font: "Calibri",
          size: 28, // 14pt título
          color: "1E3A8A",
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: "I.E. DEL MUNICIPIO DE SAN PEDRO • Seguimiento Continuo e Integral del Desarrollo Infantil • Decreto 1411 / MEN",
          italics: true,
          font: "Calibri",
          size: 22,
          color: "1E40AF",
        }),
      ],
    }),
    new Paragraph({ text: "" })
  );

  // SECCIÓN I: INFORMACIÓN GENERAL Y FAMILIAR
  childrenElements.push(
    new Paragraph({
      alignment: AlignmentType.LEFT,
      children: [
        new TextRun({
          text: "I. INFORMACIÓN GENERAL Y FAMILIAR DEL ESTUDIANTE",
          bold: true,
          font: "Calibri",
          size: 24, // 12pt
          color: "1E3A8A",
        }),
      ],
    }),
    new Paragraph({ text: "" }),
    createObservadorInfoTable(student),
    new Paragraph({ text: "" })
  );

  // SECCIÓN II: SALUD, NUTRICIÓN Y NOVEDADES
  childrenElements.push(
    new Paragraph({
      alignment: AlignmentType.LEFT,
      children: [
        new TextRun({
          text: "II. ASEGURAMIENTO EN SALUD, NUTRICIÓN Y OBSERVACIÓN INICIAL",
          bold: true,
          font: "Calibri",
          size: 24, // 12pt
          color: "1E3A8A",
        }),
      ],
    }),
    new Paragraph({ text: "" }),
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      children: [
        new TextRun({
          text: "Aseguramiento en Salud: ",
          bold: true,
          font: "Calibri",
          size: 24, // 12pt
          color: "0F172A",
        }),
        new TextRun({
          text: `Régimen ${student.healthRegimen || 'No registrado'} — EPS: ${student.eps || 'No registrada'}`,
          font: "Calibri",
          size: 24, // 12pt
          color: "334155",
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      children: [
        new TextRun({
          text: "Novedades de Salud y Nutrición: ",
          bold: true,
          font: "Calibri",
          size: 24, // 12pt
          color: "0F172A",
        }),
        new TextRun({
          text: student.healthNutritionNotes || "Sin novedades de salud o nutrición registradas.",
          font: "Calibri",
          size: 24, // 12pt
          color: "334155",
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      children: [
        new TextRun({
          text: "Observaciones Generales del Observador: ",
          bold: true,
          font: "Calibri",
          size: 24, // 12pt
          color: "0F172A",
        }),
        new TextRun({
          text: student.generalObservations || "Sin observaciones iniciales adicionales.",
          font: "Calibri",
          size: 24, // 12pt
          color: "334155",
        }),
      ],
    }),
    new Paragraph({ text: "" })
  );

  // SECCIÓN III: REGISTRO HISTÓRICO DE OBSERVACIONES Y DIARIOS DE CAMPO
  childrenElements.push(
    new Paragraph({
      alignment: AlignmentType.LEFT,
      children: [
        new TextRun({
          text: "III. REGISTRO Y SEGUIMIENTO DE OBSERVACIONES PEDAGÓGICAS Y DIARIOS DE CAMPO",
          bold: true,
          font: "Calibri",
          size: 24, // 12pt
          color: "1E3A8A",
        }),
      ],
    }),
    new Paragraph({ text: "" })
  );

  if (entries.length === 0) {
    childrenElements.push(
      new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({
            text: "No se registran observaciones de campo ni diarios de aprendizaje para este estudiante en la plataforma aún.",
            italics: true,
            font: "Calibri",
            size: 24, // 12pt
            color: "64748B",
          }),
        ],
      }),
      new Paragraph({ text: "" })
    );
  } else {
    entries.forEach((entry, idx) => {
      if (entry.isAiGeneratedReport && entry.qualitativeSections) {
        childrenElements.push(
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            children: [
              new TextRun({
                text: `${idx + 1}. INFORME CUALITATIVO CONSOLIDADO - ${entry.period || "Periodo Evaluado"} (${entry.date})`,
                bold: true,
                font: "Calibri",
                size: 24, // 12pt
                color: "1E40AF",
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            children: [
              new TextRun({
                text: "• Propósito 1 (Identidad, Autonomía y Manejo Emocional): ",
                bold: true,
                font: "Calibri",
                size: 24, // 12pt
                color: "1E3A8A",
              }),
              new TextRun({
                text: entry.qualitativeSections.proposito1 || "Sin registro.",
                font: "Calibri",
                size: 24, // 12pt
                color: "1E293B",
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            children: [
              new TextRun({
                text: "• Propósito 2 (Comunicación, Expresión y Lenguaje Artístico): ",
                bold: true,
                font: "Calibri",
                size: 24, // 12pt
                color: "1E3A8A",
              }),
              new TextRun({
                text: entry.qualitativeSections.proposito2 || "Sin registro.",
                font: "Calibri",
                size: 24, // 12pt
                color: "1E293B",
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            children: [
              new TextRun({
                text: "• Propósito 3 (Indagación, Entorno y Desarrollo Lógico): ",
                bold: true,
                font: "Calibri",
                size: 24, // 12pt
                color: "1E3A8A",
              }),
              new TextRun({
                text: entry.qualitativeSections.proposito3 || "Sin registro.",
                font: "Calibri",
                size: 24, // 12pt
                color: "1E293B",
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            children: [
              new TextRun({
                text: "• Propósito 4 (Descubrimiento de Sí Mismos, Espacio, Territorio y Movimiento): ",
                bold: true,
                font: "Calibri",
                size: 24, // 12pt
                color: "1E3A8A",
              }),
              new TextRun({
                text: entry.qualitativeSections.proposito4 || "Sin registro.",
                font: "Calibri",
                size: 24, // 12pt
                color: "1E293B",
              }),
            ],
          })
        );

        if (entry.pedagogicalReflection) {
          childrenElements.push(
            new Paragraph({
              alignment: AlignmentType.JUSTIFIED,
              children: [
                new TextRun({
                  text: "Recomendaciones Acompañamiento Familiar: ",
                  bold: true,
                  font: "Calibri",
                  size: 24, // 12pt
                  color: "B45309",
                }),
                new TextRun({
                  text: entry.pedagogicalReflection,
                  font: "Calibri",
                  size: 24, // 12pt
                  color: "334155",
                }),
              ],
            })
          );
        }

        childrenElements.push(new Paragraph({ text: "" }));
      } else {
        childrenElements.push(
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            children: [
              new TextRun({
                text: `${idx + 1}. Registro de Campo (${entry.date}) [${entry.period || "P1"}] — Experiencia Rectora: ${entry.rectorExperience}`,
                bold: true,
                font: "Calibri",
                size: 24, // 12pt
                color: "0F172A",
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            children: [
              new TextRun({
                text: "Observación Cualitativa: ",
                bold: true,
                font: "Calibri",
                size: 24, // 12pt
                color: "047857",
              }),
              new TextRun({
                text: entry.observation,
                font: "Calibri",
                size: 24, // 12pt
                color: "334155",
              }),
            ],
          })
        );

        if (entry.developmentAdvancement) {
          childrenElements.push(
            new Paragraph({
              alignment: AlignmentType.JUSTIFIED,
              children: [
                new TextRun({
                  text: "Avance Cognitivo / Desarrollo: ",
                  bold: true,
                  font: "Calibri",
                  size: 24, // 12pt
                  color: "0284C7",
                }),
                new TextRun({
                  text: entry.developmentAdvancement,
                  font: "Calibri",
                  size: 24, // 12pt
                  color: "334155",
                }),
              ],
            })
          );
        }

        if (entry.pedagogicalReflection) {
          childrenElements.push(
            new Paragraph({
              alignment: AlignmentType.JUSTIFIED,
              children: [
                new TextRun({
                  text: "Ajustes / Recomendaciones Pedagógicas: ",
                  bold: true,
                  font: "Calibri",
                  size: 24, // 12pt
                  color: "B45309",
                }),
                new TextRun({
                  text: entry.pedagogicalReflection,
                  font: "Calibri",
                  size: 24, // 12pt
                  color: "334155",
                }),
              ],
            })
          );
        }

        childrenElements.push(new Paragraph({ text: "" }));
      }
    });
  }

  // SECCIÓN IV: FIRMAS
  childrenElements.push(
    new Paragraph({ text: "" }),
    new Paragraph({ text: "" }),
    createObservadorSignatureSection()
  );

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: "Calibri",
            size: 24, // 12 pt
          },
          paragraph: {
            alignment: AlignmentType.JUSTIFIED,
          },
        },
      },
    },
    sections: [
      {
        properties: {},
        children: childrenElements,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const cleanName = student.name.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ ]/g, "_");
  const fileName = `Ficha_Observador_${cleanName}.docx`;
  saveAs(blob, fileName);
}

function createObservadorInfoTable(student: Student): Table {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 6, color: "1E3A8A" },
      bottom: { style: BorderStyle.SINGLE, size: 6, color: "1E3A8A" },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: "E2E8F0" },
      insideVertical: { style: BorderStyle.NONE },
    },
    rows: [
      new TableRow({
        children: [
          createCalibriCell("Estudiante:", true),
          createCalibriCell(student.name, false),
          createCalibriCell("Documento ID:", true),
          createCalibriCell(student.documentId || "No registrado", false),
        ],
      }),
      new TableRow({
        children: [
          createCalibriCell("Fecha Nacimiento:", true),
          createCalibriCell(student.birthDate || "No registrada", false),
          createCalibriCell("Edad del Alumno:", true),
          createCalibriCell(student.age || "No registrada", false),
        ],
      }),
      new TableRow({
        children: [
          createCalibriCell("Sede Educativa:", true),
          createCalibriCell(student.sede, false),
          createCalibriCell("Ciclo / Rango:", true),
          createCalibriCell(student.cycle, false),
        ],
      }),
      new TableRow({
        children: [
          createCalibriCell("Padres / Acudiente:", true),
          createCalibriCell(student.guardians || "No registrados", false),
          createCalibriCell("Teléfonos Contacto:", true),
          createCalibriCell(student.contactPhones || "No registrados", false),
        ],
      }),
      new TableRow({
        children: [
          createCalibriCell("Dirección:", true),
          createCalibriCell(student.address || "No registrada", false),
          createCalibriCell("Barrio:", true),
          createCalibriCell(student.neighborhood || "No registrado", false),
        ],
      }),
    ],
  });
}

function createCalibriCell(text: string, isBold: boolean): TableCell {
  return new TableCell({
    children: [
      new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({
            text,
            bold: isBold,
            font: "Calibri",
            size: 24, // 12pt
            color: isBold ? "0F172A" : "334155",
          }),
        ],
      }),
    ],
  });
}

function createObservadorSignatureSection(): Table {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.NONE },
      insideVertical: { style: BorderStyle.NONE },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: "____________________________________\n",
                    font: "Calibri",
                    size: 24,
                    color: "64748B",
                  }),
                  new TextRun({
                    text: "Firma del Docente / Agente Educativo\n",
                    bold: true,
                    font: "Calibri",
                    size: 24, // 12pt
                    color: "0F172A",
                  }),
                  new TextRun({
                    text: "Especialista en Educación Inicial",
                    italics: true,
                    font: "Calibri",
                    size: 20, // 10pt
                    color: "64748B",
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: "____________________________________\n",
                    font: "Calibri",
                    size: 24,
                    color: "64748B",
                  }),
                  new TextRun({
                    text: "Firma Padre de Familia / Acudiente\n",
                    bold: true,
                    font: "Calibri",
                    size: 24, // 12pt
                    color: "0F172A",
                  }),
                  new TextRun({
                    text: "Acudiente Autorizado del Estudiante",
                    italics: true,
                    font: "Calibri",
                    size: 20, // 10pt
                    color: "64748B",
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

/**
 * Genera y descarga un documento Word (.docx) para un informe individual o por periodo
 */
export async function exportPeriodReportToWord(
  student: Student,
  entries: DiarioEntry[],
  periodTitle: string
) {
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: "Calibri",
            size: 24, // 12pt
          },
          paragraph: {
            alignment: AlignmentType.JUSTIFIED,
          },
        },
      },
    },
    sections: [
      {
        properties: {},
        children: [
          // Encabezado Institucional
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: "I.E. DEL MUNICIPIO DE SAN PEDRO • INFORME CUALITATIVO DEL DESARROLLO INTEGRAL",
                bold: true,
                font: "Calibri",
                size: 26, // 13pt
                color: "1E3A8A", // Royal Blue
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: "Bases Curriculares para la Educación Inicial • Decreto 1411 / MEN Colombia",
                italics: true,
                font: "Calibri",
                size: 22,
                color: "475569",
              }),
            ],
          }),
          new Paragraph({ text: "" }),

          // Tabla de Datos del Estudiante
          createStudentInfoTable(student, periodTitle),

          new Paragraph({ text: "" }),

          // Contenido de los Registros del Periodo
          ...generateEntriesParagraphs(entries),

          // Firma / Pie de Página
          new Paragraph({ text: "" }),
          new Paragraph({ text: "" }),
          createSignatureSection(),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const cleanName = student.name.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ ]/g, "_");
  const fileName = `Informe_Cualitativo_${cleanName}_${periodTitle.replace(/\s+/g, "_")}.docx`;
  saveAs(blob, fileName);
}

/**
 * Genera y descarga un documento Word completo con los 4 PERIODOS combinados
 */
export async function exportAllPeriodsReportToWord(
  student: Student,
  allEntries: DiarioEntry[]
) {
  const periods = ["Periodo 1", "Periodo 2", "Periodo 3", "Periodo 4"];

  const childrenElements: any[] = [
    // Encabezado Principal
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: "I.E. DEL MUNICIPIO DE SAN PEDRO • INFORME CUALITATIVO DEL DESARROLLO INTEGRAL",
          bold: true,
          font: "Calibri",
          size: 26,
          color: "1E3A8A",
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: "Seguimiento Continuo del Proceso Cognitivo y Desarrollo Infantil • 4 Periodos",
          italics: true,
          font: "Calibri",
          size: 22,
          color: "1E40AF",
        }),
      ],
    }),
    new Paragraph({ text: "" }),

    // Información del Estudiante
    createStudentInfoTable(student, "Informe Consolidado 4 Periodos"),
    new Paragraph({ text: "" }),
  ];

  // Recorrer cada uno de los 4 periodos
  periods.forEach((pName, index) => {
    const pEntries = allEntries.filter((e) => (e.period || "Periodo 1") === pName);

    // Titulo del Periodo
    childrenElements.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        alignment: AlignmentType.LEFT,
        children: [
          new TextRun({
            text: `📌 ${pName.toUpperCase()}`,
            bold: true,
            font: "Calibri",
            size: 24, // 12pt
            color: "064E3B",
          }),
        ],
      })
    );

    if (pEntries.length === 0) {
      childrenElements.push(
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun({
              text: `No se registraron observaciones cuantitativas ni informes cualitativos en el ${pName}.`,
              italics: true,
              font: "Calibri",
              size: 24, // 12pt
              color: "94A3B8",
            }),
          ],
        }),
        new Paragraph({ text: "" })
      );
    } else {
      childrenElements.push(...generateEntriesParagraphs(pEntries));
    }

    if (index < periods.length - 1) {
      childrenElements.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: "───────────────────────────────────────────────────────",
              font: "Calibri",
              color: "CBD5E1",
            }),
          ],
        }),
        new Paragraph({ text: "" })
      );
    }
  });

  // Firma
  childrenElements.push(
    new Paragraph({ text: "" }),
    new Paragraph({ text: "" }),
    createSignatureSection()
  );

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: "Calibri",
            size: 24, // 12pt
          },
          paragraph: {
            alignment: AlignmentType.JUSTIFIED,
          },
        },
      },
    },
    sections: [
      {
        properties: {},
        children: childrenElements,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const cleanName = student.name.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ ]/g, "_");
  const fileName = `Informe_Consolidado_4_Periodos_${cleanName}.docx`;
  saveAs(blob, fileName);
}

// --- HELPER FUNCTIONS ---

function createStudentInfoTable(student: Student, periodText: string): Table {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 6, color: "064E3B" },
      bottom: { style: BorderStyle.SINGLE, size: 6, color: "064E3B" },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: "E2E8F0" },
      insideVertical: { style: BorderStyle.NONE },
    },
    rows: [
      new TableRow({
        children: [
          createCell("Estudiante:", true),
          createCell(student.name, false),
          createCell("Sede Educativa:", true),
          createCell(student.sede, false),
        ],
      }),
      new TableRow({
        children: [
          createCell("Ciclo / Rango:", true),
          createCell(student.cycle, false),
          createCell("Periodo Evaluado:", true),
          createCell(periodText, false),
        ],
      }),
      new TableRow({
        children: [
          createCell("Aseguramiento / EPS:", true),
          createCell(`${student.healthRegimen || 'Sin régimen'} - ${student.eps || 'Sin EPS'}`, false),
          createCell("Fecha de Emisión:", true),
          createCell(new Date().toLocaleDateString("es-CO"), false),
        ],
      }),
    ],
  });
}

function createCell(text: string, isBold: boolean): TableCell {
  return new TableCell({
    children: [
      new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({
            text,
            bold: isBold,
            font: "Calibri",
            size: 24, // 12pt
            color: isBold ? "0F172A" : "334155",
          }),
        ],
      }),
    ],
  });
}

function generateEntriesParagraphs(entries: DiarioEntry[]): any[] {
  const elements: any[] = [];

  entries.forEach((entry) => {
    if (entry.isAiGeneratedReport && entry.qualitativeSections) {
      // INFORME CUALITATIVO DETALLADO POR LOS 3 PROPÓSITOS
      elements.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_3,
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun({
              text: `INFORME CUALITATIVO CONSOLIDADO - ${entry.period || "Periodo Evaluado"}`,
              bold: true,
              font: "Calibri",
              size: 24, // 12pt
              color: "047857",
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun({
              text: `Fecha de elaboración: ${entry.date}`,
              italics: true,
              font: "Calibri",
              size: 22,
              color: "64748B",
            }),
          ],
        }),
        new Paragraph({ text: "" }),

        // EVOLUCIÓN DEL PROGRESO Y TRAYECTORIA
        ...(entry.qualitativeSections.evolucionProgreso ? [
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            children: [
              new TextRun({
                text: "Evolución del Progreso y Trayectoria del Desarrollo Infantil:",
                bold: true,
                font: "Calibri",
                size: 24, // 12pt
                color: "0369A1", // Sky
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            children: [
              new TextRun({
                text: entry.qualitativeSections.evolucionProgreso,
                font: "Calibri",
                size: 24, // 12pt
                color: "1E293B",
              }),
            ],
          }),
          new Paragraph({ text: "" })
        ] : []),

        // FORTALEZAS DESTACADAS
        ...(entry.qualitativeSections.fortalezas ? [
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            children: [
              new TextRun({
                text: "Fortalezas y Aspectos Destacados:",
                bold: true,
                font: "Calibri",
                size: 24, // 12pt
                color: "047857",
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            children: [
              new TextRun({
                text: entry.qualitativeSections.fortalezas,
                font: "Calibri",
                size: 24, // 12pt
                color: "1E293B",
              }),
            ],
          }),
          new Paragraph({ text: "" })
        ] : []),

        // PROPÓSITO 1
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun({
              text: "Propósito 1: Identidad, Autonomía, Manejo de Emociones y Pertenencia (Ley 2503)",
              bold: true,
              font: "Calibri",
              size: 24, // 12pt
              color: "064E3B",
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun({
              text: entry.qualitativeSections.proposito1 || "Progreso constante en autonomía, autorregulación y manejo de emociones.",
              font: "Calibri",
              size: 24, // 12pt
              color: "1E293B",
            }),
          ],
        }),
        new Paragraph({ text: "" }),

        // PROPÓSITO 2
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun({
              text: "Propósito 2: Comunicación Activa, Expresión y Lenguajes Artísticos",
              bold: true,
              font: "Calibri",
              size: 24, // 12pt
              color: "064E3B",
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun({
              text: entry.qualitativeSections.proposito2 || "Demuestra amplia fluidez narrativa, expresión de vivencias y sensibilidad artística.",
              font: "Calibri",
              size: 24, // 12pt
              color: "1E293B",
            }),
          ],
        }),
        new Paragraph({ text: "" }),

        // PROPÓSITO 3
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun({
              text: "Propósito 3: Indagación, Observación del Entorno y Desarrollo Cognitivo - Prematemática",
              bold: true,
              font: "Calibri",
              size: 24, // 12pt
              color: "064E3B",
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun({
              text: entry.qualitativeSections.proposito3 || "Observa e indaga su entorno, desarrolla el pensamiento lógico-matemático inicial y clasifica elementos del medio.",
              font: "Calibri",
              size: 24, // 12pt
              color: "1E293B",
            }),
          ],
        }),
        new Paragraph({ text: "" }),

        // PROPÓSITO 4
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun({
              text: "Propósito 4: Descubrimiento de Sí Mismos, Espacio, Territorio y Movimiento Libre",
              bold: true,
              font: "Calibri",
              size: 24, // 12pt
              color: "064E3B",
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun({
              text: entry.qualitativeSections.proposito4 || "Experimenta el descubrimiento de sí mismo/a, apropia el espacio y el territorio que habita, y se expresa a través del cuerpo y el movimiento libre en el encuentro con los otros.",
              font: "Calibri",
              size: 24, // 12pt
              color: "1E293B",
            }),
          ],
        }),
        new Paragraph({ text: "" }),

        // RECOMENDACIONES
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun({
              text: "Recomendaciones Pedagógicas y Acompañamiento Familiar:",
              bold: true,
              font: "Calibri",
              size: 24, // 12pt
              color: "B45309", // Amber
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun({
              text: entry.pedagogicalReflection || "Continuar apoyando las vivencias de exploración e intercambio lector afectivo.",
              italics: true,
              font: "Calibri",
              size: 24, // 12pt
              color: "334155",
            }),
          ],
        }),
        new Paragraph({ text: "" })
      );
    } else {
      // REGISTRO DE OBSERVACIÓN DIRECTA / DIARIO DE CAMPO
      elements.push(
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun({
              text: `• ${entry.activityTitle || "Observación de Campo"} (${entry.date}) - ${entry.rectorExperience}`,
              bold: true,
              font: "Calibri",
              size: 24, // 12pt
              color: "0F172A",
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun({
              text: `Observación Cualitativa: `,
              bold: true,
              font: "Calibri",
              size: 24, // 12pt
              color: "047857",
            }),
            new TextRun({
              text: entry.observation,
              font: "Calibri",
              size: 24, // 12pt
              color: "334155",
            }),
          ],
        })
      );

      if (entry.developmentAdvancement) {
        elements.push(
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            children: [
              new TextRun({
                text: `Avance Cognitivo/Desarrollo: `,
                bold: true,
                font: "Calibri",
                size: 24, // 12pt
                color: "0284C7",
              }),
              new TextRun({
                text: entry.developmentAdvancement,
                font: "Calibri",
                size: 24, // 12pt
                color: "334155",
              }),
            ],
          })
        );
      }

      if (entry.pedagogicalReflection) {
        elements.push(
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            children: [
              new TextRun({
                text: `Ajustes Pedagógicos: `,
                bold: true,
                font: "Calibri",
                size: 24, // 12pt
                color: "B45309",
              }),
              new TextRun({
                text: entry.pedagogicalReflection,
                italics: true,
                font: "Calibri",
                size: 24, // 12pt
                color: "334155",
              }),
            ],
          })
        );
      }

      elements.push(new Paragraph({ text: "" }));
    }
  });

  return elements;
}

function createSignatureSection(): Paragraph {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [
      new TextRun({
        text: "____________________________________________\n",
        bold: true,
        font: "Calibri",
        color: "64748B",
      }),
      new TextRun({
        text: "Firma del Docente / Agente Educativo\n",
        bold: true,
        font: "Calibri",
        size: 24, // 12pt
        color: "0F172A",
      }),
      new TextRun({
        text: "Especialista en Educación Inicial y Primera Infancia",
        italics: true,
        font: "Calibri",
        size: 20, // 10pt
        color: "64748B",
      }),
    ],
  });
}

/**
 * Genera y descarga el ACTA DE COMPROMISO Y CONVIVENCIA ESCOLAR en formato Word (.docx)
 */
export async function exportActaConvivenciaWord(data: ActaConvivenciaData) {
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440,
              bottom: 1440,
              left: 1440,
              right: 1440,
            },
          },
        },
        children: [
          // Header title
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: (data.institucion || "INSTITUCIÓN EDUCATIVA DEL MUNICIPIO DE SAN PEDRO").toUpperCase(),
                bold: true,
                font: "Calibri",
                size: 26, // 13pt
                color: "1E3A8A",
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: `SEDE: ${(data.sede || "PRINCIPAL").toUpperCase()} • COMITÉ DE CONVIVENCIA ESCOLAR`,
                bold: true,
                font: "Calibri",
                size: 22,
                color: "1E40AF",
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: "ACTA DE COMPROMISO Y CONVIVENCIA ESCOLAR N° " + new Date().getFullYear() + "-" + Math.floor(100 + Math.random() * 900),
                bold: true,
                font: "Calibri",
                size: 26,
                color: "0F172A",
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: "Marco Legal: Ley 1620 de 2013 (Convivencia Escolar), Decreto 1411 de 2022 y Código de la Infancia y la Adolescencia (Ley 1098)",
                italics: true,
                font: "Calibri",
                size: 20,
                color: "475569",
              }),
            ],
          }),
          new Paragraph({ text: "" }),

          // Table of Datos Generales
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 6, color: "064E3B" },
              bottom: { style: BorderStyle.SINGLE, size: 6, color: "064E3B" },
              left: { style: BorderStyle.SINGLE, size: 4, color: "CBD5E1" },
              right: { style: BorderStyle.SINGLE, size: 4, color: "CBD5E1" },
              insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: "E2E8F0" },
              insideVertical: { style: BorderStyle.SINGLE, size: 4, color: "E2E8F0" },
            },
            rows: [
              new TableRow({
                children: [
                  createCell("FECHA Y HORA:", true),
                  createCell(`${data.fecha || new Date().toLocaleDateString('es-CO')} - ${data.hora || '08:00 AM'}`, false),
                  createCell("LUGAR:", true),
                  createCell(data.lugar || "Sede Institucional / Dirección", false),
                ],
              }),
              new TableRow({
                children: [
                  createCell("ESTUDIANTE:", true),
                  createCell(data.studentName || "Estudiante", false),
                  createCell("EDAD / GRADO:", true),
                  createCell(`${data.studentAge || 'N/A'} • ${data.studentGrade || 'Educación Inicial'}`, false),
                ],
              }),
              new TableRow({
                children: [
                  createCell("PADRE / ACUDIENTE:", true),
                  createCell(data.parentName || "No especificado", false),
                  createCell("DOCUMENTO:", true),
                  createCell(`${data.parentIdType || 'C.C.'} ${data.parentIdNumber || 'N/A'} (${data.parentRelationship || 'Acudiente'})`, false),
                ],
              }),
              new TableRow({
                children: [
                  createCell("TELÉFONO DE CONTACTO:", true),
                  createCell(data.parentPhone || "N/A", false),
                  createCell("DOCENTE / MEDIADOR:", true),
                  createCell(`${data.teacherName || 'Docente'} (${data.teacherRole || 'Docente de Aula'})`, false),
                ],
              }),
            ],
          }),

          new Paragraph({ text: "" }),

          // I. MOTIVO DE LA CITACIÓN
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: "I. MOTIVO DE LA REUNIÓN / CITACIÓN",
                bold: true,
                font: "Calibri",
                size: 24,
                color: "064E3B",
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            children: [
              new TextRun({
                text: data.motivoReunion || "Reunión de diálogo, mediación y establecimiento de acuerdos pedagógicos y de convivencia escolar.",
                font: "Calibri",
                size: 24,
                color: "1E293B",
              }),
            ],
          }),
          new Paragraph({ text: "" }),

          // II. DESCRIPCIÓN DE LA SITUACIÓN / ANTECEDENTES
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: "II. DESCRIPCIÓN DE LA SITUACIÓN Y CONTEXTO PEDAGÓGICO",
                bold: true,
                font: "Calibri",
                size: 24,
                color: "064E3B",
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            children: [
              new TextRun({
                text: data.hechosSituacion || "Se dialoga con la familia sobre los aspectos observados en el aula respecto a la convivencia, hábitos de relacionamiento y autorregulación socioemocional del estudiante.",
                font: "Calibri",
                size: 24,
                color: "1E293B",
              }),
            ],
          }),
          new Paragraph({ text: "" }),

          // III. ACUERDOS Y COMPROMISOS ADOPTADOS
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: "III. ACUERDOS Y COMPROMISOS ADOPTADOS POR LAS PARTES",
                bold: true,
                font: "Calibri",
                size: 24,
                color: "064E3B",
              }),
            ],
          }),
          new Paragraph({ text: "" }),

          // A. Compromisos del Estudiante
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            children: [
              new TextRun({
                text: "A. COMPROMISOS DEL ESTUDIANTE:",
                bold: true,
                font: "Calibri",
                size: 24,
                color: "0369A1",
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            children: [
              new TextRun({
                text: data.acuerdosEstudiante || "• Practicar el diálogo afectivo y la autorregulación con apoyo del rincón de la calma.\n• Respetar a sus compañeros y docentes utilizando palabras amables y participando en las actividades grupales.",
                font: "Calibri",
                size: 24,
                color: "1E293B",
              }),
            ],
          }),
          new Paragraph({ text: "" }),

          // B. Compromisos de la Familia / Padres
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            children: [
              new TextRun({
                text: "B. COMPROMISOS DE LA FAMILIA / PADRES / ACUDIENTE:",
                bold: true,
                font: "Calibri",
                size: 24,
                color: "047857",
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            children: [
              new TextRun({
                text: data.acuerdosPadres || "• Fortalecer en el hogar el diálogo constante sobre la empatía y la gestión de emociones.\n• Garantizar la asistencia puntual a la institución y mantener comunicación fluida con la docente.",
                font: "Calibri",
                size: 24,
                color: "1E293B",
              }),
            ],
          }),
          new Paragraph({ text: "" }),

          // C. Compromisos del Docente e Institución
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            children: [
              new TextRun({
                text: "C. COMPROMISOS DEL DOCENTE E INSTITUCIÓN EDUCATIVA:",
                bold: true,
                font: "Calibri",
                size: 24,
                color: "B45309",
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            children: [
              new TextRun({
                text: data.acuerdosDocente || "• Implementar estrategias pedagógicas inclusivas y rincones de calma en el aula.\n• Brindar seguimiento cualitativo continuo e informar oportunamente los avances a la familia.",
                font: "Calibri",
                size: 24,
                color: "1E293B",
              }),
            ],
          }),
          new Paragraph({ text: "" }),

          // IV. PRÓXIMA CITACIÓN / FECHA DE SEGUIMIENTO
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            children: [
              new TextRun({
                text: "IV. SEGUIMIENTO Y PRÓXIMA EVALUACIÓN DE ACUERDOS:",
                bold: true,
                font: "Calibri",
                size: 24,
                color: "064E3B",
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            children: [
              new TextRun({
                text: `Se acuerda realizar la verificación y seguimiento de los compromisos adquiridos en este compromiso el día: `,
                font: "Calibri",
                size: 24,
                color: "1E293B",
              }),
              new TextRun({
                text: `${data.fechaSeguimiento || 'En 15 días hábiles'}.`,
                bold: true,
                font: "Calibri",
                size: 24,
                color: "064E3B",
              }),
            ],
          }),
          ...(data.observacionesAdicionales ? [
            new Paragraph({ text: "" }),
            new Paragraph({
              alignment: AlignmentType.JUSTIFIED,
              children: [
                new TextRun({
                  text: `Observaciones Adicionales: ${data.observacionesAdicionales}`,
                  italics: true,
                  font: "Calibri",
                  size: 22,
                  color: "475569",
                }),
              ],
            })
          ] : []),

          new Paragraph({ text: "" }),
          new Paragraph({ text: "" }),

          // V. FIRMAS
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: "En constancia de lo anterior, firman los asistentes a la reunión:",
                bold: true,
                font: "Calibri",
                size: 22,
                color: "334155",
              }),
            ],
          }),
          new Paragraph({ text: "" }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
              insideHorizontal: { style: BorderStyle.NONE },
              insideVertical: { style: BorderStyle.NONE },
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({ text: "____________________________________\n", color: "94A3B8" }),
                          new TextRun({ text: `${data.parentName || 'PADRE / MADRE / ACUDIENTE'}\n`, bold: true, font: "Calibri", size: 22 }),
                          new TextRun({ text: `Documento: ${data.parentIdNumber || 'C.C.'}\nParentesco: ${data.parentRelationship || 'Acudiente'}`, font: "Calibri", size: 20, color: "64748B" }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({ text: "____________________________________\n", color: "94A3B8" }),
                          new TextRun({ text: `${data.teacherName || 'DOCENTE / MEDIADOR'}\n`, bold: true, font: "Calibri", size: 22 }),
                          new TextRun({ text: `${data.teacherRole || 'Docente de Aula'}\nInstitución Educativa`, font: "Calibri", size: 20, color: "64748B" }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({ text: "" }),
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({ text: "____________________________________\n", color: "94A3B8" }),
                          new TextRun({ text: `${data.studentName || 'ESTUDIANTE'}\n`, bold: true, font: "Calibri", size: 22 }),
                          new TextRun({ text: "Compromiso de Convivencia Escolar", font: "Calibri", size: 20, color: "64748B" }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({ text: "" }),
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({ text: "____________________________________\n", color: "94A3B8" }),
                          new TextRun({ text: `${data.coordinatorName || 'COORDINACIÓN / RECTORÍA'}\n`, bold: true, font: "Calibri", size: 22 }),
                          new TextRun({ text: "Comité de Convivencia Escolar", font: "Calibri", size: 20, color: "64748B" }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const cleanName = (data.studentName || "Estudiante").replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ ]/g, "_");
  const fileName = `Acta_Convivencia_${cleanName}_${data.fecha || "2026"}.docx`;
  saveAs(blob, fileName);
}

/**
 * Genera y descarga el DOCUMENTO DE CONSENTIMIENTO INFORMADO en formato Word (.docx)
 * Cumple con Ley 1581 de 2012 (Hábeas Data) y Código de la Infancia y Adolescencia (Ley 1098).
 */
export async function exportConsentimientoInformadoWord(data: ConsentimientoInformadoData) {
  const isEnBlanco = data.modoDatosEnBlanco !== false;

  const valInstitucion = (data.institucion || 'INSTITUCIÓN EDUCATIVA DEL MUNICIPIO DE SAN PEDRO').toUpperCase();
  const valDepartamento = (data.departamento || "DEPARTAMENTO DE SUCRE").toUpperCase();
  const valDane = data.dane || "DANE - MUNICIPIO DE SAN PEDRO";
  const valNit = data.nit || "NIT 892.200.599-4";
  const valTelefono = data.telefono || "TEL. (605) 280-4820";
  const valCiudad = (data.ciudad || "SAN PEDRO - SUCRE").toUpperCase();

  const valStudentName = isEnBlanco || !data.studentName ? "_________________________________________________" : data.studentName;
  const valParentName = isEnBlanco || !data.parentName ? "_________________________________________________" : data.parentName;
  const valParentIdNum = isEnBlanco || !data.parentIdNumber ? "_________________________________________________" : data.parentIdNumber;
  const valFecha = isEnBlanco || !data.fecha ? "_________________________________________________" : data.fecha;

  // Respuestas de la tabla (SI / NO) - Si están vacías o no especificadas, quedan sin marcar [   ] para diligenciamiento a mano
  const isFotoSi = !isEnBlanco && (data.autorizaFotos === 'SI' || (!data.autorizaFotos && data.opcionAutorizacion === 'AUTORIZO'));
  const isFotoNo = !isEnBlanco && (data.autorizaFotos === 'NO' || (!data.autorizaFotos && data.opcionAutorizacion === 'NO_AUTORIZO'));

  const isVideoSi = !isEnBlanco && (data.autorizaVideos === 'SI' || (!data.autorizaVideos && data.opcionAutorizacion === 'AUTORIZO'));
  const isVideoNo = !isEnBlanco && (data.autorizaVideos === 'NO' || (!data.autorizaVideos && data.opcionAutorizacion === 'NO_AUTORIZO'));

  const isInternoSi = !isEnBlanco && (data.autorizaUsoInterno === 'SI' || (!data.autorizaUsoInterno && data.opcionAutorizacion === 'AUTORIZO'));
  const isInternoNo = !isEnBlanco && (data.autorizaUsoInterno === 'NO' || (!data.autorizaUsoInterno && data.opcionAutorizacion === 'NO_AUTORIZO'));

  const fotoSi = isFotoSi ? "[ X ]" : "[   ]";
  const fotoNo = isFotoNo ? "[ X ]" : "[   ]";

  const videoSi = isVideoSi ? "[ X ]" : "[   ]";
  const videoNo = isVideoNo ? "[ X ]" : "[   ]";

  const internoSi = isInternoSi ? "[ X ]" : "[   ]";
  const internoNo = isInternoNo ? "[ X ]" : "[   ]";

  const createConsentCell = (text: string, isBold: boolean, align: any = AlignmentType.LEFT, widthPercent?: number) => {
    return new TableCell({
      width: widthPercent ? { size: widthPercent, type: WidthType.PERCENTAGE } : undefined,
      margins: { top: 100, bottom: 100, left: 140, right: 140 },
      children: [
        new Paragraph({
          alignment: align,
          children: [
            new TextRun({
              text,
              bold: isBold,
              font: "Calibri",
              size: 21,
              color: isBold ? "0F172A" : "1E293B",
            }),
          ],
        }),
      ],
    });
  };

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440,
              bottom: 1440,
              left: 1440,
              right: 1440,
            },
          },
        },
        children: [
          // Header oficial
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: "REPUBLICA DE COLOMBIA\n", bold: true, font: "Calibri", size: 20, color: "334155" }),
              new TextRun({ text: `${valDepartamento}\n`, bold: true, font: "Calibri", size: 20, color: "334155" }),
              new TextRun({ text: `${valInstitucion}\n`, bold: true, font: "Calibri", size: 26, color: "0F172A" }),
              new TextRun({ text: `${valDane}  ${valNit}  ${valTelefono}  ${valCiudad}`, font: "Calibri", size: 18, color: "475569" }),
            ],
          }),
          new Paragraph({ text: "" }),

          // Titulo
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: "CONSENTIMIENTO INFORMADO PARA EL REGISTRO DE IMAGEN Y VIDEO",
                bold: true,
                font: "Calibri",
                size: 24,
                color: "1E3A8A",
              }),
            ],
          }),
          new Paragraph({ text: "" }),

          // 1. Objetivo del Consentimiento
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: "1. Objetivo del Consentimiento",
                bold: true,
                font: "Calibri",
                size: 22,
                color: "0284C7",
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            children: [
              new TextRun({
                text: data.objetivo || "La Institución Educativa tiene como propósito principal enriquecer las experiencias pedagógicas de los estudiantes de primera infancia (Jardín y Transición). Para lograr esto, el Docente a cargo requiere registrar (mediante fotografías y/o videos) las actividades desarrolladas en el aula y espacios institucionales.",
                font: "Calibri",
                size: 22,
                color: "1E293B",
              }),
            ],
          }),
          new Paragraph({ text: "" }),

          // 2. Justificación Pedagógica
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: "2. Justificación Pedagógica",
                bold: true,
                font: "Calibri",
                size: 22,
                color: "0284C7",
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            children: [
              new TextRun({
                text: "El uso de estas herramientas audiovisuales se justifica por las siguientes razones:",
                font: "Calibri",
                size: 22,
                color: "1E293B",
              }),
            ],
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: "Documentación Pedagógica: ", bold: true, font: "Calibri", size: 22 }),
              new TextRun({ text: "Permitir que los docentes observen, analicen y evalúen el progreso, los procesos de aprendizaje y la interacción social de los niños.", font: "Calibri", size: 22 }),
            ],
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: "Reflexión Educativa: ", bold: true, font: "Calibri", size: 22 }),
              new TextRun({ text: "Utilizar las evidencias como material de apoyo para ajustes curriculares y planeación de estrategias más efectivas.", font: "Calibri", size: 22 }),
            ],
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: "Evidencias de Progreso: ", bold: true, font: "Calibri", size: 22 }),
              new TextRun({ text: "Crear un portafolio digital que permita visualizar el desarrollo integral y los hitos alcanzados por los estudiantes durante el año escolar.", font: "Calibri", size: 22 }),
            ],
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: "Fortalecimiento del Vínculo Escuela-Familia: ", bold: true, font: "Calibri", size: 22 }),
              new TextRun({ text: "Compartir momentos significativos del proceso escolar para mantener informados a los acudientes sobre los aprendizajes de sus hijos.", font: "Calibri", size: 22 }),
            ],
          }),
          new Paragraph({ text: "" }),

          // 3. Compromiso y Protección de Datos
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: "3. Compromiso y Protección de Datos",
                bold: true,
                font: "Calibri",
                size: 22,
                color: "0284C7",
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            children: [
              new TextRun({
                text: data.compromisoProteccionDatos || "La institución se compromete a que el material obtenido será utilizado exclusivamente para los fines pedagógicos descritos. Se garantiza que la identidad de los menores será tratada con absoluta reserva y seguridad, evitando la exposición pública del material en redes sociales u otros medios de comunicación sin una autorización adicional específica.",
                font: "Calibri",
                size: 22,
                color: "1E293B",
              }),
            ],
          }),
          new Paragraph({ text: "" }),

          // 4. Declaración de Consentimiento
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: "4. Declaración de Consentimiento",
                bold: true,
                font: "Calibri",
                size: 22,
                color: "0284C7",
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: "Por favor, marque con una (X) su decisión frente a las siguientes condiciones:",
                font: "Calibri",
                size: 22,
                color: "1E293B",
              }),
            ],
          }),
          new Paragraph({ text: "" }),

          // Tabla de Condiciones (Exactamente como en la imagen)
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 8, color: "0284C7" },
              bottom: { style: BorderStyle.SINGLE, size: 8, color: "0284C7" },
              left: { style: BorderStyle.SINGLE, size: 8, color: "0284C7" },
              right: { style: BorderStyle.SINGLE, size: 8, color: "0284C7" },
              insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: "93C5FD" },
              insideVertical: { style: BorderStyle.SINGLE, size: 4, color: "93C5FD" },
            },
            rows: [
              new TableRow({
                children: [
                  createConsentCell("Actividad", true, AlignmentType.LEFT, 70),
                  createConsentCell("SÍ ACEPTO", true, AlignmentType.LEFT, 15),
                  createConsentCell("NO ACEPTO", true, AlignmentType.LEFT, 15),
                ],
              }),
              new TableRow({
                children: [
                  createConsentCell("Autorizo la toma de fotografías de mi hijo(a) durante actividades pedagógicas.", false, AlignmentType.LEFT, 70),
                  createConsentCell(fotoSi, false, AlignmentType.LEFT, 15),
                  createConsentCell(fotoNo, false, AlignmentType.LEFT, 15),
                ],
              }),
              new TableRow({
                children: [
                  createConsentCell("Autorizo la grabación de videos de mi hijo(a) durante actividades pedagógicas.", false, AlignmentType.LEFT, 70),
                  createConsentCell(videoSi, false, AlignmentType.LEFT, 15),
                  createConsentCell(videoNo, false, AlignmentType.LEFT, 15),
                ],
              }),
              new TableRow({
                children: [
                  createConsentCell("Autorizo el uso de estas imágenes/videos en presentaciones pedagógicas internas.", false, AlignmentType.LEFT, 70),
                  createConsentCell(internoSi, false, AlignmentType.LEFT, 15),
                  createConsentCell(internoNo, false, AlignmentType.LEFT, 15),
                ],
              }),
            ],
          }),

          new Paragraph({ text: "" }),
          new Paragraph({ text: "" }),

          // Datos del estudiante, Padre y Firma exactamente como en la imagen 2
          new Paragraph({
            children: [
              new TextRun({ text: "Nombre del Estudiante: ", font: "Calibri", size: 22 }),
              new TextRun({ text: valStudentName, font: "Calibri", size: 22 }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            children: [
              new TextRun({ text: "Nombre del Padre/Madre/Acudiente: ", font: "Calibri", size: 22 }),
              new TextRun({ text: valParentName, font: "Calibri", size: 22 }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            children: [
              new TextRun({ text: "Cédula de Ciudadanía: ", font: "Calibri", size: 22 }),
              new TextRun({ text: valParentIdNum, font: "Calibri", size: 22 }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            children: [
              new TextRun({ text: "Firma: ", font: "Calibri", size: 22 }),
              new TextRun({ text: "_________________________________________________", font: "Calibri", size: 22 }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            children: [
              new TextRun({ text: "Fecha: ", font: "Calibri", size: 22 }),
              new TextRun({ text: valFecha, font: "Calibri", size: 22 }),
            ],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const cleanName = isEnBlanco ? "Formato_En_Blanco" : (data.studentName || "Estudiante").replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ ]/g, "_");
  const fileName = `Consentimiento_Informado_${cleanName}_${data.fecha || "2026"}.docx`;
  saveAs(blob, fileName);
}

/**
 * Exporta una Planificación por Conceptos Clave a documento Word (.docx)
 */
export async function exportConceptPlanToWord(unit: ConceptPlanUnit) {
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } // 1 pulgada
          }
        },
        children: [
          // Título principal
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: "I.E. DEL MUNICIPIO DE SAN PEDRO • EDUCACIÓN INICIAL Y PREESCOLAR",
                bold: true,
                size: 20,
                color: "1E40AF",
                font: "Calibri"
              }),
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: `UNIDAD DIDÁCTICA POR CONCEPTO CLAVE`,
                bold: true,
                size: 26,
                color: "1E3A8A",
                font: "Calibri"
              }),
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: `${unit.icon} ${unit.conceptName.toUpperCase()}`,
                bold: true,
                size: 32,
                color: "1E3A8A",
                font: "Calibri"
              }),
            ]
          }),
          new Paragraph({ text: "" }),

          // Tabla Ficha Técnica
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    shading: { fill: "1E3A8A" },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: "Categoría:", bold: true, color: "FFFFFF", font: "Calibri", size: 22 }),
                        ]
                      })
                    ]
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: unit.category, font: "Calibri", size: 22 })
                        ]
                      })
                    ]
                  }),
                  new TableCell({
                    shading: { fill: "1E3A8A" },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: "Rango de Edad:", bold: true, color: "FFFFFF", font: "Calibri", size: 22 }),
                        ]
                      })
                    ]
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: unit.ageRange, font: "Calibri", size: 22 })
                        ]
                      })
                    ]
                  }),
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    shading: { fill: "F1F5F9" },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: "Dimensiones:", bold: true, font: "Calibri", size: 20 })
                        ]
                      })
                    ]
                  }),
                  new TableCell({
                    columnSpan: 3,
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: unit.dimensions.join(", "), font: "Calibri", size: 20 })
                        ]
                      })
                    ]
                  })
                ]
              })
            ]
          }),

          new Paragraph({ text: "" }),

          // Propósito MEN
          new Paragraph({
            children: [
              new TextRun({ text: "PROPÓSITO DE LA EDUCACIÓN INICIAL (MEN): ", bold: true, color: "064E3B", font: "Calibri", size: 24 }),
              new TextRun({ text: unit.propositoMEN, italics: true, font: "Calibri", size: 22 }),
            ]
          }),

          new Paragraph({ text: "" }),

          // Experiencia de Interés (Detonante Pedagógico)
          new Paragraph({
            children: [
              new TextRun({ text: "EXPERIENCIA DE INTERÉS (DETONANTE PEDAGÓGICO): ", bold: true, color: "1E40AF", font: "Calibri", size: 24 }),
              new TextRun({ text: `"${unit.guidingQuestion}"`, bold: true, italics: true, font: "Calibri", size: 22, color: "1E293B" }),
            ]
          }),

          new Paragraph({ text: "" }),

          // Justificación Pedagógica
          new Paragraph({
            children: [
              new TextRun({ text: "JUSTIFICACIÓN PEDAGÓGICA (Decreto 1411 de 2022):", bold: true, color: "047857", font: "Calibri", size: 24 })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            children: [
              new TextRun({ text: unit.justification, font: "Calibri", size: 22 })
            ]
          }),

          new Paragraph({ text: "" }),

          // Aprendizajes Imprescindibles
          new Paragraph({
            children: [
              new TextRun({ text: "APRENDIZAJES IMPRESCINDIBLES:", bold: true, color: "047857", font: "Calibri", size: 24 })
            ]
          }),
          ...unit.aprendizajesImprescindibles.map(app => new Paragraph({
            children: [
              new TextRun({ text: "• ", bold: true, color: "047857" }),
              new TextRun({ text: app, font: "Calibri", size: 22 })
            ]
          })),

          new Paragraph({ text: "" }),

          // FASES DE LA EXPERIENCIA
          new Paragraph({
            children: [
              new TextRun({ text: "DESARROLLO DE LA EXPERIENCIA PEDAGÓGICA:", bold: true, color: "064E3B", font: "Calibri", size: 26 })
            ]
          }),

          // Momento 1
          new Paragraph({
            children: [
              new TextRun({ text: `1. ${unit.sensoryProvocation.title}`, bold: true, color: "1E3A8A", font: "Calibri", size: 24 })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            children: [
              new TextRun({ text: unit.sensoryProvocation.description, font: "Calibri", size: 22 })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "   Materiales: ", bold: true, color: "475569", font: "Calibri", size: 20 }),
              new TextRun({ text: unit.sensoryProvocation.materials.join(", "), italics: true, font: "Calibri", size: 20 })
            ]
          }),
          new Paragraph({ text: "" }),

          // Momento 2
          new Paragraph({
            children: [
              new TextRun({ text: `2. ${unit.guidedExploration.title}`, bold: true, color: "1E3A8A", font: "Calibri", size: 24 })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            children: [
              new TextRun({ text: unit.guidedExploration.description, font: "Calibri", size: 22 })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "   Materiales: ", bold: true, color: "475569", font: "Calibri", size: 20 }),
              new TextRun({ text: unit.guidedExploration.materials.join(", "), italics: true, font: "Calibri", size: 20 })
            ]
          }),
          new Paragraph({ text: "" }),

          // Momento 3
          new Paragraph({
            children: [
              new TextRun({ text: `3. ${unit.creativeConsolidation.title}`, bold: true, color: "1E3A8A", font: "Calibri", size: 24 })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            children: [
              new TextRun({ text: unit.creativeConsolidation.description, font: "Calibri", size: 22 })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "   Materiales: ", bold: true, color: "475569", font: "Calibri", size: 20 }),
              new TextRun({ text: unit.creativeConsolidation.materials.join(", "), italics: true, font: "Calibri", size: 20 })
            ]
          }),
          new Paragraph({ text: "" }),

          // ACTIVIDADES RECTORAS (DECRETO 1411 DE 2022)
          new Paragraph({
            children: [
              new TextRun({ text: "ACTIVIDADES RECTORAS Y VIVENCIA DEL NIÑO/A (DECRETO 1411 DE 2022):", bold: true, color: "064E3B", font: "Calibri", size: 24 })
            ]
          }),
          ...(unit.rectorActivities && unit.rectorActivities.length > 0 ? unit.rectorActivities : [
            {
              activity: 'Exploración del Medio',
              description: `Rincón de indagación sensorial y manipulación directa de elementos en torno a "${unit.conceptName}".`,
              howChildApplies: `El niño/a toca, compara atributos y formula preguntas sobre "${unit.conceptName}".`
            },
            {
              activity: 'Juego',
              description: `Dinámicas lúdicas y circuitos psicomotores estructurados a partir de "${unit.conceptName}".`,
              howChildApplies: `El niño/a comparte con sus compañeros, respeta turnos y resuelve retos lúdicos.`
            },
            {
              activity: 'Arte',
              description: `Talleres plásticos y modelado tridimensional inspirado en "${unit.conceptName}".`,
              howChildApplies: `El niño/a estampa, moldea y exterioriza libremente sus emociones y descubrimientos.`
            },
            {
              activity: 'Literatura',
              description: `Lectura interactiva de cuentos, rimas sonoras y nanas sobre "${unit.conceptName}".`,
              howChildApplies: `El niño/a escucha historias, "lee" ilustraciones y narra con sus propias palabras.`
            }
          ]).flatMap(act => [
            new Paragraph({
              children: [
                new TextRun({ text: `• ${act.activity.toUpperCase()}: `, bold: true, color: "1E3A8A", font: "Calibri", size: 22 }),
                new TextRun({ text: act.description, font: "Calibri", size: 22 })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "   ¿Cómo lo aplica el niño/a?: ", bold: true, italics: true, color: "047857", font: "Calibri", size: 20 }),
                new TextRun({ text: act.howChildApplies, italics: true, color: "065F46", font: "Calibri", size: 20 })
              ]
            })
          ]),
          new Paragraph({ text: "" }),

          // EVALUACIÓN CUALITATIVA
          new Paragraph({
            children: [
              new TextRun({ text: "DESCRIPTORES CUALITATIVOS PARA EL OBSERVADOR / DIARIO DE CAMPO:", bold: true, color: "047857", font: "Calibri", size: 24 })
            ]
          }),
          ...unit.evaluativeDescriptors.map(desc => new Paragraph({
            children: [
              new TextRun({ text: "✓ ", bold: true, color: "047857" }),
              new TextRun({ text: desc, font: "Calibri", size: 22 })
            ]
          })),

          new Paragraph({ text: "" }),

          // ADAPTACIONES DUA Y VINCULACIÓN FAMILIAR
          new Paragraph({
            children: [
              new TextRun({ text: "AJUSTES RAZONABLES E INCLUSIÓN (DUA): ", bold: true, color: "064E3B", font: "Calibri", size: 22 }),
              new TextRun({ text: unit.adaptationsDUA, font: "Calibri", size: 22 })
            ]
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            children: [
              new TextRun({ text: "VINCULACIÓN FAMILIAR: ", bold: true, color: "064E3B", font: "Calibri", size: 22 }),
              new TextRun({ text: unit.familyActivity, font: "Calibri", size: 22 })
            ]
          }),

          new Paragraph({ text: "" }),
          new Paragraph({ text: "" }),

          // Firma del Docente
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: "_____________________________________\n", color: "94A3B8" }),
              new TextRun({ text: "Firma del Docente / Licenciado en Educación Infantil", bold: true, font: "Calibri", size: 22 })
            ]
          })
        ]
      }
    ]
  });

  const blob = await Packer.toBlob(doc);
  const cleanName = unit.conceptName.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ ]/g, "_");
  saveAs(blob, `Planificacion_Concepto_${cleanName}.docx`);
}



