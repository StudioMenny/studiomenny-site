document.addEventListener('DOMContentLoaded', () => {
  const holder = document.getElementById('qr-holder');
  if(!holder || typeof QRCode === 'undefined') return;

  const siteUrl = holder.dataset.url || window.location.origin + '/MENNY/';

  new QRCode(holder, {
    text: siteUrl,
    width: 220,
    height: 220,
    colorDark: '#070912',
    colorLight: '#ffffff',
    correctLevel: QRCode.CorrectLevel.M
  });

  const downloadBtn = document.getElementById('download-qr');
  if(downloadBtn){
    downloadBtn.addEventListener('click', () => {
      const img = holder.querySelector('img');
      const canvas = holder.querySelector('canvas');
      const dataUrl = img && img.src ? img.src : (canvas ? canvas.toDataURL('image/png') : null);
      if(!dataUrl) return;
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = 'menny-qrcode.png';
      a.click();
    });
  }
});
