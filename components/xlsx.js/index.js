import * as XLSX from "xlsx";
// ConvertToXlSx
export const convertToXLSX = (data, fileName) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  const xlsxBuffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
  saveFile(xlsxBuffer, fileName);
};

// save File
const saveFile = (buffer, fileName) => {
  const data = new Blob([buffer], { type: "application/octet-stream" });
  const url = URL.createObjectURL(data);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
};
