const QRCode = require('qrcode');

const generateQRCode = async (data) => {
  try {
    const payload = typeof data === 'string' ? data : JSON.stringify(data);
    const qrDataUrl = await QRCode.toDataURL(payload, {
      errorCorrectionLevel: 'H',
      margin: 2,
      color: {
        dark: '#1E293B',
        light: '#FFFFFF'
      }
    });
    return qrDataUrl;
  } catch (error) {
    console.error('[QR Service Error]:', error);
    return '';
  }
};

module.exports = { generateQRCode };
