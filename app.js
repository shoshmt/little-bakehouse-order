const WHATSAPP_NUMBER = "972509066634";

/* =======================
   הגדרות
   ======================= */
const MUFFIN_MIN_PER_FLAVOR = 4;

const MUFFIN_IMG_WITH_SUGAR = "muffins-with-sugar.jpg";
const MUFFIN_IMG_NO_SUGAR   = "muffins-no-sugar.jpg";

/* =======================
   מוצרים
   ======================= */
const PRODUCTS = [
  { id:"classic",       name:"לחם מחמצת קלאסי",               price:45, img:"classic.jpg",            kind:"bread" },
  { id:"onion",         name:"לחם מחמצת בצל",                 price:45, img:"onion.jpg",              kind:"bread" },

  // חלביים
  { id:"cheddar",       name:"לחם מחמצת צ'דר",                price:45, img:"cheddar.jpg",            kind:"bread", dairy:true },
  { id:"cheese_chili",  name:"לחם מחמצת גבינה וצ'ילי",        price:45, img:"cheese_chili.jpg",       kind:"bread", dairy:true },
  { id:"cheese_onion",  name:"לחם מחמצת גבינה ובצל",          price:45, img:"cheese_onion.jpg",       kind:"bread", dairy:true },

  // לחמים חדשים
  { id:"olive_calamata",   name:"לחם מחמצת עם זיתי קלמטה",          price:45, img:"olive-calamata.jpg",    kind:"bread" },
  { id:"craisin_cinnamon", name:"לחם מחמצת עם צימוקים וקינמון",     price:45, img:"craisin-cinnamon.jpg",  kind:"bread" },
  { id:"cranberry_walnut", name:"לחם מחמצת עם חמוציות ואגוזי מלך",  price:45, img:"cranberry-walnut.jpg",  kind:"bread" },

  // מיקס לחמניות
  { id:"mix_rolls",     name:"מיקס לחמניות מחמצת",            price:45, img:"rolls-mix.jpg",          kind:"bread" },

  // בסיסי פיצה — בלי בחירת קמח
  {
    id:"pizza_bases",
    name:"בסיסי בצק מחמצת לפיצה – מארז 4 יח׳",
    price:60,
    img:"pizza-bases.jpg",
    kind:"pizza",
    desc:"בסיס לפיצה מוכן לעבודה: משטחים, מוסיפים רוטב ותוספות לפי מה שאוהבים, ואופים בתנור הביתי על החום הכי גבוה או בטאבון פיצה."
  },

  // וופל בלגי — עם בחירת קמח
  {
    id:"waffle_pack",
    name:"וופל בלגי מחמצת – מארז 4 יח׳",
    price:60,
    img:"waffle-belgian.jpg",
    kind:"bread",
    dairy:true
  }
];

const MUFFIN_GROUPS = [
  {
    id: "muffins_sugar",
    title: "מאפינס עם סוכר",
    subtitle: "₪12 ליחידה",
    defaultImg: MUFFIN_IMG_WITH_SUGAR,
    options: [
      { id:"muffin_choc",        label:"מאפינס שוקולד",           price:12, available:true },
      { id:"muffin_apple",       label:"מאפינס תפוח קינמון",      price:12, available:true },
      { id:"muffin_vanilla",     label:"מאפינס וניל־אספרסו",      price:12, available:true },
      { id:"muffin_strawberry",  label:"מאפינס תות (בעונה)",      price:12, available:true },
      { id:"muffin_blueberry",   label:"מאפינס אוכמניות (בעונה)", price:12, available:true }
    ]
  },
  {
    id: "muffins_nosugar",
    title: "מאפינס בלי סוכר",
    subtitle: "₪15 ליחידה",
    defaultImg: MUFFIN_IMG_NO_SUGAR,
    options: [
      { id:"muffin_choc_sf",        label:"מאפינס שוקולד ללא סוכר",           price:15, available:true },
      { id:"muffin_apple_sf",       label:"מאפינס תפוח קינמון ללא סוכר",      price:15, available:true },
      { id:"muffin_vanilla_sf",     label:"מאפינס וניל־אספרסו ללא סוכר",      price:15, available:true },
      { id:"muffin_strawberry_sf",  label:"מאפינס תות ללא סוכר (בעונה)",      price:15, available:true },
      { id:"muffin_blueberry_sf",   label:"מאפינס אוכמניות ללא סוכר (בעונה)", price:15, available:true }
    ]
  }
];

/* =======================
   סדנאות
   ======================= */
const WORKSHOPS = [
  {
    id:"ws_couple",
    title:"סדנה זוגית חווייתית",
    price:800,
    img:"workshop-couple.jpg",
    desc:"ערב זוגי מלא אווירה: פיצות מחמצת בטאבון, הכנת כיכר לחם מחמצת, והבנה ברורה של תהליך המחמצת – מההאכלה ועד האפייה."
  },
  {
    id:"ws_group",
    title:"סדנה קבוצתית (מינ׳ 5 משתתפים)",
    price:300,
    img:"workshop-group.jpg",
    desc:"חוויה קבוצתית טעימה ומלמדת: פיצות מחמצת בטאבון, כיכר לחם מחמצת, ולמידה מסודרת על תהליך המחמצת – עם המון טיפים."
  },
  {
    id:"ws_private",
    title:"סדנה אישית",
    price:450,
    img:"workshop-private.jpg",
    desc:"מפגש 1:1 ממוקד ומעמיק: בניית מחמצת, הבנת תהליכים, התאמת קמחים וכלים, ודיוק לפי מה שתרצי/ה לאפות בבית."
  }
];

/* =======================
   DOM helpers
   ======================= */
const productsGrid = document.getElementById("products");

function $(id){
  return document.getElementById(id);
}

function val(id){
  return ($(id)?.value || "");
}

function normalizeNumber(el){
  let v = parseInt(el.value, 10);
  if (!Number.isFinite(v) || v < 0) v = 0;
  el.value = v;
  return v;
}

function isSunday(dateStr){
  if (!dateStr) return false;
  const d = new Date(dateStr + "T00:00:00");
  return d.getDay() === 0;
}

/* =======================
   חלון הזמנה: יומיים מראש
   חריג: ליום שני עד יום ראשון 12:00
   ======================= */
function getOrderDeadline(dateStr){
  const pickup = new Date(dateStr + "T00:00:00");

  if (pickup.getDay() === 1) {
    const dl = new Date(pickup);
    dl.setDate(dl.getDate() - 1);
    dl.setHours(12, 0, 0, 0);
    return dl;
  }

  const dl = new Date(pickup);
  dl.setDate(dl.getDate() - 2);
  dl.setHours(23, 59, 0, 0);
  return dl;
}

function formatDeadline(dl){
  const date = dl.toLocaleDateString("he-IL");
  const time = dl.toLocaleTimeString("he-IL", { hour:"2-digit", minute:"2-digit" });
  return `${date} בשעה ${time}`;
}

function isOrderWindowOpen(dateStr){
  if (!dateStr) return true;
  const now = new Date();
  const pickup = new Date(dateStr + "T00:00:00");
  if (now >= pickup) return false;
  return now <= getOrderDeadline(dateStr);
}

/* =======================
   מאפינס: מינימום 4 לכל טעם
   ======================= */
function muffinViolations(){
  const bad = [];

  MUFFIN_GROUPS.forEach(group => {
    group.options
      .filter(opt => opt.available !== false)
      .forEach(opt => {
        const q = parseInt($(`qty_${opt.id}`)?.value, 10) || 0;
        if (q > 0 && q < MUFFIN_MIN_PER_FLAVOR) {
          bad.push({ label: opt.label, qty: q });
        }
      });
  });

  return bad;
}

function updateMuffinWarnings(){
  MUFFIN_GROUPS.forEach(group => {
    group.options
      .filter(opt => opt.available !== false)
      .forEach(opt => {
        const q = parseInt($(`qty_${opt.id}`)?.value, 10) || 0;
        const warn = $(`warn_${opt.id}`);
        if (!warn) return;

        if (q > 0 && q < MUFFIN_MIN_PER_FLAVOR) {
          warn.style.display = "block";
          warn.textContent = `מינימום ${MUFFIN_MIN_PER_FLAVOR} יח׳ מאותו הטעם (כרגע ${q}).`;
        } else {
          warn.style.display = "none";
          warn.textContent = "";
        }
      });
  });
}

/* =======================
   קמח לכל לחם: חובה לבחור אם יש כמות
   (רק kind === "bread")
   ======================= */
function breadFlourViolations(){
  const bad = [];

  PRODUCTS
    .filter(p => p.kind === "bread")
    .forEach(p => {
      const qty = parseInt($(`qty_${p.id}`)?.value, 10) || 0;
      if (qty > 0) {
        const flour = val(`flour_${p.id}`);
        if (!flour) bad.push(p.name);
      }
    });

  return bad;
}

/* =======================
   בדיקות סל
   ======================= */
function anyItemsInCart(){
  const anyRegular = PRODUCTS.some(p => (parseInt($(`qty_${p.id}`)?.value, 10) || 0) > 0);
  const anyMuffins = MUFFIN_GROUPS.some(g =>
    g.options
      .filter(o => o.available !== false)
      .some(o => (parseInt($(`qty_${o.id}`)?.value, 10) || 0) > 0)
  );

  return anyRegular || anyMuffins;
}

function hasAnyBread(){
  return PRODUCTS.some(p => {
    const q = parseInt($(`qty_${p.id}`)?.value, 10) || 0;
    return p.kind === "bread" && q > 0;
  });
}

/* =======================
   בניית כרטיסים
   ======================= */
function buildProductsAndMuffins(){
  if (!productsGrid) return;
  productsGrid.innerHTML = "";

  PRODUCTS.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";

    const flourSelect = (p.kind === "bread") ? `
      <select id="flour_${p.id}">
        <option value="">בחירת קמח…</option>
        <option value="קמח לבן">קמח לבן</option>
        <option value="קמח כוסמין">קמח כוסמין</option>
      </select>
    ` : "";

    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <div class="name">${p.name}</div>
      <div class="price">₪${p.price}</div>
      ${p.desc ? `<div style="color:#6b5442; line-height:1.6; font-size:14px; margin-top:6px;">${p.desc}</div>` : ""}
      ${p.dairy ? `<div style="color:#7a6653;font-size:13px; margin-top:8px;">חלבי</div>` : ""}
      ${flourSelect}
      <div class="row" style="margin-top:10px;">
        <div style="color:#7a6653;font-size:13px;">כמות</div>
        <input type="number" min="0" value="0" id="qty_${p.id}">
      </div>
    `;

    const qtyEl = card.querySelector(`#qty_${p.id}`);
    qtyEl.addEventListener("input", () => {
      normalizeNumber(qtyEl);
      calcTotal();
      updateRulesUI();
    });

    if (p.kind === "bread") {
      const flourEl = card.querySelector(`#flour_${p.id}`);
      flourEl.addEventListener("change", () => {
        calcTotal();
        updateRulesUI();
      });
    }

    productsGrid.appendChild(card);
  });

  MUFFIN_GROUPS.forEach(group => {
    const card = document.createElement("div");
    card.className = "card";

    const opts = group.options.filter(opt => opt.available !== false);

    const optionsHtml = opts.map(opt => `
      <div class="row" style="margin-top:10px;">
        <div style="flex:1; color:#3e2f23; font-size:15px;">${opt.label}</div>
        <input type="number" min="0" value="0" id="qty_${opt.id}" style="width:120px;text-align:center;">
      </div>
      <div id="warn_${opt.id}" style="display:none; margin-top:6px; color:#6b2d1a; background:#fff1e6; border:1px solid #f0c9b0; padding:8px 10px; border-radius:10px; font-size:13px; line-height:1.5;"></div>
    `).join("");

    card.innerHTML = `
      <img src="${group.defaultImg}" alt="${group.title}">
      <div class="name">${group.title}</div>
      <div class="price">${group.subtitle}</div>
      <div style="color:#7a6653;font-size:13px;">חלבי</div>
      <div style="margin-top:8px; color:#7a6653; font-size:13px; line-height:1.6;">
        מינימום הזמנה: ${MUFFIN_MIN_PER_FLAVOR} יח׳ מאותו הטעם.
      </div>

      <details style="margin-top:10px;">
        <summary style="cursor:pointer;color:#6a3d1f;font-weight:600;">בחירת טעמים</summary>
        <div style="margin-top:8px;">${optionsHtml}</div>
      </details>
    `;

    opts.forEach(opt => {
      const el = card.querySelector(`#qty_${opt.id}`);
      el.addEventListener("input", () => {
        normalizeNumber(el);
        calcTotal();
        updateMuffinWarnings();
        updateRulesUI();
      });
    });

    productsGrid.appendChild(card);
  });
}

/* =======================
   סדנאות
   ======================= */
function renderWorkshops(){
  const wsGrid = $("workshops");
  if (!wsGrid) return;

  wsGrid.innerHTML = "";

  WORKSHOPS.forEach(w => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${w.img}" alt="${w.title}">
      <div class="name">${w.title}</div>
      <div class="price">₪${w.price}</div>
      <div style="color:#6b5442; line-height:1.7; font-size:15px; margin-top:6px;">${w.desc}</div>
      <div style="margin-top:10px; color:#7a6653; font-size:13px; line-height:1.6;">
        יש להזמין שבוע מראש ולהמתין לקבלת אישור בווטסאפ חוזר.
      </div>
      <button class="ws-btn" type="button">בקשת הרשמה לסדנה</button>
    `;
    card.querySelector(".ws-btn").addEventListener("click", () => requestWorkshop(w.id));
    wsGrid.appendChild(card);
  });
}

function requestWorkshop(workshopId){
  const w = WORKSHOPS.find(x => x.id === workshopId);
  if (!w) return;

  const name  = val("custName").trim();
  const phone = val("custPhone").trim();
  const notes = val("notes").trim();

  if (!name) {
    alert("כדי לשלוח בקשת סדנה, נא למלא שם מלא");
    return;
  }
  if (phone.length < 7) {
    alert("כדי לשלוח בקשת סדנה, נא למלא מספר טלפון תקין");
    return;
  }

  let msg = `בקשת הרשמה לסדנאות מחמצת:\n\n`;
  msg += `${w.title} — ₪${w.price}\n\n`;
  msg += `שם: ${name}\nטלפון: ${phone}\n`;
  if (notes) msg += `הערות: ${notes}\n`;
  msg += `\nלתשומת לב: הזמנה לפחות שבוע מראש. הבקשה ממתינה לאישור בווטסאפ חוזר.`;

  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
}

/* =======================
   חישוב סה"כ
   ======================= */
function calcTotal(){
  let total = 0;

  PRODUCTS.forEach(p => {
    const q = parseInt($(`qty_${p.id}`)?.value, 10) || 0;
    total += q * p.price;
  });

  MUFFIN_GROUPS.forEach(group => {
    group.options
      .filter(opt => opt.available !== false)
      .forEach(opt => {
        const q = parseInt($(`qty_${opt.id}`)?.value, 10) || 0;
        total += q * opt.price;
      });
  });

  if ($("total")) $("total").innerText = total;
}

/* =======================
   חוקים חכמים
   ======================= */
function updateRulesUI(){
  const msgEl = $("ruleMsg");
  const btnEl = $("sendBtn");
  if (!msgEl || !btnEl) return;

  const pickupLocation = val("pickupLocation");
  const dateStr = val("pickupDate");

  let blocked = false;
  let msg = "";

  if (pickupLocation === "דולב" && isSunday(dateStr) && hasAnyBread()) {
    blocked = true;
    msg = "בדולב אין איסוף לחמים/לחמניות ביום ראשון. אפשר לבחור תאריך אחר או להזמין מאפינס בלבד.";
  }

  if (!blocked) {
    const v = muffinViolations();
    if (v.length) {
      blocked = true;
      msg = `מינימום הזמנה למאפינס הוא ${MUFFIN_MIN_PER_FLAVOR} יח׳ מאותו הטעם. חסר לך בטעם: "${v[0].label}".`;
    }
  }

  if (!blocked && dateStr) {
    if (!isOrderWindowOpen(dateStr)) {
      blocked = true;
      msg = `הזמנות לתאריך הזה נסגרו. ניתן להזמין עד ${formatDeadline(getOrderDeadline(dateStr))}.`;
    }
  }

  if (!blocked) {
    const badBreads = breadFlourViolations();
    if (badBreads.length) {
      blocked = true;
      msg = `נא לבחור קמח (לבן/כוסמין) עבור: ${badBreads.join(" • ")}.`;
    }
  }

  if (blocked) {
    msgEl.style.display = "block";
    msgEl.textContent = msg;
    btnEl.disabled = true;
  } else {
    msgEl.style.display = "none";
    msgEl.textContent = "";
    btnEl.disabled = false;
  }
}

/* =======================
   שליחה לוואטסאפ
   ======================= */
function sendOrder(){
  const name  = val("custName").trim();
  const phone = val("custPhone").trim();
  const dateStr = val("pickupDate");
  const pickupLocation = val("pickupLocation");
  const notes = val("notes").trim();

  if (!name) {
    alert("נא למלא שם מלא");
    return;
  }
  if (phone.length < 7) {
    alert("נא למלא מספר טלפון תקין");
    return;
  }
  if (!dateStr) {
    alert("נא לבחור תאריך איסוף");
    return;
  }
  if (!pickupLocation) {
    alert("נא לבחור נקודת איסוף");
    return;
  }

  updateMuffinWarnings();
  updateRulesUI();
  if ($("sendBtn")?.disabled) return;

  if (!anyItemsInCart()) {
    alert("נא לבחור לפחות מוצר אחד להזמנה");
    return;
  }

  const v = muffinViolations();
  if (v.length) {
    alert(`מינימום הזמנה למאפינס הוא ${MUFFIN_MIN_PER_FLAVOR} יח׳ מאותו הטעם. חסר לך בטעם: "${v[0].label}".`);
    return;
  }

  const badBreads = breadFlourViolations();
  if (badBreads.length) {
    alert(`נא לבחור קמח (לבן/כוסמין) עבור: ${badBreads.join(" • ")}`);
    return;
  }

  let msg = "הזמנה חדשה:\n\n";

  PRODUCTS.forEach(p => {
    const q = parseInt($(`qty_${p.id}`)?.value, 10) || 0;
    if (q > 0) {
      if (p.kind === "bread") {
        const flour = val(`flour_${p.id}`);
        msg += `${p.name} x${q} (${flour})\n`;
      } else {
        msg += `${p.name} x${q}\n`;
      }
    }
  });

  MUFFIN_GROUPS.forEach(group => {
    const chosen = group.options
      .filter(opt => opt.available !== false)
      .map(opt => {
        const q = parseInt($(`qty_${opt.id}`)?.value, 10) || 0;
        return q > 0 ? `${opt.label} x${q}` : null;
      })
      .filter(Boolean);

    if (chosen.length) {
      msg += `\n${group.title}:\n- ${chosen.join("\n- ")}\n`;
    }
  });

  msg += `\nשם: ${name}\nטלפון: ${phone}\nנקודת איסוף: ${pickupLocation}\nתאריך איסוף: ${dateStr}\n`;
  if (notes) msg += `הערות: ${notes}\n`;

  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
}

/* =======================
   INIT
   ======================= */
buildProductsAndMuffins();
renderWorkshops();
calcTotal();
updateMuffinWarnings();
updateRulesUI();

$("sendBtn")?.addEventListener("click", sendOrder);
$("pickupLocation")?.addEventListener("change", updateRulesUI);
$("pickupDate")?.addEventListener("change", updateRulesUI);
