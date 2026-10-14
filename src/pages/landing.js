import { applyData } from '../state.js';
import { getHelpButton, bindHelpButton } from '../components/helpButton.js';

export function initLanding(){
  const appEl=document.querySelector('#app');

  appEl.innerHTML = `
<div style="font-family:Inter,system-ui,sans-serif; background:#f6fbff; color:#0f2a5c;">
  <header style="background:white; border-bottom:1px solid #eef2f7; position:sticky; top:0; z-index:100;">
    <div style="max-width:1320px; margin:auto; padding:10px 16px; display:flex; justify-content:space-between; align-items:center;">
      <div id="logoSecret" style="display:flex; gap:10px; align-items:center; cursor:pointer; user-select:none;" title="Click 5 times fast for admin">
        <div style="width:40px; height:40px; background:linear-gradient(135deg,#0ea5e9,#1e40af); border-radius:50%; display:grid; place-items:center; color:white; font-size:20px; border:2px solid #f1f5f9;">✈️</div>
        <div><div style="font-weight:900; font-size:15px; line-height:1;">Hope House Travel</div><div style="font-size:10px; opacity:0.6;">Your Journey, Our Priority</div></div>
      </div>
      <nav style="display:flex; gap:18px; font-size:12px; font-weight:600; align-items:center;">
        <a id="navHome" style="color:#2563eb; border-bottom:2px solid #2563eb; padding-bottom:4px; cursor:pointer;">Home</a>
        <a id="navAbout" style="opacity:0.7; cursor:pointer;">About Us</a>
        <a id="navDest" style="opacity:0.7; cursor:pointer;">Destinations</a>
        <a id="navServ" style="opacity:0.7; cursor:pointer;">Services</a>
        <a id="navHow" style="opacity:0.7; cursor:pointer;">How It Works</a>
        <a id="navContact" style="opacity:0.7; cursor:pointer;">Contact</a>
      </nav>
      <div style="display:flex; gap:12px; align-items:center;">
        <div style="display:flex; gap:6px; align-items:center; font-size:11px;"><span style="font-size:14px;">📞</span><div><div style="font-weight:800;">0789 338 183</div><div style="font-size:9px; opacity:0.6;">Call / WhatsApp</div></div></div>
        <button id="lpApplyTop" style="background:#2563eb; color:white; padding:9px 16px; border-radius:999px; font-size:11px; font-weight:800; border:none; cursor:pointer;">Apply Now →</button>
      </div>
    </div>
    <div id="secretBar" style="display:none; background:#070f20; color:white; padding:8px 16px; text-align:center; gap:10px; justify-content:center; font-size:11px;">
      <span style="opacity:0.7;">Secret Access Unlocked (5 clicks):</span>
      <button id="navClient" style="background:#f1f5f9; color:#0f2a5c; border:none; padding:6px 12px; border-radius:999px; font-weight:700; cursor:pointer;">Client Login</button>
      <button id="navStaff" style="background:#0f2a5c; color:white; border:1px solid #334155; padding:6px 12px; border-radius:999px; font-weight:700; cursor:pointer;">Staff Login</button>
      <button id="navAdmin" style="background:#f1f5f9; color:#0f2a5c; border:none; padding:6px 12px; border-radius:999px; font-weight:700; cursor:pointer;">Admin</button>
      <button id="closeSecret" style="background:transparent; color:white; border:1px solid rgba(255,255,255,0.2); padding:6px 10px; border-radius:999px; cursor:pointer;">✕</button>
    </div>
  </header>

  <section style="background:linear-gradient(90deg,#eef6ff 0%, #e0f0ff 60%, #ffffff 100%); position:relative; overflow:hidden;">
    <div style="max-width:1320px; margin:auto; display:grid; grid-template-columns:1.1fr 0.9fr; min-height:420px; align-items:center; padding:20px 16px; gap:16px;">
      <div>
        <div style="display:inline-block; border:1px solid #bfdbfe; background:white; padding:4px 10px; border-radius:999px; font-size:9px; font-weight:800; color:#2563eb;">VISA • TRAVEL • STUDY • WORK</div>
        <h1 style="font-size:38px; font-weight:900; line-height:1.05; margin:14px 0 12px;">Your Global Future<br><span style="color:#2563eb;">Starts Here</span></h1>
        <p style="font-size:13px; line-height:1.6; opacity:0.7; max-width:440px;">We help you process your visa applications for Canada, UK, Norway, USA, Australia and more. Professional, reliable and with you at every step.</p>
        <div style="display:flex; gap:10px; margin-top:18px;">
          <button class="lpApply" style="background:#2563eb; color:white; padding:11px 18px; border-radius:999px; font-size:12px; font-weight:800; border:none; cursor:pointer;">Apply Now →</button>
          <button id="watchStoryBtn" style="background:white; border:1px solid #bfdbfe; padding:11px 18px; border-radius:999px; font-size:12px; font-weight:700; color:#2563eb; cursor:pointer; display:flex; align-items:center; gap:6px;">▶ Watch Our Story</button>
        </div>
        <div style="display:flex; gap:18px; margin-top:18px; font-size:10px; font-weight:700; opacity:0.7;">
          <div style="display:flex; gap:6px; align-items:center;">🛡️ Trusted Agency</div>
          <div style="display:flex; gap:6px; align-items:center;">👥 Professional Support</div>
          <div style="display:flex; gap:6px; align-items:center;">📊 High Success Rate</div>
        </div>
      </div>
      <div style="position:relative; height:380px;">
        <div style="position:absolute; top:10px; right:20px; font-family:cursive; font-size:16px; line-height:1.2; text-align:right; color:#0f2a5c; transform:rotate(8deg); z-index:2; background:white; padding:8px 12px; border-radius:12px; box-shadow:0 4px 12px rgba(0,0,0,0.1);">New Country<br>New Opportunities<br>Better Future<div style="width:60px; height:3px; background:#f59e0b; margin-top:4px; margin-left:auto; border-radius:999px;"></div></div>
        <img src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=900&q=80&auto=format&fit=crop" alt="Plane" style="position:absolute; top:30px; left:0; width:70%; height:50%; object-fit:cover; border-radius:18px; border:2px solid white; box-shadow:0 8px 24px rgba(0,0,0,0.1); z-index:1;" />
        <img src="https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?w=900&q=80&auto=format&fit=crop" alt="Global cities" style="position:absolute; bottom:0; right:0; width:85%; height:62%; object-fit:cover; border-radius:18px; border:2px solid white; box-shadow:0 12px 32px rgba(0,0,0,0.15);" />
      </div>
    </div>
  </section>

  <section id="destSection" style="background:white; padding:36px 16px;">
    <div style="max-width:1320px; margin:auto;">
      <div style="display:flex; justify-content:space-between; align-items:flex-end;">
        <div><div style="display:flex; gap:6px; align-items:center; font-size:10px; font-weight:800; color:#2563eb;">✈️ POPULAR DESTINATIONS</div><h2 style="font-size:22px; font-weight:900; margin:6px 0;">Your Dream Destination Awaits</h2><p style="font-size:11px; opacity:0.6; max-width:360px;">Choose your preferred country and let us guide you through the entire visa application process.</p></div>
        <div id="viewAllDest" style="font-size:11px; color:#2563eb; font-weight:700; cursor:pointer;">View All Destinations →</div>
      </div>
      <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(160px,1fr)); gap:14px; margin-top:18px;">
        <div class="destCard" data-dest="Canada" style="background:white; border-radius:14px; overflow:hidden; border:1px solid #f1f5f9; box-shadow:0 8px 20px rgba(0,0,0,0.05); cursor:pointer;">
          <div style="position:relative; height:120px;"><img src="https://images.unsplash.com/photo-1517935706615-2717063c2225?w=400&h=200&fit=crop&q=80" alt="Canada" style="width:100%; height:100%; object-fit:cover; display:block;" loading="lazy" /><div style="position:absolute; bottom:-18px; left:50%; transform:translateX(-50%); width:36px; height:36px; border-radius:50%; background:white; box-shadow:0 4px 12px rgba(0,0,0,0.15); display:grid; place-items:center; font-size:20px; border:2px solid white;">🇨🇦</div></div>
          <div style="padding:26px 12px 12px; text-align:center;"><div style="font-weight:800; font-size:12px;">Canada</div><div style="font-size:9px; opacity:0.6; margin-top:2px;">Work • Study • Visit</div><button style="margin-top:10px; background:#eff6ff; border:1px solid #dbeafe; padding:6px 10px; border-radius:999px; font-size:10px; font-weight:700; color:#2563eb; width:100%;">Apply Now →</button></div>
        </div>
        <div class="destCard" data-dest="UK" style="background:white; border-radius:14px; overflow:hidden; border:1px solid #f1f5f9; box-shadow:0 8px 20px rgba(0,0,0,0.05); cursor:pointer;">
          <div style="position:relative; height:120px;"><img src="https://images.unsplash.com/photo-1529655683826-aba9b3e77383?w=400&h=200&fit=crop&q=80" alt="UK" style="width:100%; height:100%; object-fit:cover; display:block;" loading="lazy" /><div style="position:absolute; bottom:-18px; left:50%; transform:translateX(-50%); width:36px; height:36px; border-radius:50%; background:white; box-shadow:0 4px 12px rgba(0,0,0,0.15); display:grid; place-items:center; font-size:20px; border:2px solid white;">🇬🇧</div></div>
          <div style="padding:26px 12px 12px; text-align:center;"><div style="font-weight:800; font-size:12px;">UK</div><div style="font-size:9px; opacity:0.6; margin-top:2px;">Work • Study • Visit</div><button style="margin-top:10px; background:#eff6ff; border:1px solid #dbeafe; padding:6px 10px; border-radius:999px; font-size:10px; font-weight:700; color:#2563eb; width:100%;">Apply Now →</button></div>
        </div>
        <div class="destCard" data-dest="Norway" style="background:white; border-radius:14px; overflow:hidden; border:1px solid #f1f5f9; box-shadow:0 8px 20px rgba(0,0,0,0.05); cursor:pointer;">
          <div style="position:relative; height:120px;"><img src="https://images.unsplash.com/photo-1513519103176-e7853397f56d?w=400&h=200&fit=crop&q=80" alt="Norway" style="width:100%; height:100%; object-fit:cover; display:block;" loading="lazy" /><div style="position:absolute; bottom:-18px; left:50%; transform:translateX(-50%); width:36px; height:36px; border-radius:50%; background:white; box-shadow:0 4px 12px rgba(0,0,0,0.15); display:grid; place-items:center; font-size:20px; border:2px solid white;">🇳🇴</div></div>
          <div style="padding:26px 12px 12px; text-align:center;"><div style="font-weight:800; font-size:12px;">Norway</div><div style="font-size:9px; opacity:0.6; margin-top:2px;">Work • Study • Visit</div><button style="margin-top:10px; background:#eff6ff; border:1px solid #dbeafe; padding:6px 10px; border-radius:999px; font-size:10px; font-weight:700; color:#2563eb; width:100%;">Apply Now →</button></div>
        </div>
        <div class="destCard" data-dest="USA" style="background:white; border-radius:14px; overflow:hidden; border:1px solid #f1f5f9; box-shadow:0 8px 20px rgba(0,0,0,0.05); cursor:pointer;">
          <div style="position:relative; height:120px;"><img src="https://images.unsplash.com/photo-1485738422979-b5a0d60fdaf7?w=400&h=200&fit=crop&q=80" alt="USA" style="width:100%; height:100%; object-fit:cover; display:block;" loading="lazy" /><div style="position:absolute; bottom:-18px; left:50%; transform:translateX(-50%); width:36px; height:36px; border-radius:50%; background:white; box-shadow:0 4px 12px rgba(0,0,0,0.15); display:grid; place-items:center; font-size:20px; border:2px solid white;">🇺🇸</div></div>
          <div style="padding:26px 12px 12px; text-align:center;"><div style="font-weight:800; font-size:12px;">USA</div><div style="font-size:9px; opacity:0.6; margin-top:2px;">Work • Study • Visit</div><button style="margin-top:10px; background:#eff6ff; border:1px solid #dbeafe; padding:6px 10px; border-radius:999px; font-size:10px; font-weight:700; color:#2563eb; width:100%;">Apply Now →</button></div>
        </div>
        <div class="destCard" data-dest="Australia" style="background:white; border-radius:14px; overflow:hidden; border:1px solid #f1f5f9; box-shadow:0 8px 20px rgba(0,0,0,0.05); cursor:pointer;">
          <div style="position:relative; height:120px;"><img src="https://images.unsplash.com/photo-1523428096881-5bd79d043006?w=400&h=200&fit=crop&q=80" alt="Australia" style="width:100%; height:100%; object-fit:cover; display:block;" loading="lazy" /><div style="position:absolute; bottom:-18px; left:50%; transform:translateX(-50%); width:36px; height:36px; border-radius:50%; background:white; box-shadow:0 4px 12px rgba(0,0,0,0.15); display:grid; place-items:center; font-size:20px; border:2px solid white;">🇦🇺</div></div>
          <div style="padding:26px 12px 12px; text-align:center;"><div style="font-weight:800; font-size:12px;">Australia</div><div style="font-size:9px; opacity:0.6; margin-top:2px;">Work • Study • Visit</div><button style="margin-top:10px; background:#eff6ff; border:1px solid #dbeafe; padding:6px 10px; border-radius:999px; font-size:10px; font-weight:700; color:#2563eb; width:100%;">Apply Now →</button></div>
        </div>
        <div class="destCard" data-dest="Other Countries" style="background:white; border-radius:14px; overflow:hidden; border:1px solid #f1f5f9; box-shadow:0 8px 20px rgba(0,0,0,0.05); cursor:pointer;">
          <div style="position:relative; height:120px;"><img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=200&fit=crop&q=80" alt="Other Countries" style="width:100%; height:100%; object-fit:cover; display:block;" loading="lazy" /><div style="position:absolute; bottom:-18px; left:50%; transform:translateX(-50%); width:36px; height:36px; border-radius:50%; background:white; box-shadow:0 4px 12px rgba(0,0,0,0.15); display:grid; place-items:center; font-size:20px; border:2px solid white;">🌍</div></div>
          <div style="padding:26px 12px 12px; text-align:center;"><div style="font-weight:800; font-size:12px;">Other Countries</div><div style="font-size:9px; opacity:0.6; margin-top:2px;">Explore More</div><button style="margin-top:10px; background:#eff6ff; border:1px solid #dbeafe; padding:6px 10px; border-radius:999px; font-size:10px; font-weight:700; color:#2563eb; width:100%;">Apply Now →</button></div>
        </div>
      </div>
    </div>
  </section>

  <section style="background:#eef6ff; padding:32px 16px;">
    <div style="max-width:1320px; margin:auto; display:grid; grid-template-columns:1.2fr 1.8fr; gap:20px;">
      <div><div style="display:flex; gap:6px; align-items:center; font-size:10px; font-weight:800; color:#2563eb;">📋 WHY CHOOSE US</div><h2 style="font-size:20px; font-weight:900; margin:8px 0;">Trusted. Professional. Committed.</h2><p style="font-size:11px; opacity:0.7; line-height:1.6;">At Hope House Travel, we make your visa journey simple, safe and stress-free. Our experienced team is dedicated to helping you achieve your global dreams.</p></div>
      <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:12px;">
        <div style="background:white; border-radius:12px; padding:12px; border:1px solid #eef2f7;"><div style="width:28px; height:28px; background:#2563eb; border-radius:8px; display:grid; place-items:center; color:white;">👥</div><div style="font-weight:800; font-size:11px; margin-top:8px;">Expert Guidance</div><div style="font-size:10px; opacity:0.6; margin-top:4px;">Professional support at every step.</div></div>
        <div style="background:white; border-radius:12px; padding:12px; border:1px solid #eef2f7;"><div style="width:28px; height:28px; background:#2563eb; border-radius:8px; display:grid; place-items:center; color:white;">🛡️</div><div style="font-weight:800; font-size:11px; margin-top:8px;">Secure & Safe</div><div style="font-size:10px; opacity:0.6; margin-top:4px;">Highest security for documents.</div></div>
        <div style="background:white; border-radius:12px; padding:12px; border:1px solid #eef2f7;"><div style="width:28px; height:28px; background:#2563eb; border-radius:8px; display:grid; place-items:center; color:white;">⏰</div><div style="font-weight:800; font-size:11px; margin-top:8px;">Timely Updates</div><div style="font-size:10px; opacity:0.6; margin-top:4px;">Stay informed throughout.</div></div>
        <div style="background:white; border-radius:12px; padding:12px; border:1px solid #eef2f7;"><div style="width:28px; height:28px; background:#2563eb; border-radius:8px; display:grid; place-items:center; color:white;">✅</div><div style="font-weight:800; font-size:11px; margin-top:8px;">High Success Rate</div><div style="font-size:10px; opacity:0.6; margin-top:4px;">We work hard to get you closer to goals.</div></div>
        <div style="background:white; border-radius:12px; padding:12px; border:1px solid #eef2f7;"><div style="width:28px; height:28px; background:#2563eb; border-radius:8px; display:grid; place-items:center; color:white;">🎧</div><div style="font-weight:800; font-size:11px; margin-top:8px;">Dedicated Support</div><div style="font-size:10px; opacity:0.6; margin-top:4px;">Reach us anytime.</div></div>
        <div style="background:white; border-radius:12px; padding:12px; border:1px solid #eef2f7;"><div style="width:28px; height:28px; background:#2563eb; border-radius:8px; display:grid; place-items:center; color:white;">⭐</div><div style="font-weight:800; font-size:11px; margin-top:8px;">Affordable Packages</div><div style="font-size:10px; opacity:0.6; margin-top:4px;">Quality at competitive rates.</div></div>
      </div>
    </div>
  </section>

  <section style="max-width:1320px; margin:0 auto; padding:0 16px 20px;">
    <div style="background:linear-gradient(90deg,#0f2a5c 0%, #1e3a8a 70%, #0f2a5c 100%); border-radius:14px; display:grid; grid-template-columns:1.3fr 0.7fr; overflow:hidden; align-items:center;">
      <div style="padding:16px 20px; color:white; display:flex; gap:12px; align-items:center;">
        <div style="font-size:20px;">✈️</div>
        <div><div style="font-weight:800; font-size:14px;">Ready to Start Your Journey?</div><div style="font-size:10px; opacity:0.7; margin-top:2px;">Apply today and take the first step towards your brighter future.</div><button class="lpApply" style="margin-top:10px; background:#f59e0b; color:#0f2a5c; border:none; padding:7px 14px; border-radius:999px; font-size:10px; font-weight:800; cursor:pointer;">Apply Now →</button></div>
      </div>
      <div style="height:90px;"><img src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&q=80&auto=format&fit=crop" alt="Plane sunset" style="width:100%; height:100%; object-fit:cover; display:block;" loading="lazy" /></div>
    </div>
  </section>

  <section style="background:white; padding:24px 16px;">
    <div style="max-width:1320px; margin:auto; text-align:center;">
      <div style="font-size:10px; font-weight:800; color:#2563eb;">📋 CLIENT TESTIMONIALS</div><h2 style="font-size:18px; font-weight:900; margin:6px 0 16px;">What Our Clients Say</h2>
      <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:14px; text-align:left;">
        <div style="background:#f8fbff; border:1px solid #f1f5f9; border-radius:12px; padding:12px; display:flex; gap:10px;"><img src="https://i.pravatar.cc/100?img=11" style="width:40px; height:40px; border-radius:50%;" loading="lazy" /><div><div style="font-size:11px; line-height:1.5; opacity:0.8;">"Hope House Travel made my Canada visa process so easy. Highly recommend!"</div><div style="font-size:11px; font-weight:800; margin-top:6px;">David K.</div><div style="font-size:9px; opacity:0.6;">Canada</div></div></div>
        <div style="background:#f8fbff; border:1px solid #f1f5f9; border-radius:12px; padding:12px; display:flex; gap:10px;"><img src="https://i.pravatar.cc/100?img=32" style="width:40px; height:40px; border-radius:50%;" loading="lazy" /><div><div style="font-size:11px; line-height:1.5; opacity:0.8;">"I got my UK visa through Hope House Travel. Excellent service!"</div><div style="font-size:11px; font-weight:800; margin-top:6px;">Mary N.</div><div style="font-size:9px; opacity:0.6;">UK</div></div></div>
        <div style="background:#f8fbff; border:1px solid #f1f5f9; border-radius:12px; padding:12px; display:flex; gap:10px;"><img src="https://i.pravatar.cc/100?img=15" style="width:40px; height:40px; border-radius:50%;" loading="lazy" /><div><div style="font-size:11px; line-height:1.5; opacity:0.8;">"Supportive and professional. My Norway dream came true!"</div><div style="font-size:11px; font-weight:800; margin-top:6px;">James W.</div><div style="font-size:9px; opacity:0.6;">Norway</div></div></div>
      </div>
    </div>
  </section>

  <footer style="background:#070f20; color:rgba(255,255,255,0.7); padding:28px 16px;">
    <div style="max-width:1320px; margin:auto; display:grid; grid-template-columns:1.5fr 0.7fr 0.8fr 1fr; gap:20px;">
      <div><div style="display:flex; gap:8px; align-items:center;"><div style="width:28px; height:28px; background:linear-gradient(135deg,#0ea5e9,#2563eb); border-radius:50%; display:grid; place-items:center; color:white; font-size:14px;">✈️</div><div><div style="font-weight:800; color:white; font-size:13px;">Hope House Travel</div><div style="font-size:9px;">Your Journey, Our Priority</div></div></div><div style="font-size:10px; margin-top:10px; line-height:1.6;">Professional visa support for Canada, UK, Norway, USA, Australia and more.<br><br><span id="fAbout" style="cursor:pointer; text-decoration:underline;">About</span> • <span id="fDest" style="cursor:pointer; text-decoration:underline;">Destinations</span> • <span id="fServices" style="cursor:pointer; text-decoration:underline;">Services</span> • <span id="fHow" style="cursor:pointer; text-decoration:underline;">How It Works</span> • <span id="fContact" style="cursor:pointer; text-decoration:underline;">Contact</span></div></div>
      <div><div style="font-weight:800; color:white; font-size:11px; margin-bottom:8px;">Quick Links</div><div style="font-size:10px; line-height:2;"><div id="fHome" style="cursor:pointer;">Home</div><div id="fAbout2" style="cursor:pointer;">About Us</div><div id="fDest2" style="cursor:pointer;">Destinations</div><div id="fServ2" style="cursor:pointer;">Services</div><div id="fHow2" style="cursor:pointer;">How It Works</div><div id="fContact2" style="cursor:pointer;">Contact</div></div></div>
      <div><div style="font-weight:800; color:white; font-size:11px; margin-bottom:8px;">Contact Us</div><div style="font-size:10px; line-height:2;"><div>📞 0789 338 183</div><div>💬 Call or WhatsApp</div><div>📍 Hazina Towers 5F<br>Nairobi, Kenya</div><div>✉️ info@hopehousetravel.co.ke</div></div></div>
      <div style="text-align:right;"><div style="font-family:cursive; color:white; font-size:14px;">Your Journey,<br>Our Priority <span style="font-size:18px;">✈️</span><div style="width:60px; height:2px; background:#f59e0b; margin-left:auto; margin-top:4px;"></div></div><div style="font-size:9px; margin-top:20px;">© 2025 Hope House Travel. All rights reserved.</div></div>
    </div>
  </footer>

  <div id="storyModal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.85); z-index:9999; justify-content:center; align-items:center; padding:20px;">
    <div style="background:black; border-radius:16px; width:100%; max-width:800px; position:relative; overflow:hidden; border:1px solid #334155;">
      <button id="closeStory" style="position:absolute; top:10px; right:10px; background:rgba(255,255,255,0.95); border:none; width:34px; height:34px; border-radius:50%; font-weight:800; cursor:pointer; z-index:10; font-size:14px;">✕</button>
      <div style="aspect-ratio:16/9; width:100%; background:black;">
        <iframe id="youtubeFrame" width="100%" height="100%" style="border:none; width:100%; height:100%; aspect-ratio:16/9;" src="" allow="autoplay; fullscreen; encrypted-media" allowfullscreen></iframe>
      </div>
      <div style="padding:10px; background:#0f2a5c; color:white; font-size:11px; text-align:center;">Hope House Travel - Your Journey, Our Priority ✈️</div>
    </div>
  </div>
  ${getHelpButton()}

  <!-- FLOATING INSTALL APP BUTTON - MOVABLE -->
  <div id="installAppFloat" style="position:fixed; bottom:90px; right:16px; z-index:9998; cursor:grab; user-select:none; touch-action:none;">
    <div style="background:linear-gradient(135deg,#0f172a,#2563eb); color:white; padding:10px 14px; border-radius:999px; display:flex; gap:8px; align-items:center; box-shadow:0 8px 24px rgba(37,99,235,0.4), 0 0 0 4px rgba(255,255,255,0.8); font-size:11px; font-weight:800; border:2px solid white; animation:floatPulse 2s infinite;">
      <div style="width:28px; height:28px; background:white; border-radius:50%; display:grid; place-items:center; color:#2563eb; font-size:14px; flex-shrink:0;">📲</div>
      <div style="line-height:1.1;"><div>Install App</div><div style="font-size:8px; opacity:0.8; font-weight:400;">Drag me anywhere</div></div>
      <div id="closeInstallFloat" style="margin-left:4px; width:20px; height:20px; background:rgba(255,255,255,0.2); border-radius:50%; display:grid; place-items:center; font-size:10px; cursor:pointer;">✕</div>
    </div>
  </div>
  <style>
    @keyframes floatPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
    #installAppFloat.dragging{cursor:grabbing!important; opacity:0.9; transform:scale(1.1); z-index:10000!important;}
    #installAppFloat.hiding{transform:translateX(150%); transition:transform 0.3s ease;}
  </style>
</div>
  `;

  const go = (hash)=>{ if(window.navigateTo){ window.navigateTo(hash); } else { location.hash=hash; location.reload(); } };

  document.getElementById('navHome').onclick=()=>{ if(window.goHome) window.goHome(); else { location.hash=''; location.reload(); } };
  document.getElementById('navAbout').onclick=()=>go('#about');
  document.getElementById('navDest').onclick=()=>go('#destinations');
  document.getElementById('navServ').onclick=()=>go('#services');
  document.getElementById('navHow').onclick=()=>go('#how');
  document.getElementById('navContact').onclick=()=>go('#contact');
  document.getElementById('viewAllDest').onclick=()=>go('#destinations');

  ['fAbout','fAbout2'].forEach(id=>document.getElementById(id)?.addEventListener('click', ()=>go('#about')));
  ['fDest','fDest2'].forEach(id=>document.getElementById(id)?.addEventListener('click', ()=>go('#destinations')));
  ['fServices','fServ2'].forEach(id=>document.getElementById(id)?.addEventListener('click', ()=>go('#services')));
  ['fHow','fHow2'].forEach(id=>document.getElementById(id)?.addEventListener('click', ()=>go('#how')));
  ['fContact','fContact2'].forEach(id=>document.getElementById(id)?.addEventListener('click', ()=>go('#contact')));
  document.getElementById('fHome')?.addEventListener('click', ()=>{ if(window.goHome) window.goHome(); else { location.hash=''; location.reload(); } });

  let clickCount = 0; let clickTimer = null;
  const logo = document.getElementById('logoSecret');
  const secretBar = document.getElementById('secretBar');
  logo.onclick = ()=>{
    clickCount++;
    if(clickTimer) clearTimeout(clickTimer);
    clickTimer = setTimeout(()=>{ clickCount=0; }, 3000);
    if(clickCount>=5){ secretBar.style.display='flex'; clickCount=0; if(navigator.vibrate) navigator.vibrate(200); }
  };
  document.getElementById('closeSecret').onclick=()=>{ secretBar.style.display='none'; clickCount=0; };
  document.getElementById('navClient').onclick=()=>{ sessionStorage.setItem('loginTab','client'); go('#login'); };
  document.getElementById('navStaff').onclick=()=>{ sessionStorage.setItem('loginTab','staff'); go('#login'); };
  document.getElementById('navAdmin').onclick=()=>{ sessionStorage.setItem('loginTab','admin'); go('#login'); };

  const openApply=(dest='')=>{
    applyData.destination=dest;
    sessionStorage.setItem('applyDestination', dest);
    go('#apply');
  };
  document.getElementById('lpApplyTop').onclick=()=>openApply('');
  document.querySelectorAll('.lpApply').forEach(b=>b.addEventListener('click', ()=>openApply('')));
  document.querySelectorAll('.destCard').forEach(card=>{
    card.addEventListener('click', function(){ openApply(this.getAttribute('data-dest')); });
  });

  const modal=document.getElementById('storyModal');
  const frame=document.getElementById('youtubeFrame');
  const youtubeLink = "https://www.youtube.com/embed/ysz5S6PUM-U?autoplay=1&rel=0";
  document.getElementById('watchStoryBtn').onclick=()=>{
    frame.src=youtubeLink;
    modal.style.display='flex';
    document.body.style.overflow='hidden';
  };
  const closeModal=()=>{
    frame.src='';
    modal.style.display='none';
    document.body.style.overflow='';
  };
  document.getElementById('closeStory').onclick=closeModal;
  modal.onclick=(e)=>{ if(e.target===modal) closeModal(); };

  bindHelpButton();

  // ===== FLOATING INSTALL APP LOGIC - MOVABLE + PWA =====
  const floatEl = document.getElementById('installAppFloat');
  const closeBtn = document.getElementById('closeInstallFloat');
  let deferredPrompt = null;
  let isDragging = false, startX, startY, initialLeft, initialTop;

  // Restore position
  const savedPos = JSON.parse(localStorage.getItem('hht_install_float_pos')||'null');
  if(savedPos){
    floatEl.style.left = savedPos.left + 'px';
    floatEl.style.top = savedPos.top + 'px';
    floatEl.style.right = 'auto';
    floatEl.style.bottom = 'auto';
  }

  // Check if already installed or dismissed
  if(window.matchMedia('(display-mode: standalone)').matches || localStorage.getItem('hht_install_dismissed')){
    floatEl.style.display='none';
  }

  closeBtn.onclick = (e)=>{
    e.stopPropagation();
    floatEl.classList.add('hiding');
    setTimeout(()=>{ floatEl.style.display='none'; },300);
    localStorage.setItem('hht_install_dismissed','1');
  };

  // PWA install prompt capture
  window.addEventListener('beforeinstallprompt', (e)=>{
    e.preventDefault();
    deferredPrompt = e;
    floatEl.style.display='block';
    floatEl.classList.remove('hiding');
  });

  // Click to install
  floatEl.addEventListener('click', async (e)=>{
    if(e.target.id==='closeInstallFloat') return;
    if(isDragging) { isDragging=false; return; }
    if(deferredPrompt){
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if(choice.outcome==='accepted'){
        floatEl.style.display='none';
        localStorage.setItem('hht_install_dismissed','1');
      }
      deferredPrompt=null;
    } else {
      // Fallback instructions - same design
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      if(isIOS){
        alert('📲 Install App on iPhone:\\n1. Tap Share button (square with arrow) at bottom\\n2. Tap "Add to Home Screen"\\n3. Tap Add → App will be on your home screen!');
      } else {
        alert('📲 Install App:\\n1. Tap browser menu (3 dots top right)\\n2. Tap "Install app" or "Add to Home Screen"\\n3. App will install like normal app!');
      }
    }
  });

  // DRAG LOGIC - mouse + touch
  const startDrag = (clientX, clientY) => {
    isDragging=false;
    const rect = floatEl.getBoundingClientRect();
    startX = clientX;
    startY = clientY;
    initialLeft = rect.left;
    initialTop = rect.top;
    floatEl.classList.add('dragging');
    floatEl.style.right='auto';
    floatEl.style.bottom='auto';
  };
  const doDrag = (clientX, clientY) => {
    const dx = clientX - startX;
    const dy = clientY - startY;
    if(Math.abs(dx)>5 || Math.abs(dy)>5) isDragging=true;
    let newLeft = initialLeft + dx;
    let newTop = initialTop + dy;
    // Keep inside viewport
    const maxLeft = window.innerWidth - floatEl.offsetWidth - 10;
    const maxTop = window.innerHeight - floatEl.offsetHeight - 10;
    newLeft = Math.max(10, Math.min(maxLeft, newLeft));
    newTop = Math.max(10, Math.min(maxTop, newTop));
    floatEl.style.left = newLeft + 'px';
    floatEl.style.top = newTop + 'px';
  };
  const endDrag = () => {
    if(!floatEl.classList.contains('dragging')) return;
    floatEl.classList.remove('dragging');
    // Save position
    const rect = floatEl.getBoundingClientRect();
    localStorage.setItem('hht_install_float_pos', JSON.stringify({left:rect.left, top:rect.top}));
    setTimeout(()=>{ isDragging=false; },100);
  };

  floatEl.addEventListener('mousedown', (e)=>{
    if(e.target.id==='closeInstallFloat') return;
    startDrag(e.clientX, e.clientY);
    const onMouseMove = (ev)=>doDrag(ev.clientX, ev.clientY);
    const onMouseUp = ()=>{
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      endDrag();
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  floatEl.addEventListener('touchstart', (e)=>{
    if(e.target.id==='closeInstallFloat') return;
    const t = e.touches[0];
    startDrag(t.clientX, t.clientY);
  }, {passive:false});

  floatEl.addEventListener('touchmove', (e)=>{
    const t = e.touches[0];
    doDrag(t.clientX, t.clientY);
    e.preventDefault();
  }, {passive:false});

  floatEl.addEventListener('touchend', endDrag);

  // Auto show after 3 sec if not dismissed (even without prompt)
  setTimeout(()=>{
    if(!localStorage.getItem('hht_install_dismissed') && floatEl.style.display!=='none'){
      floatEl.style.display='block';
      floatEl.style.animation='floatPulse 2s infinite';
    }
  },3000);
}