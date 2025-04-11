
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

let deferredPrompt: BeforeInstallPromptEvent | null = null;

export const setupPWAInstallPrompt = (): void => {
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e as BeforeInstallPromptEvent;
  });
};

export const isPWAInstallable = (): boolean => {
  return !!deferredPrompt;
};

export const installPWA = async (): Promise<boolean> => {
  if (!deferredPrompt) return false;

  // Show the install prompt
  deferredPrompt.prompt();

  // Wait for the user to respond to the prompt
  const { outcome } = await deferredPrompt.userChoice;
  
  // We've used the prompt, and can't use it again, discard it
  deferredPrompt = null;
  
  return outcome === 'accepted';
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
