
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
};

export const isPWAInstallable = (): boolean => {
  console.log('Checking if PWA is installable:', !!deferredPrompt);
  return !!deferredPrompt;
};

export const installPWA = async (): Promise<boolean> => {
  console.log('Attempting to install PWA');
  
  // Check if the app can be installed
  if (!deferredPrompt) {
    console.log('No install prompt available');
    
    // For iOS devices, which don't support the standard install prompt
    if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
      return false;
    }
    
    // For browsers that don't support the beforeinstallprompt event
    if ('serviceWorker' in navigator) {
      console.log('Trying alternative installation method');
      try {
        // Check if service worker is registered
        const registrations = await navigator.serviceWorker.getRegistrations();
        if (registrations.length > 0) {
          console.log('Service worker is registered, app may be installable');
          alert('Add to Home Screen: In Safari, tap the Share button and select "Add to Home Screen". In Chrome, tap the menu button and select "Add to Home Screen".');
          return true;
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
