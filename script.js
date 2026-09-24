(() => {
  const views = [...document.querySelectorAll('.view')];
  const sellerPulse = document.getElementById('seller-pulse');
  let pulseIntervalId = null;
  let initialPulseId = null;
  let pulseCleanupId = null;

  const homeIsVisible = () => document.getElementById('home')?.classList.contains('active');

  function fireSellerPulse() {
    if (!sellerPulse || document.hidden || !homeIsVisible()) return;

    // Remove/re-add the class so the animation restarts every time, even in Safari/iOS.
    sellerPulse.classList.remove('is-pulsing');
    void sellerPulse.offsetWidth; // force reflow intentionally

    requestAnimationFrame(() => {
      sellerPulse.classList.add('is-pulsing');
      window.clearTimeout(pulseCleanupId);
      pulseCleanupId = window.setTimeout(() => {
        sellerPulse.classList.remove('is-pulsing');
      }, 950);
    });
  }

  function stopSellerPulseSchedule() {
    window.clearTimeout(initialPulseId);
    window.clearInterval(pulseIntervalId);
    initialPulseId = null;
    pulseIntervalId = null;
  }

  function startSellerPulseSchedule() {
    stopSellerPulseSchedule();
    if (!sellerPulse || !homeIsVisible()) return;

    // First attention cue shortly after load/return, then every 4.5 seconds.
    initialPulseId = window.setTimeout(fireSellerPulse, 900);
    pulseIntervalId = window.setInterval(fireSellerPulse, 4500);
  }

  function showView(target) {
    views.forEach(view => view.classList.toggle('active', view.id === target));
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (target === 'home') {
      startSellerPulseSchedule();
    } else {
      stopSellerPulseSchedule();
      sellerPulse?.classList.remove('is-pulsing');
    }
  }

  document.querySelectorAll('[data-go]').forEach(el => {
    el.addEventListener('click', () => showView(el.getAttribute('data-go')));
  });

  // Browsers throttle timers in background tabs. Restart the cadence on return.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopSellerPulseSchedule();
    } else if (homeIsVisible()) {
      startSellerPulseSchedule();
    }
  });

  window.addEventListener('pageshow', () => {
    if (homeIsVisible()) startSellerPulseSchedule();
  });

  startSellerPulseSchedule();
})();
