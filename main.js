document.addEventListener('DOMContentLoaded', () => {
  // --- Arrow‐orbit animation setup ---
  const wrapper      = document.querySelector('.cursor-wrapper');
  const N            = 12;      // number of arrows
  const R            = 220;     // orbit radius in px
  const PULSE_HEIGHT = 40;
  const R_DURATION   = 8000;
  const DURATION     = 16000;   // ms per full orbit
  const OFFSET       = 40;      // static SVG tweak (°)
  const halfCursor   = 100;

  // center the “mouse” Y at the wrapper midpoint (you can still re‐enable real mousetracking)

  // build the arrows
  wrapper.innerHTML = '';
  const arrows = [];
  for (let i = 0; i < N; i++) {
    const container = document.createElement('div');
    container.classList.add('cursor');
    const img = document.createElement('img');
    img.src = 'cursor.svg';
    img.alt = 'arrow';
    img.style.zIndex = '10';
    container.appendChild(img);
    wrapper.appendChild(container);

    arrows.push({
      container,
      img,
      initialAngle: (360 / N) * i
    });
  }

  // the animation loop
  function update() {
    const now   = performance.now() % DURATION;
    const tDeg  = (now / DURATION) * 360;
    const rDeg  = (now / R_DURATION) * 2 * Math.PI;

    // get the H1’s center as orbit origin
    const h1Rect      = document.querySelector('.hero h1').getBoundingClientRect();
    const wrapperRect = wrapper.getBoundingClientRect();
    const cx0 = (h1Rect.left - wrapperRect.left) + (h1Rect.width / 2) - halfCursor;
    const cy0 = (h1Rect.top  - wrapperRect.top ) + (h1Rect.height / 2) - halfCursor;

    arrows.forEach(({ container, img, initialAngle }) => {
      // calculate pulsing orbit radius
      const orbitDeg = initialAngle + tDeg;
      const rad      = orbitDeg * Math.PI / 180;
      const pulse    = R + PULSE_HEIGHT * Math.sin(rDeg);
      const x        = cx0 + Math.cos(rad) * pulse;
      const y        = cy0 + Math.sin(rad) * pulse;

      // position container so its “pivot” is at (x,y)
      container.style.left = `${x}px`;
      container.style.top  = `${y}px`;

      // point each arrow back at the “mouse” (or h1 center)
      const rect = wrapper.getBoundingClientRect();
      const mouseX = h1Rect.left + h1Rect.width / 2 - halfCursor;
      const mouseY = rect.top + rect.height / 2 - halfCursor * 2;
      const dx     = mouseX - x;
      const dy     = mouseY  - y;
      const angle  = Math.atan2(dy, dx) * 180 / Math.PI;
      img.style.transform = `rotate(${angle + OFFSET}deg)`;

      // fade out/in on the right side
      const orbitAngle = ((orbitDeg % 360) + 360) % 360;
      const fadeTime = 30;
      let opacity;
      if (orbitAngle >= 25 && orbitAngle <= 25 + fadeTime) {
        opacity = 1 - (orbitAngle - 25) / fadeTime;
      } else if (orbitAngle >= 115 && orbitAngle <= 115 + fadeTime) {
        opacity = (orbitAngle - 115) / fadeTime;
      } else if (orbitAngle > 25 + fadeTime && orbitAngle < 115) {
        opacity = 0;
      } else {
        opacity = 1;
      }
      img.style.opacity = opacity;
    });

    requestAnimationFrame(update);
  }

  update();


  // --- Tab‐highlighting based on scroll position ---
  const tabButtons    = document.querySelectorAll('.tab-button');
  const sections      = document.querySelectorAll('.tab-content');
  const rightPanel    = document.querySelector('.hero-right');

  // click on tab -> scroll to section
  tabButtons.forEach(button => {
    button.addEventListener('click', e => {
      e.preventDefault();
      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      const targetSection = document.querySelector(button.getAttribute('href'));
      rightPanel.scrollTo({
        top: targetSection.offsetTop - 80,
        behavior: 'smooth'
      });
    });
  });

  // click on down‐arrow indicator -> next section
  const scrollIndicators = document.querySelectorAll('.section-scroll-indicator');
  scrollIndicators.forEach(ind => {
    ind.addEventListener('click', () => {
      const currentSection = ind.closest('.tab-content');
      const nextSection    = currentSection.nextElementSibling;
      if (nextSection && nextSection.classList.contains('tab-content')) {
        rightPanel.scrollTo({
          top: nextSection.offsetTop - 80,
          behavior: 'smooth'
        });
        // update tabs
        tabButtons.forEach(btn => {
          btn.classList.toggle('active', btn.getAttribute('href') === `#${nextSection.id}`);
        });
      }
    });
  });

  // scroll in rightPanel -> highlight current tab
  rightPanel.addEventListener('scroll', () => {
    let currentTabId = '';
    const scrollY = rightPanel.scrollTop;
    sections.forEach(sec => {
      if (scrollY >= sec.offsetTop - 100 && scrollY < sec.offsetTop + sec.offsetHeight - 100) {
        currentTabId = sec.id;
      }
    });
    if (currentTabId) {
      tabButtons.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('href') === `#${currentTabId}`);
      });
    }
  });

}); // end of DOMContentLoaded listener
