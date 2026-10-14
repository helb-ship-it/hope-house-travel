export function getHeader(active='home'){
  return `
<header style="background:white; border-bottom:1px solid #eef2f7; position:sticky; top:0; z-index:100; font-family:Inter,system-ui;">
  <div style="max-width:1200px; margin:0 auto; padding:12px 16px; display:flex; justify-content:space-between; align-items:center;">
    <div style="display:flex; gap:10px; align-items:center; cursor:pointer;" onclick="location.hash=''; location.reload()">
      <div style="width:40px; height:40px; background:linear-gradient(135deg,#0ea5e9,#2563eb); border-radius:12px; display:grid; place-items:center; color:white; font-size:20px;">✈️</div>
      <div><div style="font-weight:900; font-size:15px; color:#0f2a5c;">Hope House Travel</div><div style="font-size:10px; opacity:0.6;">Your Journey, Our Priority</div></div>
    </div>
    <nav style="display:flex; gap:18px; font-size:12px; font-weight:600; align-items:center;">
      <a href="#" onclick="location.hash=''; location.reload()" style="text-decoration:none; color:${active==='home'?'#2563eb':'#64748b'}; font-weight:${active==='home'?'800':'600'};">Home</a>
      <a href="#about" style="text-decoration:none; color:${active==='about'?'#2563eb':'#64748b'}; font-weight:${active==='about'?'800':'600'};">About Us</a>
      <a href="#destinations" style="text-decoration:none; color:${active==='destinations'?'#2563eb':'#64748b'}; font-weight:${active==='destinations'?'800':'600'};">Destinations</a>
      <a href="#services" style="text-decoration:none; color:${active==='services'?'#2563eb':'#64748b'}; font-weight:${active==='services'?'800':'600'};">Services</a>
      <a href="#how" style="text-decoration:none; color:${active==='how'?'#2563eb':'#64748b'}; font-weight:${active==='how'?'800':'600'};">How It Works</a>
      <a href="#contact" style="text-decoration:none; color:${active==='contact'?'#2563eb':'#64748b'}; font-weight:${active==='contact'?'800':'600'};">Contact</a>
    </nav>
    <div style="display:flex; gap:8px;">
      <button onclick="location.hash='#login'; sessionStorage.setItem('loginTab','client'); location.reload()" style="background:#f1f5f9; border:none; padding:8px 14px; border-radius:999px; font-size:11px; font-weight:700; cursor:pointer;">Login</button>
      <button onclick="location.hash='#apply'; location.reload()" style="background:linear-gradient(90deg,#2563eb,#1e40af); color:white; border:none; padding:8px 16px; border-radius:999px; font-size:11px; font-weight:800; cursor:pointer;">Apply Now</button>
    </div>
  </div>
</header>`;
}

export function getFooter(){
  return `
<footer style="background:#0a1931; color:white; padding:24px 16px; margin-top:40px; font-family:Inter,system-ui;">
  <div style="max-width:1200px; margin:0 auto; display:grid; grid-template-columns:1.5fr 1fr 1fr 1fr; gap:20px;">
    <div><div style="display:flex; gap:8px; align-items:center;"><div style="width:36px; height:36px; background:linear-gradient(135deg,#f59e0b,#0ea5e9); border-radius:50%; display:grid; place-items:center;">✈️</div><div style="font-weight:900;">Hope House Travel</div></div><div style="font-size:11px; opacity:0.6; margin-top:8px; line-height:1.6;">Your Journey, Our Priority. We process visa applications for Canada, UK, Norway, USA, Australia and more.<br><br>📍 Hazina Towers 5F, Nairobi<br>📞 0789 338 183</div></div>
    <div><div style="font-weight:800; font-size:12px;">Quick Links</div><div style="font-size:11px; opacity:0.7; margin-top:10px; line-height:2;"><a href="#about" style="color:white; text-decoration:none;">About Us</a><br><a href="#destinations" style="color:white; text-decoration:none;">Destinations</a><br><a href="#services" style="color:white; text-decoration:none;">Services</a><br><a href="#how" style="color:white; text-decoration:none;">How It Works</a></div></div>
    <div><div style="font-weight:800; font-size:12px;">Destinations</div><div style="font-size:11px; opacity:0.7; margin-top:10px; line-height:2;">🇨🇦 Canada<br>🇬🇧 UK<br>🇳🇴 Norway<br>🇺🇸 USA<br>🇦🇺 Australia</div></div>
    <div><div style="font-weight:800; font-size:12px;">Contact</div><div style="font-size:11px; opacity:0.7; margin-top:10px; line-height:2;">📞 0789 338 183<br>✉️ info@hopehousetravel.co.ke<br>🕘 Mon-Sat 8am-6pm</div></div>
  </div>
  <div style="max-width:1200px; margin:20px auto 0; border-top:1px solid rgba(255,255,255,0.1); padding-top:12px; display:flex; justify-content:space-between; font-size:10px; opacity:0.5;"><div>© 2025 Hope House Travel. All rights reserved.</div><div>Secure • Trusted • Professional</div></div>
</footer>`;
}