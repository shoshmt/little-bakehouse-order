const WHATSAPP_NUMBER = "972509066634";

const PRODUCTS = [
  { id: "classic", name: "לחם מחמצת קלאסי", price: 40 },
  { id: "onion", name: "לחם מחמצת בצל", price: 45 },
  { id: "cheese_chili", name: "לחם מחמצת גבינה וצ׳ילי", price: 45 },
  { id: "cheddar", name: "לחם מחמצת צ׳דר", price: 45 },
  { id: "butter_garlic", name: "לחם מחמצת חמאה ושום", price: 45 },
  { id: "cheese_onion", name: "לחם מחמצת גבינה ובצל", price: 45 },
  { id: "sweet", name: "לחם מחמצת מתוק", price: 45 },

  { id: "muffin_regular", name: "מאפינס רגיל (עם סוכר)", price: 12, minQty: 4, image: "muffins-default.jpg" },
  { id: "muffin_spelt_sf", name: "מאפינס כוסמין ללא סוכר", price: 15, minQty: 4, image: "muffins-default.jpg" }
];

let cart = {};
let total = 0;

function renderProducts() {
  const container = document.getElementById("products");
  container.innerHTML = "";

  PRODUCTS.forEach(product => {
    cart[product.id] = 0;

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      ${product.image ? `<img src="${product.image}">` : ""}
      <div class="name">${product.name}</div>
      <div class="price">₪${product.price}</div>
      <div class="row">
        <label>כמות</label>
        <input type="number" min="0" value="0"
               onchange="updateQty('${product.id}', this.value)">
      </div>
      ${product.minQty ? `<div style="font-size:12px;color:#777;">מינימום ${product.minQty} יחידות</div>` : ""}
    `;

    container.appendChild(card);
  });
}

function updateQty(id, value) {
  const product = PRODUCTS.find(p => p.id === id);
  let qty = parseInt(value) || 0;

  if (product.minQty && qty > 0 && qty < product.minQty) {
    alert(`המינימום הוא ${product.minQty}`);
    qty = 0;
  }

  cart[id] = qty;
  calculateTotal();
}

function calculateTotal() {
  total = 0;
  PRODUCTS.forEach(product => {
    total += (cart[product.id] || 0) * product.price;
  });
  document.getElementById("total").innerText = "₪" + total;
}

function isValidDate(dateStr) {
  if (!dateStr) return false;

  const selected = new Date(dateStr);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  if (selected < tomorrow) return false;
  if (selected.getDay() === 0) return false;

  return true;
}

function sendOrder() {
  const name = document.getElementById("custName").value.trim();
  const phone = document.getElementById("custPhone").value.trim();
  const date = document.getElementById("pickupDate").value;
  const notes = document.getElementById("notes").value.trim();

  if (!name || !phone || !isValidDate(date)) {
    alert("נא למלא פרטים ולבחור תאריך תקין (לא ראשון ויום מראש)");
    return;
  }

  if (total === 0) {
    alert("נא לבחור מוצרים");
    return;
  }

  let message = `היי! הזמנה חדשה 😊\n\n`;
  message += `שם: ${name}\nטלפון: ${phone}\nתאריך איסוף: ${date}\n\nפריטים:\n`;

  PRODUCTS.forEach(product => {
    if (cart[product.id] > 0) {
      message += `- ${product.name} x${cart[product.id]} = ₪${cart[product.id] * product.price}\n`;
    }
  });

  message += `\nסה״כ: ₪${total}\n`;

  if (notes) {
    message += `\nהערות:\n${notes}`;
  }

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}

document.addEventListener("DOMContentLoaded", renderProducts);
