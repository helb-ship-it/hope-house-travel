export function getHeader(active='home'){
  const c = (k)=> active===k? '#2563eb' : '#64748b';
  return `
<header style="background:white; border-bottom:1px solid #eef2f7; position:sticky; top:0; z-index:100; font-family:Inter,system-ui;">
  <div style="max-width:1200px; margin:0 auto; padding:12px 16px; display:flex; justify-content:space-between; align-items:center;">
    <div style="display:flex; gap:10px; align-items:center; cursor:pointer;" onclick="window.goHome()">
      <div style="width:40px; height:40px; background:linear-gradient(135deg,#0ea5e9,#2563eb); border-radius:12px; display:grid; place-items:center; color:white;">✈️</div>
      <div><div style="font-weight:900; font-size:15px; color:#0f2a5c;">Hope House Travel</div><div style="font-size:10px; opacity:0.6;">Your Journey, Our Priority</div></div>
    </div>
    <nav style="display:flex; gap:18px; font-size:12px; font-weight:700;">
      <span onclick="window.goHome()" style="cursor:pointer; color:${c('home')};">Home</span>
      <span onclick="window.navigateTo('#about')" style="cursor:pointer; color:${c('about')};">About Us</span>
      <span onclick="window.navigateTo('#destinations')" style="cursor:pointer; color:${c('destinations')};">Destinations</span>
      <span onclick="window.navigateTo('#services')" style="cursor:pointer; color:${c('services')};">Services</span>
      <span onclick="window.navigateTo('#how')" style="cursor:pointer; color:${c('how')};">How It Works</span>
      <span onclick="window.navigateTo('#contact')" style="cursor:pointer; color:${c('contact')};">Contact</span>
    </nav>
    <div style="display:flex; gap:8px;">
      <button onclick="sessionStorage.setItem('loginTab','client'); window.navigateTo('#login')" style="background:#f1f5f9; border:none; padding:8px 14px; border-radius:999px; font-size:11px; font-weight:700; cursor:pointer;">Login</button>
      <button onclick="window.navigateTo('#apply')" style="background:linear-gradient(90deg,#2563eb,#1e40af); color:white; border:none; padding:8px 16px; border-radius:999px; font-size:11px; font-weight:800; cursor:pointer;">Apply Now</button>
    </div>
  </div>
</header>`;
}

export function getFooter(){
  return `
<footer style="background:#0a1931; color:white; padding:24px 16px; margin-top:40px; font-family:Inter;">
  <div style="max-width:1200px; margin:0 auto; display:grid; grid-template-columns:1.5fr 1fr 1fr 1fr; gap:20px;">
    <div><div style="font-weight:900;">Hope House Travel</div><div style="font-size:11px; opacity:0.6; margin-top:8px;">Hazina Towers 5F, Nairobi<br>0789 338 183</div></div>
    <div><div style="font-weight:800; font-size:12px;">Links</div><div style="font-size:11px; opacity:0.7; margin-top:8px; line-height:2;">
      <div onclick="window.navigateTo('#about')" style="cursor:pointer;">About Us</div>
      <div onclick="window.navigateTo('#destinations')" style="cursor:pointer;">Destinations</div>
      <div onclick="window.navigateTo('#services')" style="cursor:pointer;">Services</div>
      <div onclick="window.navigateTo('#how')" style="cursor:pointer;">How It Works</div>
    </div></div>
    <div><div style="font-weight:800; font-size:12px;">Destinations</div><div style="font-size:11px; opacity:0.7; margin-top:8px;">Canada<br>UK<br>Norway<br>USA<br>Australia</div></div>
    <div><div style="font-weight:800; font-size:12px;">Contact</div><div style="font-size:11px; opacity:0.7; margin-top:8px;">0789 338 183<br>info@hopehousetravel.co.ke</div></div>
  </div>
  <div style="text-align:center; font-size:10px; opacity:0.4; margin-top:20px; border-top:1px solid rgba(255,255,255,0.1); padding-top:12px;">© 2025 Hope House Travel</div>
</footer>`;
}

// Keep for backward compatibility, but not needed now
export function bindHeader(){}