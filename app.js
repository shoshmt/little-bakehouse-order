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

  // אם הקובץ אצלך לא png, תשני כאן לשם המדויק (jpg/jpeg)
  { id:"mix_rolls", name:"מיקס לחמניות מחמצת", price:45, img:"rolls-mix.png", kind:"bread", type:"mix" },
];

/* =======================
   2) מאפינס — 2 קבוצות דיפולט עם פתיחה
   ======================= */
/* תעדכני כאן את שמות התמונות הדיפולט לפי מה שיש לך בתיקייה */
const MUFFIN_IMG_WITH_SUGAR = "muffins-default.jpg";
const MUFFIN_IMG_NO_SUGAR   = "muffins-default.jpg";

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
      // אם אין לך את האופציה הזו בפועל — פשוט תמחקי את השורה:
      { id:"muffin_vanilla_sf",label:"מאפינס וניל־אספרסו ללא סוכר",   price:15 },
    ]
  }
];

const grid = document.getElementById("products");

/* =======================
   בניית כרטיסים
   ======================= */
function buildCards(){
  grid.innerHTML = "";

  // כרטיסים רגילים
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

  // כרטיסי מאפינס קבוצתיים (דיפולט + פתיחה)
  MUFFIN_GROUPS.forEach(group=>{
    const card = document.createElement("div");
    card.className = "card";

    const optionsHtml = group.options.map(opt => `
      <div class="row" style="margin-top:10px;">
        <div style="flex:1; color:#3e2f23; font-size:15px;">${opt.label}</div>
        <input
          type="number"
          min="0"
          value="0"
          id="qty_${opt.id}"
          style="width:120px;text-align:center;"
        >
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

    // מאזינים לכמויות מאפינס
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
   חישוב סה"כ
   ======================= */
function calcTotal(){
  let total = 0;

  // רגילים
  PRODUCTS.forEach(p=>{
    const qty = parseInt(document.getElementById("qty_"+p.id).value, 10) || 0;
    total += qty * p.price;
  });

  // מאפינס לפי טעמים
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

  // דולב + ראשון + יש לחם/לחמניות => חסימה (מאפינס אפשר)
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
   שליחה לוואטסאפ
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

  // מיקס לחמניות — חובה לבחור קמח אם יש כמות
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

  // רגילים
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

  // מאפינס — מקובץ לפי קבוצות
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

  // פרטים
  message += `\nשם: ${name}\n`;
  message += `טלפון: ${phone}\n`;
  message += `נקודת איסוף: ${pickupLocation}\n`;
  message += `תאריך איסוף: ${dateStr}\n`;
  if(notes) message += `הערות: ${notes}\n`;

  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");
}

/* INIT */
buildCards();
calcTotal();
updateRulesUI();

// חיבור הכפתור בצורה בטוחה
const btn = document.getElementById("sendBtn");
if(btn) btn.addEventListener("click", sendOrder);

const loc = document.getElementById("pickupLocation");
if(loc) loc.addEventListener("change", updateRulesUI);

const dateEl = document.getElementById("pickupDate");
if(dateEl) dateEl.addEventListener("change", updateRulesUI);
