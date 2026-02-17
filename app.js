const WHATSAPP_NUMBER = "972509066634";

const PRODUCTS = [
  { id: "classic", name: "לחם מחמצת קלאסי", price: 40 },
  { id: "onion", name: "לחם מחמצת בצל", price: 45 },
  { id: "cheese_chili", name: "לחם מחמצת גבינה וצ׳ילי", price: 45 },
  { id: "cheddar", name: "לחם מחמצת צ׳דר", price: 45 },
  { id: "butter_garlic", name: "לחם מחמצת חמאה ושום", price: 45 },
  { id: "cheese_onion", name: "לחם מחמצת גבינה ובצל", price: 45 },
  { id: "sweet", name: "לחם מחמצת מתוק", price: 45 },

  { id: "muffin_regular", name: "מאפינס רגיל (עם סוכר)", price: 12 },
  { id: "muffin_spelt_sf", name: "מאפינס כוסמין ללא סוכר", price: 15 }
];

let cart = {};

function renderProducts() {
  const container = document.getElementById("products");

  PRODUCTS.forEach(p => {
    cart[p.id] = 0;

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <div class="name">${p.name}</div>
      <div class="price">₪${p.price}</div>
      <input type="number" min="0" value="0"
        onchange="updateQty('${p.id}', this.value)">
    `;

    container.appendChild(card);
  });
}

function updateQty(id, value) {
  cart[id] = parseInt(value) || 0;
  calculateTotal();
}

function calculateTotal() {
  let total = 0;
  PRODUCTS.forEach(p => {
    total += cart[p.id] * p.price;
  });
  document.getElementById("total").innerText = "₪" + total;
}

function sendOrder() {
  const name = document.getElementById("custName").value;
  const phone = document.getElementById("custPhone").value;
  const date = document.getElementById("pickupDate").value;
  const notes = document.getElementById("notes").value;

  let message = `הזמנה חדשה:\n\nשם: ${name}\nטלפון: ${phone}\nתאריך: ${date}\n\n`;

  PRODUCTS.forEach(p => {
    if (cart[p.id] > 0) {
      message += `${p.name} x${cart[p.id]}\n`;
    }
  });

  message += `\nסה״כ: ₪${document.getElementById("total").innerText.replace("₪","")}`;

  if (notes) message += `\n\nהערות: ${notes}`;

  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`);
}

document.addEventListener("DOMContentLoaded", renderProducts);
