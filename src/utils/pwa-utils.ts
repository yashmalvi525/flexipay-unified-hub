
export const checkIfPWAInstalled = (): boolean => {
  return window.matchMedia('(display-mode: standalone)').matches || 
         (window.navigator as any).standalone || 
         document.referrer.includes('android-app://');
};

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

// Store the install prompt event globally
let deferredPrompt: BeforeInstallPromptEvent | null = null;

export const setupPWAInstallPrompt = (): void => {
  console.log('Setting up PWA install prompt');
  
  // Listen for the beforeinstallprompt event
  window.addEventListener('beforeinstallprompt', (e) => {
    console.log('beforeinstallprompt event fired');
    // Prevent Chrome from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e as BeforeInstallPromptEvent;
    
    // Optionally, notify the application that the app can be installed
    document.dispatchEvent(new CustomEvent('pwaInstallable', { detail: true }));
  });
  
  // Listen for the appinstalled event
  window.addEventListener('appinstalled', (e) => {
    console.log('PWA was installed', e);
    // Clear the deferredPrompt variable
    deferredPrompt = null;
    // Optionally, notify the application that the app was installed
    document.dispatchEvent(new CustomEvent('pwaInstalled', { detail: true }));
  });

  // For debug purposes
  console.log('PWA display mode:', window.matchMedia('(display-mode: standalone)').matches ? 'standalone' : 'browser');
  console.log('iOS standalone:', (window.navigator as any).standalone);
};

export const isPWAInstallable = (): boolean => {
  const isStandalone = checkIfPWAInstalled();
  const hasInstallPrompt = !!deferredPrompt;
  
  console.log('PWA installability check:', { 
    isStandalone, 
    hasInstallPrompt,
    userAgent: navigator.userAgent
  });
  
  // For iOS, we'll always say it's installable since they use a different method
  if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
    return !isStandalone; // If not already installed
  }
  
  return hasInstallPrompt && !isStandalone;
};

export const installPWA = async (): Promise<boolean> => {
  console.log('Attempting to install PWA', { deferredPrompt });
  
  // For iOS devices, show special instructions
  if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
    console.log('iOS device detected, showing manual installation instructions');
    return true; // Return true so the UI can show iOS-specific instructions
  }
  
  // Check if the app can be installed via standard method
  if (!deferredPrompt) {
    console.log('No install prompt available');
    
    // For browsers that don't support the beforeinstallprompt event but have service workers
    if ('serviceWorker' in navigator) {
      console.log('Service Worker supported, checking registration');
      try {
        // Check if service worker is registered
        const registrations = await navigator.serviceWorker.getRegistrations();
        if (registrations.length > 0) {
          console.log('Service worker is registered:', registrations);
          return true; // Allow showing installation instructions
        }
      } catch (err) {
        console.error('Error checking service worker registration:', err);
      }
    }
    
    return false;
  }

  try {
    console.log('Showing install prompt');
    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    
    // Clear the deferred prompt variable, as it can't be used again
    deferredPrompt = null;
    
    // Return true if the app was installed
    return outcome === 'accepted';
  } catch (err) {
    console.error('Error during PWA installation:', err);
    deferredPrompt = null;
    return false;
  }
};

// Function to request contacts access 
export const requestContactsAccess = async (): Promise<boolean> => {
  if ('contacts' in navigator && 'ContactsManager' in window) {
    try {
      const props = ['name', 'tel'];
      const options = { multiple: true };
      
      // This will prompt the user for permission
      await (navigator as any).contacts.select(props, options);
      return true;
    } catch (err) {
      console.error('Contacts access error:', err);
      return false;
    }
  } else {
    console.log('Contacts API not supported in this browser');
    return false;
  }
};
