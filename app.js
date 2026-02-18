const WHATSAPP_NUMBER = "972509066634";

/* ========= לחמים (₪45) ========= */
const BREADS = [
  { id:"classic",       name:"לחם מחמצת קלאסי",        price:45, img:"classic.jpg" },
  { id:"onion",         name:"לחם מחמצת בצל",          price:45, img:"onion.jpg" },
  { id:"cheddar",       name:"לחם מחמצת צ׳דר",         price:45, img:"cheddar.jpg" },
  { id:"butter_garlic", name:"לחם מחמצת שום",          price:45, img:"butter_garlic.jpg" },
  { id:"cheese_chili",  name:"לחם מחמצת גבינה וצ׳ילי", price:45, img:"cheese_chili.jpg" },
  { id:"cheese_onion",  name:"לחם מחמצת גבינה ובצל",   price:45, img:"cheese_onion.jpg" },
  { id:"sweet",         name:"לחם מחמצת מתוק",         price:45, img:"sweet.jpg" },
];

/* ========= מיקס לחמניות ========= */
const ROLLS_MIX = {
  id: "rolls_mix",
  name: "מיקס לחמניות מחמצת (קלאסי, שום, צ׳דר, בצל)",
  price: 45,
  img: "rolls-mix.jpg"
};
let rollsMixQty = 0;
let rollsMixFlour = "";

/* ========= מאפינס ========= */
const MUFFINS_DEFAULT_IMG = "muffins-default.jpg";

const MUFFIN_OPTIONS = [
  { id:"m_reg_choc",    label:"מאפינס שוקולד (עם סוכר)",        price:12, img:"muffin_regular_chocolate.jpg" },
  { id:"m_reg_apple",   label:"מאפינס תפוח קינמון (עם סוכר)",    price:12, img:"muffin_regular_apple_cinnamon.jpg" },
  { id:"m_sf_espresso", label:"מאפינס וניל-אספרסו (בלי סוכר)",    price:15, img:"muffin_sf_espresso_vanilla.jpg" },
  { id:"m_sf_choc",     label:"מאפינס שוקולד (בלי סוכר)",        price:15, img:MUFFINS_DEFAULT_IMG },
  { id:"m_sf_apple",    label:"מאפינס תפוח קינמון (בלי סוכר)",   price:15, img:MUFFINS_DEFAULT_IMG },
];

const cart = {}; // id -> qty
let total = 0;

function currency(n){ return `₪${n}`; }

/* ========= תאריך: מינימום יום מראש ========= */
function isoDate(d){
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2,'0');
  const day = String(d.getDate()).padStart(2,'0');
  return `${y}-${m}-${day}`;
}
function setupDatePicker(){
  const el = document.getElementById("pickupDate");
  const now = new Date();
  const min = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  el.min = isoDate(min);
  el.value = isoDate(min);
}
function isValidPickupDate(dateStr){
  const el = document.getElementById("pickupDate");
  if(!dateStr) return false;
  if(dateStr < el.min) return false;
  return true;
}

/* ========= נקודת איסוף: טקסט מתחלף ========= */
function updatePickupNote(){
  const pickupPointEl = document.getElementById("pickupPoint");
  const pickupNoteEl  = document.getElementById("pickupNote");
  if(!pickupPointEl || !pickupNoteEl) return;

  const v = pickupPointEl.value || "דולב";

  if(v === "דולב"){
    pickupNoteEl.textContent =
      "דולב: יש להזמין לילה לפני. אין איסוף לחמים ביום ראשון (מאפינס ושאר המוצרים אפשר).";
  } else if(v.startsWith("בית שמש")){
    pickupNoteEl.textContent =
      "בית שמש (בית משפחת מוריס): יש לברר בפרטי את יום האיסוף באותו שבוע.";
  } else {
    pickupNoteEl.textContent =
      "גבעות עדן (בית משפחת מוריס – יונתן ואליטל): יש לברר בפרטי את יום האיסוף באותו שבוע.";
  }
}

/* ========= חוק חכם: דולב + ראשון + יש לחם/מיקס לחמניות => חסימה ========= */
function isSundayISO(dateStr){
  if(!dateStr) return false;
  const d = new Date(dateStr + "T00:00:00");
  return d.getDay() === 0;
}
function hasAnyBreadInCart(){
  const breadQty = BREADS.some(b => (cart[b.id] || 0) > 0);
  return breadQty || rollsMixQty > 0;
}
function updatePickupRulesUI(){
  const pickupPointEl = document.getElementById("pickupPoint");
  const msgEl = document.getElementById("pickupRuleMsg");
  const btnEl = document.getElementById("sendBtn");
  const dateStr = document.getElementById("pickupDate")?.value || "";

  if(!pickupPointEl || !msgEl || !btnEl) return;

  const isDolev = (pickupPointEl.value || "דולב") === "דולב";
  const sunday = isSundayISO(dateStr);
  const hasBread = hasAnyBreadInCart();

  if(isDolev && sunday && hasBread){
    msgEl.style.display = "block";
    msgEl.textContent =
      "שימי לב: בדולב אין איסוף לחמים/לחמניות ביום ראשון. אפשר להמשיך עם מאפינס/מוצרים אחרים בלבד, או לבחור תאריך אחר ללחמים.";
    btnEl.disabled = true;
    return;
  }

  msgEl.style.display = "none";
  msgEl.textContent = "";
  btnEl.disabled = false;
}

/* ========= רינדור לחמים ========= */
function renderBreads(){
  const container = document.getElementById("breads");
  container.innerHTML = "";

  BREADS.forEach(b => {
    cart[b.id] = cart[b.id] || 0;

    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${b.img}" alt="${b.name}">
      <div class="name">${b.name}</div>
      <div class="price">${currency(b.price)}</div>
      <div class="row">
        <div style="color:#7a6653;font-size:13px;">כמות</div>
        <input type="number" min="0" step="1" value="${cart[b.id]}" data-id="${b.id}">
      </div>
    `;

    const input = card.querySelector("input");
    input.addEventListener("input", () => {
      let qty = Math.floor(Number(input.value || 0));
      if(!Number.isFinite(qty) || qty < 0) qty = 0;
      cart[b.id] = qty;
      calcTotal();
    });

    container.appendChild(card);
  });
}

/* ========= רינדור מיקס לחמניות ========= */
function renderRollsMix(){
  const container = document.getElementById("rolls");
  container.innerHTML = "";

  const card = document.createElement("div");
  card.className = "card compact-card"; // ✅ כאן השינוי
  card.innerHTML = `
    <img src="${ROLLS_MIX.img}" alt="${ROLLS_MIX.name}">
    <div class="name">${ROLLS_MIX.name}</div>
    <div class="price">${currency(ROLLS_MIX.price)}</div>

    <div style="color:#7a6653;font-size:13px;margin-bottom:10px;">
      בחרי קמח ואז כמות
    </div>

    <select id="rollsMixFlour">
      <option value="">בחירת קמח…</option>
      <option value="קמח לבן">קמח לבן</option>
      <option value="קמח כוסמין">קמח כוסמין</option>
    </select>

    <div style="height:10px;"></div>

    <div class="row">
      <div style="color:#7a6653;font-size:13px;">כמות</div>
      <input id="rollsMixQty" type="number" min="0" step="1" value="${rollsMixQty}">
    </div>
  `;
  container.appendChild(card);

  const flourEl = document.getElementById("rollsMixFlour");
  const qtyEl = document.getElementById("rollsMixQty");
  flourEl.value = rollsMixFlour;

  flourEl.addEventListener("change", () => {
    rollsMixFlour = flourEl.value;
    if(!rollsMixFlour && rollsMixQty > 0){
      alert("בחרי קמח למיקס הלחמניות");
      rollsMixQty = 0;
      qtyEl.value = 0;
    }
    calcTotal();
  });

  qtyEl.addEventListener("input", () => {
    let qty = Math.floor(Number(qtyEl.value || 0));
    if(!Number.isFinite(qty) || qty < 0) qty = 0;

    if(qty > 0 && !rollsMixFlour){
      alert("בחרי קמח למיקס הלחמניות");
      qty = 0;
      qtyEl.value = 0;
    }
    rollsMixQty = qty;
    calcTotal();
  });
}

/* ========= רינדור מאפינס ========= */
function renderMuffins(){
  const container = document.getElementById("muffins");
  container.innerHTML = "";

  MUFFIN_OPTIONS.forEach(o => { cart[o.id] = cart[o.id] || 0; });

  const card = document.createElement("div");
  card.className = "card compact-card"; // ✅ כאן השינוי
  card.innerHTML = `
    <img id="muffinImg" src="${MUFFINS_DEFAULT_IMG}" alt="מאפינס">
    <div class="name">מאפינס</div>
    <div style="color:#7a6653;font-size:13px;margin-bottom:10px;">
      בחרי טעם ואז כמות (מינימום 4)
    </div>

    <select id="muffinFlavor">
      <option value="">בחרי טעם…</option>
    </select>

    <div style="height:10px;"></div>

    <div class="row">
      <div style="color:#7a6653;font-size:13px;">כמות</div>
      <input id="muffinQty" type="number" min="0" step="1" value="0">
    </div>

    <div id="muffinLine" style="margin-top:10px;font-weight:800;color:#8c5a2b;">₪0</div>
  `;
  container.appendChild(card);

  const flavorEl = document.getElementById("muffinFlavor");
  const qtyEl = document.getElementById("muffinQty");
  const imgEl = document.getElementById("muffinImg");
  const lineEl = document.getElementById("muffinLine");

  MUFFIN_OPTIONS.forEach(opt => {
    const o = document.createElement("option");
    o.value = opt.id;
    o.textContent = `${opt.label} — ${currency(opt.price)}`;
    flavorEl.appendChild(o);
  });

  function resetMuffinsCart(){ MUFFIN_OPTIONS.forEach(opt => { cart[opt.id] = 0; }); }

  function updateMuffinUI(){
    const id = flavorEl.value;
    let qty = Math.floor(Number(qtyEl.value || 0));
    if(!Number.isFinite(qty) || qty < 0) qty = 0;

    resetMuffinsCart();

    if(!id){
      imgEl.src = MUFFINS_DEFAULT_IMG;
      qtyEl.value = 0;
      lineEl.textContent = "₪0";
      calcTotal();
      return;
    }

    const opt = MUFFIN_OPTIONS.find(x => x.id === id);
    imgEl.src = opt.img || MUFFINS_DEFAULT_IMG;

    if(qty > 0 && qty < 4){
      alert("המינימום למאפינס הוא 4 יח׳");
      qty = 0;
      qtyEl.value = 0;
    }

    cart[id] = qty;

    lineEl.textContent = qty > 0
      ? `${currency(opt.price)} × ${qty} = ${currency(opt.price * qty)}`
      : `${currency(opt.price)} ליחידה`;

    calcTotal();
  }

  flavorEl.addEventListener("change", updateMuffinUI);
  qtyEl.addEventListener("input", updateMuffinUI);
}

/* ========= סה"כ ========= */
function calcTotal(){
  total = 0;

  BREADS.forEach(b => { total += (cart[b.id] || 0) * b.price; });
  total += (rollsMixQty || 0) * ROLLS_MIX.price;
  MUFFIN_OPTIONS.forEach(o => { total += (cart[o.id] || 0) * o.price; });

  document.getElementById("total").textContent = currency(total);

  updatePickupRulesUI();
}

/* ========= שליחה ========= */
function sendOrder(){
  updatePickupRulesUI();
  if(document.getElementById("sendBtn").disabled){
    alert("בדולב אין איסוף לחמים ביום ראשון. הסירי לחמים/לחמניות או בחרי תאריך אחר.");
    return;
  }

  const name = document.getElementById("custName").value.trim();
  const phone = document.getElementById("custPhone").value.trim();
  const date = document.getElementById("pickupDate").value;
  const notes = document.getElementById("notes").value.trim();
  const pickupPoint = document.getElementById("pickupPoint").value;

  if(!name || phone.length < 7){ alert("נא למלא שם וטלפון"); return; }
  if(!isValidPickupDate(date)){ alert("נא לבחור תאריך תקין (מינימום יום מראש)"); return; }
  if(total <= 0){ alert("נא לבחור מוצרים להזמנה"); return; }
  if(rollsMixQty > 0 && !rollsMixFlour){ alert("נא לבחור קמח למיקס הלחמניות"); return; }

  const lines = [];
  lines.push("היי! הזמנה חדשה מהאתר 🙂");
  lines.push("");
  lines.push(`שם: ${name}`);
  lines.push(`טלפון: ${phone}`);
  lines.push(`תאריך איסוף: ${date}`);
  lines.push(`נקודת איסוף: ${pickupPoint}`);
  lines.push("");
  lines.push("פריטים:");

  BREADS.forEach(b => {
    const q = cart[b.id] || 0;
    if(q > 0) lines.push(`- ${b.name} × ${q} = ₪${b.price * q}`);
  });

  if(rollsMixQty > 0){
    lines.push(`- ${ROLLS_MIX.name} • ${rollsMixFlour} × ${rollsMixQty} = ₪${ROLLS_MIX.price * rollsMixQty}`);
  }

  MUFFIN_OPTIONS.forEach(o => {
    const q = cart[o.id] || 0;
    if(q > 0) lines.push(`- ${o.label} × ${q} = ₪${o.price * q}`);
  });

  lines.push("");
  lines.push(`סה״כ: ₪${total}`);

  if(notes){
    lines.push("");
    lines.push("הערות:");
    lines.push(notes);
  }

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
  window.open(url, "_blank");
}

/* ========= INIT ========= */
document.addEventListener("DOMContentLoaded", () => {
  renderBreads();
  renderRollsMix();
  renderMuffins();

  setupDatePicker();
  updatePickupNote();
  calcTotal();

  document.getElementById("sendBtn").addEventListener("click", sendOrder);

  document.getElementById("pickupPoint").addEventListener("change", () => {
    updatePickupNote();
    updatePickupRulesUI();
  });

  document.getElementById("pickupDate").addEventListener("change", updatePickupRulesUI);
});
