/* Keep the styled prerendered page visible until its interactive React copy is settled, then swap. */
(function () {
  var html = document.documentElement;
  if (!html.hasAttribute('data-prerendered')) return;
  var snapshot = document.getElementById('root');
  if (!snapshot) return;
  snapshot.id = 'prerender-snapshot';
  html.classList.remove('le-wait');
  // Rules scoped to #root (saved live edits, custom CSS) must keep styling the snapshot.
  var retained = document.createElement('style');
  retained.id = 'prerender-retained';
  retained.textContent = Array.from(document.head.querySelectorAll('style'))
    .filter(function (node) { return /#root\b/.test(node.textContent); })
    .map(function (node) { return node.textContent.replace(/#root\b/g, '#prerender-snapshot'); }).join('\n');
  document.head.appendChild(retained);
  var root = document.createElement('div');
  root.id = 'root';
  root.style.cssText = 'position:absolute;top:0;left:0;width:100%;visibility:hidden;pointer-events:none';
  root.setAttribute('aria-hidden', 'true');
  snapshot.before(root);

  var pending = 0, settled = Date.now(), started = Date.now(), finished = false, mountedAt = 0;
  var open = XMLHttpRequest.prototype.open, send = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.open = function (method, url) {
    try { this.__intrinsicPublicGet = String(method).toUpperCase() === 'GET' && new URL(url, location.href).pathname.startsWith('/api/'); }
    catch (e) { this.__intrinsicPublicGet = false; }
    return open.apply(this, arguments);
  };
  XMLHttpRequest.prototype.send = function () {
    if (this.__intrinsicPublicGet) {
      pending++;
      this.addEventListener('loadend', function () { pending--; settled = Date.now(); }, { once: true });
    }
    try { return send.apply(this, arguments); }
    catch (error) { if (this.__intrinsicPublicGet) pending--; throw error; }
  };

  // Entrance animations (page fade, reveals, framer mount motion) must finish while hidden,
  // otherwise the swap would show a half-faded copy.
  var finiteRunning = function () {
    if (!root.getAnimations) return false;
    return root.getAnimations({ subtree: true }).some(function (a) {
      var t = a.effect && a.effect.getComputedTiming ? a.effect.getComputedTiming() : null;
      return a.playState === 'running' && t && isFinite(t.endTime) && t.iterations !== Infinity;
    });
  };
  var inView = function (el) { var r = el.getBoundingClientRect(); return r.bottom >= 0 && r.top < window.innerHeight; };

  // Reveal scripts tag elements after mount; anything already on screen in the styled page must stay shown.
  var PAIRS = [['areveal', 'is-in'], ['img-reveal', 'is-in'], ['treveal', 'treveal-in'], ['lr-reveal', 'lr-reveal-in'], ['hero-wipe', 'hw-in']];
  var settledCss = document.createElement('style');
  settledCss.id = 'prerender-settled';
  settledCss.textContent = '.reveal[data-pr-settled]>*{animation:none!important}';
  document.head.appendChild(settledCss);
  var settle = function (el) {
    for (var i = 0; i < PAIRS.length; i++) {
      if (el.classList.contains(PAIRS[i][0]) && !el.classList.contains(PAIRS[i][1]) && inView(el)) el.classList.add(PAIRS[i][1]);
    }
    // Component-driven .reveal: already visible in the styled page, so show it without replaying its entrance.
    if (el.classList.contains('reveal') && !el.classList.contains('is-visible') && inView(el)) {
      el.setAttribute('data-pr-settled', '');
      el.classList.add('is-visible');
    }
  };
  var keepShown = new MutationObserver(function (list) {
    list.forEach(function (m) { if (m.target.nodeType === 1) settle(m.target); });
  });
  keepShown.observe(root, { subtree: true, attributes: true, attributeFilter: ['class'] });

  var swap = function () {
    finished = true;
    clearInterval(timer);
    html.classList.add('pr-swap');
    root.querySelectorAll('.areveal,.img-reveal,.treveal,.lr-reveal,.hero-wipe,.reveal').forEach(settle);
    setTimeout(function () { keepShown.disconnect(); }, 1500);
    snapshot.remove(); retained.remove();
    var zoom = document.getElementById('prerender-zoom'); if (zoom) zoom.remove();
    root.removeAttribute('style'); root.removeAttribute('aria-hidden');
    html.removeAttribute('data-prerendered');
    var visible = document.getElementById('prerender-visible'); if (visible) visible.remove();
    XMLHttpRequest.prototype.open = open; XMLHttpRequest.prototype.send = send;
    delete window.__INTRINSIC_PUBLIC_DATA__;
    window.dispatchEvent(new Event('resize'));
    requestAnimationFrame(function () { requestAnimationFrame(function () { html.classList.remove('pr-swap'); }); });
  };

  var timer = setInterval(function () {
    if (finished) return;
    var now = Date.now();
    if (now - started > 12000 && root.querySelector('main')) { swap(); return; }
    window.__prBoot = { pending: pending, idle: now - settled, h1: !!root.querySelector('main h1'), waited: now - started };
    if (pending || now - settled < 250 || !root.querySelector('main h1')) return;
    if (!mountedAt) mountedAt = now;
    if (finiteRunning() && now - mountedAt < 3000) return;
    requestAnimationFrame(function () { requestAnimationFrame(function () { if (!finished) swap(); }); });
  }, 50);
})();
