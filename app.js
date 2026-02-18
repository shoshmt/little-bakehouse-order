const WHATSAPP_NUMBER = "972509066634";

const PRODUCTS = [
  { id:"classic", name:"לחם מחמצת קלאסי", price:45, img:"classic.jpg", kind:"bread" },
  { id:"onion", name:"לחם מחמצת בצל", price:45, img:"onion.jpg", kind:"bread" },
  { id:"cheddar", name:"לחם מחמצת צ'דר", price:45, img:"cheddar.jpg", kind:"bread" },
  { id:"cheese_chili", name:"לחם מחמצת גבינה וצ'ילי", price:45, img:"cheese_chili.jpg", kind:"bread" },
  { id:"cheese_onion", name:"לחם מחמצת גבינה ובצל", price:45, img:"cheese_onion.jpg", kind:"bread" },

  // שימי לב לשם הקובץ: אם אצלך זה rolls-mix.jpg תשני פה
  { id:"mix_rolls", name:"מיקס לחמניות מחמצת", price:45, img:"rolls-mix.png", kind:"bread", type:"mix" },

  { id:"muffin_choc", name:"מאפינס שוקולד", price:12, img:"muffin_regular_chocolate.jpg", kind:"muffin" },
  { id:"muffin_apple", name:"מאפינס תפוח קינמון", price:12, img:"muffin_regular_apple_cinnamon.jpg", kind:"muffin" },

  { id:"muffin_choc_sf", name:"מאפינס שוקולד ללא סוכר", price:15, img:"muffins-default.jpg", kind:"muffin" },
  { id:"muffin_apple_sf", name:"מאפינס תפוח קינמון ללא סוכר", price:15, img:"muffins-default.jpg", kind:"muffin" }
];

const grid = document.getElementById("products");

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
      <input type="number" min="0" value="0" id="qty_${p.id}" onchange="calcTotal()">
    </div>
  `;

  grid.appendChild(card);
});

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

function hasAnyBread(){
  return PRODUCTS.some(p => p.kind === "bread" && ((parseInt(document.getElementById("qty_"+p.id).value,10) || 0) > 0));
}

function encodeMsg(s){
  return encodeURIComponent(s || "");
}

function sendOrder(){
  const name = (custName.value || "").trim();
  const phone = (custPhone.value || "").trim();
  const pickupDate = pickupDateEl().value;
  const pickupLocation = pickupLocationEl().value;
  const notes = (notesEl().value || "").trim();

  if(!name){
    alert("נא למלא שם מלא");
    return;
  }
  if(phone.length < 7){
    alert("נא למלא מספר טלפון תקין");
    return;
  }
  if(!pickupDate){
    alert("נא לבחור תאריך איסוף");
    return;
  }
  if(!pickupLocation){
    alert("נא לבחור נקודת איסוף");
    return;
  }

  // חוק חכם: בדולב אין איסוף לחמים ביום ראשון (מאפינס אפשר)
  if(pickupLocation === "דולב" && isSunday(pickupDate) && hasAnyBread()){
    alert("בדולב אין איסוף לחמים/לחמניות ביום ראשון. אפשר לבחור תאריך אחר, או להזמין מאפינס בלבד.");
    return;
  }

  // אם הזמינו מיקס לחמניות — חובה לבחור קמח
  const mixQty = parseInt(document.getElementById("qty_mix_rolls").value, 10) || 0;
  if(mixQty > 0){
    const flour = document.getElementById("flour_mix_rolls").value;
    if(!flour){
      alert("בחרי קמח למיקס לחמניות (לבן / כוסמין)");
      return;
    }
  }

  let message = "הזמנה חדשה:\n";

  PRODUCTS.forEach(p=>{
    const qty = parseInt(document.getElementById("qty_"+p.id).value, 10) || 0;
    if(qty > 0){
      if(p.type === "mix"){
        const flour = document.getElementById("flour_"+p.id).value || "";
        message += `${p.name} x${qty} (${flour})\n`;
      } else {
        message += `${p.name} x${qty}\n`;
      }
    }
  });

  message += `\nשם: ${name}\n`;
  message += `טלפון: ${phone}\n`;
  message += `נקודת איסוף: ${pickupLocation}\n`;
  message += `תאריך איסוף: ${pickupDate}\n`;
  if(notes) message += `הערות: ${notes}\n`;

  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeMsg(message)}`,"_blank");
}

function pickupDateEl(){ return document.getElementById("pickupDate"); }
function pickupLocationEl(){ return document.getElementById("pickupLocation"); }
function notesEl(){ return document.getElementById("notes"); }

// חישוב ראשוני
calcTotal();
