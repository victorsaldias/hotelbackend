export async function exportarPDF(
    nombreArchivo = "reporte.pdf",
    elementoId = null,
    titulo = "Reporte",
    nombreHotel = "Hotel Arellano",
    empleado = "Empleado"
) {
    const { jsPDF } = window.jspdf;

    const elemento = elementoId
        ? document.getElementById(elementoId)
        : document.body;

    if (!elemento) {
        alert("No se encontró el elemento a exportar.");
        return;
    }

    const ahora = new Date();
    const fecha = ahora.toLocaleDateString("es-CL");
    const hora = ahora.toLocaleTimeString("es-CL", { hour12: false });
    const fechaHoraTexto = `Generado el ${fecha} a las ${hora}`;

    const canvas = await html2canvas(elemento, {
        scale: 2,
        useCORS: true
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    pdf.setFontSize(14);
    pdf.text(nombreHotel, 105, 12, { align: "center" });

    pdf.setFontSize(18);
    pdf.text(titulo, 105, 20, { align: "center" });

    pdf.setFontSize(12);
    pdf.text("Generado por: " + empleado, 105, 27, { align: "center" });

    pdf.setLineWidth(0.5);
    pdf.line(10, 32, 200, 32);

    const offsetY = 38;

    const imgWidth = 190;
    const imgHeight = canvas.height * imgWidth / canvas.width;
    pdf.addImage(imgData, "PNG", 10, offsetY, imgWidth, imgHeight);

    pdf.setFontSize(10);
    pdf.setTextColor(120);
    pdf.text(fechaHoraTexto, 105, 290, { align: "center" });

    pdf.save(nombreArchivo);
}

window.exportarPDF = exportarPDF;




