// maskCalculator.js

// Función para calcular la máscara de subred en formato decimal basado en los bits
function calculateMask(bits) {
  let mask = [];
  for (let i = 0; i < 4; i++) {
    if (bits >= 8) {
      mask.push(255);
      bits -= 8;
    } else if (bits > 0) {
      mask.push(256 - Math.pow(2, 8 - bits));
      bits = 0;
    } else {
      mask.push(0);
    }
  }
  return mask.join('.');
}

// Función para calcular los bits de máscara requeridos para una cantidad de hosts
function calculateMaskBits(hosts) {
  return 32 - Math.ceil(Math.log2(hosts + 2)); // +2 para red y broadcast
}
