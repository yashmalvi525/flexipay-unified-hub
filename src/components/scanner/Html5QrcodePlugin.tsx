
import React, { useEffect, forwardRef, useImperativeHandle, useState } from 'react';
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

  const [scanner, setScanner] = useState<Html5Qrcode | null>(null);
  const [isScannerReady, setScannerReady] = useState(false);

  // Initialize the scanner
  useEffect(() => {
    // Only initialize once
    if (scanner) return;
    
    console.log("Initializing QR scanner");
    
    // Create config for HTML5QrCode constructor
    const createConfig = {
      formatsToSupport: [0, 12], // QR Code and UPI QR specifically
      verbose: true, // Add the missing verbose property
    };

    try {
      // Clear any previous instances
      const qrCodeContainer = document.getElementById(qrcodeRegionId);
      if (qrCodeContainer) {
        while (qrCodeContainer.firstChild) {
          qrCodeContainer.removeChild(qrCodeContainer.firstChild);
        }
      }

      // Create a new scanner instance
      const html5QrCode = new Html5Qrcode(qrcodeRegionId, createConfig);
      setScanner(html5QrCode);
      setScannerReady(true);
      console.log("QR scanner initialized successfully");
    } catch (err) {
      console.error("Failed to initialize scanner:", err);
      qrCodeErrorCallback(`Initialization error: ${err}`, err);
    }
  }, []);

  // Start scanning when scanner is ready and facingMode changes
  useEffect(() => {
    if (!scanner || !isScannerReady) return;
    
    console.log(`Starting scanner with facing mode: ${facingMode}`);
    
    const config = {
      fps,
      qrbox,
      aspectRatio,
      disableFlip
    };

    // Stop any existing scanning
    if (scanner.isScanning) {
      scanner.stop().then(() => {
        startScanning();
      }).catch(err => {
        console.error("Error stopping scanner before restart:", err);
        // Try to start anyway
        startScanning();
      });
    } else {
      startScanning();
    }

    function startScanning() {
      // Add a small delay to ensure camera resources are properly released
      setTimeout(() => {
        scanner.start(
          { facingMode },
          config,
          qrCodeSuccessCallback,
          (errorMessage) => {
            // This is a workaround to avoid constantly firing errors
            if (errorMessage.includes("No MultiFormat Readers")) {
              return;
            }
            console.log("QR scanner error:", errorMessage);
            qrCodeErrorCallback(errorMessage, errorMessage);
          }
        ).catch((err) => {
          console.error("Failed to start scanner:", err);
          qrCodeErrorCallback(`Unable to start scanning: ${err}`, err);
        });
      }, 300);
    }

    // Cleanup function when component will unmount or facingMode changes
    return () => {
      if (scanner && scanner.isScanning) {
        scanner.stop().catch(err => console.error("Failed to stop scanner during cleanup", err));
      }
    };
  }, [scanner, isScannerReady, facingMode, fps, qrbox, aspectRatio, disableFlip, qrCodeSuccessCallback, qrCodeErrorCallback]);

  // Expose restart method to parent via ref
  useImperativeHandle(ref, () => ({
    restart: () => {
      if (!scanner) return;
      
      console.log("Manually restarting scanner");
      if (scanner.isScanning) {
        scanner.stop().then(() => {
          // Add a small delay to ensure camera is fully released
          setTimeout(() => {
            const config = {
              fps,
              qrbox,
              aspectRatio,
              disableFlip
            };
            
            scanner.start(
              { facingMode },
              config,
              qrCodeSuccessCallback,
              qrCodeErrorCallback
            ).catch(err => {
              console.error("Failed to restart scanner:", err);
              qrCodeErrorCallback(`Unable to restart scanning: ${err}`, err);
            });
          }, 500);
        }).catch(err => {
          console.error("Failed to stop scanner before restarting", err);
        });
      } else {
        const config = {
          fps,
          qrbox,
          aspectRatio,
          disableFlip
        };
        
        scanner.start(
          { facingMode },
          config,
          qrCodeSuccessCallback,
          qrCodeErrorCallback
        ).catch(err => {
          console.error("Failed to start scanner during restart:", err);
          qrCodeErrorCallback(`Unable to restart scanning: ${err}`, err);
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
