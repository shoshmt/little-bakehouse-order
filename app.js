const WHATSAPP_NUMBER = "972509066634";

const PRODUCTS = [
  { id:"classic", name:"לחם מחמצת קלאסי", price:45, img:"classic.jpg", kind:"bread" },
  { id:"onion", name:"לחם מחמצת בצל", price:45, img:"onion.jpg", kind:"bread" },
  { id:"cheddar", name:"לחם מחמצת צ'דר", price:45, img:"cheddar.jpg", kind:"bread" },
  { id:"cheese_chili", name:"לחם מחמצת גבינה וצ'ילי", price:45, img:"cheese_chili.jpg", kind:"bread" },
  { id:"cheese_onion", name:"לחם מחמצת גבינה ובצל", price:45, img:"cheese_onion.jpg", kind:"bread" },

  // אם הקובץ אצלך לא png, תשני פה לשם המדויק (jpg/jpeg)
  { id:"mix_rolls", name:"מיקס לחמניות מחמצת", price:45, img:"rolls-mix.jpg", kind:"bread", type:"mix" },

  { id:"muffin_choc", name:"מאפינס שוקולד", price:12, img:"muffin_regular_chocolate.jpg", kind:"muffin" },
  { id:"muffin_apple", name:"מאפינס תפוח קינמון", price:12, img:"muffin_regular_apple_cinnamon.jpg", kind:"muffin" },

  { id:"muffin_choc_sf", name:"מאפינס שוקולד ללא סוכר", price:15, img:"muffins-default.jpg", kind:"muffin" },
  { id:"muffin_apple_sf", name:"מאפינס תפוח קינמון ללא סוכר", price:15, img:"muffins-default.jpg", kind:"muffin" }
];

const grid = document.getElementById("products");

function buildCards(){
  grid.innerHTML = "";

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
        // אם כבר יש כמות > 0 ואין קמח — נזהיר
        normalizeQty(p.id);
        updateRulesUI();
      });
    }

    grid.appendChild(card);
  });
}

function normalizeQty(id){
  const el = document.getElementById("qty_"+id);
  let v = parseInt(el.value, 10);
  if(!Number.isFinite(v) || v < 0) v = 0;
  el.value = v;

  // אם זה מיקס ויש כמות > 0 חייבים קמח
  if(id === "mix_rolls" && v > 0){
    const flour = document.getElementById("flour_mix_rolls").value;
    if(!flour){
      // לא מאפסים אוטומטית כדי לא להרגיז, רק נציג הודעה כששולחים
      return;
    }
  }
}

function calcTotal(){
  let total = 0;
  PRODUCTS.forEach(p=>{
    const qty = parseInt(document.getElementById("qty_"+p.id).value, 10) || 0;
    total += qty * p.price;
  });
  document.getElementById("total").innerText = total;
}

function isSunday(dateStr){
  if(!dateStr) return false;
  const d = new Date(dateStr + "T00:00:00");
  return d.getDay() === 0;
}

function hasAnyBreadInCart(){
  return PRODUCTS.some(p => p.kind === "bread" && ((parseInt(document.getElementById("qty_"+p.id).value, 10) || 0) > 0));
}

function updateRulesUI(){
  const msgEl = document.getElementById("ruleMsg");
  const btnEl = document.getElementById("sendBtn");

  const pickupLocation = document.getElementById("pickupLocation").value;
  const dateStr = document.getElementById("pickupDate").value;

  let blocked = false;
  let msg = "";

  // חסימה: דולב + ראשון + יש לחם/לחמניות
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

  // בדיקה נוספת לפני שליחה
  updateRulesUI();
  if(document.getElementById("sendBtn").disabled){
    return; // ההודעה כבר מוצגת
  }

  // מיקס לחמניות — חובה לבחור קמח אם יש כמות
  const mixQty = parseInt(document.getElementById("qty_mix_rolls").value, 10) || 0;
  if(mixQty > 0){
    const flour = document.getElementById("flour_mix_rolls").value;
    if(!flour){
      alert("בחרי קמח למיקס לחמניות (לבן / כוסמין)");
      return;
    }
  }

  // חייב להיות לפחות פריט אחד
  const anyQty = PRODUCTS.some(p => (parseInt(document.getElementById("qty_"+p.id).value, 10) || 0) > 0);
  if(!anyQty){
    alert("נא לבחור לפחות מוצר אחד להזמנה");
    return;
  }

  let message = "הזמנה חדשה:\n\n";

  PRODUCTS.forEach(p=>{
    const qty = parseInt(document.getElementById("qty_"+p.id).value, 10) || 0;
    if(qty > 0){
      if(p.type === "mix"){
        const flour = document.getElementById("flour_mix_rolls").value;
        message += `${p.name} x${qty} (${flour})\n`;
      } else {
        message += `${p.name} x${qty}\n`;
      }
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
calcTotal();
updateRulesUI();

document.getElementById("sendBtn").addEventListener("click", sendOrder);
document.getElementById("pickupLocation").addEventListener("change", updateRulesUI);
document.getElementById("pickupDate").addEventListener("change", updateRulesUI);
