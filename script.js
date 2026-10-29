
const WHATSAPP_NUMBER = "5511999999999";
const INSTAGRAM_URL = "https://www.instagram.com/";

const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");

// Menu para celulares
menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");

  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Fechar menu" : "Abrir menu"
  );
  menuToggle.textContent = isOpen ? "✕" : "☰";
});

// Fecha o menu ao selecionar uma seção
nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menu");
    menuToggle.textContent = "☰";
  });
});

// Filtros do catálogo de doces
const filterButtons = document.querySelectorAll(".filter");
const productCards = document.querySelectorAll(".product-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const category = button.dataset.filter;

    filterButtons.forEach((item) => {
      item.classList.remove("active");
    });

    button.classList.add("active");

    productCards.forEach((card) => {
      const matches =
        category === "todos" || card.dataset.category === category;

      card.classList.toggle("hidden", !matches);
    });
  });
});

// Botão de pedido pelo WhatsApp
const whatsappButton = document.getElementById("whatsappButton");

whatsappButton.addEventListener("click", (event) => {
  event.preventDefault();

  if (WHATSAPP_NUMBER === "5511999999999") {
    alert(
      "Configure o número de WhatsApp da confeitaria no arquivo script.js antes de publicar o site."
    );
    return;
  }

  const message = encodeURIComponent(
    "Olá! Conheci o site da Sabor & Art e gostaria de consultar os doces disponíveis e os valores."
  );

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;

  window.open(url, "_blank", "noopener,noreferrer");
});

// Link do Instagram
const instagramLink = document.getElementById("instagramLink");

instagramLink.href = INSTAGRAM_URL;

// Ano atualizado automaticamente
document.getElementById("year").textContent =
  new Date().getFullYear();
