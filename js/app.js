const $=s=>document.querySelector(s),T=n=>n.toLocaleString("en-TZ")+" TZS",PER=12;let shown=PER,list=[];
addEventListener("load",()=>setTimeout(()=>$("#loader").classList.add("out"),1400));
$("#yr").textContent=new Date().getFullYear();
$("#br").innerHTML=BRANCHES.map(b=>`<div class="col-sm-6 col-lg-3 reveal"><div class="bc"><h5>📍 ${b[0]}</h5><p class="mb-1">${b[1]}</p><small class="text-muted">${b[2]}</small><hr><small>Same products at every branch.<br>Call <a href="tel:+255761383838">+255 761 383 838</a></small></div></div>`).join("");
const catOpts='<option value="">All categories</option>'+Object.entries(CATS).map(([k,v])=>`<option value="${k}">${v[1]}</option>`).join("");
$("#cat").innerHTML=catOpts;
$("#catStrip").innerHTML='<button class="chip on" data-c=""><span>🛒</span>All</button>'+Object.entries(CATS).map(([k,v])=>`<button class="chip" data-c="${k}"><span>${v[0]}</span>${v[1]}</button>`).join("");
$("#brand").innerHTML='<option value="">All brands</option>'+[...new Set(PRODUCTS.map(p=>p.brand))].sort().map(b=>`<option>${b}</option>`).join("");
const max=Math.max(...PRODUCTS.map(p=>p.price));$("#price").max=max;$("#price").value=max;
const sp=(b,t="Loading…")=>{b.dataset.t=b.innerHTML;b.innerHTML=`<i class="spin"></i>${t}`;b.disabled=true};const un=b=>{b.innerHTML=b.dataset.t;b.disabled=false};
const ph=p=>`<div class="ph">${CATS[p.cat][0]}<img loading="lazy" src="${IMG_BASE}/${p.slug}.jpg" alt="${p.name}" onerror="this.remove()"></div>`;
const tag=p=>p.stock=="in"?'<span class="tag">In stock</span>':p.stock=="low"?'<span class="tag low">Limited stock</span>':'<span class="tag out">Out of stock</span>';
function filter(){const q=$("#q").value.trim().toLowerCase(),c=$("#cat").value,b=$("#brand").value,mp=+$("#price").value,s=$("#stock").checked,so=$("#sort").value;
$("#pv").textContent=T(mp);document.querySelectorAll(".chip").forEach(x=>x.classList.toggle("on",x.dataset.c==c));
list=PRODUCTS.filter(p=>(!q||(p.name+p.brand+CATS[p.cat][1]).toLowerCase().includes(q))&&(!c||p.cat==c)&&(!b||p.brand==b)&&p.price<=mp&&(!s||p.stock!="out"));
list.sort(so=="pa"?(a,b)=>a.price-b.price:so=="pd"?(a,b)=>b.price-a.price:(a,b)=>a.name.localeCompare(b.name));}
function render(delay=450){shown=PER;$("#grid").innerHTML=Array(8).fill('<div class="col-6 col-md-4 col-xl-3"><div class="sk"></div></div>').join("");$("#more").classList.add("d-none");
clearTimeout(render.t);render.t=setTimeout(()=>{filter();draw()},delay)}
function draw(){$("#count").textContent=`${list.length} product${list.length==1?"":"s"} found`;
if(!list.length){$("#grid").innerHTML='<div class="empty"><div>🔍</div><h5>No products found</h5><p>Try different keywords or reset your filters.</p><button class="btn-m btn-red" onclick="reset()">Reset filters</button></div>';$("#more").classList.add("d-none");return}
$("#grid").innerHTML=list.slice(0,shown).map((p,i)=>`<div class="col-6 col-md-4 col-xl-3"><div class="pc" style="animation-delay:${(i%PER)*40}ms" onclick="openP(${p.id})">${ph(p)}<div class="pb"><small>${p.brand}</small><h6>${p.name}</h6><div class="mb-2">${tag(p)}</div><div class="price">${T(p.price)}<small class="text-muted"> / ${p.size}</small></div></div></div></div>`).join("");
$("#more").classList.toggle("d-none",shown>=list.length)}
function openP(id){const p=PRODUCTS.find(x=>x.id==id);$("#pmc").innerHTML=`<div class="row g-0"><div class="col-md-5"><div class="mi">${CATS[p.cat][0]}<img src="${IMG_BASE}/${p.slug}.jpg" alt="${p.name}" onerror="this.remove()"></div></div><div class="col-md-7 p-4"><button class="btn-close float-end" data-bs-dismiss="modal"></button><small class="text-muted">${CATS[p.cat][1]}</small><h4 style="color:var(--navy)">${p.name}</h4><h4 class="text-danger">${T(p.price)}</h4>${tag(p)}<p class="mt-3">${p.desc}</p><table class="d"><tr><td>Brand</td><td>${p.brand}</td></tr><tr><td>Size / Unit</td><td>${p.size}</td></tr><tr><td>Category</td><td>${CATS[p.cat][1]}</td></tr><tr><td>SKU</td><td>${p.sku}</td></tr><tr><td>Branches</td><td>All 4 branches</td></tr></table><div class="alert alert-light border mt-3 small mb-0">🏬 <b>Available in store only.</b> We do not deliver — visit any Mkwabi branch to buy this item. Stock may vary; call +255 761 383 838 to confirm.</div></div></div>`;bootstrap.Modal.getOrCreateInstance("#pm").show()}
function reset(){$("#q").value="";$("#cat").value="";$("#brand").value="";$("#price").value=max;$("#stock").checked=false;$("#sort").value="n";render()}
["q","cat","brand","price","stock","sort"].forEach(i=>$("#"+i).addEventListener(i=="q"||i=="price"?"input":"change",()=>render(i=="q"?350:300)));
$("#catStrip").onclick=e=>{const b=e.target.closest(".chip");if(b){$("#cat").value=b.dataset.c;render();document.getElementById("products").scrollIntoView()}};
$("#reset").onclick=function(){sp(this,"Resetting");reset();setTimeout(()=>un(this),600)};
$("#more").onclick=function(){sp(this);setTimeout(()=>{shown+=PER;draw();un(this)},600)};
document.querySelectorAll("[data-spin]").forEach(a=>a.addEventListener("click",()=>{const o=a.innerHTML;a.innerHTML='<i class="spin"></i>'+o;setTimeout(()=>a.innerHTML=o,900)}));
document.querySelectorAll(".links a").forEach(a=>a.onclick=()=>bootstrap.Collapse.getOrCreateInstance("#menu",{toggle:false}).hide());
const io=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&e.target.classList.add("in")),{threshold:.1});
const obs=()=>document.querySelectorAll(".reveal").forEach(e=>io.observe(e));obs();render(900);
