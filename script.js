
/*
  CONFIGURAÇÕES DA CONFEITARIA

  WhatsApp: código do Brasil + DDD + número.
  Exemplo fictício: 5511988887777
*/

const WHATSAPP_NUMBER = "5511999999999";

const cart = new Map();

const home = document.getElementById("inicio");
const menuPage = document.getElementById("cardapio");

const cartPanel = document.getElementById("cartPanel");
const overlay = document.getElementById("overlay");
const cartItems = document.getElementById("cartItems");

const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");

const toast = document.getElementById("toast");


// Mostrar mensagens rápidas
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  window.clearTimeout(showToast.timer);

  showToast.timer = window.setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}


// Abrir o cardápio sem precisar rolar a página inicial
document.getElementById("viewMenu").addEventListener("click", () => {
  home.hidden = true;
  menuPage.hidden = false;

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});


// Voltar para a página inicial
document.getElementById("backHome").addEventListener("click", () => {
  menuPage.hidden = true;
  home.hidden = false;

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});


// Clicar em uma categoria leva à respectiva seção
document.querySelectorAll(".category-chip").forEach((button) => {
  button.addEventListener("click", () => {
    const targetId = button.dataset.target;
    const target = document.getElementById(targetId);

    document.querySelectorAll(".category-chip").forEach((chip) => {
      chip.classList.remove("active");
    });

    button.classList.add("active");

    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  });
});


// Adicionar produto ao pedido
document.querySelectorAll(".add-button").forEach((button) => {
  button.addEventListener("click", () => {
    const name = button.dataset.name;
    const price = Number(button.dataset.price) || 0;

    if (cart.has(name)) {
      const item = cart.get(name);
      item.quantity += 1;
    } else {
      cart.set(name, {
        name,
        price,
        quantity: 1
      });
    }

    updateCart();
    showToast(`${name} adicionado ao pedido!`);
  });
});


// Atualizar carrinho, quantidades e total
function updateCart() {
  const items = Array.from(cart.values());

  const totalQuantity = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  cartCount.textContent = totalQuantity;

  if (items.length === 0) {
    cartItems.innerHTML = `
      <p class="empty-cart">
        Seu carrinho ainda está vazio.
        Escolha uma delícia do cardápio!
      </p>
    `;

    cartTotal.textContent = "A consultar";
    return;
  }

  cartItems.replaceChildren();

  items.forEach((item) => {
    const article = document.createElement("article");
    article.className = "cart-item";

    const details = document.createElement("div");

    const title = document.createElement("h4");
    title.textContent = item.name;

    const description = document.createElement("p");
    description.textContent = item.price > 0
      ? formatPrice(item.price)
      : "Preço a consultar";

    const controls = document.createElement("div");
    controls.className = "quantity-controls";

    const decrease = document.createElement("button");
    decrease.textContent = "−";
    decrease.setAttribute("aria-label", `Diminuir ${item.name}`);
    decrease.addEventListener("click", () => changeQuantity(item.name, -1));

    const quantity = document.createElement("span");
    quantity.textContent = item.quantity;

    const increase = document.createElement("button");
    increase.textContent = "+";
    increase.setAttribute("aria-label", `Aumentar ${item.name}`);
    increase.addEventListener("click", () => changeQuantity(item.name, 1));

    controls.append(decrease, quantity, increase);
    details.append(title, description, controls);

    const priceColumn = document.createElement("div");

    const lineTotal = document.createElement("div");
    lineTotal.className = "cart-item-price";
    lineTotal.textContent = item.price > 0
      ? formatPrice(item.price * item.quantity)
      : "A consultar";

    const remove = document.createElement("button");
    remove.className = "remove-item";
    remove.textContent = "Remover";
    remove.addEventListener("click", () => {
      cart.delete(item.name);
      updateCart();
    });

    priceColumn.append(lineTotal, remove);
    article.append(details, priceColumn);

    cartItems.append(article);
  });

  const hasUnknownPrices = items.some((item) => item.price <= 0);

  const knownTotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  cartTotal.textContent = hasUnknownPrices
    ? `${formatPrice(knownTotal)} + itens a consultar`
    : formatPrice(knownTotal);
}


// Alterar quantidade
function changeQuantity(name, amount) {
  const item = cart.get(name);

  if (!item) {
    return;
  }

  item.quantity += amount;

  if (item.quantity <= 0) {
    cart.delete(name);
  }

  updateCart();
}


// Formatar valores em reais
function formatPrice(value) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}


// Abrir e fechar o carrinho
function openCart() {
  cartPanel.classList.add("open");
  cartPanel.setAttribute("aria-hidden", "false");

  overlay.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeCart() {
  cartPanel.classList.remove("open");
  cartPanel.setAttribute("aria-hidden", "true");

  overlay.hidden = true;
  document.body.style.overflow = "";
}

document.getElementById("openCart").addEventListener("click", openCart);

document.getElementById("closeCart").addEventListener("click", closeCart);

overlay.addEventListener("click", closeCart);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeCart();
  }
});


// Limpar o pedido
document.getElementById("clearCart").addEventListener("click", () => {
  cart.clear();
  updateCart();
  showToast("Pedido limpo.");
});


// Enviar pedido para o WhatsApp
document.getElementById("checkoutButton").addEventListener("click", () => {
  if (cart.size === 0) {
    showToast("Adicione pelo menos um produto primeiro.");
    return;
  }

  if (WHATSAPP_NUMBER === "5511999999999") {
    showToast("Configure o WhatsApp real no script.js.");
    return;
  }

  const items = Array.from(cart.values());

  const lines = items.map((item) => {
    const subtotal = item.price > 0
      ? formatPrice(item.price * item.quantity)
      : "preço a consultar";

    return `• ${item.name} — quantidade: ${item.quantity} — ${subtotal}`;
  });

  const hasUnknownPrices = items.some((item) => item.price <= 0);

  const knownTotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const totalMessage = hasUnknownPrices
    ? `Subtotal dos itens com preço cadastrado: ${formatPrice(knownTotal)}. Os demais valores precisam ser confirmados.`
    : `Total dos produtos: ${formatPrice(knownTotal)}.`;

  const message = [
    "Olá! Vim pelo site da Sabor & Art e gostaria de fazer um pedido.",
    "",
    "MEU PEDIDO:",
    ...lines,
    "",
    totalMessage,
    "",
    "Poderiam confirmar a disponibilidade e as opções de entrega ou retirada?"
  ].join("\n");

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  window.open(url, "_blank", "noopener,noreferrer");
});


// Ano do rodapé
document.getElementById("year").textContent = new Date().getFullYear();


// Estado inicial do carrinho
updateCart();
