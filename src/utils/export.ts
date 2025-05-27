import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

/**
 * Exporta dados para CSV
 * @param {any[]} data - Array de objetos a serem exportados
 * @param {string} filename - Nome do arquivo
 * @param {string[]} headers - Cabeçalhos das colunas
 * @returns {void}
 */
export function exportToCSV(
  data: any[],
  filename: string,
  headers: string[]
): void {
  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header.toLowerCase()];
          return typeof value === "string" && value.includes(",")
            ? `"${value}"`
            : value;
        })
        .join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
  saveAs(blob, `${filename}.csv`);
}

/**
 * Exporta dados para Excel
 * @param {any[]} data - Array de objetos a serem exportados
 * @param {string} filename - Nome do arquivo
 * @param {string} sheetName - Nome da planilha
 * @returns {void}
 */
export function exportToExcel(
  data: any[],
  filename: string,
  sheetName: string = "Sheet1"
): void {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}

/**
 * Exporta dados para PDF
 * @param {any[]} data - Array de objetos a serem exportados
 * @param {string} filename - Nome do arquivo
 * @param {string[]} headers - Cabeçalhos das colunas
 * @returns {Promise<void>}
 */
export async function exportToPDF(
  data: any[],
  filename: string,
  headers: string[]
): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const { autoTable } = await import("jspdf-autotable");

  const doc = new jsPDF();
  const title = filename;
  const date = format(new Date(), "dd/MM/yyyy HH:mm", { locale: ptBR });

  // Adiciona título
  doc.setFontSize(16);
  doc.text(title, 14, 15);

  // Adiciona data
  doc.setFontSize(10);
  doc.text(`Exportado em: ${date}`, 14, 22);

  // Adiciona tabela
  autoTable(doc, {
    head: [headers],
    body: data.map((row) => headers.map((header) => row[header.toLowerCase()])),
    startY: 30,
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [66, 66, 66],
      textColor: 255,
      fontStyle: "bold",
    },
  });

  doc.save(`${filename}.pdf`);
}

/**
 * Exporta dados para JSON
 * @param {any[]} data - Array de objetos a serem exportados
 * @param {string} filename - Nome do arquivo
 * @returns {void}
 */
export function exportToJSON(data: any[], filename: string): void {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: "application/json" });
  saveAs(blob, `${filename}.json`);
}

/**
 * Hook para exportação de dados
 * @returns {Object} Funções de exportação
 */
export function useExport() {
  const exportData = async (
    data: any[],
    filename: string,
    format: "csv" | "excel" | "pdf" | "json",
    headers?: string[]
  ) => {
    try {
      switch (format) {
        case "csv":
          if (!headers) throw new Error("Headers são obrigatórios para CSV");
          exportToCSV(data, filename, headers);
          break;
        case "excel":
          exportToExcel(data, filename);
          break;
        case "pdf":
          if (!headers) throw new Error("Headers são obrigatórios para PDF");
          await exportToPDF(data, filename, headers);
          break;
        case "json":
          exportToJSON(data, filename);
          break;
        default:
          throw new Error("Formato de exportação não suportado");
      }
    } catch (error) {
      console.error("Erro ao exportar dados:", error);
      throw error;
    }
  };

  return { exportData };
}
