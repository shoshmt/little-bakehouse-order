const WHATSAPP_NUMBER = "972509066634";

const PRODUCTS = [
  { id:"classic", name:"לחם מחמצת קלאסי", price:45, img:"classic.jpg", type:"bread" },
  { id:"cheddar", name:"לחם מחמצת צ'דר", price:45, img:"cheddar.jpg", type:"bread" },
  { id:"cheese_chili", name:"לחם מחמצת גבינה וצ'ילי", price:45, img:"cheese_chili.jpg", type:"bread" },
  { id:"onion", name:"לחם מחמצת בצל", price:45, img:"onion.jpg", type:"bread" },

  { id:"rolls_mix", name:"מיקס לחמניות מחמצת", price:45, img:"rolls-mix.jpg", type:"bread" },

  { id:"muffin_choco", name:"מאפינס שוקולד", price:12, img:"muffin_regular_chocolate.jpg", type:"muffin" },
  { id:"muffin_apple", name:"מאפינס תפוח קינמון", price:12, img:"muffin_regular_apple_cinnamon.jpg", type:"muffin" },
];

let cart = {};

function renderProducts(){
  const container = document.getElementById("breads");
  container.innerHTML = "";

  PRODUCTS.forEach(p=>{
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <img src="${p.img}">
      <div class="name">${p.name}</div>
      <div class="price">₪${p.price}</div>
      <input type="number" min="0" value="0" onchange="updateQty('${p.id}', this.value)">
    `;
    container.appendChild(div);
  });
}

function updateQty(id, val){
  cart[id] = parseInt(val) || 0;
  calcTotal();
}

function calcTotal(){
  let total = 0;
  PRODUCTS.forEach(p=>{
    total += (cart[p.id] || 0) * p.price;
  });
  document.getElementById("total").innerText = "₪" + total;
}

document.getElementById("sendBtn").addEventListener("click", ()=>{
  let msg = "הזמנה חדשה:%0A";
  PRODUCTS.forEach(p=>{
    if(cart[p.id]){
      msg += `${p.name} - ${cart[p.id]}%0A`;
    }
  });

  msg += `%0Aשם: ${custName.value}%0Aטלפון: ${custPhone.value}%0Aאיסוף: ${pickupLocation.value}%0A`;
  msg += `תאריך: ${pickupDate.value}%0A`;
  msg += `הערות: ${notes.value}`;

  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`);
});

renderProducts();
