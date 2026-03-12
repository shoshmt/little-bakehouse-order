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
  { id:"classic",       name:"לחם מחמצת קלאסי",          price:45, img:"classic.jpg",       kind:"bread" },
  { id:"onion",         name:"לחם מחמצת בצל",            price:45, img:"onion.jpg",         kind:"bread" },

  // חלביים:
  { id:"cheddar",       name:"לחם מחמצת צ'דר",           price:45, img:"cheddar.jpg",       kind:"bread", dairy:true },
  { id:"cheese_chili",  name:"לחם מחמצת גבינה וצ'ילי",   price:45, img:"cheese_chili.jpg",  kind:"bread", dairy:true },
  { id:"cheese_onion",  name:"לחם מחמצת גבינה ובצל",     price:45, img:"cheese_onion.jpg",  kind:"bread", dairy:true },

  { id:"mix_rolls",     name:"מיקס לחמניות מחמצת",       price:45, img:"rolls-mix.jpg",     kind:"bread" },

  // מוצר חדש: בסיסי פיצה — בלי בחירת קמח
  {
    id:"pizza_bases",
    name:"בסיסי בצק מחמצת לפיצה – מארז 4 יח׳",
    price:60,
    img:"pizza-bases.jpg",
    kind:"pizza",
    desc:"בסיס לפיצה מוכן לעבודה: משטחים, מוסיפים רוטב ותוספות לפי מה שאוהבים, ואופים בתנור הביתי על החום הכי גבוה או בטאבון פיצה."
  },

  // וופל חלבי — מארז 4 (עם בחירת קמח)
  { id:"waffle_pack",   name:"וופל בלגי מחמצת – מארז 4 יח׳", price:60, img:"waffle-belgian.jpg", kind:"bread", dairy:true },
];

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
function $(id){ return document.getElementById(id); }
function val(id){ return ($(id)?.value || ""); }
function normalizeNumber(el){
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
  if(pickup.getDay() === 1){
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
  if(!dateStr) return true;
  const now = new Date();
  const pickup = new Date(dateStr + "T00:00:00");
  if(now >= pickup) return false;
  return now <= getOrderDeadline(dateStr);
}

/* =======================
   מאפינס: מינימום 4 לכל טעם
   ======================= */
function muffinViolations(){
  const bad = [];
  MUFFIN_GROUPS.forEach(g=>{
    g.options.filter(o=>o.available!==false).forEach(o=>{
      const q = parseInt($(`qty_${o.id}`)?.value, 10) || 0;
      if(q > 0 && q < MUFFIN_MIN_PER_FLAVOR){
        bad.push({ label:o.label, qty:q });
      }
    });
  });
  return bad;
}
function updateMuffinWarnings(){
  MUFFIN_GROUPS.forEach(g=>{
    g.options.filter(o=>o.available!==false).forEach(o=>{
      const q = parseInt($(`qty_${o.id}`)?.value, 10) || 0;
      const warn = $(`warn_${o.id}`);
      if(!warn) return;

      if(q > 0 && q < MUFFIN_MIN_PER_FLAVOR){
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
  PRODUCTS.filter(p => p.kind === "bread").forEach(p=>{
    const qty = parseInt($(`qty_${p.id}`)?.value, 10) || 0;
    if(qty > 0){
      const flour = val(`flour_${p.id}`);
      if(!flour) bad.push(p.name);
    }
  });
  return bad;
}

/* =======================
   בדיקות סל
   ======================= */
function anyItemsInCart(){
  const anyRegular = PRODUCTS.some(p => (parseInt($(`qty_${p.id}`)?.value, 10) || 0) > 0);
  const anyMuffins = MUFFIN_GROUPS.some(g => g.options.filter(o=>o.available!==false).some(o => (parseInt($(`qty_${o.id}`)?.value, 10) || 0) > 0));
  return anyRegular || anyMuffins;
}
function hasAnyBread(){
  return PRODUCTS.some(p => {
    const q = parseInt($(`qty_${p.id}`)?.value, 10) || 0;
    return p.kind === "bread" && q > 0;
  });
}

/* =======================
   בניית כרטיסים (לחמים + מאפינס)
   ======================= */
function buildProductsAndMuffins(){
  if(!productsGrid) return;
  productsGrid.innerHTML = "";

  // מוצרים רגילים
  PRODUCTS.forEach(p=>{
    const card = document.createElement("div");
    card.className = "card";

    // בחירת קמח רק למוצרים מסוג bread
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
      ${p.desc ? `<div style="color:#6b5442; line-height:1.6; font-size:14px; margin-top:6px;">${p.desc}</div>` : ''}
      ${p.dairy ? '<div style="color:#7a6653;font-size:13px; margin-top:8px;">חלבי</div>' : ''}
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

    if(p.kind === "bread"){
      const flourEl = card.querySelector(`#flour_${p.id}`);
      flourEl.addEventListener("change", () => {
        calcTotal();
        updateRulesUI();
      });
    }

    productsGrid.appendChild(card);
  });

  // מאפינס
  MUFFIN_GROUPS.forEach(g=>{
    const card = document.createElement("div");
    card.className = "card";

    const opts = g.options.filter(o=>o.available!==false);

    const optionsHtml = opts.map(o => `
      <div class="row" style="margin-top:10px;">
        <div style="flex:1; color:#3e2f23; font-size:15px;">${o.label}</div>
        <input type="number" min="0" value="0" id="qty_${o.id}" style="width:120px;text-align:center;">
      </div>
      <div id="warn_${o.id}" style="display:none; margin-top:6px; color:#6b2d1a; background:#fff1e6; border:1px solid #f0c9b0; padding:8px 10px; border-radius:10px; font-size:13px; line-height:1.5;"></div>
    `).join("");

    card.innerHTML = `
      <img src="${g.defaultImg}" alt="${g.title}">
      <div class="name">${g.title}</div>
      <div class="price">${g.subtitle}</div>
      <div style="color:#7a6653;font-size:13px;">חלבי</div>
      <div style="margin-top:8px; color:#7a6653; font-size:13px; line-height:1.6;">
        מינימום הזמנה: ${MUFFIN_MIN_PER_FLAVOR} יח׳ מאותו הטעם.
      </div>

      <details style="margin-top:10px;">
        <summary style="cursor:pointer;color:#6a3d1f;font-weight:600;">בחירת טעמים</summary>
        <div style="margin-top:8px;">${optionsHtml}</div>
      </details>
    `;

    opts.forEach(o=>{
      const el = card.querySelector(`#qty_${o.id}`);
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
      <button class="ws-btn" type="button">בקשת הרשמה לסדנה</button>
    `;
    card.querySelector(".ws-btn").addEventListener("click", () => requestWorkshop(w.id));
    wsGrid.appendChild(card);
  });
}

function requestWorkshop(workshopId){
  const w = WORKSHOPS.find(x => x.id === workshopId);
  if(!w) return;

  const name  = val("custName").trim();
  const phone = val("custPhone").trim();
  const notes = val("notes").trim();

  if(!name){ alert("כדי לשלוח בקשת סדנה, נא למלא שם מלא"); return; }
  if(phone.length < 7){ alert("כדי לשלוח בקשת סדנה, נא למלא מספר טלפון תקין"); return; }

  let msg = `בקשת הרשמה לסדנאות מחמצת:\n\n`;
  msg += `${w.title} — ₪${w.price}\n\n`;
  msg += `שם: ${name}\nטלפון: ${phone}\n`;
  if(notes) msg += `הערות: ${notes}\n`;
  msg += `\nלתשומת לב: הזמנה לפחות שבוע מראש. הבקשה ממתינה לאישור בווטסאפ חוזר.`;

  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
}

/* =======================
   חישוב סה"כ
   ======================= */
function calcTotal(){
  let total = 0;

  PRODUCTS.forEach(p=>{
    const q = parseInt($(`qty_${p.id}`)?.value, 10) || 0;
    total += q * p.price;
  });

  MUFFIN_GROUPS.forEach(g=>{
    g.options.filter(o=>o.available!==false).forEach(o=>{
      const q = parseInt($(`qty_${o.id}`)?.value, 10) || 0;
      total += q * o.price;
    });
  });

  if($("total")) $("total").innerText = total;
}

/* =======================
   חוקים חכמים + הודעה ללקוח
   ======================= */
function updateRulesUI(){
  const msgEl = $("ruleMsg");
  const btnEl = $("sendBtn");
  if(!msgEl || !btnEl) return;

  const pickupLocation = val("pickupLocation");
  const dateStr = val("pickupDate");

  let blocked = false;
  let msg = "";

  // 1) דולב + ראשון + יש לחם
  if(pickupLocation === "דולב" && isSunday(dateStr) && hasAnyBread()){
    blocked = true;
    msg = "בדולב אין איסוף לחמים/לחמניות ביום ראשון. אפשר לבחור תאריך אחר או להזמין מאפינס בלבד.";
  }

  // 2) מאפינס מינימום 4 לכל טעם
  if(!blocked){
    const v = muffinViolations();
    if(v.length){
      blocked = true;
      msg = `מינימום הזמנה למאפינס הוא ${MUFFIN_MIN_PER_FLAVOR} יח׳ מאותו הטעם. חסר לך בטעם: "${v[0].label}".`;
    }
  }

  // 3) חלון הזמנה לפי תאריך
  if(!blocked && dateStr){
    if(!isOrderWindowOpen(dateStr)){
      blocked = true;
      msg = `הזמנות לתאריך הזה נסגרו. ניתן להזמין עד ${formatDeadline(getOrderDeadline(dateStr))}.`;
    }
  }

  // 4) חובה לבחור קמח לכל לחם שנבחר
  if(!blocked){
    const badBreads = breadFlourViolations();
    if(badBreads.length){
      blocked = true;
      msg = `נא לבחור קמח (לבן/כוסמין) עבור: ${badBreads.join(" • ")}.`;
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
   שליחה לוואטסאפ (מאפים)
   ======================= */
function sendOrder(){
  const name  = val("custName").trim();
  const phone = val("custPhone").trim();
  const dateStr = val("pickupDate");
  const pickupLocation = val("pickupLocation");
  const notes = val("notes").trim();

  if(!name){ alert("נא למלא שם מלא"); return; }
  if(phone.length < 7){ alert("נא למלא מספר טלפון תקין"); return; }
  if(!dateStr){ alert("נא לבחור תאריך איסוף"); return; }
  if(!pickupLocation){ alert("נא לבחור נקודת איסוף"); return; }

  updateMuffinWarnings();
  updateRulesUI();
  if($("sendBtn")?.disabled) return;

  if(!anyItemsInCart()){
    alert("נא לבחור לפחות מוצר אחד להזמנה");
    return;
  }

  const v = muffinViolations();
  if(v.length){
    alert(`מינימום הזמנה למאפינס הוא ${MUFFIN_MIN_PER_FLAVOR} יח׳ מאותו הטעם. חסר לך בטעם: "${v[0].label}".`);
    return;
  }

  const badBreads = breadFlourViolations();
  if(badBreads.length){
    alert(`נא לבחור קמח (לבן/כוסמין) עבור: ${badBreads.join(" • ")}`);
    return;
  }

  let msg = "הזמנה חדשה:\n\n";

  // מוצרים רגילים
  PRODUCTS.forEach(p=>{
    const q = parseInt($(`qty_${p.id}`)?.value, 10) || 0;
    if(q > 0){
      if(p.kind === "bread"){
        const flour = val(`flour_${p.id}`);
        msg += `${p.name} x${q} (${flour})\n`;
      } else {
        msg += `${p.name} x${q}\n`;
      }
    }
  });

  // מאפינס
  MUFFIN_GROUPS.forEach(g=>{
    const chosen = g.options
      .filter(o=>o.available!==false)
      .map(o=>{
        const q = parseInt($(`qty_${o.id}`)?.value, 10) || 0;
        return q > 0 ? `${o.label} x${q}` : null;
      })
      .filter(Boolean);

    if(chosen.length){
      msg += `\n${g.title}:\n- ${chosen.join("\n- ")}\n`;
    }
  });

  // פרטים
  msg += `\nשם: ${name}\nטלפון: ${phone}\nנקודת איסוף: ${pickupLocation}\nתאריך איסוף: ${dateStr}\n`;
  if(notes) msg += `הערות: ${notes}\n`;

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


זה הapp.js הנוכחי המעודכן שלי.

הקבצים index.html העדכניים שלי הם:

<!doctype html>
<html lang="he" dir="rtl">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>בית המאפה הקטן בדולב</title>

<link href="https://fonts.googleapis.com/css2?family=Assistant:wght@300;400;600;800&display=swap" rel="stylesheet">

<style>
body{
  margin:0;
  font-family:'Assistant', sans-serif;
  background:url("./site-bg.jpg") center/cover fixed no-repeat;
  color:#3e2f23;
}

/* HEADER */
header{
  position:relative;
  overflow:hidden;
  text-align:center;
  padding:100px 20px 60px;
  background:url("./header-bg.jpg") center/cover no-repeat;
}

header::after{
  content:"";
  position:absolute;
  left:0; right:0; bottom:0;
  height:110px;
  pointer-events:none;
  background:linear-gradient(
    to bottom,
    rgba(0,0,0,0) 0%,
    rgba(0,0,0,0) 40%,
    rgba(248,240,230,1) 100%
  );
}

.main-title{
  margin:0 0 25px 0;
  font-size:56px;
  font-weight:600;
  color:#6a3d1f;
  letter-spacing:1.5px;
  position:relative;
  z-index:1;
}

.logo{
  width:240px;
  height:240px;
  object-fit:cover;
  border-radius:30px;
  box-shadow:0 12px 30px rgba(0,0,0,0.18);
  margin:0 auto 20px;
  display:block;
  background:#fffaf3;
  position:relative;
  z-index:1;
}

.sub-title{
  font-size:35px;
  font-weight:400;
  color:#4e2f1e;
  margin-top:10px;
  position:relative;
  z-index:1;
}

/* חדש: שורת כשרות */
.sub-note{
  font-size:20px;
  color:#4e2f1e;
  margin-top:8px;
  font-weight:500;
  position:relative;
  z-index:1;
  line-height:1.6;
}

.wheat-divider{
  margin-top:20px;
  display:flex;
  justify-content:center;
  position:relative;
  z-index:1;
}

.wheat-divider svg{
  width:180px;
  opacity:0.85;
}

/* CONTENT */
main{
  max-width:1000px;
  margin:0 auto;
  padding:40px 16px 80px;
}

.grid{
  display:grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap:20px;
}

.card{
  background:#fffaf3;
  border:1px solid #f0e2d4;
  border-radius:20px;
  padding:18px;
  box-shadow:0 8px 20px rgba(0,0,0,0.06);
}

.card img{
  width:100%;
  border-radius:16px;
  margin-bottom:12px;
  display:block;
}

.name{ font-weight:600; font-size:18px; }
.price{ color:#8c5a2b; font-weight:700; margin:8px 0; }

.row{
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap:10px;
}

select, input[type="number"]{
  padding:8px;
  border-radius:10px;
  border:1px solid #dbc7b5;
  font-family:inherit;
  background:#fff;
}

.row input[type="number"]{
  width:120px;
  text-align:center;
}

.box{
  margin-top:40px;
  background:#fffaf3;
  border-radius:22px;
  padding:22px;
  box-shadow:0 8px 22px rgba(0,0,0,0.06);
}

input, textarea{
  width:100%;
  margin-top:10px;
  padding:12px;
  border-radius:12px;
  border:1px solid #dbc7b5;
  font-family:inherit;
  background:#fff;
  box-sizing:border-box;
}

.box select{
  width:100%;
  margin-top:10px;
  padding:12px;
  border-radius:12px;
  border:1px solid #dbc7b5;
  font-family:inherit;
  background:#fff;
  box-sizing:border-box;
}

.total{
  margin-top:15px;
  font-weight:800;
  font-size:20px;
}

.btn{
  margin-top:15px;
  padding:14px;
  width:100%;
  border:none;
  border-radius:14px;
  background:#7a4b2c;
  color:#fff;
  font-weight:800;
  cursor:pointer;
}

.btn:hover{ background:#5f3821; }

.btn:disabled{
  opacity:0.6;
  cursor:not-allowed;
}

.hint{
  margin-top:14px;
  font-size:14px;
  text-align:center;
  color:#7a6653;
  line-height:1.7;
}

.rule{
  margin-top:10px;
  padding:10px 12px;
  border-radius:12px;
  background:#fff1e6;
  border:1px solid #f0c9b0;
  color:#6b2d1a;
  display:none;
}

/* סדנאות */
.section-title{
  margin:46px 0 14px;
  text-align:center;
  font-size:28px;
  font-weight:600;
  color:#6a3d1f;
}

.section-text{
  text-align:center;
  max-width:820px;
  margin:0 auto 18px;
  color:#6f5a48;
  line-height:1.8;
  font-size:15px;
}

.ws-btn{
  margin-top:12px;
  width:100%;
  padding:12px 14px;
  border:none;
  border-radius:14px;
  background:#6a3d1f;
  color:#fff;
  font-weight:700;
  cursor:pointer;
}
.ws-btn:hover{ background:#5a3218; }
</style>
</head>

<body>

<header>
  <h1 class="main-title">בית המאפה הקטן בדולב</h1>
  <img class="logo" src="logo-new.jpg" alt="logo" />
  <div class="sub-title">מאפיית בוטיק למאפי מחמצת</div>
  <div class="sub-note">כל המוצרים נאפים במטבח ביתי כשר. מופרש בצק כדין.</div>

  <div class="wheat-divider">
    <svg viewBox="0 0 300 40">
      <g stroke="#b68b5e" stroke-width="1.5" fill="none">
        <line x1="20" y1="20" x2="120" y2="20"/>
        <line x1="180" y1="20" x2="280" y2="20"/>
      </g>
    </svg>
  </div>
</header>

<main>

  <!-- מוצרים -->
  <div class="grid" id="products"></div>

  <!-- סדנאות -->
  <h2 class="section-title">סדנאות מחמצת</h2>
  <div class="section-text">
    סדנאות חווייתיות באווירה כפרית: פיצות מחמצת בטאבון, הכנת כיכר לחם, והבנה ברורה של תהליך המחמצת — בקצב נעים ועם המון טיפים.
  </div>
  <div class="grid" id="workshops"></div>

  <!-- פרטי הזמנה -->
  <div class="box">
    <h2>פרטי הזמנה</h2>

    <input id="custName" placeholder="שם מלא">
    <input id="custPhone" placeholder="טלפון">
    <input id="pickupDate" type="date">

    <select id="pickupLocation">
      <option value="">בחירת נקודת איסוף…</option>
      <option value="דולב">דולב — להזמין מראש. אין איסוף לחמים ביום ראשון</option>
      <option value="בית שמש">בית שמש — בית משפחת מוריס (יש לברר בפרטי את יום האיסוף)</option>
      <option value="גבעות עדן">גבעות עדן — בית משפחת מוריס (יונתן ואליטל)</option>
    </select>

    <div class="rule" id="ruleMsg"></div>

    <textarea id="notes" placeholder="הערות להזמנה"></textarea>

    <div class="total">סה״כ: ₪<span id="total">0</span></div>
    <button class="btn" id="sendBtn" type="button">שליחת הזמנה ב-WhatsApp</button>

    <div class="hint">
      אני אופה במיוחד לכל הזמנה ✨<br>
      כיכר לחם מחמצת עוברת תהליך של כ־48 שעות הכנה.<br>
      הזמנות מתקבלות עד יומיים מראש.<br>
      להזמנה ליום שני – ניתן להזמין עד יום ראשון בשעה 12:00 בצהריים.
    </div>
  </div>

</main>

<script src="app.js?v=5"></script>
</body>
</html>
