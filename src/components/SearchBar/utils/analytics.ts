// In a real implementation, this would send to your analytics service
export const track = (eventType: string, data: any) => {
  if (typeof window === 'undefined') return;
  try {

    // Store local analytics
    const analytics = JSON.parse(
      localStorage.getItem('search-analytics') || '[]'
    );
    analytics.push({
      timestamp: new Date().toISOString(),
      event: eventType,
      data,
    });

    // Keep only last 100 events
    localStorage.setItem(
      'search-analytics',
      JSON.stringify(analytics.slice(-100))
    );
  } catch {
    // Silently fail
  }
};