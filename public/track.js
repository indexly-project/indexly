(function () {
  'use strict';

  // site_id current script tag से लो
  var script = document.currentScript ||
    document.querySelector('script[data-site-id]');
  if (!script) return;

  var siteId = script.getAttribute('data-site-id');
  if (!siteId) return;

  var endpoint = 'https://ucwaojbakhfziyfkuswx.supabase.co/functions/v1/track-visit';

  // Session ID — browser session तक रहेगा
  var sessionKey = 'ixly_' + siteId;
  var session = sessionStorage.getItem(sessionKey);
  if (!session) {
    session = Math.random().toString(36).slice(2);
    sessionStorage.setItem(sessionKey, session);
  }

  function send() {
    var referrer = document.referrer || '';

    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        site_id: siteId,
        page: window.location.pathname,
        referrer: referrer,
        session_id: session,
      }),
      keepalive: true,
    }).catch(function () {});
  }

  // Page load पर send करो
  if (document.readyState === 'complete') {
    send();
  } else {
    window.addEventListener('load', send);
  }

  // SPA support (React/Vue/Next.js)
  var lastPath = window.location.pathname;
  var observer = new MutationObserver(function () {
    if (window.location.pathname !== lastPath) {
      lastPath = window.location.pathname;
      send();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();