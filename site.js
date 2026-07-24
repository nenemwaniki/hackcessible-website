(function(){
var root=document.documentElement,path=location.pathname.split("/").pop()||"index";if(path.indexOf(".html")<0)path+=".html";if(path==="groups.html")path="cohorts.html";
var logo='<svg viewBox="0 0 266 54" role="img" aria-label="Hackcessible"><text x="0" y="39" font-family="Jakarta,Arial" font-size="35" font-weight="800" letter-spacing="-2">Hack</text><path d="M82 37V24c0-12 10-20 22-20s22 8 22 20v13" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/><circle cx="82" cy="39" r="4" fill="currentColor"/><circle cx="126" cy="39" r="4" fill="currentColor"/><text x="132" y="39" font-family="Jakarta,Arial" font-size="35" font-weight="800" letter-spacing="-2">cessible</text></svg>';
var nav=[["index.html","Home"],["cohorts.html","Cohorts"],["people.html","People"],["contact.html","Contact"]],links=nav.map(function(n){return '<a class="nav-link" href="'+n[0]+'"'+(n[0]===path?' aria-current="page"':'')+'>'+n[1]+'</a>'}).join("");
var mount=document.getElementById("site-nav");if(mount)mount.innerHTML='<a class="skip" href="#main">Skip to content</a><div class="nav-shell"><nav class="nav" aria-label="Primary"><a class="brand" href="index.html">'+logo+'</a><div class="nav-links" id="navLinks">'+links+'</div><div class="nav-actions"><button class="theme-toggle" type="button" aria-label="Toggle dark mode" aria-pressed="false"><svg class="icon-sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4 12H2m20 0h-2M5 5l2 2m10 10 2 2m0-14-2 2M7 17l-2 2"/></svg><svg class="icon-moon" viewBox="0 0 24 24"><path d="M21 14a9 9 0 1 1-11-11 7 7 0 0 0 11 11z"/></svg></button><button class="menu-toggle" type="button" aria-label="Open menu" aria-expanded="false"><svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button></div></nav></div><div class="nav-spacer"></div>';
var foot=document.getElementById("site-footer");if(foot)foot.innerHTML='<footer class="foot-wrap"><div class="wrap foot"><div><h2>Hackcessible</h2><small>Student-led assistive technology exploration in Nairobi.</small></div><div><strong>Explore</strong><a href="cohorts.html">Cohorts</a><a href="people.html">People</a><a href="contact.html">Contact</a></div><div><strong>Contact</strong><a href="mailto:nbi.cime@aku.edu">nbi.cime@aku.edu</a><small>CIME · Aga Khan University<br>Nairobi, Kenya</small></div></div></footer>';
var theme=document.querySelector(".theme-toggle");if(theme){theme.setAttribute("aria-pressed",String(root.dataset.theme==="dark"));theme.onclick=function(){var dark=root.dataset.theme!=="dark";if(dark)root.dataset.theme="dark";else delete root.dataset.theme;theme.setAttribute("aria-pressed",String(dark));try{localStorage.setItem("hk-theme",dark?"dark":"light")}catch(e){}}}
var menu=document.querySelector(".menu-toggle"),menuLinks=document.getElementById("navLinks");if(menu){menu.onclick=function(){var open=menuLinks.classList.toggle("open");menu.setAttribute("aria-expanded",String(open));menu.setAttribute("aria-label",open?"Close menu":"Open menu")};menuLinks.onclick=function(e){if(e.target.closest("a")){menuLinks.classList.remove("open");menu.setAttribute("aria-expanded","false")}}}
var reduce=matchMedia("(prefers-reduced-motion: reduce)").matches,intro=document.getElementById("intro");if(intro){var seen=false;try{seen=sessionStorage.getItem("hk-intro")}catch(e){}if(reduce||seen)intro.remove();else{try{sessionStorage.setItem("hk-intro","1")}catch(e){}setTimeout(function(){intro.classList.add("done");setTimeout(function(){intro.remove()},650)},3000)}}
var observer=new IntersectionObserver(function(entries){entries.forEach(function(e,i){if(e.isIntersecting){setTimeout(function(){e.target.classList.add("in")},Math.min(i*70,280));observer.unobserve(e.target)}})},{threshold:.12});document.querySelectorAll(".reveal").forEach(function(el){observer.observe(el)});
/* Navbar: liquid-glass shrinks on scroll */
var navShell=document.querySelector(".nav-shell");if(navShell){var onScrollNav=function(){navShell.classList.toggle("scrolled",(window.scrollY||0)>36)};onScrollNav();addEventListener("scroll",onScrollNav,{passive:true})}

/* Custom cursor: small x-ray dot, blacks out on press */
if(matchMedia("(pointer:fine) and (min-width:1024px)").matches){var p=document.createElement("div");p.className="pointer";document.body.appendChild(p);addEventListener("pointermove",function(e){p.style.left=e.clientX+"px";p.style.top=e.clientY+"px";var hot=e.target.closest("a,button");p.classList.toggle("hot",!!hot)},{passive:true});addEventListener("pointerdown",function(){p.classList.add("down")});addEventListener("pointerup",function(){p.classList.remove("down")})}

/* Word-by-word text reveal (re-initializable for SPA nav) */
function initWordReveal(){
if(reduce)return;
var splitTargets=[].slice.call(document.querySelectorAll("#main h1, #main h2, #main .lead")).filter(function(el){return !el.closest(".word-band")&&!el.classList.contains("rw-done")});
var wsplit=function(node){[].slice.call(node.childNodes).forEach(function(n){if(n.nodeType===3){if(!n.textContent)return;var frag=document.createDocumentFragment();n.textContent.split(/(\s+)/).forEach(function(w){if(w==="")return;if(/^\s+$/.test(w)){frag.appendChild(document.createTextNode(w))}else{var s=document.createElement("span");s.className="rw";s.textContent=w;frag.appendChild(s)}});node.replaceChild(frag,n)}else if(n.nodeType===1&&n.nodeName!=="BR"){wsplit(n)}})};
splitTargets.forEach(function(el){wsplit(el);el.classList.add("rw-done");el.querySelectorAll(".rw").forEach(function(s,i){s.style.transitionDelay=(i*38)+"ms"})});
var wObs=new IntersectionObserver(function(en){en.forEach(function(e){if(e.isIntersecting){e.target.classList.add("rw-in");wObs.unobserve(e.target)}})},{threshold:.18});
splitTargets.forEach(function(el){wObs.observe(el)})
}
initWordReveal();

/* Re-observe .reveal elements (re-initializable for SPA nav) */
function initReveals(){
document.querySelectorAll(".reveal:not(.in)").forEach(function(el){observer.observe(el)})
}

/* Cohort 2026 Case Study Toggle */
function initCohortToggle(){
var controls=document.querySelectorAll("[data-case]"),panels=document.querySelectorAll(".case-panel");
if(!controls.length||!panels.length)return;
var ci=document.getElementById("caseSwitchIndicator");
function syncCi(){if(!ci)return;var active=document.querySelector('.case-switch button[aria-pressed="true"]');if(active){ci.style.width=active.offsetWidth+"px";ci.style.transform="translateX("+active.offsetLeft+"px)"}}
function show(k,scroll,writeHash){
panels.forEach(function(p){p.hidden=p.id!==k});
controls.forEach(function(b){b.setAttribute("aria-pressed",String(b.dataset.case===k))});
syncCi();
if(writeHash&&history.replaceState)history.replaceState(null,"","#"+k);
if(scroll){var stage=document.querySelector(".case-stage");if(stage)stage.scrollIntoView({behavior:reduce?"auto":"smooth"})}
}
controls.forEach(function(b){b.onclick=function(){show(b.dataset.case,true,true)}});
var h=(location.hash||"").slice(1);
show(h==="sawa"?"sawa":"timekeeper",false,false);
requestAnimationFrame(syncCi);
addEventListener("resize",syncCi);
}
initCohortToggle();

/* Contact Sponsor / Student Interest Toggle */
function initContactToggle(){
var buttons=document.querySelectorAll(".contact-switch button"),
panels={sponsor:document.getElementById("sponsor"),interest:document.getElementById("interest")},
panelWrap=document.querySelector(".contact-panels");
if(!buttons.length||!panels.sponsor||!panels.interest)return;
function show(mode){
var apply=function(){
Object.keys(panels).forEach(function(k){if(panels[k])panels[k].hidden=(k!==mode)});
buttons.forEach(function(b){b.setAttribute("aria-pressed",String(b.dataset.mode===mode))});
if(history.replaceState&&location.hash!=="#"+mode)history.replaceState(null,"","#"+mode);
if(panelWrap)requestAnimationFrame(function(){panelWrap.classList.remove("is-switching")});
};
if(reduce||!panelWrap){apply();return}
panelWrap.classList.add("is-switching");
setTimeout(apply,200);
}
buttons.forEach(function(b){b.onclick=function(){show(b.dataset.mode)}});
var hash=(location.hash||"").replace("#","");
show(panels[hash]?hash:"sponsor");

var form=document.getElementById("interestForm");
if(form&&!form.dataset.bound){
form.dataset.bound="true";
form.onsubmit=function(e){
e.preventDefault();
var f=new FormData(form),lines=["Hello Hackcessible team,","","Please add me to the student interest list.","","Name: "+f.get("name"),"Email: "+f.get("email"),"Discipline: "+f.get("discipline"),"Institution: "+f.get("institution"),"Interest: "+f.get("message")];
location.href="mailto:nbi.cime@aku.edu?subject="+encodeURIComponent("Hackcessible student interest list")+"&body="+encodeURIComponent(lines.join("\n"));
};
}
}
initContactToggle();

/* People Organizers Carousel & Hover Popover */
function initPeopleCarousel(){
var track=document.getElementById("peopleTrack"),pop=document.getElementById("personPop");
if(!track)return;
var people=[
{n:"Dr Michael Moneypenny",r:"CIME programme lead. He helped convene the clinical learning environment and guide the cohort’s collaboration.",i:"images/site/dr-michael.webp"},
{n:"Dr Raana",r:"Clinical consultant. She brought clinical perspective into team discussions and prototype review.",i:"images/site/dr-raana.webp"},
{n:"Dr Susan Wamithi",r:"Clinical consultant. She supported the cohort’s understanding of people, care contexts and responsible design.",i:"images/site/dr-susan.webp"},
{n:"Austin Muchiri",r:"Project organizer at CIME. He coordinated the people, spaces and practical details that kept the cohort moving.",i:"images/site/austin-muchiri.webp"},
{n:"Melissa Kimari",r:"TimeKeeper student lead. She helped guide the team from observation through prototype learning.",i:"images/site/melissa-kimari.webp"},
{n:"Munene Mwaniki",r:"Sawa student lead. He helped connect the team’s software and device work into one prototype system.",i:"images/site/munene-mwaniki.webp"}
];
function cards(hidden){
return people.map(function(p,i){return '<button class="person-card" type="button" data-i="'+i+'"'+(hidden?' aria-hidden="true" tabindex="-1"':'')+'><img src="'+encodeURI(p.i)+'" alt="" width="480" height="560" loading="lazy"><span><strong>'+p.n+'</strong><small>Hover to read →</small></span></button>'}).join("");
}
if(!track.children.length){
track.innerHTML='<div class="people-set">'+cards(false)+'</div><div class="people-set" aria-hidden="true">'+cards(true)+'</div>';
}
if(!pop)return;
var img=document.getElementById("popImage"),name=document.getElementById("popName"),role=document.getElementById("popRole");
function place(card){var r=card.getBoundingClientRect();pop.style.left=(r.left+r.width/2)+"px";var ph=pop.offsetHeight,top=r.top-ph-16;if(top<88){pop.classList.add("below");top=r.bottom+16}else{pop.classList.remove("below")}pop.style.top=top+"px"}
function open(card){var p=people[+card.dataset.i];if(!p)return;if(img){img.src=encodeURI(p.i);img.alt=p.n}if(name)name.textContent=p.n;if(role)role.textContent=p.r;track.classList.add("paused");pop.classList.add("show");pop.setAttribute("aria-hidden","false");place(card)}
function close(){track.classList.remove("paused");pop.classList.remove("show");pop.setAttribute("aria-hidden","true")}

if(!track.dataset.bound){
track.dataset.bound="true";
track.addEventListener("pointerover",function(e){var b=e.target.closest(".person-card");if(b)open(b)});
track.addEventListener("pointerout",function(e){var b=e.target.closest(".person-card");if(b&&!b.contains(e.relatedTarget))close()});
track.addEventListener("focusin",function(e){var b=e.target.closest(".person-card");if(b)open(b)});
track.addEventListener("focusout",function(e){var b=e.target.closest(".person-card");if(b&&!b.contains(e.relatedTarget))close()});
addEventListener("scroll",function(){if(pop.classList.contains("show"))close()},{passive:true});
addEventListener("resize",close);
}
}
initPeopleCarousel();

/* Route transition veil overlay with header overdrop */
var titles={"index.html":"Hackcessible","cohorts.html":"Cohort 2026","groups.html":"Cohort 2026","people.html":"Organizers","contact.html":"Two ways in."};
var veil=document.createElement("div");veil.className="route-veil";veil.innerHTML='<span class="route-title"></span>';document.body.appendChild(veil);var veilTitle=veil.firstChild;

/* SPA-Lite Navigation: fetch + DOM swap with CSS transitions & route veil overdrop */
var main=document.getElementById("main")||document.querySelector("main")||document.body;
var isNavigating=false;

function navigate(url,addHistory){
var urlBase=url.split("#")[0].split("?")[0];
var currentBase=location.pathname.split("/").pop()||"index.html";
var targetBase=urlBase.split("/").pop()||"index.html";
if(isNavigating||targetBase===currentBase)return;
if(addHistory===undefined)addHistory=true;
isNavigating=true;

/* 1. Start fetch in background and show veil overdrop */
var fetchP=fetch(url).then(function(r){if(!r.ok)throw new Error("fetch failed");return r.text()});
if(!reduce){
veilTitle.textContent=titles[targetBase]||"Hackcessible";
veil.classList.remove("reveal","instant");
veil.classList.add("cover");
}

/* 2. Exit animation */
main.classList.add("page-exit");

/* 3. Wait for exit transition and fetch */
var transDone=new Promise(function(resolve){
var done=false;
function onEnd(ev){if(ev.target!==main||done)return;done=true;main.removeEventListener("transitionend",onEnd);resolve()}
main.addEventListener("transitionend",onEnd);
setTimeout(function(){if(!done){done=true;main.removeEventListener("transitionend",onEnd);resolve()}},500);
});

Promise.all([fetchP,transDone]).then(function(res){
var html=res[0];
var parser=new DOMParser();
var doc=parser.parseFromString(html,"text/html");
var newMain=doc.querySelector("main");
var newTitle=doc.querySelector("title");
if(newTitle)document.title=newTitle.innerText;
if(newMain){
main.innerHTML=newMain.innerHTML;
/* Re-run inline scripts */
var scripts=main.querySelectorAll("script");
scripts.forEach(function(old){var s=document.createElement("script");Array.from(old.attributes).forEach(function(a){s.setAttribute(a.name,a.value)});s.appendChild(document.createTextNode(old.innerHTML));old.parentNode.replaceChild(s,old)});
}
if(addHistory)history.pushState({url:url},"",url);
if(url.indexOf("#")===-1){window.scrollTo(0,0)}else{var hash=url.split("#")[1];setTimeout(function(){var el=document.getElementById(hash);if(el)el.scrollIntoView()},0)}

/* Enter animation with header pan-in & veil reveal */
main.classList.remove("page-exit");
main.classList.add("page-enter-start");
if(!reduce){
veil.classList.add("reveal");
setTimeout(function(){veil.classList.remove("cover","reveal")},600);
}

/* Update nav active link */
var curPath=location.pathname.split("/").pop()||"index.html";
if(curPath==="groups.html")curPath="cohorts.html";
document.querySelectorAll(".nav-link").forEach(function(a){var h=a.getAttribute("href");if(h===curPath){a.setAttribute("aria-current","page")}else{a.removeAttribute("aria-current")}});

/* Re-init page features */
initReveals();
initWordReveal();
initCohortToggle();
initContactToggle();
initPeopleCarousel();

/* Trigger entry transition */
void main.offsetHeight;
requestAnimationFrame(function(){main.classList.remove("page-enter-start");isNavigating=false});
}).catch(function(err){console.error("Navigation failed:",err);isNavigating=false;main.classList.remove("page-exit");if(!reduce)veil.classList.remove("cover","reveal");location.href=url});
}

/* Intercept internal link clicks */
document.addEventListener("click",function(e){
var a=e.target.closest("a");if(!a)return;
var href=a.getAttribute("href");
if(!href||href.indexOf("http")===0||href.charAt(0)==="#"||href.indexOf("mailto:")===0||href.indexOf("tel:")===0)return;
if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||e.button)return;
e.preventDefault();navigate(href);
});

/* Handle back/forward */
addEventListener("popstate",function(){
var url=location.pathname.split("/").pop()||"index.html";
if(location.search||location.hash)url+=location.search+location.hash;
navigate(url,false);
});
})();
