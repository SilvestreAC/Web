// Función para validar la dirección IP
function validateIPAddress(ip) {
  ip = ip.trim();
  const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return ipRegex.test(ip);
}

// Generar campos de entrada para múltiples subredes
function generateHostFields() {
  const numberOfSubnets = parseInt(document.getElementById("numberOfSubnets").value);
  const hostFieldsDiv = document.getElementById("hostFields");
  hostFieldsDiv.innerHTML = ""; // Limpiar campos anteriores

  for (let i = 0; i < numberOfSubnets; i++) {
    hostFieldsDiv.innerHTML += `
            <label for="hostsForSubnet${i}">Hosts para la subred #${i + 1}:</label>
            <input type="number" id="hostsForSubnet${i}" placeholder="Ejemplo: 30">
        `;
  }
}

// Función para calcular múltiples subredes
function calculateMultipleSubnets() {
  let ipAddress = document.getElementById("ipAddress").value.trim();
  const numberOfSubnets = parseInt(document.getElementById("numberOfSubnets").value);
  const hostsPerSubnet = [];

  if (!validateIPAddress(ipAddress)) {
    alert("Por favor, ingresa una dirección IP válida.");
    return;
  }

  for (let i = 0; i < numberOfSubnets; i++) {
    const hosts = parseInt(document.getElementById(`hostsForSubnet${i}`).value);
    if (isNaN(hosts) || hosts < 1) {
      alert(`Por favor, ingresa un número válido de hosts para el subneteo ${i + 1}`);
      return;
    }
    hostsPerSubnet.push(hosts);
  }

  // Ordenar hosts de mayor a menor
  hostsPerSubnet.sort((a, b) => b - a);

  let currentIPDecimal = ipToDecimal(ipAddress); // Iniciar desde la IP base
  let resultHTML = `<h3>Resultados de las subredes:</h3>`;

  // Calcular subred para cada cantidad de hosts en orden descendente
  hostsPerSubnet.forEach((hosts, index) => {
    const maskBits = calculateMaskBits(hosts);
    const mask = calculateMask(maskBits);
    const hostCount = Math.pow(2, 32 - maskBits) - 2;

    // Calcular dirección de red, difusión, primer y último host
    const networkAddressDecimal = currentIPDecimal;
    const broadcastAddressDecimal = networkAddressDecimal + hostCount + 1;
    const firstHostDecimal = networkAddressDecimal + 1;
    const lastHostDecimal = broadcastAddressDecimal - 1;

    // Convertir direcciones de decimal a formato IP
    const networkAddress = decimalToIp(networkAddressDecimal);
    const firstHost = decimalToIp(firstHostDecimal);
    const lastHost = decimalToIp(lastHostDecimal);
    const broadcastAddress = decimalToIp(broadcastAddressDecimal);

    resultHTML += `
            <p><strong>Subred #${index + 1} (Hosts solicitados: ${hosts}):</strong></p>
            <p>Red: ${networkAddress}</p>
            <p>Primer host: ${firstHost}</p>
            <p>Último host: ${lastHost}</p>
            <p>Difusión: ${broadcastAddress}</p>
            <p>Máscara de Subred: ${mask}</p>
            <p>Hosts disponibles: ${hostCount}</p>
        `;

    // Actualizar la IP base para la siguiente subred
    currentIPDecimal = broadcastAddressDecimal + 1;
  });

  document.getElementById("result").innerHTML = resultHTML;

  // Mostrar el botón de imprimir
  document.getElementById("printButton").style.display = 'inline-block';
}

// Función para convertir IP a formato decimal
function ipToDecimal(ip) {
  const parts = ip.split('.').map(Number);
  return (parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3];
}

// Función para convertir de decimal a formato IP
function decimalToIp(decimal) {
  return [
    (decimal >>> 24) & 255,
    (decimal >>> 16) & 255,
    (decimal >>> 8) & 255,
    decimal & 255
  ].join('.');
}

// Función para calcular la cantidad de bits de máscara necesaria
function calculateMaskBits(hosts) {
  return 32 - Math.ceil(Math.log2(hosts + 2)); // +2 para red y broadcast
}

// Función para calcular la máscara en formato IP
function calculateMask(maskBits) {
  return decimalToIp(-1 << (32 - maskBits));
}
