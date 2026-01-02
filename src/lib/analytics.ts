export const trackEvent = (name: string, params?: Record<string, any>) => {
  if (typeof window === 'undefined' || !(window as any).gtag) return;
  (window as any).gtag('event', name, params);
};

