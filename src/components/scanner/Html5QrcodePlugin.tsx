
import React, { useEffect, forwardRef, useImperativeHandle } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

interface Html5QrcodePluginProps {
  fps?: number;
  qrbox?: { width: number; height: number } | number;
  aspectRatio?: number;
  disableFlip?: boolean;
  facingMode?: string;
  qrCodeSuccessCallback: (decodedText: string, decodedResult?: any) => void;
  qrCodeErrorCallback?: (errorMessage: string, error: any) => void;
}

const qrcodeRegionId = "html5qr-code-full-region";

const Html5QrcodePlugin = forwardRef<any, Html5QrcodePluginProps>((props, ref) => {
  const {
    fps = 10,
    qrbox = 250,
    aspectRatio = 1.0,
    disableFlip = false,
    facingMode = "environment",
    qrCodeSuccessCallback,
    qrCodeErrorCallback = () => {}
  } = props;

  let html5QrCode: Html5Qrcode;

  useEffect(() => {
    // Clear any previous instances first
    const qrCodeContainer = document.getElementById(qrcodeRegionId);
    if (qrCodeContainer) {
      while (qrCodeContainer.firstChild) {
        qrCodeContainer.removeChild(qrCodeContainer.firstChild);
      }
    }

    // Create config for HTML5QrCode constructor
    const createConfig = {
      formatsToSupport: [0, 12], // QR Code and UPI QR specifically
      verbose: false, // Disable verbose logging
    };

    // Instantiate the QR code scanner
    html5QrCode = new Html5Qrcode(qrcodeRegionId, createConfig);
    
    const scanConfig = {
      fps,
      qrbox,
      aspectRatio,
      disableFlip
    };

    // Attempt to start the scanner
    const startScanner = () => {
      console.log("Starting QR scanner with facing mode:", facingMode);
      html5QrCode.start(
        { facingMode },
        scanConfig,
        qrCodeSuccessCallback,
        (errorMessage) => {
          // Ignore specific errors that happen frequently during normal operation
          if (
            errorMessage.includes("No MultiFormat Readers") ||
            errorMessage.includes("Failed to execute 'drawImage'") ||
            errorMessage.includes("No barcode or QR code detected")
          ) {
            return;
          }
          
          qrCodeErrorCallback(errorMessage, errorMessage);
        }
      ).catch((err) => {
        console.error("QR Scanner start error:", err);
        qrCodeErrorCallback(`Unable to start scanning: ${err}`, err);
      });
    };

    // Ensure we start the scanner after a short delay to allow the DOM to fully load
    setTimeout(startScanner, 100);

    // cleanup function when component will unmount
    return () => {
      console.log("Cleaning up QR scanner");
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().catch(err => console.error("Failed to stop scanner", err));
      }
    };
  }, [facingMode]);

  useImperativeHandle(ref, () => ({
    restart: () => {
      console.log("Attempting to restart QR scanner");
      if (html5QrCode) {
        if (html5QrCode.isScanning) {
          html5QrCode.stop().then(() => {
            const scanConfig = {
              fps,
              qrbox,
              aspectRatio,
              disableFlip
            };
            
            console.log("Restarting QR scanner with facing mode:", facingMode);
            html5QrCode.start(
              { facingMode },
              scanConfig,
              qrCodeSuccessCallback,
              qrCodeErrorCallback
            ).catch(err => {
              console.error("QR Scanner restart error:", err);
              qrCodeErrorCallback(`Unable to restart scanning: ${err}`, err);
            });
          }).catch(err => {
            console.error("Failed to stop scanner before restarting", err);
          });
        } else {
          const scanConfig = {
            fps,
            qrbox,
            aspectRatio,
            disableFlip
          };
          
          console.log("Starting QR scanner (not previously scanning) with facing mode:", facingMode);
          html5QrCode.start(
            { facingMode },
            scanConfig,
            qrCodeSuccessCallback,
            qrCodeErrorCallback
          ).catch(err => {
            console.error("QR Scanner start error:", err);
            qrCodeErrorCallback(`Unable to start scanning: ${err}`, err);
          });
        }
      }
    }
  }));

  return (
    <div id={qrcodeRegionId} className="w-full h-full" />
  );
});

Html5QrcodePlugin.displayName = "Html5QrcodePlugin";

export default Html5QrcodePlugin;
