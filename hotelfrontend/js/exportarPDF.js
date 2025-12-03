// js/exportarPDF.js
export async function exportarPDF(nombreArchivo = "reporte.pdf", elementoId = null) {
    const { jsPDF } = window.jspdf;

    // Si no se envía un ID, exportamos todo el body
    const elemento = elementoId 
        ? document.getElementById(elementoId)
        : document.body;

    if (!elemento) {
        alert("No se encontró el elemento a exportar.");
        return;
    }

    const canvas = await html2canvas(elemento, {
        scale: 2,
        useCORS: true
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const imgWidth = 190;  // márgenes
    const imgHeight = canvas.height * imgWidth / canvas.width;

    pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
    pdf.save(nombreArchivo);
    
}
window.exportarPDF = exportarPDF;
