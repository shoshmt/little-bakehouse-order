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

  // מחמצת מתוקה עם בחירת טעם
  { id: "sweet", name: "לחם מחמצת מתוקה", price: 45 },

  // חדש: מאפינס כוסמין ללא סוכר (מינ' 4)
  { id: "muffin_spelt_sf", name: "מאפינס כוסמין ללא סוכר", price: 15, minQty: 4 },

  // חדש: מאפינס רגיל עם סוכר (מינ' 4)
  { id: "muffin_regular", name: "מאפינס רגיל (עם סוכר)", price: 12, minQty: 4 },
];

// טעמי מחמצת מתוקה
const SWEET_OPTIONS = [
  "שוקולד צ׳יפס חום",
  "שוקולד צ׳יפס לבן",
  "שוקולד צ׳יפס חום + לבן",
  "קינמון",
];

// טעמי מאפינס כוסמין ללא סוכר
const MUFFIN_SPELT_SF_OPTIONS = [
  "אספרסו וניל",
  "שוקולד",
];

// טעמי מאפינס רגיל
const MUFFIN_REGULAR_OPTIONS = [
  "תפוח קינמון",
  "שוקולד",
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

// state
const qtyById = new Map();
let sweetChoice = "";
let muffinSpeltChoice = "";
let muffinRegularChoice = "";

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
          <select id="sweetFlavor" style="width:100%; padding:10px; margin-top:6px; border:1px solid #e5d7c7; border-radius:10px;">
            <option value="">— בחרי —</option>
            ${SWEET_OPTIONS.map(o => `<option value="${o}">${o}</option>`).join("")}
          </select>
        </div>
      `;
    }

    if (p.id === "muffin_spelt_sf") {
      extraHtml = `
        <div style="margin-top:10px">
          <label>בחרי טעם:</label>
          <select id="muffinSpeltFlavor" style="width:100%; padding:10px; margin-top:6px; border:1px solid #e5d7c7; border-radius:10px;">
            <option value="">— בחרי —</option>
            ${MUFFIN_SPELT_SF_OPTIONS.map(o => `<option value="${o}">${o}</option>`).join("")}
          </select>
          <div class="muted" style="margin-top:8px;">מינימום להזמנה: 4 יחידות</div>
        </div>
      `;
    }

    if (p.id === "muffin_regular") {
      extraHtml = `
        <div style="margin-top:10px">
          <label>בחרי טעם:</label>
          <select id="muffinRegularFlavor" style="width:100%; padding:10px; margin-top:6px; border:1px solid #e5d7c7; border-radius:10px;">
            <option value="">— בחרי —</option>
            ${MUFFIN_REGULAR_OPTIONS.map(o => `<option value="${o}">${o}</option>`).join("")}
          </select>
          <div class="muted" style="margin-top:8px;">מינימום להזמנה: 4 יחידות</div>
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

    if (p.id === "muffin_spelt_sf") {
      const select = card.querySelector("#muffinSpeltFlavor");
      select.addEventListener("change", () => {
        muffinSpeltChoice = select.value;
        updateTotalAndValidation();
      });
    }

    if (p.id === "muffin_regular") {
      const select = card.querySelector("#muffinRegularFlavor");
      select.addEventListener("change", () => {
        muffinRegularChoice = select.value;
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
// חישוב / ולידציה
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

function validateMinQty(productId) {
  const p = PRODUCTS.find(x => x.id === productId);
  const qty = qtyById.get(productId) || 0;
  if (!p || !p.minQty) return true;
  // אם לא הזמינו בכלל – בסדר. אם הזמינו – חייב להיות >= מינימום
  return qty === 0 || qty >= p.minQty;
}

function validate() {
  const nameOk = custName.value.replace(/\s+/g,"").length >= 2;
  const phoneOk = custPhone.value.trim().length >= 7;

  const dateStr = pickupDate.value;
  const dateOk = dateStr && dateStr >= pickupDate.min && !isSunday(dateStr);

  const itemsOk = hasAnyItems();

  // מחמצת מתוקה: אם כמות > 0 חייבים טעם
  const sweetQty = qtyById.get("sweet") || 0;
  const sweetOk = sweetQty === 0 || !!sweetChoice;

  // מאפינס כוסמין ללא סוכר: אם כמות > 0 חייבים טעם + מינימום 4
  const speltQty = qtyById.get("muffin_spelt_sf") || 0;
  const speltFlavorOk = speltQty === 0 || !!muffinSpeltChoice;
  const speltMinOk = validateMinQty("muffin_spelt_sf");

  // מאפינס רגיל: אם כמות > 0 חייבים טעם + מינימום 4
  const regQty = qtyById.get("muffin_regular") || 0;
  const regFlavorOk = regQty === 0 || !!muffinRegularChoice;
  const regMinOk = validateMinQty("muffin_regular");

  // הודעות שגיאה – לפי סדר הכי הגיוני ללקוחה
  if (!itemsOk) formHint.textContent = "בחרי לפחות פריט אחד.";
  else if (sweetQty > 0 && !sweetChoice) formHint.textContent = "בחרי טעם למחמצת המתוקה.";
  else if (speltQty > 0 && !muffinSpeltChoice) formHint.textContent = "בחרי טעם למאפינס כוסמין ללא סוכר.";
  else if (speltQty > 0 && !speltMinOk) formHint.textContent = "מאפינס כוסמין ללא סוכר: מינימום להזמנה הוא 4 יחידות.";
  else if (regQty > 0 && !muffinRegularChoice) formHint.textContent = "בחרי טעם למאפינס הרגיל.";
  else if (regQty > 0 && !regMinOk) formHint.textContent = "מאפינס רגיל: מינימום להזמנה הוא 4 יחידות.";
  else if (!nameOk) formHint.textContent = "נא למלא שם מלא.";
  else if (!phoneOk) formHint.textContent = "נא למלא מספר טלפון.";
  else if (!dateOk) formHint.textContent = "בחרי תאריך איסוף תקין.";
  else formHint.textContent = "";

  return (
    nameOk && phoneOk && dateOk && itemsOk &&
    sweetOk &&
    speltFlavorOk && speltMinOk &&
    regFlavorOk && regMinOk
  );
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
      } else if (p.id === "muffin_spelt_sf") {
        lines.push(`- ${p.name} (${muffinSpeltChoice}) × ${q}`);
      } else if (p.id === "muffin_regular") {
        lines.push(`- ${p.name} (${muffinRegularChoice}) × ${q}`);
      } else {
        lines.push(`- ${p.name} × ${q}`);
      }
    }
  });

  const extraNotes = notes.value.trim();
  if (extraNotes) {
    lines.push("");
    lines.push("הערות:");
    lines.push(extraNotes);
  }

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
