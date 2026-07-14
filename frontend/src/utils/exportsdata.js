// Export data to CSV
export const exportToCSV = (data, filename) => {
  const csvContent = [
    Object.keys(data[0]).join(","),
    ...data.map((row) => Object.values(row).join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  downloadFile(blob, `${filename}.csv`);
};

// Export data to PDF
export const exportToPDF = (data, filename) => {
  // Using a simple approach - you can integrate jsPDF or similar
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  downloadFile(blob, `${filename}.json`);
};

// Download file helper
const downloadFile = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

// Export dashboard as image (screenshot)
export const exportAsScreenshot = async () => {
  try {
    const element = document.querySelector(".dashboard-content");
    // Note: Requires html2canvas library
    // import html2canvas from 'html2canvas';
    // const canvas = await html2canvas(element);
    // const link = document.createElement('a');
    // link.href = canvas.toDataURL();
    // link.download = 'dashboard-screenshot.png';
    // link.click();
    alert("Install html2canvas to enable screenshot export");
  } catch (error) {
    console.error("Export failed:", error);
  }
};