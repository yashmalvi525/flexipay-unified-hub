
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
    // when component mounts
    const config = {
      fps,
      qrbox,
      aspectRatio,
      disableFlip
    };

    // Create config for HTML5QrCode constructor
    const createConfig = {
      formatsToSupport: [0, 12], // QR Code and UPI QR specifically
      verbose: true, // Add the missing verbose property
    };

    // Clear any previous instances
    const qrCodeContainer = document.getElementById(qrcodeRegionId);
    if (qrCodeContainer) {
      while (qrCodeContainer.firstChild) {
        qrCodeContainer.removeChild(qrCodeContainer.firstChild);
      }
    }

    // Instantiate the QR code scanner
    html5QrCode = new Html5Qrcode(qrcodeRegionId, createConfig);
    
    html5QrCode.start(
      { facingMode },
      config,
      qrCodeSuccessCallback,
      (errorMessage) => {
        // This is a workaround to avoid constantly firing errors
        if (errorMessage.includes("No MultiFormat Readers")) {
          return;
        }
        
        qrCodeErrorCallback(errorMessage, errorMessage);
      }
    ).catch((err) => {
      qrCodeErrorCallback(`Unable to start scanning: ${err}`, err);
    });

    // cleanup function when component will unmount
    return () => {
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().catch(err => console.error("Failed to stop scanner", err));
      }
    };
  }, [facingMode]);

  useImperativeHandle(ref, () => ({
    restart: () => {
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().then(() => {
          const config = {
            fps,
            qrbox,
            aspectRatio,
            disableFlip
          };
          
          html5QrCode.start(
            { facingMode },
            config,
            qrCodeSuccessCallback,
            qrCodeErrorCallback
          ).catch(err => {
            qrCodeErrorCallback(`Unable to restart scanning: ${err}`, err);
          });
        }).catch(err => {
          console.error("Failed to stop scanner before restarting", err);
        });
      }
    }
  }));

  return (
    <div id={qrcodeRegionId} className="w-full h-full" />
  );
});

Html5QrcodePlugin.displayName = "Html5QrcodePlugin";

export default Html5QrcodePlugin;
