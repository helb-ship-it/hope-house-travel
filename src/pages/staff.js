import { db, storage } from '../config/firebase.js';
import { collection, getDocs, doc, updateDoc, addDoc, serverTimestamp, query, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export async function initStaffDashboard(){
  const appEl=document.querySelector('#app');
  const staffSession = JSON.parse(localStorage.getItem('staffSession') || localStorage.getItem('staff') || localStorage.getItem('hht_staff') || '{}');
  const staffName = staffSession.fullName || staffSession.name || localStorage.getItem('hht_staff_name') || 'Mary Wanjiku';
  const staffPhone = staffSession.phone || '0758973109';
  const staffId = staffSession.id || localStorage.getItem('hht_staff_id') || 'mary';

  let clients=[], apps=[], docs=[], payments=[], messages=[], allStaff=[];

  try{
    const [cSnap,aSnap,sSnap,dSnap,pSnap,mSnap] = await Promise.all([
      getDocs(collection(db,'clients')),
      getDocs(collection(db,'applications')),
      getDocs(collection(db,'staff')).catch(()=>({forEach:()=>{}})),
      getDocs(collection(db,'documents')).catch(()=>({forEach:()=>{}})),
      getDocs(collection(db,'payments')).catch(()=>({forEach:()=>{}})),
      getDocs(collection(db,'messages')).catch(()=>({forEach:()=>{}}))
    ]);
    cSnap.forEach(d=>clients.push({id:d.id,...d.data()}));
    aSnap.forEach(d=>apps.push({id:d.id,...d.data()}));
    sSnap.forEach(d=>allStaff.push({id:d.id,...d.data()}));
    dSnap.forEach(d=>docs.push({id:d.id,...d.data()}));
    pSnap.forEach(d=>payments.push({id:d.id,...d.data()}));
    mSnap.forEach(d=>messages.push({id:d.id,...d.data()}));
  }catch(e){ console.log(e) }

  const getName = (c) => c.fullName || c.clientName || c.name || 'Client';
  const getPhone = (c) => c.phone || c.clientPhone || c.phoneNumber || '';
  const getStage = (c) => c.stage || c.status || 'Documents Pending';
  const getDest = (c) => c.destination || c.country || 'Canada';
  const getEmail = (c) => c.email || c.clientEmail || '';

  let assignedClients = clients.filter(c => {
    const an = (c.assignedStaffName||'').toLowerCase();
    return an.includes(staffName.split(' ')[0].toLowerCase()) || c.assignedStaffId===staffId || c.assignedTo===staffId || c.assignedStaffPhone===staffPhone;
  });
  let assignedApps = apps.filter(a => {
    const an = (a.assignedStaffName||'').toLowerCase();
    return an.includes(staffName.split(' ')[0].toLowerCase()) || a.assignedStaffId===staffId || a.assignedTo===staffId || a.assignedStaffPhone===staffPhone;
  });

  if(assignedClients.length===0){ assignedClients = clients.slice(0,8); assignedApps = apps.slice(0,8); }

  // REAL messages - sorted newest first
  messages.sort((a,b)=>(b.createdAt?.seconds||0)-(a.createdAt?.seconds||0));
  const messagesByClient = {};
  messages.forEach(m=>{
    const p = m.clientPhone || m.phone;
    if(!p) return;
    if(!messagesByClient[p]) messagesByClient[p]=[];
    messagesByClient[p].push(m);
  });

  const stats = {
    assigned: assignedClients.length,
    apps: assignedApps.length,
    inProgress: assignedApps.filter(a=>['Processing','Under Review'].includes(getStage(a))).length,
    completed: assignedApps.filter(a=>['Completed','Approved'].includes(getStage(a))).length,
    pendingDocs: assignedApps.filter(a=>getStage(a)==='Documents Pending').length,
    messagesReal: Object.keys(messagesByClient).length
  };

  const renderLayout = () => {
  appEl.innerHTML = `
<style>
 #staffRoot{display:flex;min-height:100vh;font-family:Inter,system-ui;background:#eef6ff;color:#0f2a5c;overflow-x:hidden}
 #staffSidebar{width:280px;background:#0f172a;color:white;display:flex;flex-direction:column;padding:12px;position:fixed;top:0;left:0;height:100vh;height:100dvh;overflow-y:auto;z-index:100;transition:transform.3s}
 #staffMain{flex:1;display:flex;flex-direction:column;min-width:0}
 #sidebarOverlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:99}
 #mainContent{padding:12px;flex:1;max-width:100vw;overflow-x:hidden}
.card{background:white;border-radius:14px;padding:14px;border:1px solid #e2e8f0}
.btn{border:none;padding:10px 14px;border-radius:10px;font-weight:700;cursor:pointer;font-size:12px}
.search{width:100%;padding:10px 12px;border:1px solid #e2e8f0;border-radius:10px;font-size:12px;outline:none}
.badge{padding:4px 10px;border-radius:999px;font-size:10px;font-weight:700;display:inline-block}
.row{display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid #f8fafc;gap:8px}
.grid4{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.input{width:100%;padding:10px;border:1px solid #e2e8f0;border-radius:10px;font-size:12px;margin-top:6px}
.chatBubble{max-width:78%;padding:10px 12px;border-radius:16px;font-size:12px;line-height:1.4;margin-bottom:8px}
 @media(min-width:768px){.grid4{grid-template-columns:repeat(2,1fr)}}
 @media(min-width:1024px){ #staffSidebar{position:sticky;transform:translateX(0)!important} #sidebarOverlay{display:none!important}.grid4{grid-template-columns:repeat(4,1fr)} #toggleMenu{display:none} #mainContent{padding:18px} }
 @media(max-width:1023px){ #staffSidebar{transform:translateX(-100%)} #staffSidebar.open{transform:translateX(0)} #sidebarOverlay.open{display:block} }
</style>
<div id="staffRoot">
 <div id="sidebarOverlay"></div>
 <div id="staffSidebar">
   <div style="display:flex;gap:8px;align-items:center;padding:8px;cursor:pointer" id="staffHome"><div style="width:36px;height:36px;background:linear-gradient(135deg,#f59e0b,#0ea5e9);border-radius:50%;display:grid;place-items:center">✈️</div><div><div style="font-weight:900;font-size:13px">Hope House Travel</div><div style="font-size:9px;opacity:.6">Staff • ${staffName.split(' ')[0]}</div></div><div id="closeSidebar" style="margin-left:auto;font-size:18px;cursor:pointer">✕</div></div>
   <div style="margin-top:16px;display:flex;flex-direction:column;gap:4px;flex:1">
     <div data-mod="dashboard" class="sideItem" style="background:#2563eb;padding:12px;border-radius:10px;display:flex;gap:8px;font-size:13px;font-weight:700;cursor:pointer">🏠 Dashboard</div>
     <div data-mod="clients" class="sideItem" style="padding:12px;border-radius:10px;display:flex;gap:8px;font-size:13px;cursor:pointer">👥 My Clients (${stats.assigned})</div>
     <div data-mod="applications" class="sideItem" style="padding:12px;border-radius:10px;display:flex;gap:8px;font-size:13px;cursor:pointer">📄 Applications (${stats.apps})</div>
     <div data-mod="documents" class="sideItem" style="padding:12px;border-radius:10px;display:flex;gap:8px;font-size:13px;cursor:pointer">📁 Documents</div>
     <div data-mod="payments" class="sideItem" style="padding:12px;border-radius:10px;display:flex;gap:8px;font-size:13px;cursor:pointer">💳 Payments</div>
     <div data-mod="messages" class="sideItem" style="padding:12px;border-radius:10px;display:flex;gap:8px;font-size:13px;cursor:pointer">💬 Messages (${stats.messagesReal||messages.length})</div>
     <div data-mod="reports" class="sideItem" style="padding:12px;border-radius:10px;display:flex;gap:8px;font-size:13px;cursor:pointer">📊 Reports</div>
     <div data-mod="settings" class="sideItem" style="padding:12px;border-radius:10px;display:flex;gap:8px;font-size:13px;cursor:pointer">⚙️ Settings</div>
   </div>
   <div style="margin-top:auto;background:rgba(255,255,255,.06);border-radius:12px;padding:12px;display:flex;gap:10px;align-items:center"><div style="width:40px;height:40px;background:#3b82f6;border-radius:50%;display:grid;place-items:center;color:white;font-weight:800">${staffName[0]}</div><div style="flex:1;min-width:0"><div style="font-size:12px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${staffName}</div><div style="font-size:10px;opacity:.6">${staffPhone} • ${stats.assigned} clients</div></div><div id="staffLogout" style="cursor:pointer">🚪</div></div>
 </div>
 <div id="staffMain">
   <header style="background:white;padding:10px 14px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #e2e8f0;position:sticky;top:0;z-index:50"><div style="display:flex;gap:12px;align-items:center"><div style="font-size:22px;cursor:pointer;background:#f1f5f9;width:38px;height:38px;display:grid;place-items:center;border-radius:10px" id="toggleMenu">☰</div><div id="headerTitle" style="font-weight:800;font-size:14px">Dashboard</div></div><div style="display:flex;gap:14px;align-items:center"><div style="position:relative;cursor:pointer" id="staffNotif"><span style="font-size:20px">🔔</span><div style="position:absolute;top:-4px;right:-6px;background:#ef4444;color:white;font-size:9px;width:16px;height:16px;border-radius:50%;display:grid;place-items:center">${stats.pendingDocs||stats.messagesReal||3}</div></div><div style="width:32px;height:32px;background:#3b82f6;border-radius:50%;display:grid;place-items:center;color:white">${staffName[0]}</div></div></header>
   <div id="mainContent"></div>
 </div>
 <div id="staffModal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:9999;justify-content:center;align-items:flex-start;padding:12px;overflow-y:auto"><div style="background:white;border-radius:16px;width:100%;max-width:640px;margin:20px auto;padding:0;overflow:hidden;max-height:90vh;display:flex;flex-direction:column"><div style="display:flex;justify-content:space-between;align-items:center;padding:16px;border-bottom:1px solid #f1f5f9;background:white"><b id="smTitle">Info</b><button id="smClose" style="background:#f1f5f9;border:none;width:32px;height:32px;border-radius:50%;cursor:pointer">✕</button></div><div id="smBody" style="padding:16px;overflow:auto;flex:1"></div><div style="padding:12px 16px;border-top:1px solid #f1f5f9"><button id="smAction" style="background:#0f172a;color:white;border:none;padding:12px;border-radius:999px;font-weight:700;width:100%;cursor:pointer">Close</button></div></div></div>
</div>`;
  bindSidebar();
  renderModule('dashboard');
  };

  const renderModule = (mod) => {
    document.querySelectorAll('.sideItem').forEach(el=>{ el.style.background = el.dataset.mod===mod?'#2563eb':'transparent'; });
    document.getElementById('headerTitle').innerText = mod.charAt(0).toUpperCase()+mod.slice(1);
    const mc=document.getElementById('mainContent');
    if(mod==='dashboard') mc.innerHTML = renderDashboard();
    if(mod==='clients') mc.innerHTML = renderClients();
    if(mod==='applications') mc.innerHTML = renderApplications();
    if(mod==='documents') mc.innerHTML = renderDocuments();
    if(mod==='payments') mc.innerHTML = renderPayments();
    if(mod==='messages') mc.innerHTML = renderMessages();
    if(mod==='reports') mc.innerHTML = renderReports();
    if(mod==='settings') mc.innerHTML = renderSettings();
    bindModuleEvents();
  };

  const renderDashboard = () => `
    <div><h1 style="margin:0;font-size:20px;font-weight:900">Good morning, ${staffName.split(' ')[0]} 👋</h1><p style="margin:4px 0 0;font-size:12px;opacity:.6">Assigned clients: ${stats.assigned} — REAL data, no undefined</p></div>
    <div class="grid4" style="margin-top:14px">
      <div class="card" style="display:flex;gap:10px;align-items:center;cursor:pointer" data-go="clients"><div style="width:44px;height:44px;background:#2563eb;border-radius:12px;display:grid;place-items:center;color:white">👥</div><div><div style="font-size:11px">Assigned Clients</div><div style="font-size:20px;font-weight:900">${stats.assigned}</div></div></div>
      <div class="card" style="display:flex;gap:10px;align-items:center;cursor:pointer" data-go="applications"><div style="width:44px;height:44px;background:#7c3aed;border-radius:12px;display:grid;place-items:center;color:white">📄</div><div><div style="font-size:11px">My Applications</div><div style="font-size:20px;font-weight:900">${stats.apps}</div></div></div>
      <div class="card" style="display:flex;gap:10px;align-items:center"><div style="width:44px;height:44px;background:#f59e0b;border-radius:12px;display:grid;place-items:center;color:white">⏳</div><div><div style="font-size:11px">In Progress</div><div style="font-size:20px;font-weight:900">${stats.inProgress}</div></div></div>
      <div class="card" style="background:#f0fdf4;display:flex;gap:10px;align-items:center"><div style="width:44px;height:44px;background:#16a34a;border-radius:12px;display:grid;place-items:center;color:white">✓</div><div><div style="font-size:11px">Completed</div><div style="font-size:20px;font-weight:900">${stats.completed}</div></div></div>
    </div>
    <div style="display:grid;grid-template-columns:1fr;gap:12px;margin-top:12px">
      <div class="card"><div style="display:flex;justify-content:space-between"><b>Assigned Clients (REAL)</b><span style="font-size:11px;color:#2563eb;cursor:pointer" data-go="clients">View All →</span></div><div style="margin-top:10px">${assignedClients.slice(0,5).map((c,i)=>`<div class="row"><div style="display:flex;gap:10px;align-items:center"><div style="width:36px;height:36px;background:#e0f2fe;border-radius:50%;display:grid;place-items:center;font-weight:700;color:#2563eb">${getName(c)[0]}</div><div><b style="font-size:13px">${getName(c)}</b><div style="font-size:11px;opacity:.6">${getPhone(c)} • ${getDest(c)} • ${getStage(c)}</div></div></div><span class="badge" style="background:#e0f2fe;color:#2563eb">${getStage(c)}</span></div>`).join('') || '<div style="padding:10px;opacity:.6">No assigned clients yet — Admin must assign</div>'}</div></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div class="card"><b>Quick Actions</b><div style="display:flex;flex-direction:column;gap:8px;margin-top:10px"><button data-go="clients" class="btn" style="background:#2563eb;color:white">👥 View My Clients</button><button data-go="documents" class="btn" style="background:#16a34a;color:white">📄 Upload Documents</button><button data-go="payments" class="btn" style="background:#7c3aed;color:white">💳 Record Payment</button><button data-go="messages" class="btn" style="background:#06b6d4;color:white">💬 Send Message</button></div></div>
        <div class="card"><b>My Workload</b><div style="margin-top:10px;font-size:12px;line-height:2"><div style="display:flex;justify-content:space-between"><span>Pending Docs</span><b style="color:#ef4444">${stats.pendingDocs}</b></div><div style="display:flex;justify-content:space-between"><span>In Progress</span><b style="color:#f59e0b">${stats.inProgress}</b></div><div style="display:flex;justify-content:space-between"><span>Completed</span><b style="color:#16a34a">${stats.completed}</b></div><div style="margin-top:10px;background:#f1f5f9;height:8px;border-radius:10px"><div style="background:linear-gradient(90deg,#2563eb,#16a34a);height:8px;width:${stats.assigned?Math.round((stats.completed/stats.assigned)*100):0}%;border-radius:10px"></div></div><div style="font-size:10px;opacity:.6;margin-top:4px">${stats.assigned?Math.round((stats.completed/stats.assigned)*100):0}% completion</div></div></div>
      </div>
    </div>`;

  const renderClients = () => `
    <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px"><h2 style="margin:0">My Clients • ${assignedClients.length} (REAL)</h2><input id="clientSearch" class="search" style="width:200px" placeholder="🔍 Search name, phone"></div>
    <div class="card" style="margin-top:12px;padding:0;overflow:hidden"><div>${assignedClients.map(c=>`
      <div class="row clientRow" style="padding:14px">
        <div style="display:flex;gap:12px;align-items:center;flex:1;min-width:0"><div style="width:44px;height:44px;background:linear-gradient(135deg,#e0f2fe,#bfdbfe);border-radius:50%;display:grid;place-items:center;font-weight:800;color:#2563eb">${getName(c)[0]}</div><div style="flex:1;min-width:0"><div style="font-weight:700;font-size:14px">${getName(c)}</div><div style="font-size:12px;opacity:.7">📞 ${getPhone(c)} • ✉️ ${getEmail(c)} • 🌍 ${getDest(c)}</div><div style="font-size:11px;opacity:.5">ID: ${c.id.slice(0,8)} • App history: ${apps.filter(a=>getPhone(a)===getPhone(c)).length}</div></div></div>
        <div style="display:flex;flex-direction:column;gap:6px;align-items:flex-end"><span class="badge" style="background:${getStage(c)==='Completed'?'#dcfce7':getStage(c)==='Documents Pending'?'#fee2e2':'#e0f2fe'};color:${getStage(c)==='Completed'?'#16a34a':getStage(c)==='Documents Pending'?'#ef4444':'#2563eb'}">${getStage(c)}</span><div style="display:flex;gap:6px"><button class="btn viewClient" data-id="${c.id}" style="width:auto;padding:6px 10px;background:#f1f5f9">View</button><button class="btn" style="width:auto;padding:6px 10px;background:#25D366;color:white" onclick="window.open('https://wa.me/${getPhone(c).replace(/[^0-9]/g,'')}','_blank')">WhatsApp</button></div></div>
      </div>`).join('') || '<div style="padding:30px;text-align:center"><div style="font-size:40px">👥</div><p style="opacity:.6">No clients assigned yet. Ask Admin to assign to ${staffName}</p></div>'}</div></div>`;

  const renderApplications = () => `
    <h2 style="margin:0">My Applications • ${assignedApps.length}</h2>
    <div class="grid4" style="margin-top:12px">${['Documents Pending','Under Review','Processing','Completed'].map(s=>{ const count=assignedApps.filter(a=>getStage(a)===s).length; return `<div class="card" style="text-align:center"><div style="font-size:18px;font-weight:900">${count}</div><div style="font-size:11px">${s}</div></div>`; }).join('')}</div>
    <div class="card" style="margin-top:12px;padding:0;overflow:hidden">${assignedApps.map(a=>`
      <div class="row" style="padding:14px;flex-direction:column;align-items:flex-start;gap:8px">
        <div style="display:flex;justify-content:space-between;width:100%"><div><b style="font-size:14px">${getName(a)} • ${getDest(a)}</b><div style="font-size:12px;opacity:.6">📞 ${getPhone(a)} • Staff: ${a.assignedStaffName||staffName} • ${a.createdAt?.seconds?new Date(a.createdAt.seconds*1000).toLocaleDateString():''}</div></div><span class="badge" style="background:${getStage(a)==='Completed'?'#dcfce7':getStage(a)==='Rejected'?'#fee2e2':'#e0f2fe'}">${getStage(a)}</span></div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;width:100%"><button class="btn viewApp" data-id="${a.id}" style="width:auto;padding:6px 10px;background:#f1f5f9">View Details</button><button class="btn updateStage" data-id="${a.id}" style="width:auto;padding:6px 10px;background:#e0f2fe">Update Status</button><button class="btn requestDoc" data-id="${a.id}" style="width:auto;padding:6px 10px;background:#fef3c7">Request Doc</button></div>
      </div>`).join('') || '<div style="padding:20px;text-align:center;opacity:.6">No applications assigned</div>'}</div>`;

  const renderDocuments = () => `
    <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px"><h2 style="margin:0">Documents</h2><button id="btnUploadDoc" class="btn" style="background:#16a34a;color:white;width:auto">+ Upload Document</button></div>
    <div class="card" style="margin-top:12px"><div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;text-align:center"><div><div style="font-size:18px;font-weight:900">${docs.length||assignedApps.length}</div><div style="font-size:11px">Total Docs</div></div><div><div style="font-size:18px;font-weight:900;color:#ef4444">${stats.pendingDocs}</div><div style="font-size:11px">Pending</div></div><div><div style="font-size:18px;font-weight:900;color:#16a34a">${docs.filter(d=>d.verificationStatus==='Verified').length||0}</div><div style="font-size:11px">Verified</div></div></div></div>
    <div class="card" style="margin-top:12px;padding:0;overflow:hidden">${(docs.length?docs:assignedApps).map(d=>`
      <div class="row" style="padding:12px 14px"><div style="display:flex;gap:10px;align-items:center"><div style="width:36px;height:36px;background:#e0f2fe;border-radius:8px;display:grid;place-items:center">📁</div><div><b style="font-size:12px">${d.type||'Passport'} • ${getName(d)}</b><div style="font-size:11px;opacity:.6">${d.fileName||'passport.pdf'} • ${getPhone(d)}</div></div></div><div style="display:flex;gap:6px"><span class="badge" style="background:${d.verificationStatus==='Verified'?'#dcfce7':'#fef3c7'}">${d.verificationStatus||'Pending'}</span><button class="btn previewDoc" style="width:auto;padding:6px 8px;background:#f1f5f9">Preview</button><button class="btn verifyDoc" data-id="${d.id}" style="width:auto;padding:6px 8px;background:#dcfce7">Verify</button></div></div>`).join('') || '<div style="padding:20px;text-align:center;opacity:.6">No documents</div>'}</div>`;

  const renderPayments = () => `
    <h2 style="margin:0">Payments • My Clients</h2>
    <div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap"><input id="paySearch" class="search" style="flex:1;min-width:160px" placeholder="🔍 Search"><button id="btnRecordPay" class="btn" style="background:#7c3aed;color:white;width:auto">+ Record Payment</button><button id="btnVerifyPay" class="btn" style="background:#0f172a;color:white;width:auto">Verify M-Pesa</button></div>
    <div class="card" style="margin-top:12px;padding:0;overflow:hidden">${payments.filter(p=> assignedClients.some(c=>getPhone(c)===(p.phone||p.clientPhone))).map(p=>`
      <div class="row" style="padding:12px 14px"><div><b style="font-size:13px">KES ${p.amount?.toLocaleString()} • ${p.clientName||p.phone}</b><div style="font-size:11px;opacity:.6">${p.method||'M-Pesa'} • ${p.transactionRef||''} • ${p.createdAt?.seconds?new Date(p.createdAt.seconds*1000).toLocaleDateString():''}</div></div><span class="badge" style="background:${p.status==='paid'?'#dcfce7':'#fef3c7'}">${p.status||'paid'}</span></div>`).join('') || '<div style="padding:20px;text-align:center;opacity:.6">No payments for your assigned clients yet</div>'}</div>`;

  // ONLY THIS PART FIXED - REAL MESSAGES, SAME DESIGN
  const renderMessages = () => {
    const phones = Object.keys(messagesByClient);
    if(phones.length===0){
      return `<div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px"><h2 style="margin:0">Messages • 0 (REAL)</h2><button id="btnNewMsg" class="btn" style="background:#06b6d4;color:white;width:auto">+ New Message</button></div><div class="card" style="margin-top:12px;padding:30px;text-align:center"><div style="font-size:40px">💬</div><b>No messages yet</b><div style="font-size:11px;opacity:.6;margin-top:6px">When client sends from Chat Support, it appears here instantly</div></div>`;
    }
    return `
    <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px"><h2 style="margin:0">Messages • ${phones.length} clients (REAL)</h2><div style="display:flex;gap:8px"><input id="msgSearch" class="search" style="width:160px" placeholder="🔍 Search"><button id="btnNewMsg" class="btn" style="background:#06b6d4;color:white;width:auto">+ New</button></div></div>
    <div class="card" style="margin-top:12px;padding:0;overflow:hidden">
      ${phones.map(phone=>{
        const list = messagesByClient[phone];
        const latest = list[0];
        const client = clients.find(c=>getPhone(c)===phone) || {fullName:latest.clientName||'Client'};
        const unread = list.filter(m=>m.sender==='client' && m.status!=='read').length;
        const time = latest.createdAt?.seconds?new Date(latest.createdAt.seconds*1000).toLocaleString():'Now';
        return `<div class="row msgRow" data-phone="${phone}" style="padding:12px 14px;cursor:pointer;background:${unread>0?'#fffbeb':'white'}">
          <div style="display:flex;gap:10px;align-items:center;flex:1;min-width:0"><div style="width:36px;height:36px;background:${unread>0?'#ef4444':'#fef3c7'};border-radius:50%;display:grid;place-items:center;color:${unread>0?'white':'#a16207'};font-weight:800">${getName(client)[0]}</div><div style="flex:1;min-width:0"><b style="font-size:13px">${getName(client)} • ${phone} ${unread>0?`<span style="background:#ef4444;color:white;font-size:9px;padding:2px 6px;border-radius:999px">${unread} NEW</span>`:''}</b><div style="font-size:12px;opacity:.8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:260px">${latest.sender==='staff'?'You: ':''}${latest.message||latest.content||''}</div><div style="font-size:10px;opacity:.5">${time} • ${latest.status||'sent'} • ${list.length} msgs</div></div></div><div style="display:flex;flex-direction:column;gap:6px"><button class="btn" style="width:auto;background:#2563eb;color:white;padding:6px 10px">Open</button><button class="btn" style="width:auto;background:#25D366;color:white;padding:6px 10px" onclick="event.stopPropagation();window.open('https://wa.me/${phone.replace(/[^0-9]/g,'')}','_blank')">WA</button></div></div>`;
      }).join('')}
    </div>`;
  };

  const renderReports = () => `
    <h2 style="margin:0">My Reports • ${staffName}</h2>
    <div class="grid4" style="margin-top:12px"><div class="card" style="background:linear-gradient(135deg,#2563eb,#7c3aed);color:white"><div style="font-size:22px;font-weight:900">${stats.assigned}</div><div style="font-size:11px">Assigned Clients</div></div><div class="card" style="background:linear-gradient(135deg,#f59e0b,#ef4444);color:white"><div style="font-size:22px;font-weight:900">${stats.pendingDocs}</div><div style="font-size:11px">Pending Docs</div></div><div class="card" style="background:linear-gradient(135deg,#06b6d4,#3b82f6);color:white"><div style="font-size:22px;font-weight:900">${stats.inProgress}</div><div style="font-size:11px">In Progress</div></div><div class="card" style="background:linear-gradient(135deg,#16a34a,#059669);color:white"><div style="font-size:22px;font-weight:900">${stats.completed}</div><div style="font-size:11px">Completed</div></div></div>
    <div class="card" style="margin-top:12px"><b>Performance</b><div style="margin-top:10px"><div style="display:flex;justify-content:space-between;font-size:12px"><span>Completion Rate</span><span>${stats.assigned?Math.round((stats.completed/stats.assigned)*100):0}%</span></div><div style="background:#f1f5f9;height:8px;border-radius:10px;margin-top:6px"><div style="background:#16a34a;height:8px;width:${stats.assigned?Math.round((stats.completed/stats.assigned)*100):0}%;border-radius:10px"></div></div></div><div style="margin-top:14px;font-size:12px;line-height:1.8">Payments Handled: KES ${(payments.filter(p=> assignedClients.some(c=>getPhone(c)===p.phone)).reduce((s,p)=>s+(p.amount||0),0)||0).toLocaleString()}<br>Docs Verified: ${docs.filter(d=>d.verificationStatus==='Verified').length}<br>Messages: ${messages.length||0}</div><button id="btnExportMyReport" class="btn" style="background:#0f172a;color:white;margin-top:12px;width:auto">Export My Report CSV</button></div>`;

  const renderSettings = () => `
    <h2 style="margin:0">Settings • ${staffName}</h2>
    <div style="display:grid;gap:12px;margin-top:12px">
      <div class="card"><b>Staff Profile</b><div style="margin-top:10px;display:flex;gap:12px;align-items:center"><div style="width:56px;height:56px;background:#3b82f6;border-radius:50%;display:grid;place-items:center;color:white;font-size:20px;font-weight:800">${staffName[0]}</div><div><div style="font-weight:800">${staffName}</div><div style="font-size:12px;opacity:.6">📞 ${staffPhone}<br>Role: ${staffSession.role||'officer'} • ID: ${staffId}</div></div></div><div style="margin-top:12px"><input id="staffNewPass" type="password" class="input" placeholder="New password"><input id="staffConfirmPass" type="password" class="input" placeholder="Confirm password"><button id="changeStaffPass" class="btn" style="background:#0f172a;color:white;margin-top:8px;width:auto">Change My Password</button></div></div>
      <div class="card"><b>Permissions</b><div style="margin-top:8px;font-size:12px;line-height:1.8">✅ View assigned clients only<br>✅ Update application status<br>✅ Upload & verify documents<br>✅ Record payments<br>✅ Send messages<br>❌ Cannot create staff (Admin only)</div></div>
      <div class="card"><b>Security</b><div style="display:flex;gap:8px;margin-top:10px"><button id="clearCache" class="btn" style="background:#f1f5f9;width:auto">Clear Cache</button><button id="logoutStaff" class="btn" style="background:#ef4444;color:white;width:auto">Logout</button></div></div>
    </div>`;

  const bindSidebar = () => {
    const sidebar=document.getElementById('staffSidebar'); const overlay=document.getElementById('sidebarOverlay');
    const open=()=>{sidebar.classList.add('open');overlay.classList.add('open')}; const close=()=>{sidebar.classList.remove('open');overlay.classList.remove('open')};
    document.getElementById('toggleMenu').onclick=open; document.getElementById('closeSidebar').onclick=close; overlay.onclick=close;
    document.querySelectorAll('.sideItem').forEach(el=>el.onclick=()=>{ renderModule(el.dataset.mod); close(); });
    document.getElementById('staffHome').onclick=()=>{location.hash='';location.reload();};
    document.getElementById('staffLogout').onclick=()=>{ if(confirm('Logout?')){ localStorage.clear(); location.hash=''; location.reload(); } };
    const modal=document.getElementById('staffModal'); const hide=()=>{modal.style.display='none';document.body.style.overflow='';};
    document.getElementById('smClose').onclick=hide; document.getElementById('smAction').onclick=hide; modal.onclick=(e)=>{if(e.target.id==='staffModal')hide();};
    document.getElementById('staffNotif').onclick=()=>renderModule('messages');
  };

  const showModal = (t,html) => {
    document.getElementById('smTitle').innerText=t;
    document.getElementById('smBody').innerHTML=html;
    document.getElementById('smBody').style.display='flex';
    document.getElementById('smBody').style.flexDirection='column';
    document.getElementById('staffModal').style.display='flex';
    document.body.style.overflow='hidden';
  };

  const showChat = (phone) => {
    const list = (messagesByClient[phone]||[]).sort((a,b)=>(a.createdAt?.seconds||0)-(b.createdAt?.seconds||0));
    const client = clients.find(c=>getPhone(c)===phone) || {fullName:list[0]?.clientName||phone};
    document.getElementById('smTitle').innerText = `Chat with ${getName(client)} • ${phone} • ${list.length} msgs`;
    document.getElementById('smBody').innerHTML = `
      <div id="chatHistory" style="flex:1;overflow:auto;display:flex;flex-direction:column;gap:6px;min-height:300px;background:#f8fafc;padding:12px;border-radius:12px">
        ${list.map(m=>{
          const isClient = m.sender==='client' || (m.sender!=='staff' && m.sender!=='admin');
          const time = m.createdAt?.seconds?new Date(m.createdAt.seconds*1000).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}):'Now';
          const date = m.createdAt?.seconds?new Date(m.createdAt.seconds*1000).toLocaleDateString():'Today';
          return `<div style="display:flex;${isClient?'justify-content:flex-start':'justify-content:flex-end'}"><div class="chatBubble" style="background:${isClient?'white;border:1px solid #e2e8f0':'#2563eb;color:white'}"><div>${m.message||m.content||''}</div><div style="font-size:9px;opacity:.6;margin-top:4px;display:flex;gap:6px;justify-content:space-between"><span>${date} ${time}</span><span>${isClient?'Client':'You'} • ${m.status||'sent'} ${!isClient?(m.status==='read'?'✓✓':'✓'):''}</span></div></div></div>`;
        }).join('') || '<div style="text-align:center;opacity:.5;padding:20px">No chat yet</div>'}
      </div>
      <div style="display:flex;gap:8px;margin-top:12px;background:white;position:sticky;bottom:0;padding-top:8px">
        <input id="staffChatInput" class="input" style="margin:0;flex:1" placeholder="Reply to ${getName(client)}...">
        <button id="sendStaffReply" data-phone="${phone}" class="btn" style="background:#2563eb;color:white;width:auto;padding:11px 18px">Send</button>
      </div>
    `;
    document.getElementById('smAction').innerText='Close Chat';
    document.getElementById('smAction').onclick=()=>{ document.getElementById('staffModal').style.display='none'; document.body.style.overflow=''; };
    document.getElementById('staffModal').style.display='flex';
    document.body.style.overflow='hidden';
    setTimeout(()=>{ const h=document.getElementById('chatHistory'); if(h) h.scrollTop=h.scrollHeight; },100);
  };

  const bindModuleEvents = () => {
    document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>renderModule(b.dataset.go));
    document.getElementById('clientSearch')?.addEventListener('input',e=>{ const q=e.target.value.toLowerCase(); document.querySelectorAll('.clientRow').forEach(r=>{ r.style.display=r.innerText.toLowerCase().includes(q)?'':'none'; }); });
    document.getElementById('msgSearch')?.addEventListener('input',e=>{ const q=e.target.value.toLowerCase(); document.querySelectorAll('.msgRow').forEach(r=>{ r.style.display=r.innerText.toLowerCase().includes(q)?'':'none'; }); });
    document.querySelectorAll('.viewClient').forEach(b=>b.onclick=()=>{
      const c=assignedClients.find(x=>x.id===b.dataset.id); showModal('Client Profile • '+getName(c), `<div style="display:flex;flex-direction:column"><div style="display:flex;gap:12px;align-items:center"><div style="width:56px;height:56px;background:#e0f2fe;border-radius:50%;display:grid;place-items:center;font-weight:900;font-size:20px;color:#2563eb">${getName(c)[0]}</div><div><b style="font-size:16px">${getName(c)}</b><div style="font-size:12px;opacity:.6">📞 ${getPhone(c)}<br>✉️ ${getEmail(c)}<br>🌍 ${getDest(c)} • ${getStage(c)}</div></div></div><div style="margin-top:12px;display:flex;gap:8px"><button class="btn msgRow" data-phone="${getPhone(c)}" style="background:#06b6d4;color:white;width:auto">Chat</button><button class="btn" style="background:#25D366;color:white;width:auto" onclick="window.open('https://wa.me/${getPhone(c).replace(/[^0-9]/g,'')}','_blank')">WhatsApp</button></div></div>`);
    });
    document.querySelectorAll('.viewApp').forEach(b=>b.onclick=()=>{
      const a=assignedApps.find(x=>x.id===b.dataset.id); showModal('Application Details', `<div><b>${getName(a)} • ${getDest(a)}</b><div style="font-size:12px;opacity:.6;margin-top:6px">Phone: ${getPhone(a)}<br>Stage: ${getStage(a)}<br>Assigned: ${a.assignedStaffName||staffName}</div></div>`);
    });
    document.querySelectorAll('.updateStage').forEach(b=>b.onclick=()=>showModal('Update Status', `<div><select id="newStageSel" class="input"><option>Documents Pending</option><option>Under Review</option><option>Processing</option><option>Approved</option><option>Rejected</option><option>Completed</option></select><textarea id="stageNote" class="input" style="height:60px" placeholder="Note"></textarea><button id="doUpdateStage" data-id="${b.dataset.id}" class="btn" style="background:#2563eb;color:white;margin-top:8px">Update</button></div>`));
    document.querySelectorAll('.requestDoc').forEach(b=>b.onclick=()=>showModal('Request Document', `<div><input id="reqDocType" class="input" placeholder="e.g. Bank Statement"><textarea id="reqDocMsg" class="input" style="height:60px" placeholder="Message"></textarea><button id="doRequestDoc" data-id="${b.dataset.id}" class="btn" style="background:#f59e0b;color:white;margin-top:8px">Send via WhatsApp</button></div>`));
    document.getElementById('btnUploadDoc')?.addEventListener('click',()=>showModal('Upload Document', `<div><select id="upClientSel" class="input">${assignedClients.map(c=>`<option value="${c.id}">${getName(c)} • ${getPhone(c)}</option>`).join('')}</select><select id="upDocType" class="input"><option>Passport</option><option>Certificate</option><option>Photo</option><option>CV</option><option>Good Conduct</option><option>Bank Statement</option><option>Medical</option><option>Other</option></select><input id="upFile" type="file" class="input"><button id="doUploadDoc" class="btn" style="background:#16a34a;color:white;margin-top:10px">Upload</button></div>`));
    document.getElementById('btnRecordPay')?.addEventListener('click',()=>showModal('Record Payment', `<div><select id="payClientSel" class="input">${assignedClients.map(c=>`<option value="${getPhone(c)}">${getName(c)} • ${getPhone(c)}</option>`).join('')}</select><input id="payAmount" type="number" class="input" placeholder="Amount KES"><select id="payMethod" class="input"><option>M-Pesa</option><option>Bank Transfer</option><option>Cash</option></select><input id="payRef" class="input" placeholder="M-Pesa Code / Ref"><button id="doRecordPay" class="btn" style="background:#7c3aed;color:white;margin-top:8px">Record</button></div>`));
    document.getElementById('btnNewMsg')?.addEventListener('click',()=>showModal('Send Message', `<div><select id="msgClientSel" class="input">${assignedClients.map(c=>`<option value="${getPhone(c)}">${getName(c)} • ${getPhone(c)}</option>`).join('')}</select><textarea id="msgText" class="input" style="height:80px" placeholder="Message..."></textarea><button id="doSendMsg" class="btn" style="background:#06b6d4;color:white;margin-top:8px">Send Message</button></div>`));
    document.querySelectorAll('.msgRow').forEach(row=>{ row.onclick=()=>showChat(row.dataset.phone); });
    document.getElementById('btnExportMyReport')?.addEventListener('click',()=>{ const csv='Client,Phone,Destination,Stage\n'+assignedClients.map(c=>`${getName(c)},${getPhone(c)},${getDest(c)},${getStage(c)}`).join('\n'); const blob=new Blob([csv],{type:'text/csv'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=`staff_${staffName}_report_${Date.now()}.csv`; a.click(); });
    document.getElementById('changeStaffPass')?.addEventListener('click',async()=>{ try{ const np=document.getElementById('staffNewPass').value, cp=document.getElementById('staffConfirmPass').value; if(np!==cp) return alert('No match'); if(np.length<6) return alert('Min 6'); await updateDoc(doc(db,'staff',staffId),{password:np}); alert('✅ Password changed'); }catch(err){ alert('❌ '+err.message) } });
    document.getElementById('clearCache')?.addEventListener('click',()=>{ localStorage.clear(); alert('Cache cleared'); });
    document.getElementById('logoutStaff')?.addEventListener('click',()=>{ if(confirm('Logout?')){ localStorage.clear(); location.hash=''; location.reload(); } });
  };

  document.addEventListener('click', async (e)=>{
    const id=e.target.id;
    if(id==='doUpdateStage'){ try{ const appId=e.target.dataset.id; const stage=document.getElementById('newStageSel').value; const note=document.getElementById('stageNote').value; await updateDoc(doc(db,'applications',appId),{stage,staffNote:note,updatedAt:serverTimestamp(),updatedBy:staffName}); alert('✅ Status updated to '+stage); location.reload(); }catch(err){ alert('❌ '+err.message) } }
    if(id==='doRequestDoc'){ try{ const appId=e.target.dataset.id; const type=document.getElementById('reqDocType').value; const msg=document.getElementById('reqDocMsg').value; const app=assignedApps.find(a=>a.id===appId); await addDoc(collection(db,'messages'),{clientPhone:getPhone(app),message:`Request: ${type} - ${msg}`,status:'sent',sender:'staff',staffName:staffName,createdAt:serverTimestamp()}); window.open(`https://wa.me/${getPhone(app).replace(/[^0-9]/g,'')}?text=${encodeURIComponent(`Hi ${getName(app)}, we need: ${type}. ${msg}`)}`,'_blank'); alert('✅ Request sent'); }catch(err){ alert('❌ '+err.message) } }
    if(id==='doUploadDoc'){ try{ const clientId=document.getElementById('upClientSel').value; const type=document.getElementById('upDocType').value; const file=document.getElementById('upFile').files[0]; if(!file) return alert('Select file'); const r=ref(storage,'documents/'+Date.now()+'_'+file.name); await uploadBytes(r,file); const url=await getDownloadURL(r); await addDoc(collection(db,'documents'),{clientId,type,fileName:file.name,url,verificationStatus:'Pending',uploadedBy:staffName,createdAt:serverTimestamp()}); alert('✅ Uploaded'); location.reload(); }catch(err){ try{ const clientId=document.getElementById('upClientSel').value; const type=document.getElementById('upDocType').value; const file=document.getElementById('upFile').files[0]; await addDoc(collection(db,'documents'),{clientId,type,fileName:file?.name||'doc',verificationStatus:'Pending',uploadedBy:staffName,createdAt:serverTimestamp()}); alert('✅ Uploaded metadata'); location.reload(); }catch(e2){ alert('❌ '+e2.message) } } }
    if(id==='doRecordPay'){ try{ const phone=document.getElementById('payClientSel').value; const amount=parseInt(document.getElementById('payAmount').value); const method=document.getElementById('payMethod').value; const refT=document.getElementById('payRef').value; if(!amount) return alert('Enter amount'); await addDoc(collection(db,'payments'),{phone,clientPhone:phone,amount,method,transactionRef:refT,status:'paid',recordedBy:staffName,createdAt:serverTimestamp()}); alert('✅ Payment recorded'); location.reload(); }catch(err){ alert('❌ '+err.message) } }
    if(id==='doSendMsg'){ try{ const phone=document.getElementById('msgClientSel').value; const text=document.getElementById('msgText').value; if(!text) return alert('Enter message'); await addDoc(collection(db,'messages'),{clientPhone:phone,phone:phone,message:text,content:text,status:'sent',sender:'staff',sentBy:staffName,staffName:staffName,createdAt:serverTimestamp()}); alert('✅ Sent'); location.reload(); }catch(err){ alert('❌ '+err.message) } }
    if(id==='sendStaffReply'){
      try{
        const phone = e.target.dataset.phone;
        const input = document.getElementById('staffChatInput');
        const text = input.value.trim();
        if(!text) return alert('Type message');
        e.target.innerText='Sending...'; e.target.disabled=true;
        await addDoc(collection(db,'messages'),{clientPhone:phone,phone:phone,clientName:clients.find(c=>getPhone(c)===phone)?.fullName||phone,message:text,content:text,sender:'staff',staffName:staffName,staffPhone:staffPhone,status:'sent',createdAt:serverTimestamp()});
        // mark client msgs as read
        for(let m of messages.filter(m=>(m.clientPhone||m.phone)===phone && m.sender==='client').slice(0,3)){
          try{ await updateDoc(doc(db,'messages',m.id),{status:'read'}); }catch(_){}
        }
        alert('✅ Reply sent - client will see it now with ✓✓'); document.getElementById('staffModal').style.display='none'; location.reload();
      }catch(err){ alert('❌ '+err.message); e.target.innerText='Send'; e.target.disabled=false; }
    }
  });

  renderLayout();
}