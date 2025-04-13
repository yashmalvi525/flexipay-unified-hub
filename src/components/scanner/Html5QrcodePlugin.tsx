
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
  const [scanningStarted, setScanningStarted] = useState(false);

  // Initialize the scanner with a slight delay to ensure DOM is ready
  useEffect(() => {
    const timerId = setTimeout(() => {
      if (scanner) return;
      
      console.log("Initializing QR scanner with delay");
      
      // Create config for HTML5QrCode constructor
      const createConfig = {
        formatsToSupport: [0, 12], // QR Code and UPI QR specifically
        verbose: true,
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
    }, 300); // Add a small delay to ensure DOM is fully rendered
    
    return () => clearTimeout(timerId);
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

    // Always stop any existing scanning before starting new scan
    const startNewScan = () => {
      setScanningStarted(true);
      
      console.log("Starting camera with config:", config);
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
        setScanningStarted(false);
        qrCodeErrorCallback(`Unable to start scanning: ${err}`, err);
        
        // Auto-retry on fail with longer delay
        setTimeout(() => {
          if (scanner && !scanner.isScanning) {
            console.log("Auto-retrying camera start after failure");
            startNewScan();
          }
        }, 1000);
      });
    };

    // If already scanning but mode changed, restart
    if (scanner.isScanning) {
      console.log("Scanner was already running, stopping first");
      scanner.stop().then(() => {
        // Add a longer delay to ensure camera is fully released
        setTimeout(startNewScan, 800);
      }).catch(err => {
        console.error("Error stopping scanner before restart:", err);
        // Try to start anyway after a delay
        setTimeout(startNewScan, 1000);
      });
    } else if (!scanningStarted) {
      // First time starting
      startNewScan();
    }

    // Cleanup function when component will unmount or facingMode changes
    return () => {
      if (scanner && scanner.isScanning) {
        console.log("Stopping scanner during cleanup");
        scanner.stop().catch(err => console.error("Failed to stop scanner during cleanup", err));
        setScanningStarted(false);
      }
    };
  }, [scanner, isScannerReady, facingMode, fps, qrbox, aspectRatio, disableFlip, qrCodeSuccessCallback, qrCodeErrorCallback]);

  // Expose restart method to parent via ref
  useImperativeHandle(ref, () => ({
    restart: () => {
      if (!scanner) return;
      
      console.log("Manually restarting scanner");
      setScanningStarted(false);
      
      if (scanner.isScanning) {
        scanner.stop().then(() => {
          // Add a longer delay to ensure camera is fully released
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
            
            setScanningStarted(true);
          }, 800);
        }).catch(err => {
          console.error("Failed to stop scanner before restarting", err);
          
          // Try force restarting after a longer delay
          setTimeout(() => {
            if (scanner) {
              console.log("Trying force restart after error");
              
              // First attempt to stop if it's still scanning (ignoring errors)
              if (scanner.isScanning) {
                scanner.stop().catch(() => {});
              }
              
              // Start with a longer delay
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
                  console.error("Failed final restart attempt:", err);
                });
                
                setScanningStarted(true);
              }, 1000);
            }
          }, 1000);
        });
      } else {
        console.log("Starting scanner in restart (wasn't running)");
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
        
        setScanningStarted(true);
      }
    },
    
    forceStop: () => {
      if (scanner && scanner.isScanning) {
        console.log("Force stopping scanner");
        scanner.stop().catch(err => console.error("Error in force stop", err));
        setScanningStarted(false);
      }
    }
  }));

  return (
    <div id={qrcodeRegionId} className="w-full h-full" />
  );
});

Html5QrcodePlugin.displayName = "Html5QrcodePlugin";

export default Html5QrcodePlugin;
