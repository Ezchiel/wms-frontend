import { useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

interface Props {
  onScanSuccess: (decodedText: string) => void;
}

const QRScanner = ({ onScanSuccess }: Props) => {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      'reader',
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    scanner.render(onScanSuccess, (error) => {
      console.log(error);
    });

    return () => {
      scanner.clear().catch((error) => console.error('Failed to clear scanner', error));
    };
  }, [onScanSuccess]);

  return <div id="reader" className="w-full overflow-hidden rounded-xl"></div>;
};

export default QRScanner;
