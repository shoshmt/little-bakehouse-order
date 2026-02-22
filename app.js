const WHATSAPP_NUMBER = "972509066634";

/* =======================
   1) מוצרים רגילים (לחמים + מיקס לחמניות + וופל)
   ======================= */
const PRODUCTS = [
  { id:"classic",       name:"לחם מחמצת קלאסי",          price:45, img:"classic.jpg",       kind:"bread" },
  { id:"onion",         name:"לחם מחמצת בצל",            price:45, img:"onion.jpg",         kind:"bread" },

  // חלבי:
  { id:"cheddar",       name:"לחם מחמצת צ'דר",           price:45, img:"cheddar.jpg",       kind:"bread", dairy:true },
  { id:"cheese_chili",  name:"לחם מחמצת גבינה וצ'ילי",   price:45, img:"cheese_chili.jpg",  kind:"bread", dairy:true },
  { id:"cheese_onion",  name:"לחם מחמצת גבינה ובצל",     price:45, img:"cheese_onion.jpg",  kind:"bread", dairy:true },

  { id:"mix_rolls",     name:"מיקס לחמניות מחמצת",       price:45, img:"rolls-mix.jpg",     kind:"bread", type:"mix" },

  // וופל (חלבי) — מארז 4
  { id:"waffle_pack",   name:"וופל בלגי מחמצת (חלבי) – מארז 4 יח׳", price:60, img:"waffle-belgian.jpg", kind:"bread", dairy:true },
];

/* =======================
   2) מאפינס — מינימום 4 מאותו הטעם
   ======================= */
const MUFFIN_MIN_PER_FLAVOR = 4;

const MUFFIN_IMG_WITH_SUGAR = "muffins-with-sugar.jpg";
const MUFFIN_IMG_NO_SUGAR   = "muffins-no-sugar.jpg";

const MUFFIN_GROUPS = [
  {
    id: "muffins_sugar",
    title: "מאפינס עם סוכר",
    subtitle: "₪12 ליחידה",
    defaultImg: MUFFIN_IMG_WITH_SUGAR,
    options: [
      { id:"muffin_choc",        label:"מאפינס שוקולד",            price:12, available:true },
      { id:"muffin_apple",       label:"מאפינס תפוח קינמון",       price:12, available:true },
      { id:"muffin_vanilla",     label:"מאפינס וניל־אספרסו",       price:12, available:true },
      { id:"muffin_strawberry",  label:"מאפינס תות (בעונה)",       price:12, available:true },
      { id:"muffin_blueberry",   label:"מאפינס אוכמניות (בעונה)",  price:12, available:true },
    ]
  },
  {
    id: "muffins_nosugar",
    title: "מאפינס בלי סוכר",
    subtitle: "₪15 ליחידה",
    defaultImg: MUFFIN_IMG_NO_SUGAR,
    options: [
      { id:"muffin_choc_sf",        label:"מאפינס שוקולד ללא סוכר",              price:15, available:true },
      { id:"muffin_apple_sf",       label:"מאפינס תפוח קינמון ללא סוכר",         price:15, available:true },
      { id:"muffin_vanilla_sf",     label:"מאפינס וניל־אספרסו ללא סוכר",         price:15, available:true },
      { id:"muffin_strawberry_sf",  label:"מאפינס תות ללא סוכר (בעונה)",         price:15, available:true },
      { id:"muffin_blueberry_sf",   label:"מאפינס אוכמניות ללא סוכר (בעונה)",    price:15, available:true },
    ]
  }
];

/* =======================
   3) סדנאות מחמצת
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
   עזרי DOM
   ======================= */
const grid = document.getElementById("products");

function getVal(id){ return (document.getElementById(id)?.value || ""); }
function setText(id, txt){ const el=document.getElementById(id); if(el) el.innerText = txt; }

function normalizeNumberInput(el){
  let v = parseInt(el.value, 10);
  if(!Number.isFinite(v) || v < 0) v = 0;
  el.value = v;
  return v;
}

function isSunday(dateStr){
  if(!dateStr) return false;
  const d = new Date(dateStr + "T00:00:00");
  return d.getDay() === 0;
}

/* =======================
   חלון הזמנה: יומיים מראש
   חריג: ליום שני עד יום ראשון 12:00
   ======================= */
function getOrderDeadline(dateStr){
  const pickup = new Date(dateStr + "T00:00:00");

  // Monday exception
  if(pickup.getDay() === 1){
    const deadline = new Date(pickup);
    deadline.setDate(deadline.getDate() - 1); // Sunday
    deadline.setHours(12, 0, 0, 0); // 12:00
    return deadline;
  }

  // Default: 2 days before, end of day
  const deadline = new Date(pickup);
  deadline.setDate(deadline.getDate() - 2);
  deadline.setHours(23, 59, 0, 0);
  return deadline;
}

function formatDeadline(deadline){
  const date = deadline.toLocaleDateString("he-IL");
  const time = deadline.toLocaleTimeString("he-IL", { hour:"2-digit", minute:"2-digit" });
  return `${date} בשעה ${time}`;
}

function isOrderWindowOpen(dateStr){
  if(!dateStr) return true;

  const now = new Date();
  const pickup = new Date(dateStr + "T00:00:00");
  const deadline = getOrderDeadline(dateStr);

  // No ordering for past/same day
  if(now >= pickup) return false;

  return now <= deadline;
}

/* =======================
   חוק מאפינס: מינימום 4 לכל טעם
   ======================= */
function getMuffinViolations(){
  const bad = [];

  MUFFIN_GROUPS.forEach(group=>{
    group.options
      .filter(opt => opt.available !== false)
      .forEach(opt=>{
        const qty = parseInt(document.getElementById("qty_"+opt.id)?.value, 10) || 0;
        if(qty > 0 && qty < MUFFIN_MIN_PER_FLAVOR){
          bad.push({ label: opt.label, qty });
        }
      });
  });

  return bad;
}

function updateMuffinInlineWarnings(){
  MUFFIN_GROUPS.forEach(group=>{
    group.options
      .filter(opt => opt.available !== false)
      .forEach(opt=>{
        const qty = parseInt(document.getElementById("qty_"+opt.id)?.value, 10) || 0;
        const warnEl = document.getElementById("warn_"+opt.id);
        if(!warnEl) return;

        if(qty > 0 && qty < MUFFIN_MIN_PER_FLAVOR){
          warnEl.style.display = "block";
          warnEl.textContent = `מינימום ${MUFFIN_MIN_PER_FLAVOR} יח׳ מאותו הטעם (כרגע ${qty}).`;
        } else {
          warnEl.style.display = "none";
          warnEl.textContent = "";
        }
      });
  });
}

/* =======================
   בניית כרטיסים: מוצרים + מאפינס
   ======================= */
function buildCards(){
  if(!grid) return;
  grid.innerHTML = "";

  // מוצרים רגילים
  PRODUCTS.forEach(p=>{
    const card = document.createElement("div");
    card.className = "card";

    const extra = (p.type === "mix")
      ? `
        <select id="flour_${p.id}">
          <option value="">בחירת קמח…</option>
          <option value="קמח לבן">קמח לבן</option>
          <option value="קמח כוסמין">קמח כוסמין</option>
        </select>
      `
      : "";

    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <div class="name">${p.name}</div>
      <div class="price">₪${p.price}</div>
      <div style="color:#7a6653;font-size:13px;">חלבי</div>
      ${p.dairy ? '<div style="color:#7a6653;font-size:13px;">חלבי</div>' : ''}
      ${extra}
      <div class="row" style="margin-top:10px;">
        <div style="color:#7a6653;font-size:13px;">כמות</div>
        <input type="number" min="0" value="0" id="qty_${p.id}">
      </div>
    `;

    const qtyInput = card.querySelector(`#qty_${p.id}`);
    qtyInput.addEventListener("input", () => {
      normalizeNumberInput(qtyInput);
      calcTotal();
      updateRulesUI();
    });

    if(p.type === "mix"){
      const flourSel = card.querySelector(`#flour_${p.id}`);
      flourSel.addEventListener("change", () => {
        calcTotal();
        updateRulesUI();
      });
    }

    grid.appendChild(card);
  });

  // כרטיסי מאפינס קבוצתיים
  MUFFIN_GROUPS.forEach(group=>{
    const card = document.createElement("div");
    card.className = "card";

    const visibleOptions = group.options.filter(opt => opt.available !== false);

    const optionsHtml = visibleOptions.map(opt => `
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
      <div style="margin-top:8px; color:#7a6653; font-size:13px; line-height:1.6;">
        מינימום הזמנה: ${MUFFIN_MIN_PER_FLAVOR} יח׳ מאותו הטעם.
      </div>

      <details style="margin-top:10px;" ${visibleOptions.length ? "" : "open"}>
        <summary style="cursor:pointer;color:#6a3d1f;font-weight:600;">בחירת טעמים</summary>
        <div style="margin-top:8px;">
          ${
            visibleOptions.length
              ? optionsHtml
              : `<div style="color:#7a6653;font-size:14px;line-height:1.6;">
                   כרגע אין טעמים זמינים בקבוצה הזו 🙏🏼
                 </div>`
          }
        </div>
      </details>
    `;

    visibleOptions.forEach(opt=>{
      const el = card.querySelector(`#qty_${opt.id}`);
      el.addEventListener("input", () => {
        normalizeNumberInput(el);
        calcTotal();
        updateMuffinInlineWarnings();
        updateRulesUI();
      });
    });

    grid.appendChild(card);
  });
}

/* =======================
   רינדור סדנאות
   ======================= */
function renderWorkshops(){
  const wsGrid = document.getElementById("workshops");
  if(!wsGrid) return;

  wsGrid.innerHTML = "";

  WORKSHOPS.forEach(w=>{
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
      <button class="ws-btn" type="button" data-ws="${w.id}">בקשת הרשמה לסדנה</button>
    `;

    const btn = card.querySelector(".ws-btn");
    btn.addEventListener("click", () => requestWorkshop(w.id));

    wsGrid.appendChild(card);
  });
}

function requestWorkshop(workshopId){
  const w = WORKSHOPS.find(x => x.id === workshopId);
  if(!w) return;

  const name  = getVal("custName").trim();
  const phone = getVal("custPhone").trim();
  const notes = getVal("notes").trim();

  if(!name){ alert("כדי לשלוח בקשת סדנה, נא למלא שם מלא"); return; }
  if(phone.length < 7){ alert("כדי לשלוח בקשת סדנה, נא למלא מספר טלפון תקין"); return; }

  let message = `בקשת הרשמה לסדנאות מחמצת:\n\n`;
  message += `${w.title} — ₪${w.price}\n\n`;
  message += `שם: ${name}\n`;
  message += `טלפון: ${phone}\n`;
  if(notes) message += `הערות: ${notes}\n`;
  message += `\nלתשומת לב: הזמנה לפחות שבוע מראש. הבקשה ממתינה לאישור בווטסאפ חוזר.`;

  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");
}

/* =======================
   חישוב סה"כ
   ======================= */
function calcTotal(){
  let total = 0;

  PRODUCTS.forEach(p=>{
    const qty = parseInt(document.getElementById("qty_"+p.id)?.value, 10) || 0;
    total += qty * p.price;
  });

  MUFFIN_GROUPS.forEach(group=>{
    group.options
      .filter(opt => opt.available !== false)
      .forEach(opt=>{
        const qty = parseInt(document.getElementById("qty_"+opt.id)?.value, 10) || 0;
        total += qty * opt.price;
      });
  });

  setText("total", total);
}

function anyItemsInCart(){
  const anyRegular = PRODUCTS.some(p => (parseInt(document.getElementById("qty_"+p.id)?.value, 10) || 0) > 0);

  const anyMuffins = MUFFIN_GROUPS.some(g =>
    g.options
      .filter(opt => opt.available !== false)
      .some(opt => (parseInt(document.getElementById("qty_"+opt.id)?.value, 10) || 0) > 0)
  );

  return anyRegular || anyMuffins;
}

function hasAnyBreadInCart(){
  return PRODUCTS.some(p => {
    const q = parseInt(document.getElementById("qty_"+p.id)?.value, 10) || 0;
    return p.kind === "bread" && q > 0;
  });
}

/* =======================
   חוקים חכמים:
   1) דולב + ראשון + יש לחם => חסימה
   2) מינימום מאפינס לכל טעם
   3) חלון הזמנה לפי תאריך (יומיים מראש, חריג שני)
   ======================= */
function updateRulesUI(){
  const msgEl = document.getElementById("ruleMsg");
  const btnEl = document.getElementById("sendBtn");
  if(!msgEl || !btnEl) return;

  const pickupLocation = getVal("pickupLocation");
  const dateStr = getVal("pickupDate");

  let blocked = false;
  let msg = "";

  // 1) דולב + ראשון + יש לחם
  if(pickupLocation === "דולב" && isSunday(dateStr) && hasAnyBreadInCart()){
    blocked = true;
    msg = "בדולב אין איסוף לחמים/לחמניות ביום ראשון. אפשר לבחור תאריך אחר או להזמין מאפינס בלבד.";
  }

  // 2) מינימום מאפינס לכל טעם
  if(!blocked){
    const violations = getMuffinViolations();
    if(violations.length){
      blocked = true;
      msg = `מינימום הזמנה למאפינס הוא ${MUFFIN_MIN_PER_FLAVOR} יח׳ מאותו הטעם. חסר לך בטעם: "${violations[0].label}".`;
    }
  }

  // 3) חלון הזמנה
  if(!blocked && dateStr){
    if(!isOrderWindowOpen(dateStr)){
      const deadline = getOrderDeadline(dateStr);
      blocked = true;
      msg = `הזמנות לתאריך הזה נסגרו. ניתן להזמין עד ${formatDeadline(deadline)}.`;
    }
  }

  if(blocked){
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
   שליחת הזמנה (מאפים)
   ======================= */
function sendOrder(){
  const name  = getVal("custName").trim();
  const phone = getVal("custPhone").trim();
  const dateStr = getVal("pickupDate");
  const pickupLocation = getVal("pickupLocation");
  const notes = getVal("notes").trim();

  if(!name){ alert("נא למלא שם מלא"); return; }
  if(phone.length < 7){ alert("נא למלא מספר טלפון תקין"); return; }
  if(!dateStr){ alert("נא לבחור תאריך איסוף"); return; }
  if(!pickupLocation){ alert("נא לבחור נקודת איסוף"); return; }

  updateMuffinInlineWarnings();
  updateRulesUI();
  if(document.getElementById("sendBtn")?.disabled) return;

  // מיקס לחמניות — חובה לבחור קמח אם יש כמות
  const mixQty = parseInt(document.getElementById("qty_mix_rolls")?.value, 10) || 0;
  if(mixQty > 0){
    const flour = getVal("flour_mix_rolls");
    if(!flour){
      alert("בחרי קמח למיקס לחמניות (לבן / כוסמין)");
      return;
    }
  }

  if(!anyItemsInCart()){
    alert("נא לבחור לפחות מוצר אחד להזמנה");
    return;
  }

  // גיבוי נוסף לחוק מאפינס
  const violations = getMuffinViolations();
  if(violations.length){
    alert(`מינימום הזמנה למאפינס הוא ${MUFFIN_MIN_PER_FLAVOR} יח׳ מאותו הטעם. חסר לך בטעם: "${violations[0].label}".`);
    return;
  }

  let message = "הזמנה חדשה:\n\n";

  PRODUCTS.forEach(p=>{
    const qty = parseInt(document.getElementById("qty_"+p.id)?.value, 10) || 0;
    if(qty > 0){
      if(p.type === "mix"){
        const flour = getVal("flour_mix_rolls");
        message += `${p.name} x${qty} (${flour})\n`;
      } else {
        message += `${p.name} x${qty}\n`;
      }
    }
  });

  MUFFIN_GROUPS.forEach(group=>{
    const chosen = group.options
      .filter(opt => opt.available !== false)
      .map(opt => {
        const qty = parseInt(document.getElementById("qty_"+opt.id)?.value, 10) || 0;
        return qty > 0 ? `${opt.label} x${qty}` : null;
      })
      .filter(Boolean);

    if(chosen.length){
      message += `\n${group.title}:\n- ${chosen.join("\n- ")}\n`;
    }
  });

  message += `\nשם: ${name}\n`;
  message += `טלפון: ${phone}\n`;
  message += `נקודת איסוף: ${pickupLocation}\n`;
  message += `תאריך איסוף: ${dateStr}\n`;
  if(notes) message += `הערות: ${notes}\n`;

  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");
}

/* =======================
   INIT
   ======================= */
buildCards();
renderWorkshops();
calcTotal();
updateMuffinInlineWarnings();
updateRulesUI();

const sendBtn = document.getElementById("sendBtn");
if(sendBtn) sendBtn.addEventListener("click", sendOrder);

const loc = document.getElementById("pickupLocation");
if(loc) loc.addEventListener("change", updateRulesUI);

const dateEl = document.getElementById("pickupDate");
if(dateEl) dateEl.addEventListener("change", updateRulesUI);
