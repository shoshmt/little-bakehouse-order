const WHATSAPP_NUMBER = "972509066634";

/* =======================
   1) מוצרים רגילים (לחמים + מיקס לחמניות)
   ======================= */
const PRODUCTS = [
  { id:"classic", name:"לחם מחמצת קלאסי", price:45, img:"classic.jpg", kind:"bread" },
  { id:"onion", name:"לחם מחמצת בצל", price:45, img:"onion.jpg", kind:"bread" },
  { id:"cheddar", name:"לחם מחמצת צ'דר", price:45, img:"cheddar.jpg", kind:"bread" },
  { id:"cheese_chili", name:"לחם מחמצת גבינה וצ'ילי", price:45, img:"cheese_chili.jpg", kind:"bread" },
  { id:"cheese_onion", name:"לחם מחמצת גבינה ובצל", price:45, img:"cheese_onion.jpg", kind:"bread" },

  { id:"mix_rolls", name:"מיקס לחמניות מחמצת", price:45, img:"rolls-mix.jpg", kind:"bread", type:"mix" },
];

/* =======================
   2) מאפינס — 2 קבוצות דיפולט עם פתיחה
   ======================= */
const MUFFIN_IMG_WITH_SUGAR = "muffins-with-sugar.jpg";
const MUFFIN_IMG_NO_SUGAR   = "muffins-no-sugar.jpg";

const MUFFIN_GROUPS = [
  {
    id: "muffins_sugar",
    title: "מאפינס עם סוכר",
    subtitle: "₪12 ליחידה",
    defaultImg: MUFFIN_IMG_WITH_SUGAR,
    options: [
      { id:"muffin_choc",  label:"מאפינס שוקולד",          price:12 },
      { id:"muffin_apple", label:"מאפינס תפוח קינמון",     price:12 },
    ]
  },
  {
    id: "muffins_nosugar",
    title: "מאפינס בלי סוכר",
    subtitle: "₪15 ליחידה",
    defaultImg: MUFFIN_IMG_NO_SUGAR,
    options: [
      { id:"muffin_choc_sf",   label:"מאפינס שוקולד ללא סוכר",        price:15 },
      { id:"muffin_apple_sf",  label:"מאפינס תפוח קינמון ללא סוכר",   price:15 },
      { id:"muffin_vanilla_sf",label:"מאפינס וניל־אספרסו ללא סוכר",   price:15 },
    ]
  }
];

/* =======================
   3) סדנאות מחמצת (חדש)
   ======================= */
const WORKSHOPS = [
  {
    id:"ws_couple",
    title:"סדנה זוגית חווייתית",
    price:800,
    img:"workshop-couple.jpg",
    desc:"ערב זוגי מלא אווירה: הכנת פיצות מחמצת בטאבון, הכנת כיכר לחם מחמצת, והבנה ברורה של כל תהליך המחמצת – מההאכלה ועד האפייה."
  },
  {
    id:"ws_group",
    title:"סדנה קבוצתית (מינ׳ 5 משתתפים)",
    price:300,
    img:"workshop-group.jpg",
    desc:"חוויה קבוצתית טעימה ומלמדת: פיצות מחמצת בטאבון, כיכר לחם מחמצת, ולמידה מסודרת על תהליך המחמצת – בקצב נעים ועם המון טיפים."
  },
  {
    id:"ws_private",
    title:"סדנה אישית",
    price:450,
    img:"workshop-private.jpg",
    desc:"מפגש 1:1 ממוקד ומעמיק: בניית מחמצת, הבנת תהליכים, התאמת קמחים וכלים, ודיוק לפי מה שאת/ה רוצה לאפות בבית."
  }
];

const grid = document.getElementById("products");

/* =======================
   בניית כרטיסים (מוצרים + מאפינס)
   ======================= */
function buildCards(){
  grid.innerHTML = "";

  // מוצרים רגילים
  PRODUCTS.forEach(p=>{
    const card = document.createElement("div");
    card.className = "card";

    let extra = "";
    if(p.type === "mix"){
      extra = `
        <select id="flour_${p.id}">
          <option value="">בחירת קמח…</option>
          <option value="קמח לבן">קמח לבן</option>
          <option value="קמח כוסמין">קמח כוסמין</option>
        </select>
      `;
    }

    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <div class="name">${p.name}</div>
      <div class="price">₪${p.price}</div>
      ${extra}
      <div class="row">
        <div style="color:#7a6653;font-size:13px;">כמות</div>
        <input type="number" min="0" value="0" id="qty_${p.id}">
      </div>
    `;

    const qtyInput = card.querySelector(`#qty_${p.id}`);
    qtyInput.addEventListener("input", () => {
      normalizeQty(p.id);
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

    const optionsHtml = group.options.map(opt => `
      <div class="row" style="margin-top:10px;">
        <div style="flex:1; color:#3e2f23; font-size:15px;">${opt.label}</div>
        <input type="number" min="0" value="0" id="qty_${opt.id}" style="width:120px;text-align:center;">
      </div>
    `).join("");

    card.innerHTML = `
      <img src="${group.defaultImg}" alt="${group.title}">
      <div class="name">${group.title}</div>
      <div class="price">${group.subtitle}</div>

      <details style="margin-top:10px;">
        <summary style="cursor:pointer;color:#6a3d1f;font-weight:600;">בחירת טעמים</summary>
        <div style="margin-top:8px;">
          ${optionsHtml}
        </div>
      </details>
    `;

    group.options.forEach(opt=>{
      const el = card.querySelector(`#qty_${opt.id}`);
      el.addEventListener("input", () => {
        normalizeMuffinQty(opt.id);
        calcTotal();
        updateRulesUI();
      });
    });

    grid.appendChild(card);
  });
}

/* =======================
   רינדור סדנאות (חדש)
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
      <div style="color:#6b5442; line-height:1.7; font-size:15px;">${w.desc}</div>
      <div style="margin-top:10px; color:#7a6653; font-size:13px; line-height:1.6;">
        יש להזמין שבוע מראש ולהמתין לקבלת אישור בווטסאפ חוזר.
      </div>
      <button class="ws-btn" type="button" onclick="requestWorkshop('${w.id}')">בקשת הרשמה לסדנה</button>
    `;

    wsGrid.appendChild(card);
  });
}

function requestWorkshop(workshopId){
  const w = WORKSHOPS.find(x => x.id === workshopId);
  if(!w) return;

  const name = (document.getElementById("custName").value || "").trim();
  const phone = (document.getElementById("custPhone").value || "").trim();
  const notes = (document.getElementById("notes").value || "").trim();

  if(!name){ alert("כדי לשלוח בקשת סדנה, נא למלא שם מלא"); return; }
  if(phone.length < 7){ alert("כדי לשלוח בקשת סדנה, נא למלא מספר טלפון תקין"); return; }

  let message = `בקשת הרשמה לסדנת מחמצת:\n\n`;
  message += `${w.title} — ₪${w.price}\n\n`;
  message += `שם: ${name}\n`;
  message += `טלפון: ${phone}\n`;
  if(notes) message += `הערות: ${notes}\n`;
  message += `\n*לתשומת לב:* הזמנה לפחות שבוע מראש. ההרשמה היא בקשה — ממתינים לאישור בווטסאפ חוזר.`;

  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");
}

/* =======================
   חישוב סה"כ
   ======================= */
function calcTotal(){
  let total = 0;

  PRODUCTS.forEach(p=>{
    const qty = parseInt(document.getElementById("qty_"+p.id).value, 10) || 0;
    total += qty * p.price;
  });

  MUFFIN_GROUPS.forEach(group=>{
    group.options.forEach(opt=>{
      const qty = parseInt(document.getElementById("qty_"+opt.id).value, 10) || 0;
      total += qty * opt.price;
    });
  });

  document.getElementById("total").innerText = total;
}

function normalizeQty(id){
  const el = document.getElementById("qty_"+id);
  let v = parseInt(el.value, 10);
  if(!Number.isFinite(v) || v < 0) v = 0;
  el.value = v;
}

function normalizeMuffinQty(id){
  const el = document.getElementById("qty_"+id);
  let v = parseInt(el.value, 10);
  if(!Number.isFinite(v) || v < 0) v = 0;
  el.value = v;
}

/* =======================
   חוקים חכמים
   ======================= */
function isSunday(dateStr){
  if(!dateStr) return false;
  const d = new Date(dateStr + "T00:00:00");
  return d.getDay() === 0;
}

function hasAnyBreadInCart(){
  return PRODUCTS.some(p => {
    const q = parseInt(document.getElementById("qty_"+p.id).value, 10) || 0;
    return p.kind === "bread" && q > 0;
  });
}

function anyItemsInCart(){
  const anyRegular = PRODUCTS.some(p => (parseInt(document.getElementById("qty_"+p.id).value, 10) || 0) > 0);
  const anyMuffins = MUFFIN_GROUPS.some(g => g.options.some(opt => (parseInt(document.getElementById("qty_"+opt.id).value, 10) || 0) > 0));
  return anyRegular || anyMuffins;
}

function updateRulesUI(){
  const msgEl = document.getElementById("ruleMsg");
  const btnEl = document.getElementById("sendBtn");

  if(!msgEl || !btnEl) return;

  const pickupLocation = document.getElementById("pickupLocation")?.value || "";
  const dateStr = document.getElementById("pickupDate")?.value || "";

  let blocked = false;
  let msg = "";

  if(pickupLocation === "דולב" && isSunday(dateStr) && hasAnyBreadInCart()){
    blocked = true;
    msg = "בדולב אין איסוף לחמים/לחמניות ביום ראשון. אפשר לבחור תאריך אחר או להזמין מאפינס בלבד.";
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
   שליחה לוואטסאפ (הזמנת מאפים)
   ======================= */
function sendOrder(){
  const name = (document.getElementById("custName").value || "").trim();
  const phone = (document.getElementById("custPhone").value || "").trim();
  const dateStr = document.getElementById("pickupDate").value;
  const pickupLocation = document.getElementById("pickupLocation").value;
  const notes = (document.getElementById("notes").value || "").trim();

  if(!name){ alert("נא למלא שם מלא"); return; }
  if(phone.length < 7){ alert("נא למלא מספר טלפון תקין"); return; }
  if(!dateStr){ alert("נא לבחור תאריך איסוף"); return; }
  if(!pickupLocation){ alert("נא לבחור נקודת איסוף"); return; }

  updateRulesUI();
  if(document.getElementById("sendBtn").disabled) return;

  const mixQty = parseInt(document.getElementById("qty_mix_rolls").value, 10) || 0;
  if(mixQty > 0){
    const flour = document.getElementById("flour_mix_rolls").value;
    if(!flour){
      alert("בחרי קמח למיקס לחמניות (לבן / כוסמין)");
      return;
    }
  }

  if(!anyItemsInCart()){
    alert("נא לבחור לפחות מוצר אחד להזמנה");
    return;
  }

  let message = "הזמנה חדשה:\n\n";

  PRODUCTS.forEach(p=>{
    const qty = parseInt(document.getElementById("qty_"+p.id).value, 10) || 0;
    if(qty > 0){
      if(p.type === "mix"){
        const flour = document.getElementById("flour_mix_rolls").value || "";
        message += `${p.name} x${qty} (${flour})\n`;
      } else {
        message += `${p.name} x${qty}\n`;
      }
    }
  });

  MUFFIN_GROUPS.forEach(group=>{
    const chosen = group.options
      .map(opt => {
        const qty = parseInt(document.getElementById("qty_"+opt.id).value, 10) || 0;
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

/* INIT */
buildCards();
renderWorkshops();
calcTotal();
updateRulesUI();

const btn = document.getElementById("sendBtn");
if(btn) btn.addEventListener("click", sendOrder);

const loc = document.getElementById("pickupLocation");
if(loc) loc.addEventListener("change", updateRulesUI);

const dateEl = document.getElementById("pickupDate");
if(dateEl) dateEl.addEventListener("change", updateRulesUI);
