document.documentElement.classList.add("js");
var WA_NUMBER="13052062675";
var WA_TEXT="Hola Milton, quiero información sobre sus servicios de IA, páginas web y SEO";
var WA_URL="https://wa.me/"+WA_NUMBER+"?text="+encodeURIComponent(WA_TEXT);
document.querySelectorAll("[data-wa]").forEach(function(a){a.href=WA_URL});
document.querySelectorAll("[data-qr]").forEach(function(el){
  if(window.QRCode)new QRCode(el,{text:WA_URL,width:+el.dataset.qr,height:+el.dataset.qr,correctLevel:QRCode.CorrectLevel.M});
});
var nav=document.getElementById("nav");
function onScroll(){nav.classList.toggle("stuck",scrollY>8)}
addEventListener("scroll",onScroll,{passive:true});onScroll();
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}})},{threshold:.1});
document.querySelectorAll(".rv").forEach(function(el){io.observe(el)});
