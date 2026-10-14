import { getHeader, getFooter, bindHeader } from '../components/layout/header.js';
import { getHelpButton, bindHelpButton } from '../components/helpButton.js';

export function initHowItWorks(){
  const appEl=document.querySelector('#app');
  appEl.innerHTML=`
${getHeader('how')}
<div style="font-family:Inter,system-ui; background:#f8fbff; min-height:100vh; color:#0f2a5c;">
  <section style="background:white; padding:50px 16px; text-align:center; border-bottom:1px solid #eef2f7;">
    <h1 style="margin:0; font-size:28px; font-weight:900;">How It Works — 4 Simple Steps</h1><p style="opacity:0.6; font-size:13px; margin-top:8px;">Transparent process from application to visa outcome.</p>
  </section>
  <section style="max-width:1000px; margin:0 auto; padding:30px 16px;">
    <div style="position:relative;">
      <div style="position:absolute; left:50%; top:0; bottom:0; width:3px; background:linear-gradient(180deg,#2563eb,#16a34a,#f59e0b,#7c3aed); transform:translateX(-50%);"></div>
      ${[
        {step:'01', title:'Apply Now (Step 1-4)', desc:'Fill Applicant Details, Travel Details, Review, Confirmation. Auto-generates reference code.', icon:'📝', side:'left'},
        {step:'02', title:'Auto Staff Assignment', desc:'System finds staff with fewest clients and assigns your file. You get WhatsApp contact.', icon:'👥', side:'right'},
        {step:'03', title:'Document Upload & Verification', desc:'Upload passport, certificates, CV, photo. Staff verifies and marks Verified/Pending.', icon:'📄', side:'left'},
        {step:'04', title:'Payment & Processing', desc:'Pay via M-Pesa. Stages: Documents Pending → Under Review → Processing → Completed.', icon:'💳', side:'right'},
        {step:'05', title:'Embassy & Outcome', desc:'We submit to embassy. Embassy decides visa. Note: Agency stage is not visa guarantee.', icon:'✈️', side:'left'},
      ].map(s=>`
        <div style="display:grid; grid-template-columns:1fr 60px 1fr; gap:16px; align-items:center; margin-bottom:36px;">
          ${s.side==='left'? `<div style="background:white; border-radius:16px; padding:18px; border:1px solid #f1f5f9; text-align:right;"><div style="font-size:10px; opacity:0.5; font-weight:800;">STEP ${s.step}</div><div style="font-weight:900; margin-top:4px;">${s.title}</div><div style="font-size:12px; opacity:0.7; margin-top:6px;">${s.desc}</div></div><div style="display:grid; place-items:center;"><div style="width:48px; height:48px; background:#2563eb; color:white; border-radius:50%; display:grid; place-items:center; font-size:20px; border:4px solid white;">${s.icon}</div></div><div></div>` : `<div></div><div style="display:grid; place-items:center;"><div style="width:48px; height:48px; background:#16a34a; color:white; border-radius:50%; display:grid; place-items:center; font-size:20px; border:4px solid white;">${s.icon}</div></div><div style="background:white; border-radius:16px; padding:18px; border:1px solid #f1f5f9;"><div style="font-size:10px; opacity:0.5; font-weight:800;">STEP ${s.step}</div><div style="font-weight:900; margin-top:4px;">${s.title}</div><div style="font-size:12px; opacity:0.7; margin-top:6px;">${s.desc}</div></div>`}
        </div>
      `).join('')}
    </div>
  </section>
  <section style="max-width:900px; margin:0 auto; padding:0 16px 40px;">
    <div style="background:#eff6ff; border:1px solid #dbeafe; border-radius:16px; padding:16px; display:flex; gap:12px; font-size:12px;"><div style="width:28px; height:28px; background:#2563eb; color:white; border-radius:50%; display:grid; place-items:center;">ℹ️</div><div><b>Important:</b> Agency stage is not visa guarantee. Visa decisions by embassies.<br><br><button id="howApply" style="background:#2563eb; color:white; border:none; padding:10px 16px; border-radius:999px; font-weight:700; cursor:pointer;">Start Application →</button></div></div>
  </section>
</div>
${getFooter()}
${getHelpButton()}
`;
  setTimeout(()=>{ 
    bindHeader(); 
    bindHelpButton();
    document.getElementById('howApply')?.addEventListener('click', ()=>{ location.hash='#apply'; location.reload(); }); 
  }, 50);
}