import { createServer } from "node:http";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const storePath = join(here, "store.json");
const sessions = new Map();
const PORT = Number(process.env.PORT || 8000);
const cakePrices = { "strawberry-cloud":780,"vanilla-dream":650,"matcha-bloom":800,"choco-velvet":750,"blueberry-milk":820,"birthday-pop":900,"lemon-cloud":760,"ube-milk":820,"red-velvet":850,"caramel-nude":880,"peach-blush":840,"cookies-cream":790,"strawberry-shortcake":860,"midnight-chocolate":920,"garden-party":980,"retro-cherry":950,"pink-heart":890,"dreamy-ribbon":990 };
const cakeNames = { "strawberry-cloud":"Strawberry Cloud","vanilla-dream":"Vanilla Dream","matcha-bloom":"Matcha Bloom","choco-velvet":"Chocolate Velvet","blueberry-milk":"Blueberry Milk","birthday-pop":"Birthday Pop","lemon-cloud":"Lemon Cloud","ube-milk":"Ube Milk","red-velvet":"Red Velvet Kiss","caramel-nude":"Caramel Nude","peach-blush":"Peach Blush","cookies-cream":"Cookies & Cream","strawberry-shortcake":"Strawberry Shortcake","midnight-chocolate":"Midnight Chocolate","garden-party":"Garden Party","retro-cherry":"Retro Cherry","pink-heart":"Pink Heart","dreamy-ribbon":"Dreamy Ribbon" };
const prices = {
  size:{"4-inch mini":480,"6-inch":650,"8-inch":850,"10-inch":1100,"12-inch":1450,"14-inch party":1850},
  flavor:{Vanilla:0,Chocolate:100,"Red Velvet":150,Matcha:150,Strawberry:130,Ube:140,"Cookies & Cream":160,Lemon:120},
  filling:{None:0,"Vanilla Cream":50,Chocolate:80,Strawberry:120,"Salted Caramel":120,"Cream Cheese":140,"Ube Cream":130,"Mango Cream":140,"Blueberry Cream":140},
  design:{Minimalist:100,Floral:250,Vintage:300,Character:350,"Y2K Pastel":280,"Heart Ribbon":320,"Lambeth Piping":380,"Korean Minimal":220,"Photo Style":300},
  addOn:{"Cake Topper":100,"Custom Message":50,"Extra Decorations":150,"Mini Candle Set":80,"Fresh Flowers":220,"Chocolate Plaque":120,"Ribbon Finish":90,"Mini Cupcake Set":260,"Cake Knife Set":60},
};
const promos = { WELCOME10:{type:"percent",value:10,minimum:800}, SWEET150:{type:"fixed",value:150,minimum:1500}, Y2K15:{type:"percent",value:15,minimum:1000}, BIRTHDAY200:{type:"fixed",value:200,minimum:1800} };

function loadStore() { if (!existsSync(storePath)) return { users: [], orders: [] }; try { return JSON.parse(readFileSync(storePath, "utf8")); } catch { return { users: [], orders: [] }; } }
function saveStore(store) { mkdirSync(here, { recursive: true }); writeFileSync(storePath, JSON.stringify(store, null, 2)); }
function hashPassword(password) { const salt=randomBytes(16).toString("hex"); return `${salt}:${scryptSync(password,salt,64).toString("hex")}`; }
function passwordMatches(password, stored) { const [salt, hash] = stored.split(":"); return timingSafeEqual(scryptSync(password,salt,64),Buffer.from(hash,"hex")); }
function userView(user) { return { id:user.id, name:user.name, email:user.email, phone:user.phone || "" }; }
function send(res,status,body) { res.writeHead(status,{"Content-Type":"application/json","Access-Control-Allow-Origin":"http://localhost:5173","Access-Control-Allow-Headers":"Content-Type, Authorization"}); res.end(JSON.stringify(body)); }
function issueToken(userId) { const token=randomBytes(32).toString("hex"); sessions.set(token,userId); return token; }
function requireUser(req,res,store) { const token=req.headers.authorization?.replace("Bearer ",""); const user=token && store.users.find(entry=>entry.id===sessions.get(token)); if (!user) { send(res,401,{message:"Please log in to continue."}); return null; } return user; }
function readBody(req) { return new Promise((resolve,reject)=>{ let body=""; req.on("data",chunk=>{body+=chunk;if(body.length>1_000_000)reject(new Error("Request is too large."));}); req.on("end",()=>{try{resolve(body?JSON.parse(body):{});}catch{reject(new Error("Invalid request."));}}); req.on("error",reject); }); }
function dailySlots(store) { const now=new Date(); now.setHours(0,0,0,0); return Array.from({length:7},(_,index)=>{ const date=new Date(now); date.setDate(now.getDate()+index+2); const value=date.toISOString().slice(0,10); const capacity=date.getDay()===0?8:10; const booked=store.orders.filter(o=>o.pickupDate===value&&o.status!=="Cancelled").length; return {date:value,label:date.toLocaleDateString("en-US",{weekday:"short"}),day:value.slice(-2),capacity,booked}; }); }
function calculateOrder(body) { const c=body.configuration||{}; if (!cakePrices[c.cakeId]) throw new Error("Please choose a valid cake."); let subtotal=cakePrices[c.cakeId]; for (const [group,value] of [[prices.size,c.size],[prices.flavor,c.flavor],[prices.filling,c.filling],[prices.design,c.design]]) { if (typeof value!=="string" || !(value in group)) throw new Error("One of your cake choices is unavailable."); subtotal+=group[value]; } const addOns=Array.isArray(c.addOns)?c.addOns:[]; for(const addOn of addOns){if(!(addOn in prices.addOn))throw new Error("One of your add-ons is unavailable.");subtotal+=prices.addOn[addOn];} const code=String(c.promoCode||"").toUpperCase(); const promo=promos[code]; const discount=promo&&subtotal>=promo.minimum?(promo.type==="percent"?Math.round(subtotal*promo.value/100):promo.value):0; return {cakeId:c.cakeId,cakeName:cakeNames[c.cakeId],subtotal,discount,total:Math.max(0,subtotal-discount),promoCode:discount?code:"",configuration:{...c,addOns,promoCode:discount?code:""}}; }

createServer(async (req,res)=>{
  if(req.method==="OPTIONS")return send(res,204,{}); const url=new URL(req.url,`http://${req.headers.host}`), path=url.pathname, store=loadStore();
  try {
    if(req.method==="POST"&&path==="/api/auth/register"){const {name,email,password}=await readBody(req);const normalized=String(email||"").trim().toLowerCase();if(String(name||"").trim().length<2||!/^\S+@\S+\.\S+$/.test(normalized)||String(password||"").length<6)return send(res,400,{message:"Please provide a name, valid email, and password of at least 6 characters."});if(store.users.some(u=>u.email===normalized))return send(res,409,{message:"An account already exists for this email."});const user={id:randomBytes(12).toString("hex"),name:name.trim(),email:normalized,phone:"",passwordHash:hashPassword(password),createdAt:new Date().toISOString()};store.users.push(user);saveStore(store);return send(res,201,{token:issueToken(user.id),user:userView(user)});}
    if(req.method==="POST"&&path==="/api/auth/login"){const {email,password}=await readBody(req);const user=store.users.find(u=>u.email===String(email||"").trim().toLowerCase());if(!user||!passwordMatches(String(password||""),user.passwordHash))return send(res,401,{message:"Email or password is incorrect."});return send(res,200,{token:issueToken(user.id),user:userView(user)});}
    if(req.method==="POST"&&path==="/api/auth/forgot-password"){await readBody(req);return send(res,200,{message:"If an account exists, reset instructions have been sent."});}
    if(req.method==="GET"&&path==="/api/auth/me"){const user=requireUser(req,res,store);if(!user)return;return send(res,200,{user:userView(user)});}
    if(req.method==="PUT"&&path==="/api/users/me"){const user=requireUser(req,res,store);if(!user)return;const {name,phone}=await readBody(req);if(String(name||"").trim().length<2||String(phone||"").trim().length<7)return send(res,400,{message:"Please provide a name and valid phone number."});user.name=name.trim();user.phone=phone.trim();saveStore(store);return send(res,200,{user:userView(user)});}
    if(req.method==="GET"&&path==="/api/pickup-slots")return send(res,200,{slots:dailySlots(store)});
    if(req.method==="GET"&&path==="/api/orders/me"){const user=requireUser(req,res,store);if(!user)return;return send(res,200,{orders:store.orders.filter(o=>o.userId===user.id).sort((a,b)=>b.createdAt.localeCompare(a.createdAt))});}
    if(req.method==="POST"&&path==="/api/orders"){const user=requireUser(req,res,store);if(!user)return;const body=await readBody(req);const slot=dailySlots(store).find(item=>item.date===body.pickupDate);if(!slot||slot.booked>=slot.capacity)return send(res,409,{message:"That pickup date is no longer available. Please choose another date."});const order={id:`CC-${String(Date.now()).slice(-6)}`,userId:user.id,pickupDate:body.pickupDate,status:"Pending",specialInstructions:String(body.specialInstructions||"").slice(0,250),createdAt:new Date().toISOString(),...calculateOrder(body)};store.orders.push(order);saveStore(store);return send(res,201,{order});}
    const orderMatch=path.match(/^\/api\/orders\/([^/]+)$/);if(orderMatch&&req.method==="GET"){const user=requireUser(req,res,store);if(!user)return;const order=store.orders.find(o=>o.id===orderMatch[1]&&o.userId===user.id);return order?send(res,200,{order}):send(res,404,{message:"Order not found."});}
    const cancelMatch=path.match(/^\/api\/orders\/([^/]+)\/cancel$/);if(cancelMatch&&req.method==="PATCH"){const user=requireUser(req,res,store);if(!user)return;const order=store.orders.find(o=>o.id===cancelMatch[1]&&o.userId===user.id);if(!order)return send(res,404,{message:"Order not found."});if(!["Pending","Confirmed"].includes(order.status))return send(res,400,{message:"This order is already in production and can no longer be cancelled online."});order.status="Cancelled";saveStore(store);return send(res,200,{order});}
    return send(res,404,{message:"Route not found."});
  } catch(error) { return send(res,400,{message:error.message||"Something went wrong."}); }
}).listen(PORT,()=>console.log(`CakeCraft API running at http://localhost:${PORT}/api`));
