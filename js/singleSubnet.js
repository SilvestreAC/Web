// singleSubnet.js

// Función para validar la dirección IP
function validateIPAddress(ip) {
  const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return ipRegex.test(ip);
}

// Función para calcular una sola subred
function calculateSingleSubnet() {
  const ipAddress = document.getElementById("ipAddress").value;
  const hosts = parseInt(document.getElementById("hosts").value);

  if (!validateIPAddress(ipAddress)) {
    alert("Por favor, ingresa una dirección IP válida.");
    return;
  }

  if (isNaN(hosts) || hosts < 1) {
    alert("Por favor, ingresa una cantidad válida de hosts.");
    return;
  }

  // Llamada a las funciones de maskCalculator.js
  const maskBits = calculateMaskBits(hosts);
  const mask = calculateMask(maskBits);
  const hostCount = Math.pow(2, 32 - maskBits) - 2;

  // Calcular la IP de la red
  const ipParts = ipAddress.split('.').map(Number);
  const ipDecimal = (ipParts[0] << 24) | (ipParts[1] << 16) | (ipParts[2] << 8) | ipParts[3];
  const maskDecimal = -1 << (32 - maskBits);
  const networkAddressDecimal = ipDecimal & maskDecimal;

  // Calcular IP de difusión
  const broadcastAddressDecimal = networkAddressDecimal | ~maskDecimal;

  // Calcular primer y último host
  const firstHostDecimal = networkAddressDecimal + 1;
  const lastHostDecimal = broadcastAddressDecimal - 1;

  // Convertir direcciones de decimal a formato IP
  const networkAddress = decimalToIp(networkAddressDecimal);
  const firstHost = decimalToIp(firstHostDecimal);
  const lastHost = decimalToIp(lastHostDecimal);
  const broadcastAddress = decimalToIp(broadcastAddressDecimal);

  document.getElementById("result").innerHTML = `
    <p><strong>Red:</strong> ${networkAddress}</p>
    <p><strong>Primer host:</strong> ${firstHost}</p>
    <p><strong>Último host:</strong> ${lastHost}</p>
    <p><strong>IP difusión:</strong> ${broadcastAddress}</p>
    <p><strong>Máscara de Subred:</strong> ${mask}</p>
    <p><strong>Hosts disponibles:</strong> ${hostCount}</p>

  `;
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
