
(() => {
  const body = document.body;
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");

  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const expanded = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!expanded));
      nav.classList.toggle("open", !expanded);
    });
  }

  document.querySelectorAll("[data-font]").forEach(button => {
    button.addEventListener("click", () => {
      const current = Number(getComputedStyle(document.documentElement).getPropertyValue("--font-scale").trim()) || 1;
      const next = button.dataset.font === "up" ? Math.min(1.3, current + 0.1) : Math.max(0.9, current - 0.1);
      document.documentElement.style.setProperty("--font-scale", next.toFixed(1));
    });
  });

  const contrastButton = document.querySelector("[data-contrast]");
  if (contrastButton) {
    contrastButton.addEventListener("click", () => {
      const active = body.classList.toggle("high-contrast");
      contrastButton.setAttribute("aria-pressed", String(active));
      contrastButton.textContent = active ? "Contraste padrão" : "Alto contraste";
    });
  }

  const motionButton = document.querySelector("[data-motion]");
  if (motionButton) {
    motionButton.addEventListener("click", () => {
      const active = body.classList.toggle("reduce-motion");
      motionButton.setAttribute("aria-pressed", String(active));
      motionButton.textContent = active ? "Ativar animações" : "Reduzir movimentos";
    });
  }

  const readButton = document.querySelector("[data-read]");
  if (readButton && "speechSynthesis" in window) {
    readButton.addEventListener("click", () => {
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
        readButton.textContent = "Ouvir esta página";
        return;
      }
      const main = document.querySelector("main");
      const text = main ? main.innerText : document.body.innerText;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "pt-BR";
      utterance.rate = 0.95;
      utterance.onend = () => readButton.textContent = "Ouvir esta página";
      readButton.textContent = "Parar leitura";
      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
    });
  } else if (readButton) {
    readButton.disabled = true;
    readButton.textContent = "Leitura por voz indisponível";
  }

  const searchForm = document.querySelector("[data-search-form]");
  if (searchForm) {
    searchForm.addEventListener("submit", event => {
      event.preventDefault();
      const query = searchForm.querySelector("input").value.trim().toLocaleLowerCase("pt-BR");
      const cards = [...document.querySelectorAll("[data-article-card]")];
      let visible = 0;
      cards.forEach(card => {
        const match = card.innerText.toLocaleLowerCase("pt-BR").includes(query);
        card.hidden = !match;
        if (match) visible++;
      });
      const status = document.querySelector("[data-search-status]");
      if (status) status.textContent = query ? `${visible} conteúdo(s) encontrado(s).` : "Mostrando todos os conteúdos.";
    });
  }
})();
