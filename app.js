const WHATSAPP_NUMBER = "972509066634";

// ======================
// מוצרים
// ======================
const PRODUCTS = [
  { id: "classic", name: "לחם מחמצת קלאסי", price: 40, type: "bread" },
  { id: "onion", name: "לחם מחמצת בצל", price: 45, type: "bread" },
  { id: "cheese_chili", name: "לחם מחמצת גבינה וצ׳ילי", price: 45, type: "bread" },
  { id: "cheddar", name: "לחם מחמצת צ׳דר", price: 45, type: "bread" },
  { id: "butter_garlic", name: "לחם מחמצת חמאה ושום", price: 45, type: "bread" },
  { id: "cheese_onion", name: "לחם מחמצת גבינה ובצל", price: 45, type: "bread" },

  // מחמצת מתוקה עם בחירת טעם
  { id: "sweet", name: "לחם מחמצת מתוקה", price: 45, type: "bread_sweet" },

  // מאפינס כוסמין ללא סוכר (מינ' 4)
  { id: "muffin_spelt_sf", name: "מאפינס כוסמין ללא סוכר", price: 15, minQty: 4, type: "muffin_sf" },

  // מאפינס רגיל עם סוכר (מינ' 4)
  { id: "muffin_regular", name: "מאפינס רגיל (עם סוכר)", price: 12, minQty: 4, type: "muffin_regular" },
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

// בחירת קמח
const FLOUR_OPTIONS = [
  { value: "", label: "— בחרי —" },
  { value: "קמח לבן", label: "קמח לבן" },
  { value: "קמח כוסמין", label: "קמח כוסמין" },
];

// ======================
// תמונות (שמות קבצים)
// ======================
const IMAGE_BY_PRODUCT_ID = {
  classic: "classic.jpg",
  onion: "onion.jpg",
  cheddar: "cheddar.jpg",
  cheese_chili: "cheese_chili.jpg",
  butter_garlic: "butter_garlic.jpg",
  cheese_onion: "cheese_onion.jpg",
  sweet: "sweet.jpg",
};

// תמונות למאפינס לפי טעם
// שימי לב: אלה השמות *בדיוק* כמו אצלך בגיטהאב
const IMAGE_BY_MUFFIN_CHOICE = {
  muffin_spelt_sf: {
    "אספרסו וניל": "muffin_sf_espresso_vanilla.jpg",
    // שוקולד ללא סוכר ישתמש באותה תמונה של השוקולד הרגיל
    "שוקולד": "muffin_regular_chocolate.jpg",
  },
  muffin_regular: {
    "שוקולד": "muffin_regular_chocolate.jpg",
    "תפוח קינמון": "muffin_regular_apple_cinnamon.jpg",
  },
};

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

// state
const qtyById = new Map();
const flourById = new Map();
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

// נתיב תמונה יציב (עם ./) + cache-bust קבוע
function imgSrc(fileName) {
  if (!fileName) return "";
  return `./${fileName}?v=2`;
}

// ======================
// UI
// ======================
function renderProducts() {
  productsEl.innerHTML = "";

  PRODUCTS.forEach(p => {
    qtyById.set(p.id, 0);
    if (p.type === "bread" || p.type === "bread_sweet") flourById.set(p.id, "");

    const card = document.createElement("div");
    card.className = "card";

    const productImg = IMAGE_BY_PRODUCT_ID[p.id] ? `
      <img
        class="prod-img"
        src="${imgSrc(IMAGE_BY_PRODUCT_ID[p.id])}"
        alt="${p.name}"
        onerror="this.style.display='none';"
      />
    ` : "";

    let flourHtml = "";
    if (p.type === "bread" || p.type === "bread_sweet") {
      flourHtml = `
        <div style="margin-top:6px">
          <label>בחרי קמח:</label>
          <select id="flour_${p.id}" style="width:100%; padding:10px; margin-top:6px; border:1px solid #e5d7c7; border-radius:10px;">
            ${FLOUR_OPTIONS.map(o => `<option value="${o.value}">${o.label}</option>`).join("")}
          </select>
        </div>
      `;
    }

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
          <div id="muffinSpeltImgWrap" style="margin-top:10px;"></div>
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
          <div id="muffinRegularImgWrap" style="margin-top:10px;"></div>
          <div class="muted" style="margin-top:8px;">מינימום להזמנה: 4 יחידות</div>
        </div>
      `;
    }

    card.innerHTML = `
      ${productImg}
      <div class="name">${p.name}</div>
      <div class="price">${currency(p.price)}</div>

      ${flourHtml}

      <div class="row" style="margin-top:10px;">
        <label>כמות</label>
        <input id="qty_${p.id}" type="number" min="0" step="1" value="0">
      </div>

      ${extraHtml}
    `;

    // כמות
    const qtyInput = card.querySelector(`#qty_${p.id}`);
    const onQtyChange = () => {
      const val = Number(qtyInput.value || 0);
      qtyById.set(p.id, Math.max(0, Math.floor(val)));
      updateTotalAndValidation();
    };
    qtyInput.addEventListener("input", onQtyChange);
    qtyInput.addEventListener("change", onQtyChange);

    // קמח
    if (p.type === "bread" || p.type === "bread_sweet") {
      const flourSelect = card.querySelector(`#flour_${p.id}`);
      flourSelect.addEventListener("change", () => {
        flourById.set(p.id, flourSelect.value);
        updateTotalAndValidation();
      });
    }

    // טעם מתוקה
    if (p.id === "sweet") {
      const select = card.querySelector("#sweetFlavor");
      select.addEventListener("change", () => {
        sweetChoice = select.value;
        updateTotalAndValidation();
      });
    }

    // מאפינס ללא סוכר
    if (p.id === "muffin_spelt_sf") {
      const select = card.querySelector("#muffinSpeltFlavor");
      const imgWrap = card.querySelector("#muffinSpeltImgWrap");

      const renderMuffinImg = () => {
        const file = IMAGE_BY_MUFFIN_CHOICE.muffin_spelt_sf[muffinSpeltChoice] || "";
        if (!file) { imgWrap.innerHTML = ""; return; }
        imgWrap.innerHTML = `
          <img
            class="prod-img"
            src="${imgSrc(file)}"
            alt="מאפינס כוסמין ללא סוכר - ${muffinSpeltChoice}"
            onerror="this.style.display='none';"
          />
        `;
      };

      select.addEventListener("change", () => {
        muffinSpeltChoice = select.value;
        renderMuffinImg();
        updateTotalAndValidation();
      });

      renderMuffinImg();
    }

    // מאפינס רגיל
    if (p.id === "muffin_regular") {
      const select = card.querySelector("#muffinRegularFlavor");
      const imgWrap = card.querySelector("#muffinRegularImgWrap");

      const renderMuffinImg = () => {
        const file = IMAGE_BY_MUFFIN_CHOICE.muffin_regular[muffinRegularChoice] || "";
        if (!file) { imgWrap.innerHTML = ""; return; }
        imgWrap.innerHTML = `
          <img
            class="prod-img"
            src="${imgSrc(file)}"
            alt="מאפינס רגיל - ${muffinRegularChoice}"
            onerror="this.style.display='none';"
          />
        `;
      };

      select.addEventListener("change", () => {
        muffinRegularChoice = select.value;
        renderMuffinImg();
        updateTotalAndValidation();
      });

      renderMuffinImg();
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
  return qty === 0 || qty >= p.minQty;
}

function validateFlourSelection() {
  for (const p of PRODUCTS) {
    if (p.type === "bread" || p.type === "bread_sweet") {
      const q = qtyById.get(p.id) || 0;
      if (q > 0) {
        const flour = flourById.get(p.id) || "";
        if (!flour) return { ok: false, productName: p.name };
      }
    }
  }
  return { ok: true };
}

function validate() {
  const nameOk = custName.value.replace(/\s+/g,"").length >= 2;
  const phoneOk = custPhone.value.trim().length >= 7;

  const dateStr = pickupDate.value;
  const dateOk = dateStr && dateStr >= pickupDate.min && !isSunday(dateStr);

  const itemsOk = hasAnyItems();

  const flourCheck = validateFlourSelection();

  const sweetQty = qtyById.get("sweet") || 0;
  const sweetOk = sweetQty === 0 || !!sweetChoice;

  const speltQty = qtyById.get("muffin_spelt_sf") || 0;
  const speltFlavorOk = speltQty === 0 || !!muffinSpeltChoice;
  const speltMinOk = validateMinQty("muffin_spelt_sf");

  const regQty = qtyById.get("muffin_regular") || 0;
  const regFlavorOk = regQty === 0 || !!muffinRegularChoice;
  const regMinOk = validateMinQty("muffin_regular");

  if (!itemsOk) formHint.textContent = "בחרי לפחות פריט אחד.";
  else if (!flourCheck.ok) formHint.textContent = `בחרי קמח עבור: ${flourCheck.productName}`;
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
    flourCheck.ok &&
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
    if (q <= 0) return;

    const flourPart = (p.type === "bread" || p.type === "bread_sweet")
      ? ` (${flourById.get(p.id) || ""})`
      : "";

    if (p.id === "sweet") {
      lines.push(`- ${p.name}${flourPart} | טעם: ${sweetChoice} × ${q}`);
    } else if (p.id === "muffin_spelt_sf") {
      lines.push(`- ${p.name} | טעם: ${muffinSpeltChoice} × ${q}`);
    } else if (p.id === "muffin_regular") {
      lines.push(`- ${p.name} | טעם: ${muffinRegularChoice} × ${q}`);
    } else {
      lines.push(`- ${p.name}${flourPart} × ${q}`);
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
