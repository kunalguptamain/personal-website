document.addEventListener('DOMContentLoaded', () => {
  const wrapper = document.querySelector('.cursor-wrapper');
  const N        = 12;      // number of arrows
  const R        = 200;     // orbit radius in px
  const PULSE_HEIGHT = 40;
  const R_DURATION = 8000;
  const DURATION = 16000;    // ms per full orbit
  const OFFSET   = 40;      // your static SVG tweak (°)

  const r  = wrapper.getBoundingClientRect();
	const halfCursor  = 100;
  let mouseY = r.top  + r.height /2  - halfCursor*2;
  
  //document.addEventListener('mousemove', e => {
  //  mouseX = e.clientX;
  //  mouseY = e.clientY;
  //});

  // 1) create arrows
  wrapper.innerHTML = '';
  const arrows = [];
  for (let i = 0; i < N; i++) {
    const div = document.createElement('div');
    div.classList.add('cursor');
    const img = document.createElement('img');
    img.src = 'cursor.svg';
    img.alt = 'arrow';
    img.style.zIndex = '10'
    div.appendChild(img);
    wrapper.appendChild(div);

    arrows.push({
      container: div,
      img,
      initialAngle: (360 / N) * i
    });
  }

  // 2) animation loop
  function update() {
    const now   = performance.now() % DURATION;
    const tDeg  = (now / DURATION) * 360;
    const rDeg = (now / R_DURATION) * 2 * 3.14;
    const wrapperRect = wrapper.getBoundingClientRect();
	  const h1Rect      = document.querySelector('.hero h1').getBoundingClientRect();

    // compute the H1-center relative to the wrapper’s top/left
    const cx0 = (h1Rect.left - wrapperRect.left) + (h1Rect.width  / 2) - halfCursor;
    const cy0 = (h1Rect.top  - wrapperRect.top)  + (h1Rect.height / 2) - halfCursor;
    console.log(cx0);

    arrows.forEach(({ container, img, initialAngle }) => {
      // --- orbit position ---
      const orbitDeg = initialAngle + tDeg;
      const rad      = orbitDeg * Math.PI / 180;
      const x        = cx0 + Math.cos(rad) * (R + PULSE_HEIGHT * Math.sin(rDeg));
      const y        = cy0 + Math.sin(rad) * (R + PULSE_HEIGHT * Math.sin(rDeg));

      // place the arrow’s **pivot point** at (x,y)
      container.style.left = `${x}px`;
      container.style.top  = `${y}px`;

      // --- pointer rotation ---
	    let mouseX = h1Rect.left + h1Rect.width / 2 - halfCursor;
      const dx    = mouseX - x;
      const dy    = mouseY - y;
      const angle = Math.atan2(dy, dx) * 180 / Math.PI;

      // apply, plus your static offset
      img.style.transform = `rotate(${angle + OFFSET}deg)`;
      
      const orbitAngle = (orbitDeg % 360 + 360) % 360;

      let opacity;
      let fade_time = 30
      if (orbitAngle >= 25 && orbitAngle <= 25 + fade_time)
      {
        opacity = 1 - (orbitAngle - 25) / fade_time;
      }
      else if (orbitAngle >= 115 && orbitAngle <= 115 + fade_time)
      {
        opacity = (orbitAngle - 115) / fade_time;
      }
      else if (orbitAngle > 25 + fade_time && orbitAngle < 115 + fade_time)
      {
        opacity = 0;
      } 
      else
      {
        opacity = 1;
      }
      img.style.opacity = opacity;
    });

    requestAnimationFrame(update);
  }

  update();
});

function switchTab(tabId) {
  // Hide all tabs
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });
  
  // Show selected tab
  document.getElementById(tabId).classList.add('active');
  
  // Update button states
  document.querySelectorAll('.tab-button').forEach(btn => {
    // Remove active class from all buttons
    btn.classList.remove('active');
    
    // Add active class only to the button associated with the visible tab
    if(btn.onclick.toString().includes(`'${tabId}'`)) {
      btn.classList.add('active');
    }
  });
}