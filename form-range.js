document.addEventListener("DOMContentLoaded", () => {
  const rangeContainers = document.querySelectorAll(".form-range-container");

  rangeContainers.forEach((container) => {
    const rangeInput = container.querySelector(".form-range");
    const ticksContainer = container.querySelector(".form-range-ticks");

    if (!rangeInput || !ticksContainer) {
      console.error("Elemento input o container non trovati.");
      return;
    }

    const min = parseFloat(rangeInput.getAttribute("min")) || 0;
    const max = parseFloat(rangeInput.getAttribute("max")) || 40;
    const step = parseFloat(rangeInput.getAttribute("step")) || 8;

    if (isNaN(min) || isNaN(max) || isNaN(step)) {
      console.error("Input range deve avere min, max e step definiti");
      return;
    }

    ticksContainer.innerHTML = "";

    // Determina se stiamo lavorando con decimali
    const isDecimal = step < 1;

    // Usa step diversi in base al tipo di input
    const displayStep = isDecimal ? 0.25 : step;

    const numberOfSteps = Math.round((max - min) / displayStep);

    for (let i = 0; i <= numberOfSteps; i++) {
      const value = isDecimal
        ? parseFloat((min + i * displayStep).toFixed(2))
        : min + i * displayStep;

      if (value > max) continue;

      const tickElement = document.createElement("span");
      tickElement.classList.add("form-range-tick");

      // Mostra il valore solo per i tick pari
      if (i % 2 === 0) {
        tickElement.textContent = value;
      }

      tickElement.style.position = "absolute";
      tickElement.style.left = `${((value - min) / (max - min)) * 100}%`;
      tickElement.style.transform = "translateX(-50%)";

      ticksContainer.appendChild(tickElement);
    }
  });
});
