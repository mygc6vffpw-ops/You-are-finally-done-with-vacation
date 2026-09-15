(() => {
  "use strict";

  const body = document.body;
  const flowerLayer = document.getElementById("flowerLayer");
  const presentButton = document.getElementById("presentButton");
  const envelopeButton = document.getElementById("envelopeButton");
  const continueButton = document.getElementById("continueButton");

  const FLOWERS = [
    "pink-lily-1.png",
    "white-lily.png",
    "pink-lily-2.png"
  ];

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let flowerCount = 0;
  let flowerTimers = [];
  let sequenceStarted = false;
  let envelopeOpened = false;
  let surpriseShown = false;

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const rand = (min, max) => Math.random() * (max - min) + min;

  function createFlower(delayMs, index) {
    const flower = document.createElement("img");
    flower.className = "flower";
    flower.src = FLOWERS[index % FLOWERS.length];
    flower.alt = "";
    flower.draggable = false;

    // Organic variation: size, position, rotation, drift and opacity.
    const size = rand(88, 185);
    const startX = rand(-8, 108);
    const midX = clamp(startX + rand(-18, 18), -15, 115);
    const endX = clamp(midX + rand(-16, 16), -15, 115);
    const duration = rand(3.5, 5.7);
    const rotationStart = rand(-42, 42);
    const rotationMid = rotationStart + rand(-115, 115);
    const rotationEnd = rotationMid + rand(-80, 80);

    flower.style.setProperty("--size", `${size}px`);
    flower.style.setProperty("--x0", `${startX}vw`);
    flower.style.setProperty("--x1", `${midX}vw`);
    flower.style.setProperty("--x2", `${endX}vw`);
    flower.style.setProperty("--drift", `${rand(-6, 6)}vw`);
    flower.style.setProperty("--duration", `${duration}s`);
    flower.style.setProperty("--r0", `${rotationStart}deg`);
    flower.style.setProperty("--r1", `${rotationMid}deg`);
    flower.style.setProperty("--r2", `${rotationEnd}deg`);
    flower.style.setProperty("--opacity", `${rand(.86, 1)}`);
    flower.style.animationDelay = `${delayMs}ms`;

    flowerLayer.appendChild(flower);
    flowerCount += 1;

    // Keep the final visual layer in the DOM. Flowers do not disappear after landing.
    flower.addEventListener("animationend", () => {
      flower.style.animation = "none";
      flower.style.transform = `translate3d(${endX}vw, 122vh, 0) rotate(${rotationEnd}deg)`;
    }, { once: true });
  }

  function buildFlowerSequence() {
    if (sequenceStarted) return;
    sequenceStarted = true;

    flowerLayer.style.visibility = "visible";
    body.classList.add("flowers-active");

    if (prefersReducedMotion) {
      // Accessibility fallback: still uses only the supplied flower assets.
      for (let i = 0; i < 22; i++) {
        createFlower(i * 15, i);
      }
      setTimeout(revealEnvelope, 700);
      return;
    }

    // First: clearly individual lilies, with deliberate pauses.
    const firstWave = [0, 720, 1450, 2150];
    firstWave.forEach((delay, i) => {
      flowerTimers.push(setTimeout(() => createFlower(delay, i), delay));
    });

    // Then density increases progressively over roughly 7 seconds.
    const waves = [
      { at: 2700, count: 2 },
      { at: 3150, count: 2 },
      { at: 3600, count: 3 },
      { at: 4050, count: 3 },
      { at: 4500, count: 4 },
      { at: 5000, count: 5 },
      { at: 5450, count: 6 },
      { at: 5850, count: 7 },
      { at: 6250, count: 8 }
    ];

    waves.forEach((wave, waveIndex) => {
      flowerTimers.push(setTimeout(() => {
        for (let i = 0; i < wave.count; i++) {
          createFlower(rand(0, 140), flowerCount + waveIndex + i);
        }
      }, wave.at));
    });

    // A dense finishing burst ensures the viewport is visually covered at the end.
    flowerTimers.push(setTimeout(() => {
      for (let i = 0; i < 16; i++) {
        createFlower(rand(0, 220), flowerCount + i);
      }
    }, 6700));

    // The flowers have filled the screen by about 7 seconds. Hold briefly, then reveal.
    flowerTimers.push(setTimeout(revealEnvelope, 7700));
  }

  function revealEnvelope() {
    if (envelopeOpened) return;

    // Continuous reveal: flowers move/scatter upward/outward rather than a page cut.
    flowerLayer.classList.add("revealing");
    flowerLayer.style.transition = "opacity 1900ms cubic-bezier(.2,.8,.2,1), transform 1900ms cubic-bezier(.2,.8,.2,1)";
    flowerLayer.style.transform = "translate3d(0, -8vh, 0) scale(1.055)";
    flowerLayer.style.opacity = "0";

    body.classList.add("celebration-visible");

    // Give the envelope its own soft arrival, still underneath the existing flower layer.
    setTimeout(() => {
      flowerLayer.style.visibility = "hidden";
      flowerLayer.innerHTML = "";
      flowerLayer.style.opacity = "";
      flowerLayer.style.transform = "";
      flowerLayer.classList.remove("revealing");
    }, 2050);
  }

  function openPresent() {
    if (sequenceStarted) return;
    sequenceStarted = true;
    presentButton.style.transform = "scale(.94) translateY(7px)";
    presentButton.style.filter = "brightness(1.04)";
    setTimeout(() => {
      presentButton.style.transform = "";
      presentButton.style.filter = "";
      // buildFlowerSequence normally guards against repeats; reset the guard here
      // so the actual sequence can start exactly once.
      sequenceStarted = false;
      buildFlowerSequence();
    }, 240);
  }

  presentButton.addEventListener("click", openPresent);
  presentButton.addEventListener("touchend", (event) => {
    event.preventDefault();
    openPresent();
  }, { passive: false });

  envelopeButton.addEventListener("click", () => {
    if (envelopeOpened) return;
    envelopeOpened = true;
    envelopeButton.classList.add("is-opening");

    // Flap opens, then the letter rises continuously from the physical envelope.
    setTimeout(() => {
      body.classList.add("letter-visible");
      document.getElementById("letterScene").classList.add("active");
    }, 650);
  });

  continueButton.addEventListener("click", () => {
    if (surpriseShown) return;
    surpriseShown = true;

    const paper = document.getElementById("letterPaper");
    paper.style.transform = "rotate(-1.1deg) translateY(-7vh) scale(.93)";
    paper.style.opacity = "0";

    // No blank screen: the final scene is already underneath and fades in directly.
    setTimeout(() => {
      body.classList.add("surprise-visible");
      startCountdown();
    }, 430);
  });

  function startCountdown() {
    const target = new Date(2026, 8, 21, 9, 45, 0, 0); // Local device time.
    const els = {
      days: document.getElementById("days"),
      hours: document.getElementById("hours"),
      minutes: document.getElementById("minutes"),
      seconds: document.getElementById("seconds")
    };

    function update() {
      const now = new Date();
      let diff = target.getTime() - now.getTime();

      if (diff <= 0) diff = 0;

      const totalSeconds = Math.floor(diff / 1000);
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      els.days.textContent = String(days).padStart(2, "0");
      els.hours.textContent = String(hours).padStart(2, "0");
      els.minutes.textContent = String(minutes).padStart(2, "0");
      els.seconds.textContent = String(seconds).padStart(2, "0");
    }

    update();
    setInterval(update, 1000);
  }
})();
