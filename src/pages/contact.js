import { getHeader, getFooter } from '../components/layout/header.js';
import { getHelpButton, bindHelpButton } from '../components/helpButton.js';
import { db } from '../config/firebase.js';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export function initContact(){
  const appEl=document.querySelector('#app');
  appEl.innerHTML=`
${getHeader('contact')}
<div style="font-family:Inter,system-ui; background:#f8fbff; min-height:100vh; color:#0f2a5c;">
  <section style="background:linear-gradient(90deg,#0f2a5c,#1e40af); color:white; padding:50px 16px;">
    <div style="max-width:1100px; margin:0 auto; display:grid; grid-template-columns:1.2fr 0.8fr; gap:20px; align-items:center;">
      <div><h1 style="margin:0; font-size:28px; font-weight:900;">Contact Us</h1><p style="opacity:0.8; font-size:13px; margin-top:8px; line-height:1.6;">Visit Hazina Towers 5th Floor, Nairobi. Call or WhatsApp 0789 338 183.</p><div style="margin-top:18px; display:flex; gap:10px;"><button id="waBtn" style="background:#25D366; color:white; border:none; padding:10px 18px; border-radius:999px; font-weight:800; font-size:12px; cursor:pointer;">WhatsApp Us</button><button id="callBtn" style="background:white; color:#0f2a5c; border:none; padding:10px 18px; border-radius:999px; font-weight:800; font-size:12px; cursor:pointer;">Call Now</button></div></div>
      <div style="background:white; border-radius:16px; padding:16px; color:#0f2a5c;"><div style="font-weight:800;">Office Hours</div><div style="font-size:12px; opacity:0.7; margin-top:8px; line-height:1.8;">Mon-Fri: 8am-6pm<br>Saturday: 8am-4pm<br>Sunday: Closed<br><br>📍 Hazina Towers 5F<br>📞 0789 338 183<br>✉️ info@hopehousetravel.co.ke</div></div>
    </div>
  </section>
  <section style="max-width:1100px; margin:0 auto; padding:24px 16px; display:grid; grid-template-columns:1.1fr 0.9fr; gap:20px;">
    <div style="background:white; border-radius:20px; padding:22px; border:1px solid #f1f5f9;">
      <h2 style="margin:0; font-size:18px; font-weight:900;">Send us a message</h2>
      <div style="margin-top:16px; display:flex; flex-direction:column; gap:12px;">
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;"><input id="cName" placeholder="Full Name *" style="padding:12px; border:1px solid #e2e8f0; border-radius:12px; font-size:12px;" /><input id="cPhone" placeholder="Phone *" style="padding:12px; border:1px solid #e2e8f0; border-radius:12px; font-size:12px;" /></div>
        <input id="cEmail" placeholder="Email" style="padding:12px; border:1px solid #e2e8f0; border-radius:12px; font-size:12px;" />
        <input id="cSubject" placeholder="Subject *" style="padding:12px; border:1px solid #e2e8f0; border-radius:12px; font-size:12px;" />
        <textarea id="cMsg" placeholder="Your message *" style="padding:12px; border:1px solid #e2e8f0; border-radius:12px; font-size:12px; min-height:120px;"></textarea>
        <button id="sendMsg" style="background:linear-gradient(90deg,#2563eb,#1e40af); color:white; border:none; padding:14px; border-radius:12px; font-weight:800; font-size:12px; cursor:pointer;">Send Message →</button>
        <div id="cStatus" style="display:none; padding:10px; border-radius:10px; font-size:11px;"></div>
      </div>
    </div>
    <div style="display:flex; flex-direction:column; gap:16px;">
      <div style="background:white; border-radius:16px; padding:18px; border:1px solid #f1f5f9;"><div style="display:flex; gap:12px; align-items:center;"><div style="width:40px; height:40px; background:#dcfce7; border-radius:10px; display:grid; place-items:center;">💬</div><div><div style="font-weight:800; font-size:13px;">Call or WhatsApp</div><div style="font-size:11px; opacity:0.6;">0789 338 183</div></div></div><div style="margin-top:10px; display:flex; gap:8px;"><button id="wa2" style="flex:1; background:#25D366; color:white; border:none; padding:10px; border-radius:10px; font-weight:700; font-size:11px; cursor:pointer;">WhatsApp</button><button id="call2" style="flex:1; background:#f1f5f9; border:none; padding:10px; border-radius:10px; font-weight:700; font-size:11px; cursor:pointer;">Call</button></div></div>
      <div style="background:white; border-radius:16px; padding:18px; border:1px solid #f1f5f9;"><div style="font-weight:800; font-size:13px;">Need live help?</div><div style="font-size:11px; opacity:0.7; margin-top:6px;">Chat with our agent now</div><button id="openChat" style="margin-top:10px; width:100%; background:#2563eb; color:white; border:none; padding:10px; border-radius:10px; font-weight:700; font-size:11px; cursor:pointer;">Open Live Chat 💬</button></div>
    </div>
  </section>
</div>
${getFooter()}
${getHelpButton()}
`;
  setTimeout(()=>{
    try{ import('../components/layout/header.js').then(m=>m.bindHeader()); }catch{}
    bindHelpButton();
    const openWA = ()=>window.open('https://wa.me/254789338183','_blank');
    const call = ()=>window.location.href='tel:+254789338183';
    document.getElementById('waBtn')?.addEventListener('click', openWA);
    document.getElementById('callBtn')?.addEventListener('click', call);
    document.getElementById('wa2')?.addEventListener('click', openWA);
    document.getElementById('call2')?.addEventListener('click', call);
    document.getElementById('openChat')?.addEventListener('click', ()=>{ location.hash='#messenger'; location.reload(); });
    document.getElementById('sendMsg')?.addEventListener('click', async ()=>{
      const name=document.getElementById('cName').value.trim();
      const phone=document.getElementById('cPhone').value.trim();
      const email=document.getElementById('cEmail').value.trim();
      const subject=document.getElementById('cSubject').value.trim();
      const msg=document.getElementById('cMsg').value.trim();
      const st=document.getElementById('cStatus');
      if(!name||!phone||!subject||!msg){ st.style.display='block'; st.style.background='#fee2e2'; st.innerText='Fill all * fields'; return; }
      st.style.display='block'; st.style.background='#eff6ff'; st.innerText='Saving...';
      try{
        await addDoc(collection(db,'contacts'), { name, phone, email, subject, message:msg, status:'new', createdAt:serverTimestamp() });
        st.style.background='#dcfce7'; st.innerHTML='✅ Saved to contacts! Opening WhatsApp...';
        const text=`Hi Hope House, I am ${name}, Phone ${phone}, Subject: ${subject}, Message: ${msg}`;
        setTimeout(()=>{ window.open('https://wa.me/254789338183?text='+encodeURIComponent(text), '_blank'); }, 800);
        document.getElementById('cName').value=''; document.getElementById('cPhone').value=''; document.getElementById('cEmail').value=''; document.getElementById('cSubject').value=''; document.getElementById('cMsg').value='';
      }catch(e){ st.style.background='#fee2e2'; st.innerText='Error: '+e.message; }
    });
  }, 80);
}