// Utility for native OS/browser notifications and audio reminder chimes

export function playReminderChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    // Tone 1
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    gain1.gain.setValueAtTime(0.2, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.4);

    // Tone 2 (higher bell pitch)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, ctx.currentTime + 0.15); // A5
    gain2.gain.setValueAtTime(0.25, ctx.currentTime + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.15);
    osc2.stop(ctx.currentTime + 0.8);
  } catch (e) {
    console.warn('Audio chime could not play', e);
  }
}

export async function requestBrowserNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    return 'denied';
  }
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (e) {
    console.error('Failed to request notification permission', e);
    return Notification.permission;
  }
}

export function sendSystemNotification(title: string, body: string, tag?: string) {
  // Always play audio alert chime
  playReminderChime();

  if (!('Notification' in window)) {
    return false;
  }

  if (Notification.permission === 'granted') {
    try {
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.ready.then(reg => {
          reg.showNotification(title, {
            body,
            icon: '/favicon.ico',
            tag: tag || 'onespace-reminder',
            badge: '/favicon.ico',
            requireInteraction: true
          });
        }).catch(() => {
          new Notification(title, {
            body,
            icon: '/favicon.ico',
            tag: tag || 'onespace-reminder',
            requireInteraction: true
          });
        });
      } else {
        new Notification(title, {
          body,
          icon: '/favicon.ico',
          tag: tag || 'onespace-reminder',
          requireInteraction: true
        });
      }
      return true;
    } catch (e) {
      console.warn('Failed to display native notification', e);
    }
  }
  return false;
}
