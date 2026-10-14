import { db } from '../config/firebase.js';
import { collection, getDocs, query, where } from 'firebase/firestore';

export function initLoginPage(){
  const appEl=document.querySelector('#app');
  const tab = sessionStorage.getItem('loginTab') || 'client';

  appEl.innerHTML = `
<div style="min-height:100vh; background:#f0f7ff; font-family:Inter,system-ui; display:grid; place-items:center; padding:16px;">
  <div style="background:white; border-radius:20px; width:100%; max-width:420px; border:1px solid #eef2f7; box-shadow:0 20px 40px rgba(0,0,0,0.08); overflow:hidden;">
    <div style="padding:22px 22px 0; display:flex; gap:10px; align-items:center;"><div style="width:44px; height:44px; background:linear-gradient(135deg,#0ea5e9,#2563eb); border-radius:12px; display:grid; place-items:center; color:white; font-size:22px;">✈️</div><div><div style="font-weight:900; font-size:16px;">Hope House Travel</div><div style="font-size:11px; opacity:0.6;">Secure Login Portal</div></div><div style="margin-left:auto; cursor:pointer; background:#f1f5f9; padding:6px 12px; border-radius:999px; font-size:11px; font-weight:700;" id="backHome">← Home</div></div>

    <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:8px; padding:16px;">
      <button id="tabClient" style="padding:10px; border-radius:10px; border:1px solid ${tab==='client'?'#2563eb':'#f1f5f9'}; background:${tab==='client'?'#eff6ff':'#f8fafc'}; font-weight:800; font-size:12px; cursor:pointer; color:${tab==='client'?'#2563eb':'#64748b'};">👤 Client</button>
      <button id="tabStaff" style="padding:10px; border-radius:10px; border:1px solid ${tab==='staff'?'#16a34a':'#f1f5f9'}; background:${tab==='staff'?'#f0fdf4':'#f8fafc'}; font-weight:800; font-size:12px; cursor:pointer; color:${tab==='staff'?'#15803d':'#64748b'};">🛡️ Staff</button>
      <button id="tabAdmin" style="padding:10px; border-radius:10px; border:1px solid ${tab==='admin'?'#7c3aed':'#f1f5f9'}; background:${tab==='admin'?'#f3e8ff':'#f8fafc'}; font-weight:800; font-size:12px; cursor:pointer; color:${tab==='admin'?'#7c3aed':'#64748b'};">⚙️ Admin</button>
    </div>

    <div style="padding:0 22px 22px;">
      <h2 id="loginTitle" style="margin:0; font-size:18px; font-weight:900;">${tab==='client'?'Client Login':tab==='staff'?'Staff Login':'Admin Login'}</h2>
      <p id="loginSub" style="margin:6px 0 0; font-size:11px; opacity:0.6;">${tab==='client'?'Use phone + password created during registration':tab==='staff'?'Staff phone + password from staff collection':'Admin phone + password from admin collection'}</p>

      <div style="margin-top:16px; display:flex; flex-direction:column; gap:12px;">
        <div><label style="font-size:11px; font-weight:700;">Phone Number *</label><input id="loginPhone" placeholder="07XXXXXXXX or +2... o r +1" style="width:100%; padding:12px; border:1px solid #e2e8f0; border-radius:12px; margin-top:6px; font-size:13px;" /></div>
        <div><label style="font-size:11px; font-weight:700;">Password *</label><div style="position:relative;"><input id="loginPass" type="password" placeholder="Enter your password" style="width:100%; padding:12px; border:1px solid #e2e8f0; border-radius:12px; margin-top:6px; font-size:13px;" /><button id="showPass" style="position:absolute; right:8px; top:14px; background:#f1f5f9; border:none; padding:4px 8px; border-radius:999px; font-size:10px; cursor:pointer;">Show</button></div></div>
        <div style="display:flex; justify-content:space-between; font-size:11px;"><label style="display:flex; gap:6px; align-items:center;"><input type="checkbox" id="remember" checked /> Remember me</label><span id="forgot" style="color:#2563eb; cursor:pointer; font-weight:700;">Forgot password?</span></div>
        <button id="doLogin" style="background:linear-gradient(90deg,#2563eb,#1e40af); color:white; border:none; padding:14px; border-radius:12px; font-weight:800; font-size:13px; cursor:pointer;">🔐 Login</button>
        <div id="loginStatus" style="display:none; padding:10px; border-radius:10px; font-size:11px;"></div>
      </div>

      <div style="margin-top:16px; text-align:center; font-size:11px;">Don't have account? <span id="goApply" style="color:#2563eb; font-weight:800; cursor:pointer;">Apply Now →</span></div>
    </div>
  </div>
</div>
  `;

  const switchTab = (newTab)=>{
    sessionStorage.setItem('loginTab', newTab);
    initLoginPage();
  };
  document.getElementById('tabClient').onclick=()=>switchTab('client');
  document.getElementById('tabStaff').onclick=()=>switchTab('staff');
  document.getElementById('tabAdmin').onclick=()=>switchTab('admin');
  document.getElementById('backHome').onclick=()=>{ location.hash=''; location.reload(); };
  document.getElementById('goApply').onclick=()=>{ location.hash='#apply'; location.reload(); };
  document.getElementById('showPass').onclick=()=>{ const p=document.getElementById('loginPass'); p.type=p.type==='password'?'text':'password'; document.getElementById('showPass').innerText=p.type==='password'?'Show':'Hide'; };
  document.getElementById('forgot').onclick=()=>{
    const st=document.getElementById('loginStatus');
    st.style.display='block';
    st.style.background='#fffbeb';
    st.style.border='1px solid #fde68a';
    st.innerHTML='Forgot password? Contact support: 0789 338 183 or info@hopehousetravel.co.ke to reset your password.';
  };

  document.getElementById('doLogin').onclick=async()=>{
    const phone=document.getElementById('loginPhone').value.trim();
    const pass=document.getElementById('loginPass').value.trim();
    const tabNow=sessionStorage.getItem('loginTab')||'client';
    const status=document.getElementById('loginStatus');
    const btn=document.getElementById('doLogin');
    if(!phone||!pass){ status.style.display='block'; status.style.background='#fee2e2'; status.innerHTML='Fill phone and password'; return; }
    btn.disabled=true; btn.innerText='⏳ Checking...'; status.style.display='block'; status.style.background='#eff6ff'; status.style.border='1px solid #dbeafe'; status.innerText='Checking Firestore...';

    try{
      if(tabNow==='client'){
        const q=query(collection(db,'clients'), where('phone','==', phone));
        const snap=await getDocs(q);
        if(snap.empty){ status.style.background='#fee2e2'; status.innerHTML='❌ No client found with phone '+phone+'. Please apply first.'; btn.disabled=false; btn.innerText='🔐 Login'; return; }
        const data=snap.docs[0].data();
        const expectedPass = data.loginPass || data.password;
        if(!expectedPass || pass!==expectedPass){ status.style.background='#fee2e2'; status.innerHTML='❌ Wrong password for this client.'; btn.disabled=false; btn.innerText='🔐 Login'; return; }
        localStorage.setItem('hht_client_phone', phone);
        localStorage.setItem('hht_role', 'client');
        status.style.background='#dcfce7'; status.innerHTML='✅ Success! Redirecting...';
        setTimeout(()=>{ location.hash='#client'; location.reload(); }, 800);
      } else if(tabNow==='staff'){
        const q=query(collection(db,'staff'), where('phone','==', phone));
        const snap=await getDocs(q);
        if(snap.empty){ status.style.background='#fee2e2'; status.innerHTML='❌ No staff account found with phone '+phone+'. Ask admin to create staff account in Firestore.'; btn.disabled=false; btn.innerText='🔐 Login'; return; }
        const data=snap.docs[0].data();
        const expected=data.password || data.loginPass;
        if(!expected || pass!==expected){ status.style.background='#fee2e2'; status.innerHTML='❌ Wrong staff password.'; btn.disabled=false; btn.innerText='🔐 Login'; return; }
        localStorage.setItem('hht_staff_id', snap.docs[0].id);
        localStorage.setItem('hht_staff_phone', phone);
        localStorage.setItem('hht_staff_name', data.fullName||data.name||'Staff');
        localStorage.setItem('hht_role', 'staff');
        status.style.background='#dcfce7'; status.innerHTML='✅ Staff login success! Redirecting...';
        setTimeout(()=>{ location.hash='#staff'; location.reload(); }, 800);
      } else {
        const q=query(collection(db,'admin'), where('phone','==', phone));
        const snap=await getDocs(q);
        if(snap.empty){ status.style.background='#fee2e2'; status.innerHTML='❌ No admin account found with phone '+phone+'. Ask admin to create admin account in Firestore.'; btn.disabled=false; btn.innerText='🔐 Login'; return; }
        const data=snap.docs[0].data();
        if(!data.password || data.password!==pass){ status.style.background='#fee2e2'; status.innerHTML='❌ Wrong admin password.'; btn.disabled=false; btn.innerText='🔐 Login'; return; }
        localStorage.setItem('hht_admin_phone', phone);
        localStorage.setItem('hht_role', 'admin');
        status.style.background='#dcfce7'; status.innerHTML='✅ Admin login success!';
        setTimeout(()=>{ location.hash='#admin'; location.reload(); }, 800);
      }
    }catch(e){
      status.style.background='#fee2e2'; status.innerHTML='❌ Error: '+e.message; btn.disabled=false; btn.innerText='🔐 Login';
    }
  };
}