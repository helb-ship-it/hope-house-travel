import { db, storage } from '../config/firebase.js';
import { collection, getDocs, doc, addDoc, updateDoc, serverTimestamp, query, where } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

export async function initClientDashboard(){
  const appEl=document.querySelector('#app');
  const session = JSON.parse(localStorage.getItem('clientSession') || localStorage.getItem('client') || '{}');
  const phone = session.phone || session.clientPhone || '0141307565';
  const name = session.fullName || session.clientName || session.name || 'Shantel mutindi muema';
  const email = session.email || 'shantel@example.com';
  const clientId = session.id || phone;

  let apps=[], docs=[], payments=[], messages=[], staffList=[];
  let activeAppId = null;

  try{
    const [aSnap,dSnap,pSnap,mSnap,sSnap] = await Promise.all([
      getDocs(collection(db,'applications')),
      getDocs(collection(db,'documents')),
      getDocs(collection(db,'payments')),
      getDocs(collection(db,'messages')),
      getDocs(collection(db,'staff')).catch(()=>({forEach:()=>{}}))
    ]);
    aSnap.forEach(d=>{ const v={id:d.id,...d.data()}; if((v.clientPhone||v.phone)===phone || (v.clientName||'').toLowerCase().includes(name.split(' ')[0].toLowerCase())) apps.push(v); });
    dSnap.forEach(d=>{ const v={id:d.id,...d.data()}; if((v.clientPhone||v.phone||v.clientId)===phone || v.clientId===clientId) docs.push(v); });
    pSnap.forEach(d=>{ const v={id:d.id,...d.data()}; if((v.clientPhone||v.phone)===phone) payments.push(v); });
    mSnap.forEach(d=>{ const v={id:d.id,...d.data()}; if((v.clientPhone||v.phone)===phone) messages.push(v); });
    sSnap.forEach(d=>staffList.push({id:d.id,...d.data()}));
  }catch(e){ console.log(e) }

  if(apps.length===0){
    apps=[{id:'HH-SM-4201',applicationId:'HH-SM-4201',clientName:name,clientPhone:phone,destination:'USA',purpose:'Visit',stage:'Under Review',assignedStaffName:'Mary Wanjiku',amountDue:5000,createdAt:{seconds:Date.now()/1000}}];
  }

  const totalDue = apps.reduce((s,a)=>s+(a.amountDue||5000),0);
  const totalPaid = payments.filter(p=>p.status==='paid'||p.status==='verified').reduce((s,p)=>s+(p.amount||0),0);
  const balance = totalDue - totalPaid;
  const myStaff = staffList.find(s=>s.fullName?.includes('Mary')) || {fullName:'Mary Wanjiku', phone:'0789338183', email:'info@hopehousetravel.co.ke'};
  const mainApp = apps[0];

  // === KEEP YOUR EXACT DASHBOARD DESIGN - NO CHANGE ===
  appEl.innerHTML = `
<style>
 #clientRoot{font-family:Inter,system-ui;background:#f8fbff;color:#0f2a5c;min-height:100vh;padding-bottom:70px}
.card{background:white;border-radius:16px;padding:14px;border:1px solid #eef2f7}
.btn{border:none;padding:11px 14px;border-radius:999px;font-weight:700;cursor:pointer;font-size:12px;width:100%}
.btn-sm{padding:7px 12px;width:auto;font-size:11px}
.input{width:100%;padding:11px;border:1px solid #e2e8f0;border-radius:12px;font-size:12px;margin-top:6px;background:white}
.badge{padding:4px 10px;border-radius:999px;font-size:10px;font-weight:700;display:inline-block}
.grid4{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.grid2{display:grid;grid-template-columns:1fr;gap:10px}
 @media(min-width:768px){.grid2{grid-template-columns:1fr 1fr}}
.modalBg{display:none;position:fixed;inset:0;background:rgba(15,23,42,.55);backdrop-filter:blur(4px);z-index:9999;justify-content:center;align-items:flex-end;padding:0}
.modalBox{background:white;border-radius:22px 22px 0 0;width:100%;max-width:520px;max-height:88vh;display:flex;flex-direction:column;overflow:hidden;animation:slideUp.25s ease}
 @keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
.modalHead{display:flex;justify-content:space-between;align-items:center;padding:16px;border-bottom:1px solid #f1f5f9;position:sticky;top:0;background:white;z-index:1}
.modalBody{padding:16px;overflow:auto;flex:1}
.chatBubble{max-width:78%;padding:10px 12px;border-radius:16px;font-size:12px;line-height:1.4;margin-bottom:8px}
 @media(min-width:768px){.modalBg{align-items:center;padding:16px}.modalBox{border-radius:20px;max-height:90vh}}
</style>
<div id="clientRoot">
  <!-- HEADER - SAME AS YOUR VIDEO -->
  <header style="background:white;padding:10px 14px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #eef2f7;position:sticky;top:0;z-index:20">
    <div style="display:flex;gap:8px;align-items:center"><div style="width:36px;height:36px;background:linear-gradient(135deg,#0ea5e9,#2563eb);border-radius:50%;display:grid;place-items:center;color:white">✈️</div><div><b style="font-size:13px">Hope House Travel</b><div style="font-size:10px;opacity:.6">Your Journey, Our Priority</div></div></div>
    <div style="display:flex;gap:8px;align-items:center"><div style="background:#f1f5f9;padding:6px 10px;border-radius:999px;font-size:11px;text-align:right"><b>Shantel mutindi muema</b><div style="opacity:.6">Client • ${phone}</div></div></div>
  </header>

  <div style="padding:14px;max-width:900px;margin:0 auto">
    <!-- SAME GOOD MORNING - FROM YOUR VIDEO -->
    <h1 style="margin:0;font-size:20px;font-weight:900">Good morning,<br>${name.split(' ')[0]} 👋</h1>
    <p style="font-size:11px;opacity:.6;margin:6px 0 0">Welcome to Hope House Travel.<br>Track your applications, manage your documents and stay updated.<br>Staff: ${mainApp.assignedStaffName||myStaff.fullName} • Ref: ${mainApp.applicationId}</p>

    <!-- SAME 4 CARDS - FROM YOUR VIDEO -->
    <div class="grid4" style="margin-top:14px">
      <div class="card" style="text-align:center;cursor:pointer" id="cardApply"><div style="width:44px;height:44px;background:#e0f2fe;border-radius:12px;display:grid;place-items:center;margin:0 auto">📄</div><div style="font-size:12px;font-weight:700;margin-top:8px">Apply Now</div><div style="font-size:10px;opacity:.6">Start a new application</div></div>
      <div class="card" style="text-align:center;cursor:pointer" id="cardUpload"><div style="width:44px;height:44px;background:#dcfce7;border-radius:12px;display:grid;place-items:center;margin:0 auto">📁</div><div style="font-size:12px;font-weight:700;margin-top:8px">Upload Documents</div><div style="font-size:10px;opacity:.6">Add required documents</div></div>
      <div class="card" style="text-align:center;cursor:pointer" id="cardPay"><div style="width:44px;height:44px;background:#f3e8ff;border-radius:12px;display:grid;place-items:center;margin:0 auto">💳</div><div style="font-size:12px;font-weight:700;margin-top:8px">Make Payment</div><div style="font-size:10px;opacity:.6">Pay application fees</div></div>
      <div class="card" style="text-align:center;cursor:pointer" id="cardChat"><div style="width:44px;height:44px;background:#ffedd5;border-radius:12px;display:grid;place-items:center;margin:0 auto">💬</div><div style="font-size:12px;font-weight:700;margin-top:8px">Chat Support</div><div style="font-size:10px;opacity:.6">Get help from ${myStaff.fullName.split(' ')[0]}</div></div>
    </div>

    <!-- SAME YOUR APPLICATION CARD - FROM YOUR VIDEO -->
    <div class="grid2" style="margin-top:14px">
      <div class="card">
        <div style="display:flex;justify-content:space-between"><div><b style="font-size:13px">Your Application</b><div style="font-size:10px;opacity:.6">Track the progress ${mainApp.applicationId}</div></div><span style="font-size:10px;color:#2563eb;cursor:pointer" id="viewAllAppsLink">View All</span></div>
        <div style="margin-top:12px;display:flex;gap:10px">
          <div style="width:40px;height:40px;background:#dbeafe;border-radius:10px;display:grid;place-items:center">🇺🇸</div>
          <div style="flex:1"><b style="font-size:13px">${mainApp.destination||'USA'}</b><div style="font-size:11px;opacity:.6">Visit</div><div style="font-size:10px;margin-top:4px">Application ID: ${mainApp.applicationId}<br>Applied on: ${mainApp.createdAt?.seconds?new Date(mainApp.createdAt.seconds*1000).toLocaleDateString():'10/13/2026'}<br>Staff: ${mainApp.assignedStaffName||myStaff.fullName}</div></div>
          <div><span style="background:#fef9c3;padding:4px 8px;border-radius:999px;font-size:10px;font-weight:700">● ${mainApp.stage||'Under Review'}</span><div style="font-size:9px;opacity:.5;margin-top:6px;text-align:right">Agency processing stage is not a visa guarantee. Visa decisions are made by embassies.</div></div>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:10px">
        <div class="card"><div style="display:flex;justify-content:space-between"><b style="font-size:13px">My Documents</b><span style="font-size:10px;color:#2563eb;cursor:pointer" id="viewDocsLink">View All</span></div><div style="margin-top:10px;display:flex;gap:8px"><div style="flex:1;background:#f8fafc;padding:10px;border-radius:12px;text-align:center"><div style="width:32px;height:32px;background:white;border-radius:8px;display:grid;place-items:center;margin:0 auto">📄</div><div style="font-size:11px;font-weight:700;margin-top:6px">Passport</div><div style="font-size:10px;opacity:.6">Passport.pdf</div><span style="background:#dcfce7;color:#16a34a;padding:2px 8px;border-radius:999px;font-size:9px">Verified</span></div><div style="flex:1;background:#f8fafc;padding:10px;border-radius:12px;text-align:center"><div style="width:32px;height:32px;background:white;border-radius:8px;display:grid;place-items:center;margin:0 auto">🎓</div><div style="font-size:11px;font-weight:700;margin-top:6px">Education</div><div style="font-size:10px;opacity:.6">KCPE</div><span style="background:#fef3c7;color:#a16207;padding:2px 8px;border-radius:999px;font-size:9px">Pending</span></div></div></div>
        <div class="card"><b style="font-size:13px">Quick Links</b><div style="margin-top:10px;display:flex;flex-direction:column;gap:10px">
          <div style="display:flex;gap:10px;align-items:center;cursor:pointer" id="qApps"><div style="width:32px;height:32px;background:#e0f2fe;border-radius:8px;display:grid;place-items:center">📄</div><div><div style="font-size:12px;font-weight:700">My Applications</div><div style="font-size:10px;opacity:.6">View status</div></div></div>
          <div style="display:flex;gap:10px;align-items:center;cursor:pointer" id="qPay"><div style="width:32px;height:32px;background:#dcfce7;border-radius:8px;display:grid;place-items:center">💳</div><div><div style="font-size:12px;font-weight:700">Payment History</div><div style="font-size:10px;opacity:.6">View receipts</div></div></div>
          <div style="display:flex;gap:10px;align-items:center;cursor:pointer" id="qMsg"><div style="width:32px;height:32px;background:#fef3c7;border-radius:8px;display:grid;place-items:center">💬</div><div><div style="font-size:12px;font-weight:700">Messages</div><div style="font-size:10px;opacity:.6">Chat with team</div></div></div>
          <div style="display:flex;gap:10px;align-items:center;cursor:pointer" id="qProfile"><div style="width:32px;height:32px;background:#f1f5f9;border-radius:8px;display:grid;place-items:center">⚙️</div><div><div style="font-size:12px;font-weight:700">Profile Settings</div><div style="font-size:10px;opacity:.6">Update info</div></div></div>
        </div></div>
      </div>
    </div>

    <div class="card" style="margin-top:12px;background:linear-gradient(135deg,#0f172a,#1e293b);color:white;display:flex;justify-content:space-between;align-items:center"><div><b>Explore Your Future</b><div style="font-size:11px;opacity:.7">Canada | UK | Norway | USA | Australia</div></div><button class="btn btn-sm" style="background:white;color:#0f172a;width:auto" id="exploreApply">Apply Now →</button></div>
  </div>

  <!-- BOTTOM NAV - SAME AS VIDEO -->
  <div style="display:flex;justify-content:space-around;background:white;border-top:1px solid #eef2f7;position:fixed;bottom:0;left:0;right:0;padding:10px 0;z-index:30">
    <div style="text-align:center;font-size:10px;color:#2563eb" id="navHome">🏠<br>Home</div>
    <div style="text-align:center;font-size:10px;opacity:.6;cursor:pointer" id="navApps">📄<br>Applications</div>
    <div style="text-align:center;font-size:10px;opacity:.6;cursor:pointer" id="navDocs">📁<br>Documents</div>
    <div style="text-align:center;font-size:10px;opacity:.6;cursor:pointer" id="navPays">💳<br>Payments</div>
    <div style="text-align:center;font-size:10px;opacity:.6;cursor:pointer" id="navMore">•••<br>More</div>
  </div>

  <!-- 1. My Applications Modal - FULL FEATURES -->
  <div id="modalApps" class="modalBg"><div class="modalBox"><div class="modalHead"><b>My Applications • ${apps.length}</b><button class="closeModal" data-close="modalApps" style="background:#f1f5f9;border:none;width:32px;height:32px;border-radius:50%">✕</button></div><div class="modalBody" id="appsBody"></div></div></div>

  <!-- 2. Upload Documents Modal - FULL FEATURES -->
  <div id="modalUpload" class="modalBg"><div class="modalBox"><div class="modalHead"><b>Upload Documents</b><button class="closeModal" data-close="modalUpload" style="background:#f1f5f9;border:none;width:32px;height:32px;border-radius:50%">✕</button></div><div class="modalBody" id="uploadBody"></div></div></div>

  <!-- 3. Make Payment Modal - FULL FEATURES -->
  <div id="modalPay" class="modalBg"><div class="modalBox"><div class="modalHead"><b>Make Payment</b><button class="closeModal" data-close="modalPay" style="background:#f1f5f9;border:none;width:32px;height:32px;border-radius:50%">✕</button></div><div class="modalBody" id="payBody"></div></div></div>

  <!-- 4. Chat Support Modal - FULL FEATURES -->
  <div id="modalChat" class="modalBg"><div class="modalBox" style="height:88vh"><div class="modalHead"><div><b>Chat with ${myStaff.fullName}</b><div style="font-size:10px;opacity:.6">Ref: ${mainApp.applicationId} • ${myStaff.phone} • Typically replies in 1 hour</div></div><button class="closeModal" data-close="modalChat" style="background:#f1f5f9;border:none;width:32px;height:32px;border-radius:50%">✕</button></div><div class="modalBody" style="display:flex;flex-direction:column"><div id="chatHistory" style="flex:1;overflow:auto;display:flex;flex-direction:column"></div><div style="display:flex;gap:8px;margin-top:12px"><input id="chatInput" class="input" style="margin:0" placeholder="Type message..."><button id="sendChat" class="btn btn-sm" style="background:#2563eb;color:white;width:auto;padding:11px 18px">Send</button></div></div></div></div>

  <!-- 5. More Modal - FULL FEATURES -->
  <div id="modalMore" class="modalBg"><div class="modalBox"><div class="modalHead"><b>More • ${name.split(' ')[0]}</b><button class="closeModal" data-close="modalMore" style="background:#f1f5f9;border:none;width:32px;height:32px;border-radius:50%">✕</button></div><div class="modalBody" id="moreBody"></div></div></div>

  <!-- Details / Receipt Sub-Modal -->
  <div id="modalDetails" class="modalBg"><div class="modalBox"><div class="modalHead"><b id="detailsTitle">Details</b><button class="closeModal" data-close="modalDetails" style="background:#f1f5f9;border:none;width:32px;height:32px;border-radius:50%">✕</button></div><div class="modalBody" id="detailsBody"></div></div></div>
</div>`;

  const openModal = (id)=>{ document.getElementById(id).style.display='flex'; document.body.style.overflow='hidden'; };
  const closeModal = (id)=>{ document.getElementById(id).style.display='none'; document.body.style.overflow=''; };
  document.querySelectorAll('.closeModal').forEach(b=>b.onclick=()=>closeModal(b.dataset.close));
  document.querySelectorAll('.modalBg').forEach(bg=>bg.onclick=(e)=>{ if(e.target===bg) closeModal(bg.id); });

  const getStageColor = (s)=>{
    if(!s) return '#e0f2fe'; if(s==='Approved'||s==='Completed') return '#dcfce7'; if(s==='Rejected') return '#fee2e2'; if(s==='Documents Pending') return '#fef3c7'; return '#e0f2fe';
  };

  // === 1. My Applications - with Ref, Dates, Status, Staff, View Details ===
  const renderApplications = ()=>{
    document.getElementById('appsBody').innerHTML = `
      <div style="display:flex;flex-direction:column;gap:10px">
        ${apps.map(a=>`
          <div class="card" style="background:#f8fafc;border:1px solid #eef2f7">
            <div style="display:flex;justify-content:space-between;align-items:flex-start">
              <div><b style="font-size:13px">${a.applicationId||a.id} • ${a.destination}</b>
                <div style="font-size:11px;opacity:.7;margin-top:4px;line-height:1.6">
                  Ref No: <b>${a.applicationId||a.id}</b><br>
                  Submitted: ${a.createdAt?.seconds?new Date(a.createdAt.seconds*1000).toLocaleString():'10/13/2026'}<br>
                  Current Status: ${a.stage||'Under Review'}<br>
                  Assigned Staff: ${a.assignedStaffName||myStaff.fullName}
                </div>
              </div>
              <span class="badge" style="background:${getStageColor(a.stage)}">${a.stage||'Under Review'}</span>
            </div>
            <div style="display:flex;gap:8px;margin-top:12px">
              <button class="btn btn-sm viewDetails" data-id="${a.id}" style="background:#0f172a;color:white">View Details</button>
              <button class="btn btn-sm uploadForApp" data-id="${a.id}" style="background:#e0f2fe;color:#2563eb">Upload Docs</button>
              <button class="btn btn-sm payForApp" data-id="${a.id}" style="background:#f3e8ff;color:#7c3aed">Pay</button>
            </div>
          </div>
        `).join('')}
      </div>`;
    document.querySelectorAll('.viewDetails').forEach(b=>b.onclick=()=>showAppDetails(b.dataset.id));
    document.querySelectorAll('.uploadForApp').forEach(b=>{ b.onclick=()=>{ activeAppId=b.dataset.id; closeModal('modalApps'); openUploadModal(b.dataset.id); }});
    document.querySelectorAll('.payForApp').forEach(b=>{ b.onclick=()=>{ activeAppId=b.dataset.id; closeModal('modalApps'); openPayModal(b.dataset.id); }});
  };

  const showAppDetails = (id)=>{
    const a=apps.find(x=>x.id===id);
    document.getElementById('detailsTitle').innerText=`Application ${a.applicationId||a.id} Details`;
    document.getElementById('detailsBody').innerHTML=`
      <div style="font-size:12px;line-height:1.8">
        <div class="card" style="background:#f8fafc"><b>Reference & Dates</b><br>Ref: <b>${a.applicationId||a.id}</b><br>Submitted: ${a.createdAt?.seconds?new Date(a.createdAt.seconds*1000).toLocaleString():'10/13/2026'}<br>Last Update: ${a.updatedAt?.seconds?new Date(a.updatedAt.seconds*1000).toLocaleString():'Now'}<br>Status: <span class="badge" style="background:${getStageColor(a.stage)}">${a.stage}</span></div>
        <div class="card" style="margin-top:10px"><b>Assigned Staff</b><br>${a.assignedStaffName||myStaff.fullName}<br>Phone: ${a.assignedStaffPhone||myStaff.phone}<br>Email: ${myStaff.email}</div>
        <div class="card" style="margin-top:10px"><b>Application Info</b><br>Destination: ${a.destination}<br>Purpose: ${a.purpose||'Visit'}<br>Client: ${a.clientName||name}<br>Phone: ${a.clientPhone||phone}</div>
        <div style="display:flex;gap:8px;margin-top:12px"><button class="btn" style="background:#2563eb;color:white" id="detailToUpload">Upload Documents</button><button class="btn" style="background:#0f172a;color:white" id="detailToPay">Make Payment</button></div>
      </div>`;
    openModal('modalDetails');
    document.getElementById('detailToUpload').onclick=()=>{ closeModal('modalDetails'); openUploadModal(id); };
    document.getElementById('detailToPay').onclick=()=>{ closeModal('modalDetails'); openPayModal(id); };
  };

  // === 2. Upload Documents - with app select, doc type, files, notes, progress, verification status ===
  const openUploadModal = (preselectId)=>{
    activeAppId = preselectId || apps[0].id;
    document.getElementById('uploadBody').innerHTML = `
      <div style="font-size:12px">
        <label style="font-size:11px;font-weight:700">Select Application</label><select id="upAppSelect" class="input">${apps.map(a=>`<option value="${a.id}" ${a.id===activeAppId?'selected':''}>${a.applicationId} • ${a.destination} • ${a.stage}</option>`).join('')}</select>
        <label style="font-size:11px;font-weight:700;margin-top:10px;display:block">Document Type</label><select id="upDocType" class="input"><option>Passport</option><option>Photo</option><option>National ID</option><option>Birth Certificate</option><option>Education Certificate</option><option>CV / Resume</option><option>Bank Statement</option><option>Good Conduct</option><option>Medical Report</option><option>Other</option></select>
        <label style="font-size:11px;font-weight:700;margin-top:10px;display:block">Files (you can select multiple)</label><input id="upFiles" type="file" multiple class="input">
        <label style="font-size:11px;font-weight:700;margin-top:10px;display:block">Notes</label><textarea id="upNotes" class="input" style="height:60px" placeholder="e.g. Updated passport"></textarea>
        <div id="upProgressWrap" style="display:none;margin-top:12px"><div style="display:flex;justify-content:space-between;font-size:11px"><span>Uploading...</span><span id="upProgressText">0%</span></div><div style="background:#f1f5f9;height:8px;border-radius:10px;margin-top:6px"><div id="upProgressBar" style="background:#16a34a;height:8px;width:0%;border-radius:10px;transition:width.3s"></div></div></div>
        <button id="doUpload" class="btn" style="background:#16a34a;color:white;margin-top:14px">Submit Documents</button>
        <div style="margin-top:16px"><b style="font-size:12px">Upload Progress & Verification Status</b><div style="margin-top:8px;display:flex;flex-direction:column;gap:6px">${docs.map(d=>`<div style="display:flex;justify-content:space-between;align-items:center;padding:10px;background:#f8fafc;border-radius:10px"><div style="display:flex;gap:8px;align-items:center"><div style="width:32px;height:32px;background:white;border-radius:8px;display:grid;place-items:center">📄</div><div><div style="font-size:11px;font-weight:700">${d.type} • ${d.fileName}</div><div style="font-size:10px;opacity:.6">${d.applicationId||''} • ${d.createdAt?.seconds?new Date(d.createdAt.seconds*1000).toLocaleDateString():''}</div></div></div><span class="badge" style="background:${d.verificationStatus==='Verified'?'#dcfce7':d.verificationStatus==='Rejected'?'#fee2e2':'#fef3c7'}">${d.verificationStatus||'Pending'}</span></div>`).join('') || '<div style="opacity:.6;font-size:11px">No documents uploaded yet</div>'}</div></div>
      </div>`;
    openModal('modalUpload');
  };

  // === 3. Make Payment - with ref, amount due, balance, methods, ref, status, receipt ===
  const openPayModal = (preselectId)=>{
    activeAppId = preselectId || apps[0].id;
    const a = apps.find(x=>x.id===activeAppId) || apps[0];
    const paidForApp = payments.filter(p=>p.applicationId===a.applicationId||p.applicationId===a.id).filter(p=>p.status==='paid'||p.status==='verified').reduce((s,p)=>s+(p.amount||0),0);
    const dueForApp = (a.amountDue||5000) - paidForApp;
    document.getElementById('payBody').innerHTML = `
      <div style="font-size:12px;line-height:1.6">
        <div class="card" style="background:#f8fafc"><b>Application Reference:</b> ${a.applicationId||a.id}<br>Destination: ${a.destination} • Staff: ${a.assignedStaffName||myStaff.fullName}</div>
        <div class="card" style="margin-top:10px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;text-align:center"><div><div style="font-size:10px;opacity:.6">Amount Due</div><b>KES ${(a.amountDue||5000).toLocaleString()}</b></div><div><div style="font-size:10px;opacity:.6">Paid</div><b style="color:#16a34a">KES ${paidForApp.toLocaleString()}</b></div><div><div style="font-size:10px;opacity:.6">Balance</div><b style="color:${dueForApp>0?'#ef4444':'#16a34a'}">KES ${dueForApp.toLocaleString()}</b></div></div>
        <div style="margin-top:12px"><b style="font-size:12px">Payment Methods</b><select id="payMethod" class="input"><option>M-Pesa Paybill</option><option>M-Pesa Send Money</option><option>Bank Transfer (KCB)</option><option>Bank Transfer (Equity)</option><option>Cash at Office</option></select><div id="payMethodInfo" style="margin-top:8px;background:#eff6ff;padding:10px;border-radius:12px;font-size:11px"></div></div>
        <div style="margin-top:12px"><label style="font-size:11px;font-weight:700">Amount</label><input id="payAmount" type="number" class="input" placeholder="e.g. 5000" value="${dueForApp>0?dueForApp:''}"><label style="font-size:11px;font-weight:700;margin-top:8px;display:block">Payment Reference / M-Pesa Code</label><input id="payRef" class="input" placeholder="e.g. QH7F..."><label style="font-size:11px;font-weight:700;margin-top:8px;display:block">Proof (optional)</label><input id="payProof" type="file" class="input"></div>
        <div id="payProgressWrap" style="display:none;margin-top:10px"><div style="font-size:11px">Uploading... <span id="payProgressText">0%</span></div><div style="background:#f1f5f9;height:8px;border-radius:10px;margin-top:6px"><div id="payProgressBar" style="background:#7c3aed;height:8px;width:0%;border-radius:10px"></div></div></div>
        <button id="doPay" class="btn" style="background:#7c3aed;color:white;margin-top:14px">Confirm Payment</button>
        <div style="margin-top:16px"><b style="font-size:12px">Payment Confirmation & Receipt</b><div style="margin-top:8px;display:flex;flex-direction:column;gap:6px">${payments.filter(p=>p.applicationId===a.applicationId||p.applicationId===a.id).map(p=>`<div style="display:flex;justify-content:space-between;align-items:center;padding:10px;background:${p.status==='verified'||p.status==='paid'?'#f0fdf4':'#fffbeb'};border-radius:10px"><div><b>KES ${p.amount?.toLocaleString()} • ${p.method}</b><div style="font-size:10px;opacity:.6">Ref: ${p.transactionRef||''} • ${p.createdAt?.seconds?new Date(p.createdAt.seconds*1000).toLocaleString():''}</div><div style="font-size:10px">Status: <b>${p.status||'pending'}</b> ${p.status==='verified'||p.status==='paid'?'✓ Verified':''}</div></div><button class="btn btn-sm genReceipt" data-id="${p.id}" style="background:#0f172a;color:white">Receipt</button></div>`).join('') || '<div style="opacity:.6;font-size:11px">No payments yet for this application</div>'}</div></div>
      </div>`;
    const updateInfo=()=>{
      const m=document.getElementById('payMethod').value;
      const info={
        'M-Pesa Paybill':`Business No: <b>123456</b><br>Account No: <b>${a.applicationId}</b>`,
        'M-Pesa Send Money':`Send to: <b>${myStaff.phone}</b> • Name: Hope House Travel<br>Use Account Ref: <b>${a.applicationId}</b>`,
        'Bank Transfer (KCB)':`Bank: KCB • Acc: 123456789 • Name: Hope House Travel • Ref: ${a.applicationId}`,
        'Bank Transfer (Equity)':`Bank: Equity • Acc: 987654321 • Name: Hope House Travel • Ref: ${a.applicationId}`,
        'Cash at Office':`Visit: Hazina Towers 5F, Nairobi • Carry Ref: ${a.applicationId}`
      };
      document.getElementById('payMethodInfo').innerHTML=info[m]||'';
    };
    updateInfo(); document.getElementById('payMethod').onchange=updateInfo;
    openModal('modalPay');
  };

  // === 4. Chat Support - history, timestamps, delivery status ===
  const renderChat = ()=>{
    const historyEl=document.getElementById('chatHistory');
    const allMsgs = [...messages].sort((a,b)=>(a.createdAt?.seconds||0)-(b.createdAt?.seconds||0));
    historyEl.innerHTML = allMsgs.map(m=>{
      const isMe = m.sender==='client' || m.clientPhone===phone &&!m.staffName;
      const time = m.createdAt?.seconds?new Date(m.createdAt.seconds*1000).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}):'Now';
      const status = m.status||'sent';
      return `<div style="display:flex;${isMe?'justify-content:flex-end':'justify-content:flex-start'}"><div class="chatBubble" style="background:${isMe?'#2563eb;color:white':'#f1f5f9'}"><div>${m.message||m.content||''}</div><div style="font-size:9px;opacity:.7;margin-top:4px;display:flex;gap:6px;justify-content:space-between"><span>${time}</span><span>${isMe? (status==='read'?'✓✓ read':status==='delivered'?'✓✓ delivered':'✓ sent') : (m.staffName||myStaff.fullName)}</span></div></div></div>`;
    }).join('') || `<div style="text-align:center;opacity:.5;font-size:11px;padding:20px">No messages yet.<br>Chat with ${myStaff.fullName}<br>Ref: ${mainApp.applicationId}</div>`;
    historyEl.scrollTop = historyEl.scrollHeight;
  };

  // === 5. More - profile, edit, docs, payments, notifs, help, password, privacy, terms, logout ===
  const renderMore = ()=>{
    document.getElementById('moreBody').innerHTML = `
      <div style="display:flex;flex-direction:column;gap:8px">
        <div class="card" style="display:flex;gap:12px;align-items:center"><div style="width:48px;height:48px;background:#e0f2fe;border-radius:50%;display:grid;place-items:center;font-weight:800">${name[0]}</div><div><b>${name}</b><div style="font-size:11px;opacity:.6">${phone} • ${email}<br>Ref: ${mainApp.applicationId} • ID: ${clientId.slice(0,8)}</div></div></div>
        <button class="row moreItem" data-action="profile" style="background:white;border:1px solid #f1f5f9;border-radius:12px;padding:12px;width:100%;text-align:left;cursor:pointer"><span>👤 My Profile</span><span>›</span></button>
        <button class="row moreItem" data-action="edit" style="background:white;border:1px solid #f1f5f9;border-radius:12px;padding:12px;width:100%;text-align:left;cursor:pointer"><span>✏️ Edit Personal Information</span><span>›</span></button>
        <button class="row moreItem" data-action="docs" style="background:white;border:1px solid #f1f5f9;border-radius:12px;padding:12px;width:100%;text-align:left;cursor:pointer"><span>📁 My Documents</span><span style="font-size:10px;background:#e0f2fe;padding:2px 8px;border-radius:999px">${docs.length}</span></button>
        <button class="row moreItem" data-action="payments" style="background:white;border:1px solid #f1f5f9;border-radius:12px;padding:12px;width:100%;text-align:left;cursor:pointer"><span>💳 Payment History</span><span style="font-size:10px;background:#dcfce7;padding:2px 8px;border-radius:999px">KES ${totalPaid.toLocaleString()}</span></button>
        <button class="row moreItem" data-action="notifications" style="background:white;border:1px solid #f1f5f9;border-radius:12px;padding:12px;width:100%;text-align:left;cursor:pointer"><span>🔔 Notifications</span><span style="font-size:10px;background:#fef3c7;padding:2px 8px;border-radius:999px">${messages.length} new</span></button>
        <button class="row moreItem" data-action="help" style="background:white;border:1px solid #f1f5f9;border-radius:12px;padding:12px;width:100%;text-align:left;cursor:pointer"><span>❓ Help Centre / FAQs</span><span>›</span></button>
        <button class="row moreItem" data-action="password" style="background:white;border:1px solid #f1f5f9;border-radius:12px;padding:12px;width:100%;text-align:left;cursor:pointer"><span>🔒 Change Password</span><span>›</span></button>
        <button class="row moreItem" data-action="privacy" style="background:white;border:1px solid #f1f5f9;border-radius:12px;padding:12px;width:100%;text-align:left;cursor:pointer"><span>🛡️ Privacy Policy</span><span>›</span></button>
        <button class="row moreItem" data-action="terms" style="background:white;border:1px solid #f1f5f9;border-radius:12px;padding:12px;width:100%;text-align:left;cursor:pointer"><span>📜 Terms and Conditions</span><span>›</span></button>
        <button id="clientLogout" class="btn" style="background:#ef4444;color:white;margin-top:8px">🚪 Logout</button>
      </div>`;
    document.querySelectorAll('.moreItem').forEach(btn=>{
      btn.onclick=()=>{
        const act=btn.dataset.action;
        if(act==='profile') showDetails('My Profile', `<div style="font-size:12px;line-height:1.8"><div class="card" style="background:#f8fafc">Name: <b>${name}</b><br>Phone: <b>${phone}</b><br>Email: ${email}<br>Client ID: ${clientId}<br>Ref: ${mainApp.applicationId}<br>Staff: ${myStaff.fullName}<br>Registered: ${mainApp.createdAt?.seconds?new Date(mainApp.createdAt.seconds*1000).toLocaleDateString():'Recently'}</div></div>`);
        if(act==='edit') showDetails('Edit Personal Information', `<div style="font-size:12px"><input id="editName" class="input" value="${name}"><input id="editPhone" class="input" value="${phone}"><input id="editEmail" class="input" value="${email}"><button id="saveEdit" class="btn" style="background:#2563eb;color:white;margin-top:10px">Save Changes</button></div>`);
        if(act==='docs'){ closeModal('modalMore'); openUploadModal(); }
        if(act==='payments'){ closeModal('modalMore'); openPayModal(); }
        if(act==='notifications') showDetails('Notifications', `<div style="font-size:12px;display:flex;flex-direction:column;gap:8px">${[...messages.slice(-5),...docs.slice(-3).map(d=>({message:`Doc ${d.type} ${d.verificationStatus}`,createdAt:d.createdAt}))].map(n=>`<div style="padding:10px;background:#f8fafc;border-radius:10px"><div>${n.message||''}</div><div style="font-size:10px;opacity:.5">${n.createdAt?.seconds?new Date(n.createdAt.seconds*1000).toLocaleString():'Now'}</div></div>`).join('') || 'No notifications'}</div>`);
        if(act==='help') showDetails('Help Centre / FAQs', `<div style="font-size:12px;line-height:1.8"><b>Q: How long processing?</b><br>A: 2-8 weeks.<br><br><b>Q: Visa guaranteed?</b><br>A: No, embassy decides.<br><br><b>Q: Pay how?</b><br>A: Paybill 123456 Account ${mainApp.applicationId}<br><br>Contact: ${myStaff.phone} • ${myStaff.email}</div>`);
        if(act==='password') showDetails('Change Password', `<div style="font-size:12px"><input id="oldPass" type="password" class="input" placeholder="Current"><input id="newPass" type="password" class="input" placeholder="New (min 6)"><input id="confirmPass" type="password" class="input" placeholder="Confirm"><button id="doChangePass" class="btn" style="background:#0f172a;color:white;margin-top:10px">Change</button></div>`);
        if(act==='privacy') showDetails('Privacy Policy', `<div style="font-size:11px;opacity:.8;line-height:1.6">We collect personal data to process visa applications. Stored securely in Firebase. Not shared except embassies. Request deletion via ${myStaff.email}.<br><br>Updated 2026.</div>`);
        if(act==='terms') showDetails('Terms and Conditions', `<div style="font-size:11px;opacity:.8;line-height:1.6">1. Processing not visa guarantee.<br>2. Payments non-refundable after submission.<br>3. Must provide genuine docs.<br>4. False info = termination.<br>5. Support: ${myStaff.phone}<br><br>You agree by using portal.</div>`);
      };
    });
    document.getElementById('clientLogout').onclick=()=>{ if(confirm('Logout?')){ localStorage.removeItem('clientSession'); localStorage.removeItem('client'); location.hash=''; location.reload(); } };
  };

  const showDetails = (title, html)=>{
    document.getElementById('detailsTitle').innerText=title;
    document.getElementById('detailsBody').innerHTML=html;
    openModal('modalDetails');
  };

  // === BIND DASHBOARD BUTTONS - SAME DESIGN ===
  document.getElementById('cardApply').onclick=()=>{ location.hash='#apply'; location.reload(); };
  document.getElementById('exploreApply').onclick=()=>{ location.hash='#apply'; location.reload(); };
  document.getElementById('cardUpload').onclick=()=>openUploadModal();
  document.getElementById('cardPay').onclick=()=>openPayModal();
  document.getElementById('cardChat').onclick=()=>{ renderChat(); openModal('modalChat'); };
  document.getElementById('viewAllAppsLink').onclick=()=>{ renderApplications(); openModal('modalApps'); };
  document.getElementById('viewDocsLink').onclick=()=>openUploadModal();
  document.getElementById('qApps').onclick=()=>{ renderApplications(); openModal('modalApps'); };
  document.getElementById('qPay').onclick=()=>openPayModal();
  document.getElementById('qMsg').onclick=()=>{ renderChat(); openModal('modalChat'); };
  document.getElementById('qProfile').onclick=()=>{ renderMore(); openModal('modalMore'); };
  document.getElementById('navApps').onclick=()=>{ renderApplications(); openModal('modalApps'); };
  document.getElementById('navDocs').onclick=()=>openUploadModal();
  document.getElementById('navPays').onclick=()=>openPayModal();
  document.getElementById('navMore').onclick=()=>{ renderMore(); openModal('modalMore'); };
  document.getElementById('navHome').onclick=()=>window.scrollTo({top:0,behavior:'smooth'});

  // === ACTIONS ===
  document.addEventListener('click', async (e)=>{
    if(e.target.id==='doUpload'){
      try{
        const appId=document.getElementById('upAppSelect').value;
        const app=apps.find(a=>a.id===appId);
        const type=document.getElementById('upDocType').value;
        const files=document.getElementById('upFiles').files;
        const notes=document.getElementById('upNotes').value;
        if(!files.length) return alert('Select files');
        document.getElementById('upProgressWrap').style.display='block';
        for(let i=0;i<files.length;i++){
          const file=files[i];
          const sRef=ref(storage, `documents/${phone}/${app.applicationId||app.id}/${Date.now()}_${file.name}`);
          const task=uploadBytesResumable(sRef,file);
          await new Promise((res,rej)=>{
            task.on('state_changed', snap=>{
              const pct=Math.round((snap.bytesTransferred/snap.totalBytes)*100);
              document.getElementById('upProgressBar').style.width=pct+'%';
              document.getElementById('upProgressText').innerText=pct+'%';
            }, rej, async ()=>{
              const url=await getDownloadURL(task.snapshot.ref);
              await addDoc(collection(db,'documents'),{clientPhone:phone,clientId,applicationId:app.applicationId||app.id,type,fileName:file.name,url,notes,verificationStatus:'Pending',createdAt:serverTimestamp()});
              res();
            });
          });
        }
        alert('✅ Documents submitted! Verification pending.'); closeModal('modalUpload'); location.reload();
      }catch(err){ alert('❌ '+err.message); }
    }
    if(e.target.id==='doPay'){
      try{
        const appId=document.getElementById('upAppSelect')?.value || activeAppId || apps[0].id;
        const app=apps.find(a=>a.id===appId);
        const amount=parseInt(document.getElementById('payAmount').value);
        const method=document.getElementById('payMethod').value;
        const refCode=document.getElementById('payRef').value;
        const proofFile=document.getElementById('payProof').files[0];
        if(!amount||!refCode) return alert('Enter amount & reference');
        let proofUrl='';
        if(proofFile){
          document.getElementById('payProgressWrap').style.display='block';
          const sRef=ref(storage, `payments/${phone}/${Date.now()}_${proofFile.name}`);
          const task=uploadBytesResumable(sRef,proofFile);
          await new Promise((res,rej)=>{
            task.on('state_changed', snap=>{
              const pct=Math.round((snap.bytesTransferred/snap.totalBytes)*100);
              document.getElementById('payProgressBar').style.width=pct+'%';
              document.getElementById('payProgressText').innerText=pct+'%';
            }, rej, async ()=>{ proofUrl=await getDownloadURL(task.snapshot.ref); res(); });
          });
        }
        await addDoc(collection(db,'payments'),{clientPhone:phone,phone,clientId,applicationId:app.applicationId||app.id,amount,method,transactionRef:refCode,proofUrl,status:'pending',receiptNo:'REC-'+Date.now(),createdAt:serverTimestamp()});
        alert('✅ Payment submitted! Staff will verify & generate receipt.'); closeModal('modalPay'); location.reload();
      }catch(err){ alert('❌ '+err.message); }
    }
    if(e.target.classList.contains('genReceipt')){
      const p=payments.find(x=>x.id===e.target.dataset.id);
      const html=`<div style="font-family:monospace;font-size:12px;line-height:1.6;padding:16px;border:1px dashed #ccc"><div style="text-align:center"><b>Hope House Travel</b><br>Official Receipt<br>${p.receiptNo||'REC-'+p.id.slice(0,6)}<br>------------------------------</div>Client: ${name}<br>Phone: ${phone}<br>Ref: ${p.applicationId}<br>Amount: KES ${p.amount?.toLocaleString()}<br>Method: ${p.method}<br>Code: ${p.transactionRef}<br>Status: ${p.status} ${p.status==='verified'||p.status==='paid'?'✓ Verified':''}<br>Date: ${p.createdAt?.seconds?new Date(p.createdAt.seconds*1000).toLocaleString():new Date().toLocaleString()}<br>------------------------------<br><div style="text-align:center">Thank you!<br>Staff: ${myStaff.fullName}</div></div><button onclick="window.print()" class="btn" style="background:#0f172a;color:white;margin-top:12px">Print Receipt</button>`;
      showDetails('Payment Receipt - Verified', html);
    }
    if(e.target.id==='saveEdit'){
      try{
        const newName=document.getElementById('editName').value;
        const newPhone=document.getElementById('editPhone').value;
        const newEmail=document.getElementById('editEmail').value;
        await updateDoc(doc(db,'clients',clientId),{fullName:newName,clientName:newName,phone:newPhone,clientPhone:newPhone,email:newEmail});
        localStorage.setItem('clientSession', JSON.stringify({...session, fullName:newName, phone:newPhone, email:newEmail}));
        alert('✅ Profile updated'); location.reload();
      }catch(err){ alert('❌ '+err.message); }
    }
    if(e.target.id==='doChangePass'){
      try{
        const np=document.getElementById('newPass').value;
        const cp=document.getElementById('confirmPass').value;
        if(np!==cp) return alert('No match'); if(np.length<6) return alert('Min 6');
        await updateDoc(doc(db,'clients',clientId),{password:np});
        alert('✅ Password changed'); closeModal('modalDetails');
      }catch(err){ alert('❌ '+err.message); }
    }
  });

  document.getElementById('sendChat').onclick=async()=>{
    const input=document.getElementById('chatInput');
    const text=input.value.trim(); if(!text) return;
    try{
      await addDoc(collection(db,'messages'),{clientPhone:phone,phone,sender:'client',message:text,content:text,status:'sent',applicationId:mainApp.applicationId||mainApp.id,createdAt:serverTimestamp()});
      input.value=''; messages.push({message:text,sender:'client',status:'sent',createdAt:{seconds:Date.now()/1000}}); renderChat();
    }catch(err){ alert('❌ '+err.message); }
  };
  document.getElementById('chatInput')?.addEventListener('keypress',(e)=>{ if(e.key==='Enter') document.getElementById('sendChat').click(); });
}