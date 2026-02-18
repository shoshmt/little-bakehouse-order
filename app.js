const WHATSAPP = "972509066634";

const breads = [
 {id:"classic",name:"לחם מחמצת קלאסי",price:45,img:"classic.jpg"},
 {id:"onion",name:"לחם מחמצת בצל",price:45,img:"onion.jpg"},
 {id:"cheddar",name:"לחם מחמצת צ׳דר",price:45,img:"cheddar.jpg"},
];

const muffins = [
 {id:"m1",label:"שוקולד",price:12,img:"muffin_regular_chocolate.jpg"},
 {id:"m2",label:"תפוח קינמון",price:12,img:"muffin_regular_apple_cinnamon.jpg"},
 {id:"m3",label:"וניל אספרסו (ללא סוכר)",price:15,img:"muffin_sf_espresso_vanilla.jpg"}
];

let cart = {};
let rollsQty = 0;
let rollsFlour = "";
let total = 0;

function render(){
 renderBreads();
 renderRolls();
 renderMuffins();
 calcTotal();
}

function renderBreads(){
 const el=document.getElementById("breads");
 el.innerHTML="";
 breads.forEach(b=>{
  cart[b.id]=cart[b.id]||0;
  el.innerHTML+=`
  <div class="card">
   <img src="${b.img}">
   <div class="name">${b.name}</div>
   <div class="price">₪${b.price}</div>
   <input type="number" min="0" value="${cart[b.id]}" 
   onchange="cart['${b.id}']=+this.value;calcTotal()">
  </div>`;
 });
}

function renderRolls(){
 const el=document.getElementById("rolls");
 el.innerHTML=`
 <div class="card compact-card">
  <img src="rolls-mix.jpg">
  <div class="name">מיקס לחמניות מחמצת</div>
  <div class="price">₪45</div>
  <select onchange="rollsFlour=this.value">
    <option value="">בחרי קמח</option>
    <option>לבן</option>
    <option>כוסמין</option>
  </select>
  <input type="number" min="0" value="${rollsQty}" 
   onchange="rollsQty=+this.value;calcTotal()">
 </div>`;
}

function renderMuffins(){
 const el=document.getElementById("muffins");
 el.innerHTML=`
 <div class="card compact-card">
  <img id="mImg" src="muffins-default.jpg">
  <div class="name">מאפינס</div>
  <select id="mSel" onchange="changeMuffin()">
   <option value="">בחרי טעם</option>
   ${muffins.map(m=>`<option value="${m.id}">${m.label} ₪${m.price}</option>`).join("")}
  </select>
  <input type="number" id="mQty" min="0" value="0" onchange="changeMuffin()">
 </div>`;
}

function changeMuffin(){
 const id=document.getElementById("mSel").value;
 const qty=+document.getElementById("mQty").value;
 muffins.forEach(m=>cart[m.id]=0);
 if(!id)return calcTotal();
 const m=muffins.find(x=>x.id==id);
 document.getElementById("mImg").src=m.img;
 if(qty>=4) cart[id]=qty;
 calcTotal();
}

function calcTotal(){
 total=0;
 breads.forEach(b=> total+= (cart[b.id]||0)*b.price);
 total+=rollsQty*45;
 muffins.forEach(m=> total+=(cart[m.id]||0)*m.price);
 document.getElementById("total").innerText="₪"+total;
}

function send(){
 const msg="הזמנה חדשה\nסה״כ ₪"+total;
 window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`);
}

document.getElementById("sendBtn").onclick=send;
render();
