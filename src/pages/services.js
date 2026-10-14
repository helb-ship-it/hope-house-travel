import { getHeader, getFooter, bindHeader } from '../components/layout/header.js';
import { getHelpButton, bindHelpButton } from '../components/helpButton.js';

export function initServices(){
  const appEl=document.querySelector('#app');
  appEl.innerHTML=`
${getHeader('services')}
<div style="font-family:Inter,system-ui; background:#f8fbff; min-height:100vh; color:#0f2a5c;">
  <section style="background:white; border-bottom:1px solid #eef2f7; padding:50px 16px; text-align:center;">
    <div style="display:inline-block; background:#eff6ff; border:1px solid #dbeafe; padding:6px 12px; border-radius:999px; font-size:11px; font-weight:700; color:#2563eb;">Our Services</div>
    <h1 style="margin:12px 0 0; font-size:28px; font-weight:900;">End-to-End Travel Support</h1><p style="opacity:0.6; font-size:13px; margin-top:8px; max-width:600px; margin-left:auto; margin-right:auto;">From application to departure — we handle documents, staff assignment, tracking and support.</p>
  </section>
  <section style="max-width:1100px; margin:0 auto; padding:24px 16px; display:grid; grid-template-columns:repeat(3,1fr); gap:16px;">
    ${[
      {icon:'📋', title:'Visa Application Processing', desc:'We fill forms, check documents, prepare you for embassy interview.', list:['Work Permits','Study Visas','Tourist Visas','Family Sponsorship']},
      {icon:'📄', title:'Document Verification', desc:'Passport, education certificates, CV, photos — verified and uploaded.', list:['Passport Check','Education Verification','CV Review','Photo Specs']},
      {icon:'👥', title:'Staff Assignment', desc:'Auto-assign to staff with fewest clients. Your personal manager.', list:['Auto Assignment','WhatsApp Updates','County Tracking','Personal Manager']},
      {icon:'💳', title:'Payment Tracking', desc:'Pay via M-Pesa, we record and verify. Receipts in dashboard.', list:['M-Pesa Paybill','Receipts','Balance Tracking','Installments']},
      {icon:'📊', title:'Real Dashboard Tracking', desc:'Client dashboard shows Documents Pending → Completed.', list:['Live Status','Document Status','Staff Contact','History']},
      {icon:'💬', title:'24/7 Support', desc:'Call 0789 338 183, WhatsApp, office visit Hazina Towers 5F.', list:['Phone Support','WhatsApp Chat','Office Visit','Email Support']},
    ].map(s=>`
      <div style="background:white; border-radius:20px; border:1px solid #f1f5f9; padding:20px;">
        <div style="width:48px; height:48px; background:#eff6ff; border-radius:12px; display:grid; place-items:center; font-size:22px;">${s.icon}</div>
        <div style="font-weight:900; margin-top:12px; font-size:15px;">${s.title}</div>
        <div style="font-size:12px; opacity:0.7; margin-top:6px; line-height:1.6;">${s.desc}</div>
        <div style="margin-top:12px; display:flex; flex-direction:column; gap:6px;">${s.list.map(l=>`<div style="display:flex; gap:8px; font-size:11px;"><span style="color:#16a34a; font-weight:800;">✓</span><span>${l}</span></div>`).join('')}</div>
        <button class="svcApply" style="margin-top:14px; width:100%; background:#f1f5f9; border:none; padding:10px; border-radius:10px; font-size:11px; font-weight:700; cursor:pointer;">Apply Now →</button>
      </div>
    `).join('')}
  </section>
  <section style="max-width:1100px; margin:0 auto; padding:0 16px 40px;">
    <div style="background:linear-gradient(90deg,#0f2a5c,#1e40af); border-radius:20px; padding:24px; display:grid; grid-template-columns:1.2fr 0.8fr; align-items:center; color:white;">
      <div><h2 style="margin:0; font-size:20px; font-weight:900;">Ready to start?</h2><p style="opacity:0.8; font-size:12px; margin-top:6px;">Click Apply Now, fill 4 steps, get reference code.</p></div>
      <div style="text-align:right;"><button id="svcMainApply" style="background:white; color:#0f2a5c; border:none; padding:12px 20px; border-radius:999px; font-weight:800; font-size:12px; cursor:pointer;">Apply Now →</button></div>
    </div>
  </section>
</div>
${getFooter()}
${getHelpButton()}
`;
  setTimeout(()=>{
    bindHeader();
    bindHelpButton();
    document.querySelectorAll('.svcApply').forEach(b=>b.addEventListener('click', ()=>{ location.hash='#apply'; location.reload(); }));
    document.getElementById('svcMainApply')?.addEventListener('click', ()=>{ location.hash='#apply'; location.reload(); });
  }, 50);
}