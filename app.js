const WHATSAPP_NUMBER = "972509066634";

const PRODUCTS = [
  { id:"classic", name:"לחם מחמצת קלאסי", price:45, img:"classic.jpg", type:"bread"},
  { id:"onion", name:"לחם מחמצת בצל", price:45, img:"onion.jpg", type:"bread"},
  { id:"cheddar", name:"לחם מחמצת צ׳דר", price:45, img:"cheddar.jpg", type:"bread"},
  { id:"butter_garlic", name:"לחם מחמצת שום", price:45, img:"butter_garlic.jpg", type:"bread"},
  { id:"cheese_chili", name:"לחם מחמצת גבינה וצ׳ילי", price:45, img:"cheese_chili.jpg", type:"bread"},
  { id:"cheese_onion", name:"לחם מחמצת גבינה ובצל", price:45, img:"cheese_onion.jpg", type:"bread"},

  { id:"rolls_mix", name:"מיקס לחמניות מחמצת", price:45, img:"rolls-mix.jpg", type:"bread"},

  { id:"muffin_choc", name:"מאפינס שוקולד", price:12, img:"muffin_regular_chocolate.jpg", type:"muffin"},
  { id:"muffin_apple", name:"מאפינס תפוח קינמון", price:12, img:"muffin_regular_apple_cinnamon.jpg", type:"muffin"},
  { id:"muffin_sf_choc", name:"מאפינס שוקולד ללא סוכר", price:15, img:"muffin_sf_espresso_vanilla.jpg", type:"muffin"},
  { id:"muffin_sf_apple", name:"מאפינס תפוח קינמון ללא סוכר", price:15, img:"muffins-default.jpg", type:"muffin"}
];

let cart = {};

function renderProducts(){
  const container = document.getElementById("products");
  container.innerHTML="";

  PRODUCTS.forEach(p=>{
    const card=document.createElement("div");
    card.className="card";

    let flourSelect="";
    if(p.id==="rolls_mix"){
      flourSelect=`
      <select onchange="updateFlour('${p.id}',this.value)">
        <option value="">בחירת קמח</option>
        <option value="לבן">לבן</option>
        <option value="כוסמין">כוסמין</option>
      </select>
      `;
    }

    card.innerHTML=`
      <img src="${p.img}">
      <div class="name">${p.name}</div>
      <div class="price">₪${p.price}</div>
      ${flourSelect}
      <input type="number" min="0" value="0" 
        onchange="updateQty('${p.id}',this.value)">
    `;
    container.appendChild(card);
  });
}

function updateQty(id,val){
  cart[id]=parseInt(val)||0;
  calcTotal();
}

function updateFlour(id,val){
  cart[id+"_flour"]=val;
}

function calcTotal(){
  let total=0;
  PRODUCTS.forEach(p=>{
    total+= (cart[p.id]||0)*p.price;
  });
  document.getElementById("total").innerText=total;
}

document.getElementById("sendBtn").onclick=function(){

  const date=document.getElementById("pickupDate").value;
  const location=document.getElementById("pickupLocation").value;
  const warning=document.getElementById("warning");
  warning.style.display="none";

  if(!location){ alert("בחרי נקודת איסוף"); return; }

  const selectedDate=new Date(date);
  const isSunday=selectedDate.getDay()===0;

  let hasBread=false;
  PRODUCTS.forEach(p=>{
    if(p.type==="bread" && cart[p.id]>0){ hasBread=true; }
  });

  if(location==="דולב" && isSunday && hasBread){
    warning.style.display="block";
    return;
  }

  let message="הזמנה חדשה:\n\n";

  PRODUCTS.forEach(p=>{
    if(cart[p.id]>0){
      message+=`${p.name} x${cart[p.id]}\n`;
      if(p.id==="rolls_mix" && cart["rolls_mix_flour"])
        message+=`קמח: ${cart["rolls_mix_flour"]}\n`;
    }
  });

  message+=`\nתאריך איסוף: ${date}`;
  message+=`\nנקודת איסוף: ${location}`;

  const url=`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url);
};

renderProducts();
