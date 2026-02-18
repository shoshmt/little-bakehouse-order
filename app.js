const WHATSAPP_NUMBER = "972509066634";

const PRODUCTS = [
  { id:"classic", name:"לחם מחמצת קלאסי", price:45, img:"classic.jpg" },
  { id:"cheddar", name:"לחם מחמצת צ'דר", price:45, img:"cheddar.jpg" },
  { id:"cheese_chili", name:"לחם מחמצת גבינה וצ'ילי", price:45, img:"cheese_chili.jpg" },
  { id:"onion", name:"לחם מחמצת בצל", price:45, img:"onion.jpg" },

  { id:"rolls_mix", name:"מיקס לחמניות מחמצת", price:45, img:"rolls-mix.jpg" },

  { id:"muffin_choco", name:"מאפינס שוקולד", price:12, img:"muffin_regular_chocolate.jpg" },
  { id:"muffin_apple", name:"מאפינס תפוח קינמון", price:12, img:"muffin_regular_apple_cinnamon.jpg" },
];

const cart = {};

function renderProducts(){
  const container = document.getElementById("products");
  container.innerHTML = "";

  PRODUCTS.forEach(p=>{
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <div class="name">${p.name}</div>
      <div class="price">₪${p.price}</div>
      <input type="number" min="0" value="0" data-id="${p.id}">
    `;

    const input = div.querySelector("input");
    input.addEventListener("input", () => {
      const id = input.dataset.id;
      cart[id] = Math.max(0, parseInt(input.value, 10) || 0);
      calcTotal();
    });

    container.appendChild(div);
  });
}

function calcTotal(){
  let total = 0;
  PRODUCTS.forEach(p=>{
    total += (cart[p.id] || 0) * p.price;
  });
  document.getElementById("total").innerText = "₪" + total;
}

function hasAnyBread(){
  // כל מה שב-45 נחשב "לחם/לחמניות"
  return PRODUCTS.some(p => p.price === 45 && (cart[p.id] || 0) > 0);
}

function isSunday(dateStr){
  if(!dateStr) return false;
  const d = new Date(dateStr + "T00:00:00");
  return d.getDay() === 0;
}

document.getElementById("sendBtn").addEventListener("click", ()=>{
  const name = document.getElementById("custName").value.trim();
  const phone = document.getElementById("custPhone").value.trim();
  const pickupLocation = document.getElementById("pickupLocation").value;
  const pickupDate = document.getElementById("pickupDate").value;
  const notes = document.getElementById("notes").value.trim();

  if(!name || phone.length < 7){
    alert("נא למלא שם וטלפון");
    return;
  }
  if(!pickupLocation){
    alert("נא לבחור נקודת איסוף");
    return;
  }
  if(!pickupDate){
    alert("נא לבחור תאריך איסוף");
    return;
  }

  // חוק חכם: בדולב אין איסוף לחמים ביום ראשון
  if(pickupLocation === "דולב" && isSunday(pickupDate) && hasAnyBread()){
    alert("בדולב אין איסוף לחמים/לחמניות ביום ראשון. אפשר לבחור תאריך אחר או להזמין מאפינס בלבד.");
    return;
  }

  let msg = "הזמנה חדשה:%0A";

  PRODUCTS.forEach(p=>{
    const q = cart[p.id] || 0;
    if(q > 0){
      msg += `${p.name} - ${q}%0A`;
    }
  });

  msg += `%0Aשם: ${encodeURIComponent(name)}%0A`;
  msg += `טלפון: ${encodeURIComponent(phone)}%0A`;
  msg += `נקודת איסוף: ${encodeURIComponent(pickupLocation)}%0A`;
  msg += `תאריך: ${encodeURIComponent(pickupDate)}%0A`;

  if(notes){
    msg += `הערות: ${encodeURIComponent(notes)}`;
  }

  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`);
});

renderProducts();
calcTotal();
