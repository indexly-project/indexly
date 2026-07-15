(function () {
  'use strict';
  var script = document.currentScript || document.querySelector('script[data-site-id]');
  if (!script) return;
  var siteId = script.getAttribute('data-site-id');
  if (!siteId) return;
  var endpoint = 'https://indexly-snowy.vercel.app/api/track';
  var sessionKey = 'ixly_' + siteId;
  var session = sessionStorage.getItem(sessionKey);
  if (!session) { session = Math.random().toString(36).slice(2); sessionStorage.setItem(sessionKey, session); }
  function send() {
    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ site_id: siteId, page: window.location.pathname, referrer: document.referrer || '', session_id: session }),
      keepalive: true
    }).catch(function () {});
  }
  if (document.readyState === 'complete') { send(); } else { window.addEventListener('load', send); }
  var lastPath = window.location.pathname;
  new MutationObserver(function () {
    if (window.location.pathname !== lastPath) { lastPath = window.location.pathname; send(); }
  }).observe(document.body, { childList: true, subtree: true });
})();
