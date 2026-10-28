
/*
  SABOR E ART
  Antes de publicar, substitua o número abaixo pelo WhatsApp
  comercial completo, incluindo o código do país e o DDD.
  Use somente números, sem +, espaços ou traços.
*/

const WHATSAPP_NUMBER = "5531999999999";

const buildWhatsAppLink = (message) => {
  const numberIsConfigured =
    /^\d{12,13}$/.test(WHATSAPP_NUMBER) &&
    !WHATSAPP_NUMBER.endsWith("999999999");

  if (!numberIsConfigured) {
    alert(
      "O WhatsApp da loja ainda precisa ser configurado no arquivo script.js."
    );
    return;
  }

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
};

// Menu para celular
const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");

menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Fechar menu" : "Abrir menu"
  );
  menuToggle.textContent = isOpen ? "×" : "☰";
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menu");
    menuToggle.textContent = "☰";
  });
});

// Filtros do cardápio
const filterButtons = document.querySelectorAll(".filter");
const productCards = document.querySelectorAll(".product-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedFilter = button.dataset.filter;

    filterButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle("active", active);
      item.setAttribute("aria-pressed", String(active));
    });

    productCards.forEach((card) => {
      card.hidden =
        selectedFilter !== "todos" &&
        card.dataset.category !== selectedFilter;
    });
  });

  button.setAttribute(
    "aria-pressed",
    String(button.classList.contains("active"))
  );
});

// Botões de consulta de produtos
document.querySelectorAll(".add-button").forEach((button) => {
  button.addEventListener("click", () => {
    const product = button.dataset.product;
    buildWhatsAppLink(
      `Olá! Vi o site da Sabor e Art e gostaria de saber mais sobre ${product}, incluindo sabores, tamanhos e valores.`
    );
  });
});

// Botões gerais de contato
const generalMessage =
  "Olá! Conheci o site da Sabor e Art e gostaria de consultar o cardápio e fazer uma encomenda.";

document.getElementById("contactButton").addEventListener("click", (event) => {
  event.preventDefault();
  buildWhatsAppLink(generalMessage);
});

document.getElementById("floatingWhatsapp").addEventListener("click", (event) => {
  event.preventDefault();
  buildWhatsAppLink(generalMessage);
});

// Ano automático no rodapé
document.getElementById("year").textContent = new Date().getFullYear();
