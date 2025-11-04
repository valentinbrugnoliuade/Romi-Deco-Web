const productos=[
  {id:'nova',nombre:'Lámpara Nova',precio:59990},
  {id:'orbit',nombre:'Sillón Orbit',precio:249990},
  {id:'aura',nombre:'Set de vasos Aura (x6)',precio:14990},
  {id:'vela',nombre:'Vela Ámbar 250ml',precio:8990},
];
const $=id=>document.getElementById(id);
const money=n=>n.toLocaleString('es-AR',{style:'currency',currency:'ARS'});
const cargar=sel=>{ sel.innerHTML=productos.map(p=>`<option value='${p.id}'>${p.nombre} — ${money(p.precio)}</option>`).join(''); }
cargar($('pA_producto')); cargar($('pB_producto')); cargar($('pC_producto'));
const price=id=>productos.find(p=>p.id===id).precio;
const validInt=v=>{const n=parseInt(v,10);return Number.isFinite(n)&&n>0?n:null;}
function render(el,sub,desc,total){ el.innerHTML=`<p>Subtotal: <span class='strike'>${money(sub)}</span></p><p>Descuento: <strong>${money(desc)}</strong></p><p>Total final: <strong>${money(total)}</strong></p><p>Ahorro: <strong>${((desc/sub)*100||0).toFixed(1)}%</strong></p>` }
function promoA(precio,cantidad){const n=validInt(cantidad); if(!n) return null; const pares=Math.floor(n/2); const desc=pares*(precio*0.5); const sub=precio*n; return {sub,desc,total:sub-desc};}
function promoB(precio,cantidad){const n=validInt(cantidad); if(!n) return null; const trios=Math.floor(n/3); const desc=trios*precio; const sub=precio*n; return {sub,desc,total:sub-desc};}
function promoC(precio,cantidad){const n=validInt(cantidad); if(!n) return null; const sub=precio*n; const desc=sub>30000?sub*0.10:0; return {sub,desc,total:sub-desc};}
$('pA_btn').addEventListener('click',()=>{const res=promoA(price($('pA_producto').value),$('pA_cantidad').value); if(!res){$('pA_res').textContent='Ingresá una cantidad válida.';return;} render($('pA_res'),res.sub,res.desc,res.total);});
$('pB_btn').addEventListener('click',()=>{const res=promoB(price($('pB_producto').value),$('pB_cantidad').value); if(!res){$('pB_res').textContent='Ingresá una cantidad válida.';return;} render($('pB_res'),res.sub,res.desc,res.total);});
$('pC_btn').addEventListener('click',()=>{const res=promoC(price($('pC_producto').value),$('pC_cantidad').value); if(!res){$('pC_res').textContent='Ingresá una cantidad válida.';return;} render($('pC_res'),res.sub,res.desc,res.total);});