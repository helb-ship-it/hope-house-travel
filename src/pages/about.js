import { getHeader, getFooter, bindHeader } from '../components/layout/header.js';
import { getHelpButton, bindHelpButton } from '../components/helpButton.js';

export function initAbout(){
  const appEl=document.querySelector('#app');
  appEl.innerHTML=`
${getHeader('about')}
<div style="font-family:Inter,system-ui; background:#f8fbff; min-height:100vh; color:#0f2a5c;">
  <section style="background:linear-gradient(90deg,#0f2a5c 0%, #1e40af 100%); color:white; padding:60px 16px;">
    <div style="max-width:1100px; margin:0 auto; display:grid; grid-template-columns:1.2fr 0.8fr; gap:30px; align-items:center;">
      <div><div style="background:rgba(255,255,255,0.1); display:inline-block; padding:6px 12px; border-radius:999px; font-size:11px;">About Hope House Travel</div><h1 style="margin:16px 0 0; font-size:32px; font-weight:900; line-height:1.2;">Empowering Your<br>Global Journey</h1><p style="margin:14px 0 0; opacity:0.8; font-size:13px; line-height:1.6;">Founded in Nairobi, we have helped hundreds of Kenyans achieve their dreams of working, studying and living abroad. Your journey is our priority.</p><div style="margin-top:20px; display:flex; gap:12px;"><div id="aboutContact" style="background:white; color:#0f2a5c; padding:10px 18px; border-radius:999px; font-weight:800; font-size:12px; cursor:pointer;">Contact Us →</div><div id="aboutServices" style="border:1px solid rgba(255,255,255,0.3); padding:10px 18px; border-radius:999px; font-size:12px; cursor:pointer;">Our Services</div></div></div>
      <div style="border-radius:20px; overflow:hidden;"><img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80" style="width:100%; height:320px; object-fit:cover; display:block;" /></div>
    </div>
  </section>
  <section style="max-width:1100px; margin:0 auto; padding:40px 16px; display:grid; grid-template-columns:repeat(3,1fr); gap:16px;">
    <div style="background:white; border-radius:16px; padding:20px; border:1px solid #f1f5f9;"><div style="width:44px; height:44px; background:#eff6ff; border-radius:12px; display:grid; place-items:center; font-size:20px;">🎯</div><div style="font-weight:800; margin-top:12px;">Our Mission</div><div style="font-size:12px; opacity:0.7; margin-top:6px; line-height:1.6;">To provide transparent, professional and affordable visa processing services that open global opportunities for every Kenyan.</div></div>
    <div style="background:white; border-radius:16px; padding:20px; border:1px solid #f1f5f9;"><div style="width:44px; height:44px; background:#f0fdf4; border-radius:12px; display:grid; place-items:center; font-size:20px;">👁️</div><div style="font-weight:800; margin-top:12px;">Our Vision</div><div style="font-size:12px; opacity:0.7; margin-top:6px; line-height:1.6;">To be East Africa's most trusted travel agency, known for integrity, success and putting clients first.</div></div>
    <div style="background:white; border-radius:16px; padding:20px; border:1px solid #f1f5f9;"><div style="width:44px; height:44px; background:#fef3c7; border-radius:12px; display:grid; place-items:center; font-size:20px;">🤝</div><div style="font-weight:800; margin-top:12px;">Our Values</div><div style="font-size:12px; opacity:0.7; margin-top:6px; line-height:1.6;">Integrity, Transparency, Professionalism, Client Success. We never guarantee visas — embassies decide, we prepare you best.</div></div>
  </section>
  <section style="max-width:1100px; margin:0 auto; padding:0 16px 40px; display:grid; grid-template-columns:0.9fr 1.1fr; gap:20px; align-items:center;">
    <div><img src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&q=80" style="width:100%; height:360px; object-fit:cover; border-radius:20px; display:block;" /></div>
    <div><h2 style="margin:0; font-size:22px; font-weight:900;">Why Choose Us?</h2><div style="margin-top:16px; display:flex; flex-direction:column; gap:12px; font-size:12px;">
      <div style="display:flex; gap:10px; background:white; padding:12px; border-radius:12px; border:1px solid #f1f5f9;"><div style="width:28px; height:28px; background:#dcfce7; border-radius:50%; display:grid; place-items:center;">✓</div><div><b>County-to-County Support</b><br><span style="opacity:0.6;">We track clients by County, Constituency, Ward — Bomet to Turkana.</span></div></div>
      <div style="display:flex; gap:10px; background:white; padding:12px; border-radius:12px; border:1px solid #f1f5f9;"><div style="width:28px; height:28px; background:#dbeafe; border-radius:50%; display:grid; place-items:center;">✓</div><div><b>Least-Loaded Staff Assignment</b><br><span style="opacity:0.6;">Auto-assigned to staff with fewest clients for fast service.</span></div></div>
      <div style="display:flex; gap:10px; background:white; padding:12px; border-radius:12px; border:1px solid #f1f5f9;"><div style="width:28px; height:28px; background:#f3e8ff; border-radius:50%; display:grid; place-items:center;">✓</div><div><b>Real Tracking Dashboard</b><br><span style="opacity:0.6;">Client, Staff, Admin dashboards with real Firestore data.</span></div></div>
    </div></div>
  </section>
</div>
${getFooter()}
${getHelpButton()}
`;
  setTimeout(()=>{ 
    bindHeader(); 
    bindHelpButton();
    document.getElementById('aboutContact')?.addEventListener('click', ()=>{ location.hash='#contact'; location.reload(); }); 
    document.getElementById('aboutServices')?.addEventListener('click', ()=>{ location.hash='#services'; location.reload(); }); 
  }, 50);
}