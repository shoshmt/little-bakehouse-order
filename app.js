// === הגדרות ===
const WHATSAPP_NUMBER = "972509066634"; // 0509066634 -> 972 + בלי 0 בתחילת המספר

const PRODUCTS = [
  // מהתמונה:
  { id: "classic", name: "לחם מחמצת קלאסי", price: 40 },
  { id: "onion", name: "לחם מחמצת בצל", price: 45 },
  { id: "cheese_chili", name: "לחם מחמצת גבינה וצ׳ילי", price: 45 },
  { id: "cheddar", name: "לחם מחמצת צ׳דר", price: 45 },
  { id: "butter_garlic", name: "לחם מחמצת חמאה ושום", price: 45 },
  { id: "cheese_onion", name: "לחם מחמצת גבינה ובצל", price: 45 },

  // גרסאות נוספות שציינת:
  { id: "choc_chips", name: "לחם מחמצת שוקולד צ׳יפס", price: 45 },
  { id: "white_choc", name: "לחם מחמצת שוקולד צ׳יפס לבן", price: 45 },
  { id: "cinnamon", name: "לחם מחמצת קינמון", price: 45 },
  { id: "garlic_herbs", name: "לחם מחמצת שום ועשבי תיבול", price: 45 },

  // מאפינס (אריזות)
  { id: "muffin_1", name: "מאפינס שוקולד מחמצת (יחידה)", price: 12 },
  { id: "muffin_6", name: "מאפינס שוקולד מחמצת (מארז 6)", price: 63 },
  { id: "muffin_12", name: "מאפינס שוקולד מחמצת (מארז 12)", price: 120 }
];

// === בניית UI ===
const productsEl = document.getElementById("products");
const addonsEl = document.getElementById("addons");
const totalEl = document.getElementById("total");
const sendBtn = document.getElementById("sendBtn");

const custName = document.getElementById("custName");
const custPhone = document.getElementById("custPhone");
const pickupDate = document.getElementById("pickupDate");
const notes = document.getElementById("notes");
const dateHint = document.getElementById("dateHint");

const qtyById = new Map();
const addonChecked = new Map();

function currency(n) {
  return `₪${n}`;
}

function renderProducts() {
  PRODUCTS.forEach(p => {
    qtyById.set(p.id, 0);

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <div class="name">${p.name}</div>
      <div class="price">${currency(p.price)}</div>
      <div class="row">
        <label for="qty_${p.id}">כמות</label>
        <input id="qty_${p.id}" type="number" min="0" step="1" value="0" />
      </div>
      <div class="muted">*מחיר/מוצר ניתן לעדכון</div>
    `;

    const input = card.querySelector(`#qty_${p.id}`);
    input.addEventListener("input", () => {
      const val = Number(input.value || 0);
      qtyById.set(p.id, Number.isFinite(val) && val >= 0 ? Math.floor(val) : 0);
      updateTotalAndValidation();
    });

    productsEl.appendChild(card);
  });
}

function renderAddons() {
  ADDONS.forEach(a => {
    addonChecked.set(a.id, false);

    const chip = document.createElement("label");
    chip.className = "chip";
    chip.innerHTML = `
      <input type="checkbox" id="${a.id}" style="margin-left:8px; transform:scale(1.1);" />
      ${a.label}
    `;
    const cb = chip.querySelector("input");
    cb.addEventListener("change", () => {
      addonChecked.set(a.id, cb.checked);
      updateTotalAndValidation();
    });

    addonsEl.appendChild(chip);
  });
}

// === תאריך: לפחות מחר, ולא יום ראשון ===
function isoDate(d) {
  return d.toISOString().slice(0,10);
}

function isSunday(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.getDay() === 0; // 0=Sunday
}

function setupDatePicker() {
  const now = new Date();
  const min = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  pickupDate.min = isoDate(min);

  // ברירת מחדל: מחר (אם זה ראשון – אז מחרתיים)
  let def = new Date(min);
  if (def.getDay() === 0) def = new Date(def.getFullYear(), def.getMonth(), def.getDate() + 1);
  pickupDate.value = isoDate(def);

  dateHint.textContent = "שימי לב: לא ניתן לבחור יום ראשון, והמערכת מחייבת הזמנה לפחות יום מראש.";
  pickupDate.addEventListener("change", updateTotalAndValidation);
}

function calcTotal() {
  let total = 0;
  PRODUCTS.forEach(p => {
    const q = qtyById.get(p.id) || 0;
    total += q * p.price;
  });
  return total;
}

function hasAnyItems() {
  for (const v of qtyById.values()) if (v > 0) return true;
  return false;
}

function selectedAddonsText() {
  const arr = [];
  ADDONS.forEach(a => {
    if (addonChecked.get(a.id)) arr.push(a.label);
  });
  return arr;
}

function validate() {
  const nameOk = custName.value.trim().length >= 2;
  const phoneOk = custPhone.value.trim().length >= 7;
  const dateStr = pickupDate.value;
  const dateOk = !!dateStr && dateStr >= pickupDate.min && !isSunday(dateStr);
  const itemsOk = hasAnyItems();

  let msg = "";
  if (!!dateStr && isSunday(dateStr)) msg = "לא ניתן לבחור יום ראשון. בחרי תאריך אחר.";
  if (!!dateStr && dateStr < pickupDate.min) msg = "צריך לבחור תאריך של לפחות מחר (הזמנה יום מראש).";

  dateHint.textContent = msg || "שימי לב: לא ניתן לבחור יום ראשון, והמערכת מחייבת הזמנה לפחות יום מראש.";

  return nameOk && phoneOk && dateOk && itemsOk;
}

function updateTotalAndValidation() {
  totalEl.textContent = currency(calcTotal());
  sendBtn.disabled = !validate();
}

function buildOrderText() {
  const lines = [];
  lines.push("היי! הזמנה חדשה מהאתר 🙂");
  lines.push("");
  lines.push(`שם: ${custName.value.trim()}`);
  lines.push(`טלפון: ${custPhone.value.trim()}`);
  lines.push(`תאריך איסוף: ${pickupDate.value}`);
  lines.push("");

  lines.push("פריטים:");
  PRODUCTS.forEach(p => {
    const q = qtyById.get(p.id) || 0;
    if (q > 0) lines.push(`- ${p.name} × ${q} = ₪${p.price * q}`);
  });

  const addons = selectedAddonsText();
  if (addons.length) {
    lines.push("");
    lines.push("תוספות שנבחרו:");
    addons.forEach(a => lines.push(`- ${a}`));
  }

  const n = notes.value.trim();
  if (n) {
    lines.push("");
    lines.push("הערות:");
    lines.push(n);
  }

  lines.push("");
  lines.push(`סה״כ: ₪${calcTotal()}`);

  return lines.join("\n");
}

function sendWhatsApp() {
  const text = buildOrderText();
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
window.location.href = url;
}

// === init ===
renderProducts();
renderAddons();
setupDatePicker();
updateTotalAndValidation();

[custName, custPhone, notes].forEach(el => el.addEventListener("input", updateTotalAndValidation));
sendBtn.addEventListener("click", sendWhatsApp);
