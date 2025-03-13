const PDFDocument = require("pdfkit");
const fs = require("fs");
const { calculateCredit } = require("./motor");

// Casos de prueba
const testCases = [
    { tipoNomina: "A", fechaPrimerEmpleo: "2022-06-12", genero: "f" },
    { tipoNomina: "B", fechaPrimerEmpleo: "1993-12-30", genero: "f" },
    { tipoNomina: "C", fechaPrimerEmpleo: "2020-09-19", genero: "m" },
    { tipoNomina: "D", fechaPrimerEmpleo: "2019-01-15", genero: "m" }
];

const tableData = testCases.map(({ tipoNomina, fechaPrimerEmpleo, genero }) => {
    const result = calculateCredit(tipoNomina, fechaPrimerEmpleo, genero);
    return [
        tipoNomina,
        fechaPrimerEmpleo,
        genero.toUpperCase(),
        `$${result.minCredit.toFixed(2)}`,
        `$${result.maxCredit.toFixed(2)}`,
        `$${result.optimalCreditLine.toFixed(2)}`
    ];
});

// Crear documento PDF
const doc = new PDFDocument({ margin: 50 });
const outputFile = "credit_report.pdf";
const stream = fs.createWriteStream(outputFile);
doc.pipe(stream);

// Título
doc.fontSize(16).text("Motor de decisión de credito", { align: "center" }).moveDown(2);

// Configuración de la tabla
const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
const colWidths = [80, 120, 50, 100, 100, 100]; // Ajuste de anchos
const tableWidth = colWidths.reduce((a, b) => a + b, 0);
const startX = (pageWidth - tableWidth) / 2 + doc.page.margins.left;
let startY = doc.y;
const rowHeight = 25;

// Encabezados con saltos de línea
const headers = [
    "Tipo de Nómina",
    "Fecha\nPrimer Empleo",
    "Género",
    "Monto Mínimo\nCrédito",
    "Monto Máximo\nCrédito",
    "Línea Óptima\nCrédito"
];

// Dibujar encabezados
doc.font("Helvetica-Bold").fontSize(10);
headers.forEach((header, i) => {
    doc.text(header, startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0), startY, {
        width: colWidths[i],
        align: "center"
    });
});
doc.moveDown();

// Dibujar líneas horizontales
doc.moveTo(startX, startY - 5).lineTo(startX + tableWidth, startY - 5).stroke();

startY += rowHeight;

// Dibujar los datos de la tabla
doc.font("Helvetica").fontSize(10);
tableData.forEach((row) => {
    row.forEach((text, i) => {
        doc.text(text, startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0), startY, {
            width: colWidths[i],
            align: "center"
        });
    });

    // Dibujar línea inferior de la fila
    doc.moveTo(startX, startY + rowHeight - 5).lineTo(startX + tableWidth, startY + rowHeight - 5).stroke();

    startY += rowHeight;
});

// Finalizar PDF
doc.end();
stream.on("finish", () => {
    console.log(`PDF generado: ${outputFile}`);
});