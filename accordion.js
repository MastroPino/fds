class Accordion {
  // Define static DOM lookup map for improved performance
  static _domRefs = {
    ITEM: ".accordion-item",
    BUTTON: ".accordion-button",
    CONTENT: ".accordion-collapse",
    REMOVER: ".accordion-remover",
    ICON: ".accordion-icon",
  };

  // Static method to optimize DOM queries
  static get(element, selector) {
    return element.querySelector(selector);
  }

  static getAll(element, selector) {
    return element.querySelectorAll(selector);
  }

  constructor(element) {
    this.element = element;
    this.config = {
      icons: {
        default: {
          open: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19.5 15L12 7.5L4.5 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                           </svg>`,
          close: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4.5 9L12 16.5L19.5 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                           </svg>`,
        },
        plus: {
          open: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                           </svg>`,
          close: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                           </svg>`,
        },
        chevron: {
          open: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 15L12 9L6 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                           </svg>`,
          close: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                           </svg>`,
        },
      },
      animation: {
        duration: 300,
      },
    };

    this.iconStyle = element.dataset.iconStyle || "default";
    this.iconSet = this.config.icons[this.iconStyle];
    this.items = new Map();
    this.init();
  }

  init() {
    this.cacheElements();
    this.setupIcons();
    this.setupListeners();
    this.setupInitialAccessibility();
  }

  cacheElements() {
    const items = this.element.querySelectorAll(".accordion-item");
    items.forEach((item) => {
      const button = item.querySelector(".accordion-button");
      const content = item.querySelector(".accordion-collapse");
      const remover = item.querySelector(".accordion-remover");
      this.items.set(item, { button, content, remover });
    });
  }

  setupInitialAccessibility() {
    this.items.forEach(({ button, content }) => {
      const isExpanded = button.getAttribute("aria-expanded") === "true";
      content.setAttribute("tabindex", isExpanded ? "0" : "-1");
      button.setAttribute("aria-selected", isExpanded ? "true" : "false");
    });
  }

  setupIcons() {
    this.items.forEach(({ button }) => {
      const iconContainer = button.querySelector(".accordion-icon");
      if (iconContainer) {
        const isExpanded = button.getAttribute("aria-expanded") === "true";
        iconContainer.innerHTML = isExpanded
          ? this.iconSet.open
          : this.iconSet.close;
      }
    });
  }

  setupListeners() {
    this.items.forEach(({ button, remover }) => {
      button.addEventListener("click", this.handleButtonClick.bind(this));
      button.addEventListener(
        "keydown",
        this.handleKeyboardNavigation.bind(this),
      );

      if (remover) {
        remover.setAttribute("tabindex", "0");
        remover.addEventListener("click", this.handleRemoverClick.bind(this));
        remover.addEventListener(
          "keydown",
          this.handleRemoverKeydown.bind(this),
        );
      }
    });
  }

  handleButtonClick(e) {
    if (!e.target.closest(".accordion-remover")) {
      this.toggleSection(e.currentTarget);
    }
  }

  handleRemoverClick(e) {
    e.stopPropagation();
    this.removeAccordionItem(e.currentTarget);
  }

  handleRemoverKeydown(e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();
      this.removeAccordionItem(e.currentTarget);
    }
  }

  removeAccordionItem(remover) {
    const item = remover.closest(".accordion-item");
    if (item) {
      this.items.delete(item);
      item.remove();
    }
  }

  handleKeyboardNavigation(e) {
    const buttons = Array.from(this.items.values()).map((i) => i.button);
    const currentIndex = buttons.indexOf(e.target);

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        buttons[(currentIndex + 1) % buttons.length].focus();
        break;
      case "ArrowUp":
        e.preventDefault();
        buttons[(currentIndex - 1 + buttons.length) % buttons.length].focus();
        break;
      case "Home":
        e.preventDefault();
        buttons[0].focus();
        break;
      case "End":
        e.preventDefault();
        buttons[buttons.length - 1].focus();
        break;
      case "Escape":
        e.preventDefault();
        if (e.target.getAttribute("aria-expanded") === "true") {
          this.toggleSection(e.target);
        }
        break;
    }
  }

  toggleSection(button) {
    const isExpanded = button.getAttribute("aria-expanded") === "true";
    const collapseId = button.getAttribute("aria-controls");
    const collapseElement = document.getElementById(collapseId);

    if (!isExpanded) {
      this.closeOtherSections(button);
    }

    button.setAttribute("aria-expanded", !isExpanded);
    button.setAttribute("aria-selected", !isExpanded);

    if (collapseElement) {
      collapseElement.setAttribute("tabindex", !isExpanded ? "0" : "-1");
      this.updateIcon(button, !isExpanded);
      this.animateSection(collapseElement, !isExpanded);
    }
  }

  updateIcon(button, isExpanded) {
    const iconContainer = button.querySelector(".accordion-icon");
    if (iconContainer) {
      iconContainer.innerHTML = isExpanded
        ? this.iconSet.open
        : this.iconSet.close;
    }
  }

  animateSection(element, isOpening) {
    const animation = () => {
      if (isOpening) {
        element.classList.remove("collapse");
        element.classList.add("collapsing");
        element.style.height = "0";
        requestAnimationFrame(() => {
          element.style.height = element.scrollHeight + "px";
          setTimeout(() => {
            element.classList.remove("collapsing");
            element.classList.add("collapse", "show");
            element.style.height = "";
          }, this.config.animation.duration);
        });
      } else {
        element.style.height = element.scrollHeight + "px";
        requestAnimationFrame(() => {
          element.style.height = "0";
          element.classList.add("collapsing");
          element.classList.remove("collapse", "show");
          setTimeout(() => {
            element.classList.remove("collapsing");
            element.classList.add("collapse");
            element.style.height = "";
          }, this.config.animation.duration);
        });
      }
    };
    requestAnimationFrame(animation);
  }

  closeOtherSections(activeButton) {
    this.items.forEach(({ button, content }) => {
      if (
        button !== activeButton &&
        button.getAttribute("aria-expanded") === "true"
      ) {
        button.setAttribute("aria-expanded", "false");
        button.setAttribute("aria-selected", "false");
        content.setAttribute("tabindex", "-1");
        this.updateIcon(button, false);
        this.animateSection(content, false);
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const accordions = document.querySelectorAll(".accordion");
  accordions.forEach((accordion) => new Accordion(accordion));
});
