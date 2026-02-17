const WHATSAPP_NUMBER = "972509066634";

// =========================
// מוצרים: לחמים (כמו שיש)
// =========================
const PRODUCTS = [
  { id: "classic", name: "לחם מחמצת קלאסי", price: 40, image: "classic.jpg" },
  { id: "onion", name: "לחם מחמצת בצל", price: 45, image: "onion.jpg" },
  { id: "cheese_chili", name: "לחם מחמצת גבינה וצ׳ילי", price: 45, image: "cheese_chili.jpg" },
  { id: "cheddar", name: "לחם מחמצת צ׳דר", price: 45, image: "cheddar.jpg" },
  { id: "butter_garlic", name: "לחם מחמצת חמאה ושום", price: 45, image: "butter_garlic.jpg" },
  { id: "cheese_onion", name: "לחם מחמצת גבינה ובצל", price: 45, image: "cheese_onion.jpg" },
  { id: "sweet", name: "לחם מחמצת מתוק", price: 45, image: "sweet.jpg" }
];

// =========================
// מאפינס: בחירת טעם
// =========================
const MUFFINS_DEFAULT_IMG = "muffins-default.jpg";

// אפשר לשנות/להוסיף טעמים כאן בקלות
const MUFFIN_OPTIONS = [
  { id: "m_reg_choc", group: "regular", label: "שוקולד (עם סוכר)", price: 12, image: "muffin_regular_chocolate.jpg" },
  { id: "m_reg_apple", group: "regular", label: "תפוח-קינמון (עם סוכר)", price: 12, image: "muffin_regular_apple_cinnamon.jpg" },
  { id: "m_sf_espresso", group: "sf", label: "וניל-אספרסו (כוסמין ללא סוכר)", price: 15, image: "muffin_sf_espresso_vanilla.jpg" }
];

const cart = {};
let total = 0;

function currency(n){ return `₪${n}`; }

// ---------- תאריך ----------
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
function setupDatePicker(){
  const el = document.getElementById("pickupDate");
  const now = new Date();
  const min = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  el.min = isoDate(min);

  let def = new Date(min);
  if (def.getDay() === 0) def = new Date(def.getFullYear(), def.getMonth(), def.getDate() + 1);
  el.value = isoDate(def);
}
function isValidPickupDate(dateStr){
  const el = document.getElementById("pickupDate");
  if (!dateStr) return false;
  if (dateStr < el.min) return false;
  if (isSunday(dateStr)) return false;
  return true;
}

// ---------- רינדור ----------
function renderProducts(){
  const container = document.getElementById("products");
  container.innerHTML = "";

  // 1) לחמים
  PRODUCTS.forEach(p => {
    cart[p.id] = 0;

    const card = document.createElement("div");
    card.className = "card";

    const imgHtml = p.image ? `<img src="${p.image}" alt="${p.name}">` : "";

    card.innerHTML = `
      ${imgHtml}
      <div class="name">${p.name}</div>
      <div class="price">${currency(p.price)}</div>
      <div class="row">
        <div style="color:#7a6653;font-size:13px;">כמות</div>
        <input type="number" min="0" step="1" value="0" data-id="${p.id}">
      </div>
    `;

    const input = card.querySelector("input");
    input.addEventListener("input", () => onQtyChange(p.id, input.value));

    container.appendChild(card);
  });

  // 2) מאפינס (כרטיס אחד מסודר עם בחירת טעם)
  const muffinCard = document.createElement("div");
  muffinCard.className = "card";

  muffinCard.innerHTML = `
    <img id="muffinImg" src="${MUFFINS_DEFAULT_IMG}" alt="מאפינס">
    <div class="name">מאפינס</div>
    <div style="color:#7a6653;font-size:13px;margin-bottom:10px;">בחרי טעם ואז כמות (מינימום 4)</div>

    <div style="display:flex; gap:10px; align-items:center; justify-content:space-between; flex-wrap:wrap;">
      <select id="muffinFlavor" style="flex:1; min-width:180px; padding:12px; border-radius:12px; border:1px solid #dbc7b5; font-family:inherit; background:#fff;">
        <option value="">בחרי טעם…</option>
      </select>

      <input id="muffinQty" type="number" min="0" step="1" value="0"
             style="width:120px; padding:10px; border-radius:12px; border:1px solid #dbc7b5; text-align:center;">
    </div>

    <div id="muffinPriceLine" style="margin-top:10px; font-weight:700; color:#8c5a2b;">₪0</div>
  `;

  container.appendChild(muffinCard);

  // למלא את ה-dropdown
  const select = document.getElementById("muffinFlavor");
  MUFFIN_OPTIONS.forEach(opt => {
    const o = document.createElement("option");
    o.value = opt.id;
    o.textContent = `${opt.label} — ${currency(opt.price)}`;
    select.appendChild(o);
  });

  // אירועים
  select.addEventListener("change", onMuffinChange);
  document.getElementById("muffinQty").addEventListener("input", onMuffinChange);

  // init cart למאפינס לפי טעם
  MUFFIN_OPTIONS.forEach(opt => { cart[opt.id] = 0; });
}

function onQtyChange(id, val){
  let qty = Math.floor(Number(val || 0));
  if (!Number.isFinite(qty) || qty < 0) qty = 0;
  cart[id] = qty;
  calcTotal();
}

// מאפינס: שינוי טעם/כמות
function onMuffinChange(){
  const flavorId = document.getElementById("muffinFlavor").value;
  const qtyEl = document.getElementById("muffinQty");
  let qty = Math.floor(Number(qtyEl.value || 0));
  if (!Number.isFinite(qty) || qty < 0) qty = 0;

  // לאפס את כל טעמי המאפינס בעגלה
  MUFFIN_OPTIONS.forEach(opt => { cart[opt.id] = 0; });

  const img = document.getElementById("muffinImg");
  const priceLine = document.getElementById("muffinPriceLine");

  // אם לא נבחר טעם – מחזירים ברירת מחדל
  if (!flavorId){
    img.src = MUFFINS_DEFAULT_IMG;
    priceLine.textContent = "₪0";
    qtyEl.value = 0;
    calcTotal();
    return;
  }

  const opt = MUFFIN_OPTIONS.find(x => x.id === flavorId);

  // תמונה לפי טעם (אם תרצי), ואם לא — נשאר ברירת מחדל
  img.src = opt.image || MUFFINS_DEFAULT_IMG;

  // מינימום 4
  if (qty > 0 && qty < 4){
    alert("המינימום למאפינס הוא 4 יח׳");
    qty = 0;
    qtyEl.value = 0;
  }

  cart[opt.id] = qty;

  priceLine.textContent = qty > 0 ? `${currency(opt.price)} × ${qty} = ${currency(opt.price * qty)}` : `${currency(opt.price)} ליחידה`;

  calcTotal();
}

function calcTotal(){
  total = 0;

  // לחמים
  PRODUCTS.forEach(p => {
    total += (cart[p.id] || 0) * p.price;
  });

  // מאפינס לפי טעם
  MUFFIN_OPTIONS.forEach(opt => {
    total += (cart[opt.id] || 0) * opt.price;
  });

  document.getElementById("total").textContent = currency(total);
}

// ---------- שליחה ----------
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

  // לחמים
  PRODUCTS.forEach(p => {
    const q = cart[p.id] || 0;
    if (q > 0){
      lines.push(`- ${p.name} × ${q} = ₪${p.price * q}`);
    }
  });

  // מאפינס
  MUFFIN_OPTIONS.forEach(opt => {
    const q = cart[opt.id] || 0;
    if (q > 0){
      lines.push(`- מאפינס: ${opt.label} × ${q} = ₪${opt.price * q}`);
    }
  });

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
