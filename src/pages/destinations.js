import { getHeader, getFooter } from '../components/layout/header.js';
import { getHelpButton, bindHelpButton } from '../components/helpButton.js';
import { applyData } from '../state.js';
import { db } from '../config/firebase.js';
import { collection, getDocs } from 'firebase/firestore';

const DESTS=[
  {flag:'🇨🇦', name:'Canada', type:'Work & Study', desc:'Top destination for work permits, study visas, PR. High demand for healthcare, tech, trades.', jobs:'Nurses, Welders, Farm Workers, IT', color:'#ef4444'},
  {flag:'🇬🇧', name:'United Kingdom', type:'Work & Care', desc:'UK Care Worker visas, Skilled Worker, Student visas. Fast processing with our guidance.', jobs:'Caregivers, Nurses, Hospitality', color:'#2563eb'},
  {flag:'🇳🇴', name:'Norway', type:'Work Permit', desc:'High-paying jobs in fish factories, farms, cleaning. Schengen access.', jobs:'Fish Factory, Farm, Cleaning', color:'#7c3aed'},
  {flag:'🇺🇸', name:'USA', type:'Work & Study', desc:'J1, H2B, Student F1 visas. We prepare documents professionally.', jobs:'Hospitality, Teaching, Tech', color:'#f97316'},
  {flag:'🇦🇺', name:'Australia', type:'Skilled Migration', desc:'Subclass 482, 500. Australia needs skilled workers from Kenya.', jobs:'Construction, Aged Care, Mining', color:'#06b6d4'},
  {flag:'🌍', name:'Other Countries', type:'Europe & Gulf', desc:'Germany, Poland, Qatar, UAE, Saudi. We process according to embassy rules.', jobs:'Varies by country', color:'#64748b'},
];
export function initDestinations(){
  const appEl=document.querySelector('#app');
  appEl.innerHTML=`
${getHeader('destinations')}
<div style="font-family:Inter,system-ui; background:#f8fbff; min-height:100vh; color:#0f2a5c;">
  <section style="background:linear-gradient(90deg,#0f2a5c,#1e40af); color:white; padding:50px 16px; text-align:center;">
    <h1 style="margin:0; font-size:28px; font-weight:900;">Choose Your Destination</h1><p style="opacity:0.8; font-size:13px; margin-top:8px; max-width:600px; margin-left:auto; margin-right:auto;">Live client counts from Firestore. Click Apply — destination auto-fills.</p>
  </section>
  <section style="max-width:1200px; margin:0 auto; padding:24px 16px; display:grid; grid-template-columns:repeat(3,1fr); gap:16px;">
    ${DESTS.map(d=>`
      <div style="background:white; border-radius:20px; border:1px solid #f1f5f9; overflow:hidden; box-shadow:0 8px 24px rgba(0,0,0,0.04); display:flex; flex-direction:column;">
        <div style="height:8px; background:${d.color};"></div>
        <div style="padding:18px;">
          <div style="display:flex; gap:12px; align-items:center;"><div style="width:52px; height:52px; background:#f8fafc; border-radius:14px; display:grid; place-items:center; font-size:28px; border:1px solid #f1f5f9;">${d.flag}</div><div><div style="font-weight:900; font-size:16px;">${d.name}</div><div style="font-size:11px; background:#eff6ff; border:1px solid #dbeafe; display:inline-block; padding:2px 8px; border-radius:999px; margin-top:4px; color:#2563eb; font-weight:700;">${d.type}</div></div></div>
          <div style="font-size:12px; opacity:0.7; margin-top:12px; line-height:1.6;">${d.desc}</div>
          <div style="margin-top:12px; background:#f8fafc; border-radius:10px; padding:10px; font-size:11px;"><b>Popular Jobs:</b><br><span style="opacity:0.7;">${d.jobs}</span></div>
          <div style="margin-top:10px; display:flex; justify-content:space-between; font-size:10px; background:#eff6ff; padding:6px 10px; border-radius:999px; border:1px solid #dbeafe; color:#2563eb; font-weight:700;"><span id="count-${d.name}">Loading...</span><span>● Live</span></div>
          <button class="destApply" data-dest="${d.name}" style="margin-top:12px; width:100%; background:linear-gradient(90deg,#2563eb,#1e40af); color:white; border:none; padding:12px; border-radius:12px; font-weight:800; font-size:12px; cursor:pointer;">Apply for ${d.name} →</button>
        </div>
      </div>
    `).join('')}
  </section>
</div>
${getFooter()}
${getHelpButton()}
`;
  setTimeout(async ()=>{
    try{ const { bindHeader } = await import('../components/layout/header.js'); bindHeader(); }catch{}
    bindHelpButton();
    document.querySelectorAll('.destApply').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const dest=btn.getAttribute('data-dest');
        applyData.destination=dest;
        sessionStorage.setItem('applyDestination', dest);
        location.hash='#apply'; location.reload();
      });
    });
    try{
      const snap = await getDocs(collection(db,'applications'));
      const counts={};
      snap.forEach(doc=>{ const dest=doc.data().destination; if(dest) counts[dest]=(counts[dest]||0)+1; });
      DESTS.forEach(d=>{
        const el=document.getElementById('count-'+d.name);
        if(el) el.innerText = `${counts[d.name]||0} clients applying`;
      });
    }catch(e){
      DESTS.forEach(d=>{
        const el=document.getElementById('count-'+d.name);
        if(el) el.innerText='Be first! • Live tracking';
      });
    }
  }, 80);
}