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
  { id: "sweet", name: "לחם מחמצת מתוקה", price: 45 },
  { id: "muffin_spelt_sf", name: "מאפינס כוסמין ללא סוכר", price: 15, minQty: 4 },
  { id: "muffin_regular", name: "מאפינס רגיל (עם סוכר)", price: 12, minQty: 4 },
];

const FLOUR_OPTIONS = ["קמח לבן", "קמח כוסמין"];

const SWEET_OPTIONS = [
  "שוקולד צ׳יפס חום",
  "שוקולד צ׳יפס לבן",
  "שוקולד צ׳יפס חום + לבן",
  "קינמון",
];

const MUFFIN_SPELT_SF_OPTIONS = [
  "אספרסו וניל",
  "שוקולד",
];

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
const formHint = document.getElementById("formHint");

const qtyById = new Map();
const flourChoice = {};
let sweetChoice = "";
let muffinSpeltChoice = "";
let muffinRegularChoice = "";

// ======================
// יצירת כרטיסים
// ======================
function renderProducts() {
  PRODUCTS.forEach(p => {
    qtyById.set(p.id, 0);

    const card = document.createElement("div");
    card.className = "card";

    let imageHtml = "";
    if (p.id === "classic") {
      imageHtml = `
        <img src="classic.jpg?v=2"
             style="width:100%; border-radius:12px; margin-bottom:10px;">
      `;
    }

    let flourHtml = "";
    if (!p.id.includes("muffin")) {
      flourHtml = `
        <div style="margin-top:10px">
          <label>בחרי סוג קמח:</label>
          <select id="flour_${p.id}" style="width:100%; padding:10px; margin-top:6px; border-radius:10px;">
            <option value="">— בחרי —</option>
            ${FLOUR_OPTIONS.map(f => `<option value="${f}">${f}</option>`).join("")}
          </select>
        </div>
      `;
    }

    let extraHtml = "";

    if (p.id === "sweet") {
      extraHtml = `
        <div style="margin-top:10px">
          <label>בחרי טעם:</label>
          <select id="sweetFlavor" style="width:100%; padding:10px; margin-top:6px; border-radius:10px;">
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
          <select id="muffinSpeltFlavor" style="width:100%; padding:10px; margin-top:6px; border-radius:10px;">
            <option value="">— בחרי —</option>
            ${MUFFIN_SPELT_SF_OPTIONS.map(o => `<option value="${o}">${o}</option>`).join("")}
          </select>
          <div style="margin-top:8px; font-size:13px;">מינימום להזמנה: 4 יחידות</div>
        </div>
      `;
    }

    if (p.id === "muffin_regular") {
      extraHtml = `
        <div style="margin-top:10px">
          <label>בחרי טעם:</label>
          <select id="muffinRegularFlavor" style="width:100%; padding:10px; margin-top:6px; border-radius:10px;">
            <option value="">— בחרי —</option>
            ${MUFFIN_REGULAR_OPTIONS.map(o => `<option value="${o}">${o}</option>`).join("")}
          </select>
          <div style="margin-top:8px; font-size:13px;">מינימום להזמנה: 4 יחידות</div>
        </div>
      `;
    }

    card.innerHTML = `
      ${imageHtml}
      <div style="font-weight:600;">${p.name}</div>
      <div>₪${p.price}</div>
      <div style="margin-top:8px;">
        <label>כמות</label>
        <input id="qty_${p.id}" type="number" min="0" value="0" style="width:100%; padding:8px; margin-top:5px;">
      </div>
      ${flourHtml}
      ${extraHtml}
    `;

    productsEl.appendChild(card);

    // listeners
    const qtyInput = document.getElementById(`qty_${p.id}`);
    qtyInput.addEventListener("input", () => {
      qtyById.set(p.id, Number(qtyInput.value || 0));
      update();
    });

    if (!p.id.includes("muffin")) {
      const flourSelect = document.getElementById(`flour_${p.id}`);
      flourSelect.addEventListener("change", () => {
        flourChoice[p.id] = flourSelect.value;
        update();
      });
    }

    if (p.id === "sweet") {
      document.getElementById("sweetFlavor")
        .addEventListener("change", e => {
          sweetChoice = e.target.value;
          update();
        });
    }

    if (p.id === "muffin_spelt_sf") {
      document.getElementById("muffinSpeltFlavor")
        .addEventListener("change", e => {
          muffinSpeltChoice = e.target.value;
          update();
        });
    }

    if (p.id === "muffin_regular") {
      document.getElementById("muffinRegularFlavor")
        .addEventListener("change", e => {
          muffinRegularChoice = e.target.value;
          update();
        });
    }
  });
}

// ======================
// חישוב
// ======================
function calcTotal() {
  let total = 0;
  PRODUCTS.forEach(p => {
    total += (qtyById.get(p.id) || 0) * p.price;
  });
  return total;
}

function update() {
  totalEl.textContent = `₪${calcTotal()}`;
  sendBtn.disabled = calcTotal() === 0;
}

// ======================
// WhatsApp
// ======================
function sendWhatsApp() {
  let text = "היי! הזמנה חדשה 🙂\n\n";
  text += `שם: ${custName.value}\n`;
  text += `טלפון: ${custPhone.value}\n`;
  text += `תאריך איסוף: ${pickupDate.value}\n\n`;
  text += "פריטים:\n";

  PRODUCTS.forEach(p => {
    const q = qtyById.get(p.id) || 0;
    if (q > 0) {
      let line = `- ${p.name}`;

      if (flourChoice[p.id])
        line += ` (${flourChoice[p.id]})`;

      if (p.id === "sweet")
        line += ` - ${sweetChoice}`;

      if (p.id === "muffin_spelt_sf")
        line += ` - ${muffinSpeltChoice}`;

      if (p.id === "muffin_regular")
        line += ` - ${muffinRegularChoice}`;

      line += ` × ${q}\n`;
      text += line;
    }
  });

  text += `\nסה״כ: ₪${calcTotal()}`;

  const url = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(text)}`;
  window.open(url, "_blank");
}

// ======================
renderProducts();
update();
sendBtn.addEventListener("click", sendWhatsApp);
