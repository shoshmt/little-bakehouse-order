const WHATSAPP_NUMBER = "972509066634";

// ======================
// מוצרים
// ======================
const PRODUCTS = [
  { id: "classic", name: "לחם מחמצת קלאסי", price: 40 },
  { id: "onion", name: "לחם מחמצת בצל", price: 45 },
  { id: "cheese_chili", name: "לחם מחמצת גבינה וצ׳ילי", price: 45 },
  { id: "cheddar", name: "לחם מחמצת צ׳דר", price: 45 },
  { id: "butter_garlic", name: "לחם מחמצת חמאה ושום", price: 45 },
  { id: "cheese_onion", name: "לחם מחמצת גבינה ובצל", price: 45 },

  // חדש ✨
  { id: "sweet", name: "לחם מחמצת מתוקה", price: 45 },

  { id: "muffin_1", name: "מאפינס שוקולד מחמצת (יחידה)", price: 12 },
  { id: "muffin_6", name: "מאפינס שוקולד מחמצת (מארז 6)", price: 63 },
  { id: "muffin_12", name: "מאפינס שוקולד מחמצת (מארז 12)", price: 120 }
];

// טעמי מחמצת מתוקה
const SWEET_OPTIONS = [
  "שוקולד צ׳יפס חום",
  "שוקולד צ׳יפס לבן",
  "שוקולד צ׳יפס חום + לבן",
  "קינמון"
];

// ======================
// DOM
// ======================
const productsEl = document.getElementById("products");
const totalEl = document.getElementById("total");
const sendBtn = document.getElementById("sendBtn");

const custName = document.getElementById("custName");
const custPhone = document.getElementById("custPhone");
const pickupDate = document.getElementById("pickupDate");
const notes = document.getElementById("notes");
const dateHint = document.getElementById("dateHint");
const formHint = document.getElementById("formHint");

const qtyById = new Map();
let sweetChoice = "";

// ======================
// helpers
// ======================
function currency(n) { return `₪${n}`; }
function isoDate(d) { return d.toISOString().slice(0,10); }
function isSunday(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.getDay() === 0;
}

// ======================
// UI
// ======================
function renderProducts() {
  PRODUCTS.forEach(p => {
    qtyById.set(p.id, 0);

    const card = document.createElement("div");
    card.className = "card";

    let extraHtml = "";
    if (p.id === "sweet") {
      extraHtml = `
        <div style="margin-top:10px">
          <label>בחרי טעם:</label>
          <select id="sweetFlavor" style="width:100%; padding:10px; margin-top:6px">
            <option value="">— בחרי —</option>
            ${SWEET_OPTIONS.map(o => `<option value="${o}">${o}</option>`).join("")}
          </select>
        </div>
      `;
    }

    card.innerHTML = `
      <div class="name">${p.name}</div>
      <div class="price">${currency(p.price)}</div>
      <div class="row">
        <label>כמות</label>
        <input id="qty_${p.id}" type="number" min="0" step="1" value="0">
      </div>
      ${extraHtml}
    `;

    const input = card.querySelector(`#qty_${p.id}`);
    const onQtyChange = () => {
      const val = Number(input.value || 0);
      qtyById.set(p.id, Math.max(0, Math.floor(val)));
      updateTotalAndValidation();
    };
    input.addEventListener("input", onQtyChange);
    input.addEventListener("change", onQtyChange);

    if (p.id === "sweet") {
      const select = card.querySelector("#sweetFlavor");
      select.addEventListener("change", () => {
        sweetChoice = select.value;
        updateTotalAndValidation();
      });
    }

    productsEl.appendChild(card);
  });
}

// ======================
// תאריך
// ======================
function setupDatePicker() {
  const now = new Date();
  const min = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  pickupDate.min = isoDate(min);

  let def = new Date(min);
  if (def.getDay() === 0) def.setDate(def.getDate() + 1);
  pickupDate.value = isoDate(def);

  pickupDate.addEventListener("change", updateTotalAndValidation);
}

// ======================
// ולידציה
// ======================
function hasAnyItems() {
  for (const v of qtyById.values()) if (v > 0) return true;
  return false;
}

function calcTotal() {
  let total = 0;
  PRODUCTS.forEach(p => {
    total += (qtyById.get(p.id) || 0) * p.price;
  });
  return total;
}

function validate() {
  const nameOk = custName.value.replace(/\s+/g,"").length >= 2;
  const phoneOk = custPhone.value.trim().length >= 7;

  const dateStr = pickupDate.value;
  const dateOk = dateStr && dateStr >= pickupDate.min && !isSunday(dateStr);

  const itemsOk = hasAnyItems();

  // בדיקת מחמצת מתוקה
  const sweetQty = qtyById.get("sweet") || 0;
  const sweetOk = sweetQty === 0 || sweetChoice;

  if (!itemsOk) formHint.textContent = "בחרי לפחות פריט אחד.";
  else if (sweetQty > 0 && !sweetChoice) formHint.textContent = "בחרי טעם למחמצת המתוקה.";
  else if (!nameOk) formHint.textContent = "נא למלא שם מלא.";
  else if (!phoneOk) formHint.textContent = "נא למלא מספר טלפון.";
  else if (!dateOk) formHint.textContent = "בחרי תאריך איסוף תקין.";
  else formHint.textContent = "";

  return nameOk && phoneOk && dateOk && itemsOk && sweetOk;
}

function updateTotalAndValidation() {
  totalEl.textContent = currency(calcTotal());
  sendBtn.disabled = !validate();
}

// ======================
// WhatsApp
// ======================
function buildOrderText() {
  const lines = [];
  lines.push("היי! הזמנה חדשה 🙂");
  lines.push(`שם: ${custName.value}`);
  lines.push(`טלפון: ${custPhone.value}`);
  lines.push(`תאריך איסוף: ${pickupDate.value}`);
  lines.push("");
  lines.push("פריטים:");

  PRODUCTS.forEach(p => {
    const q = qtyById.get(p.id) || 0;
    if (q > 0) {
      if (p.id === "sweet") {
        lines.push(`- ${p.name} (${sweetChoice}) × ${q}`);
      } else {
        lines.push(`- ${p.name} × ${q}`);
      }
    }
  });

  lines.push("");
  lines.push(`סה״כ: ₪${calcTotal()}`);
  return lines.join("\n");
}

function sendWhatsApp() {
  const encoded = encodeURIComponent(buildOrderText());
  const url = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encoded}`;

  const a = document.createElement("a");
  a.href = url;
  a.target = "_blank";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

// ======================
// init
// ======================
renderProducts();
setupDatePicker();
updateTotalAndValidation();

[custName, custPhone, notes].forEach(el =>
  el.addEventListener("input", updateTotalAndValidation)
);
pickupDate.addEventListener("input", updateTotalAndValidation);
sendBtn.addEventListener("click", sendWhatsApp);
