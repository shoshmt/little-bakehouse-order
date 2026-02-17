const WHATSAPP_NUMBER = "972509066634";

const PRODUCTS = [
  // לחמים + תמונות
  { id: "classic", name: "לחם מחמצת קלאסי", price: 40, type: "bread", image: "classic.jpg" },
  { id: "onion", name: "לחם מחמצת בצל", price: 45, type: "bread", image: "onion.jpg" },
  { id: "cheese_chili", name: "לחם מחמצת גבינה וצ׳ילי", price: 45, type: "bread", image: "cheese_chili.jpg" },
  { id: "cheddar", name: "לחם מחמצת צ׳דר", price: 45, type: "bread", image: "cheddar.jpg" },
  { id: "butter_garlic", name: "לחם מחמצת חמאה ושום", price: 45, type: "bread", image: "butter_garlic.jpg" },
  { id: "cheese_onion", name: "לחם מחמצת גבינה ובצל", price: 45, type: "bread", image: "cheese_onion.jpg" },
  { id: "sweet", name: "לחם מחמצת מתוק", price: 45, type: "bread", image: "sweet.jpg" },

  // מאפינס + תמונות
  { id: "muffin_regular", name: "מאפינס רגיל (עם סוכר)", price: 12, type: "muffin", minQty: 4, image: "muffin_regular_chocolate.jpg" },
  { id: "muffin_spelt_sf", name: "מאפינס כוסמין ללא סוכר", price: 15, type: "muffin", minQty: 4, image: "muffin_sf_espresso_vanilla.jpg" }
];

const cart = {};
let total = 0;

function currency(n){ return `₪${n}`; }

function renderProducts(){
  const container = document.getElementById("products");
  container.innerHTML = "";

  PRODUCTS.forEach(p => {
    cart[p.id] = 0;

    const card = document.createElement("div");
    card.className = "card";

    const imgHtml = p.image ? `<img src="${p.image}" alt="${p.name}">` : "";
    const minHtml = p.minQty ? `<div style="font-size:12px;color:#7a6653;margin-top:8px;">מינימום ${p.minQty} יח׳</div>` : "";

    card.innerHTML = `
      ${imgHtml}
      <div class="name">${p.name}</div>
      <div class="price">${currency(p.price)}</div>
      <div class="row">
        <div style="color:#7a6653;font-size:13px;">כמות</div>
        <input type="number" min="0" step="1" value="0" data-id="${p.id}">
      </div>
      ${minHtml}
    `;

    const input = card.querySelector("input");
    input.addEventListener("input", () => onQtyChange(p.id, input.value));

    container.appendChild(card);
  });
}

function onQtyChange(id, val){
  const p = PRODUCTS.find(x => x.id === id);
  let qty = Math.floor(Number(val || 0));
  if (!Number.isFinite(qty) || qty < 0) qty = 0;

  if (p.minQty && qty > 0 && qty < p.minQty){
    alert(`המינימום עבור "${p.name}" הוא ${p.minQty} יח׳`);
    qty = 0;
    const el = document.querySelector(`input[data-id="${id}"]`);
    if (el) el.value = 0;
  }

  cart[id] = qty;
  calcTotal();
}

function calcTotal(){
  total = 0;
  for (const p of PRODUCTS){
    total += (cart[p.id] || 0) * p.price;
  }
  document.getElementById("total").textContent = currency(total);
}

// תאריך: לפחות מחר, לא ראשון
function setupDatePicker(){
  const el = document.getElementById("pickupDate");
  const now = new Date();
  const min = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  el.min = isoDate(min);

  let def = new Date(min);
  if (def.getDay() === 0) def = new Date(def.getFullYear(), def.getMonth(), def.getDate() + 1);
  el.value = isoDate(def);
}

function isoDate(d){
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2,'0');
  const day = String(d.getDate()).padStart(2,'0');
  return `${y}-${m}-${day}`;
}

function isSunday(dateStr){
  const d = new Date(dateStr + "T00:00:00");
  return d.getDay() === 0;
}

function isValidPickupDate(dateStr){
  const el = document.getElementById("pickupDate");
  if (!dateStr) return false;
  if (dateStr < el.min) return false;
  if (isSunday(dateStr)) return false;
  return true;
}

function sendOrder(){
  const name = document.getElementById("custName").value.trim();
  const phone = document.getElementById("custPhone").value.trim();
  const date = document.getElementById("pickupDate").value;
  const notes = document.getElementById("notes").value.trim();

  if (!name || phone.length < 7){
    alert("נא למלא שם וטלפון");
    return;
  }
  if (!isValidPickupDate(date)){
    alert("נא לבחור תאריך איסוף תקין (יום מראש, לא ראשון)");
    return;
  }
  if (total <= 0){
    alert("נא לבחור מוצרים להזמנה");
    return;
  }

  const lines = [];
  lines.push("היי! הזמנה חדשה מהאתר 🙂");
  lines.push("");
  lines.push(`שם: ${name}`);
  lines.push(`טלפון: ${phone}`);
  lines.push(`תאריך איסוף: ${date}`);
  lines.push("");
  lines.push("פריטים:");

  for (const p of PRODUCTS){
    const q = cart[p.id] || 0;
    if (q > 0){
      lines.push(`- ${p.name} × ${q} = ₪${p.price * q}`);
    }
  }

  lines.push("");
  lines.push(`סה״כ: ₪${total}`);

  if (notes){
    lines.push("");
    lines.push("הערות:");
    lines.push(notes);
  }

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
  window.open(url, "_blank");
}

document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  setupDatePicker();
  calcTotal();
  const btn = document.getElementById("sendBtn");
  if (btn) btn.addEventListener("click", sendOrder);
});
