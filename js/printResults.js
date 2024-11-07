// Función para imprimir los resultados
function printResults() {
  const resultDiv = document.getElementById("result");
  if (resultDiv.innerHTML === "") {
    alert("Por favor, calcula las subredes antes de imprimir.");
    return;
  }

  // Crear un nuevo documento de impresión
  const printWindow = window.open('', '', 'height=400,width=600');
  printWindow.document.write('<html><head><title>Resultados de Subredes</title>');
  printWindow.document.write('</head><body>');
  printWindow.document.write(resultDiv.innerHTML); // Escribir los resultados
  printWindow.document.write('</body></html>');
  printWindow.document.close(); // Cerrar el documento para poder imprimir
  printWindow.print(); // Abrir el cuadro de diálogo de impresión
}
