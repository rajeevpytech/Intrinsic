import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { API, getToken } from '../lib/api';

// A random browser ID, not a person identifier. No cookies, IPs, or query strings.
export const VisitorTracker = () => {
  const { pathname, search } = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(search);
    if (pathname.startsWith('/admin') || pathname.startsWith('/api') || getToken() || window.self !== window.top || params.has('edit') || params.has('review') || navigator.doNotTrack === '1' || navigator.globalPrivacyControl) return;
    const timer = setTimeout(() => {
      try {
        let visitor = localStorage.getItem('intr_visitor_id');
        if (!visitor) {
          visitor = crypto.randomUUID();
          localStorage.setItem('intr_visitor_id', visitor);
        }
        fetch(`${API}/analytics/pageview`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, keepalive: true,
          body: JSON.stringify({ visitor_id: visitor, event_id: crypto.randomUUID(), path: pathname }),
        }).catch(() => {});
      } catch { /* Browsers denying storage are not tracked. */ }
    }, 250);
    return () => clearTimeout(timer);
  }, [pathname, search]);
  return null;
};
