const WHATSAPP_NUMBER = "972509066634";

const PRODUCTS = [
  { id:"classic", name:"לחם מחמצת קלאסי", price:45, img:"classic.jpg" },
  { id:"onion", name:"לחם מחמצת בצל", price:45, img:"onion.jpg" },
  { id:"cheddar", name:"לחם מחמצת צ'דר", price:45, img:"cheddar.jpg" },
  { id:"cheese_chili", name:"לחם מחמצת גבינה וצ'ילי", price:45, img:"cheese_chili.jpg" },
  { id:"cheese_onion", name:"לחם מחמצת גבינה ובצל", price:45, img:"cheese_onion.jpg" },

  { id:"mix_rolls", name:"מיקס לחמניות מחמצת", price:45, img:"rolls-mix.png", type:"mix" },

  { id:"muffin_choc", name:"מאפינס שוקולד", price:12, img:"muffin_regular_chocolate.jpg" },
  { id:"muffin_apple", name:"מאפינס תפוח קינמון", price:12, img:"muffin_regular_apple_cinnamon.jpg" },

  { id:"muffin_choc_sf", name:"מאפינס שוקולד ללא סוכר", price:15, img:"muffins-default.jpg" },
  { id:"muffin_apple_sf", name:"מאפינס תפוח קינמון ללא סוכר", price:15, img:"muffins-default.jpg" }
];

const grid = document.getElementById("products");

PRODUCTS.forEach(p=>{
  const card = document.createElement("div");
  card.className="card";

  let extra = "";
  if(p.type==="mix"){
    extra = `
      <select id="flour_${p.id}">
        <option value="">בחירת קמח...</option>
        <option>קמח לבן</option>
        <option>קמח כוסמין</option>
      </select>
    `;
  }

  card.innerHTML=`
    <img src="${p.img}">
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
  let total=0;
  PRODUCTS.forEach(p=>{
    const qty=parseInt(document.getElementById("qty_"+p.id).value)||0;
    total+=qty*p.price;
  });
  document.getElementById("total").innerText=total;
}

function sendOrder(){
  let message="הזמנה חדשה:%0A";
  PRODUCTS.forEach(p=>{
    const qty=parseInt(document.getElementById("qty_"+p.id).value)||0;
    if(qty>0){
      message+=`${p.name} x${qty}%0A`;
    }
  });

  message+=`%0Aשם: ${custName.value}%0A`;
  message+=`טלפון: ${custPhone.value}%0A`;
  message+=`תאריך איסוף: ${pickupDate.value}%0A`;
  message+=`הערות: ${notes.value}%0A`;

  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`,"_blank");
}
