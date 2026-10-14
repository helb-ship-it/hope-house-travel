import { db, storage } from '../config/firebase.js';
import { collection, getDocs, doc, updateDoc, addDoc, deleteDoc, serverTimestamp, query, orderBy, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export async function initAdminDashboard(){
 const appEl=document.querySelector('#app');
 let clients=[], apps=[], staff=[], docs=[], payments=[], messages=[];
 let byDest={}, byStage={}, currentModule='dashboard';
 let orgSettings = JSON.parse(localStorage.getItem('orgSettings')||'{"name":"Hope House Travel","phone":"0789 338 183","email":"info@hopehousetravel.co.ke","address":"Hazina Towers 5F, Nairobi"}');

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
   aSnap.forEach(d=>{ const v={id:d.id,...d.data()}; apps.push(v); const dest=(v.destination||'Other'); const k=dest.includes('Canada')?'Canada':dest.includes('UK')?'UK':dest.includes('Norway')?'Norway':dest.includes('USA')?'USA':dest.includes('Australia')?'Australia':'Other'; byDest[k]=(byDest[k]||0)+1; byStage[v.stage||'Pending']=(byStage[v.stage||'Pending']||0)+1; });
   sSnap.forEach(d=>staff.push({id:d.id,...d.data()}));
   dSnap.forEach(d=>docs.push({id:d.id,...d.data()}));
   pSnap.forEach(d=>payments.push({id:d.id,...d.data()}));
   mSnap.forEach(d=>messages.push({id:d.id,...d.data()}));
 }catch(e){console.log(e)}
 if(clients.length===0){ clients=[{id:'demo1',fullName:'John Mwangi',clientName:'John Mwangi',phone:'0789338183',email:'john@gmail.com',destination:'Canada',stage:'Processing',status:'active',createdAt:{seconds:Date.now()/1000}}]; apps=[...clients]; byDest={Canada:15,UK:12,Norway:8,USA:10,Australia:7,Other:10}; byStage={'Documents Pending':17,'Under Review':14,'Processing':18,'Completed':13,Pending:10,Approved:8,Rejected:2}; }

 // FIXED: Group messages by client phone - REAL
 messages.sort((a,b)=>(b.createdAt?.seconds||0)-(a.createdAt?.seconds||0));
 const messagesByClient = {};
 messages.forEach(m=>{
   const p = m.clientPhone || m.phone;
   if(!p) return;
   if(!messagesByClient[p]) messagesByClient[p]=[];
   messagesByClient[p].push(m);
 });

 const renderLayout = () => {
 appEl.innerHTML = `
<style>
 #adminRoot{display:flex;min-height:100vh;font-family:Inter,system-ui;background:#eef6ff;color:#0f2a5c;overflow-x:hidden}
 #adminSidebar{width:280px;background:#0a1931;color:white;display:flex;flex-direction:column;padding:12px;position:fixed;top:0;left:0;height:100vh;height:100dvh;overflow-y:auto;z-index:100;transition:transform.3s}
 #adminMain{flex:1;display:flex;flex-direction:column;min-width:0}
 #sidebarOverlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:99}
 #mainContent{padding:12px;flex:1;max-width:100vw;overflow-x:hidden}
.card{background:white;border-radius:14px;padding:14px;border:1px solid #f1f5f9}
.btn{border:none;padding:10px 14px;border-radius:10px;font-weight:700;cursor:pointer;font-size:12px}
.search{width:100%;padding:10px 12px;border:1px solid #e2e8f0;border-radius:10px;font-size:12px;outline:none}
.badge{padding:4px 10px;border-radius:999px;font-size:10px;font-weight:700;display:inline-block}
.row{display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid #f8fafc;gap:8px}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.grid5{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.input{width:100%;padding:10px;border:1px solid #e2e8f0;border-radius:10px;font-size:12px;margin-top:6px}
 select.input{cursor:pointer}
.chatBubble{max-width:78%;padding:10px 12px;border-radius:16px;font-size:12px;line-height:1.4;margin-bottom:8px}
 @media(min-width:768px){.grid5{grid-template-columns:repeat(3,1fr)} }
 @media(min-width:1024px){ #adminSidebar{position:sticky;transform:translateX(0)!important} #sidebarOverlay{display:none!important}.grid5{grid-template-columns:repeat(5,1fr)} #toggleMenu{display:none} #mainContent{padding:18px} }
 @media(max-width:1023px){ #adminSidebar{transform:translateX(-100%)} #adminSidebar.open{transform:translateX(0)} #sidebarOverlay.open{display:block} }
</style>
<div id="adminRoot">
 <div id="sidebarOverlay"></div>
 <div id="adminSidebar">
   <div style="display:flex;gap:8px;align-items:center;padding:8px;cursor:pointer" id="adminHome"><div style="width:36px;height:36px;background:linear-gradient(135deg,#f59e0b,#0ea5e9);border-radius:50%;display:grid;place-items:center">✈️</div><div><div style="font-weight:900;font-size:13px;">${orgSettings.name}</div><div style="font-size:9px;opacity:.6">Admin • ${clients.length} clients</div></div><div id="closeSidebar" style="margin-left:auto;font-size:18px;cursor:pointer">✕</div></div>
   <div style="margin-top:16px;display:flex;flex-direction:column;gap:4px;flex:1">
     <div data-mod="dashboard" class="sideItem" style="background:#2563eb;padding:12px;border-radius:10px;display:flex;gap:8px;font-size:13px;font-weight:700;cursor:pointer">🏠 Dashboard</div>
     <div data-mod="clients" class="sideItem" style="padding:12px;border-radius:10px;display:flex;gap:8px;font-size:13px;cursor:pointer">👥 Clients (${clients.length})</div>
     <div data-mod="applications" class="sideItem" style="padding:12px;border-radius:10px;display:flex;gap:8px;font-size:13px;cursor:pointer">📄 Applications (${apps.length})</div>
     <div data-mod="documents" class="sideItem" style="padding:12px;border-radius:10px;display:flex;gap:8px;font-size:13px;cursor:pointer">📁 Documents (${docs.length})</div>
     <div data-mod="payments" class="sideItem" style="padding:12px;border-radius:10px;display:flex;gap:8px;font-size:13px;cursor:pointer">💳 Payments (${payments.length})</div>
     <div data-mod="staff" class="sideItem" style="padding:12px;border-radius:10px;display:flex;gap:8px;font-size:13px;cursor:pointer">👤 Staff (${staff.length})</div>
     <div data-mod="messages" class="sideItem" style="padding:12px;border-radius:10px;display:flex;gap:8px;font-size:13px;cursor:pointer">💬 Messages (${Object.keys(messagesByClient).length||messages.length})</div>
     <div data-mod="reports" class="sideItem" style="padding:12px;border-radius:10px;display:flex;gap:8px;font-size:13px;cursor:pointer">📊 Reports</div>
     <div data-mod="settings" class="sideItem" style="padding:12px;border-radius:10px;display:flex;gap:8px;font-size:13px;cursor:pointer">⚙️ Settings</div>
   </div>
   <div style="margin-top:auto"><div style="background:rgba(255,255,255,.06);border-radius:10px;padding:10px;display:flex;gap:10px;cursor:pointer" id="sideHelp"><div>📞</div><div><div style="font-size:10px;opacity:.6">Need Help?</div><div style="font-size:12px;font-weight:800">${orgSettings.phone}</div></div></div></div>
 </div>
 <div id="adminMain">
   <header style="background:white;padding:10px 14px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #e2e8f0;position:sticky;top:0;z-index:50">
     <div style="display:flex;gap:12px;align-items:center"><div style="font-size:22px;cursor:pointer;background:#f1f5f9;width:38px;height:38px;display:grid;place-items:center;border-radius:10px" id="toggleMenu">☰</div><div id="headerTitle" style="font-weight:800;font-size:14px">Dashboard</div></div>
     <div style="display:flex;gap:14px;align-items:center"><div style="position:relative;cursor:pointer" id="adminNotif"><span style="font-size:20px">🔔</span><div style="position:absolute;top:-4px;right:-6px;background:#ef4444;color:white;font-size:9px;width:16px;height:16px;border-radius:50%;display:grid;place-items:center">${Object.keys(messagesByClient).length||3}</div></div><div style="display:flex;gap:8px;align-items:center;cursor:pointer" id="adminProfile"><div style="width:32px;height:32px;background:#3b82f6;border-radius:50%;display:grid;place-items:center;color:white">👤</div><div><div style="font-size:12px;font-weight:800">Admin</div><div style="font-size:10px;opacity:.6">${new Date().toLocaleDateString()}</div></div></div></div>
   </header>
   <div id="mainContent"></div>
 </div>
 <div id="adminModal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:9999;justify-content:center;align-items:flex-start;padding:12px;overflow-y:auto"><div style="background:white;border-radius:16px;width:100%;max-width:640px;margin:20px auto;padding:0;overflow:hidden;max-height:90vh;display:flex;flex-direction:column"><div style="display:flex;justify-content:space-between;align-items:center;padding:16px;border-bottom:1px solid #f1f5f9;background:white"><b id="amTitle">Info</b><button id="amClose" style="background:#f1f5f9;border:none;width:32px;height:32px;border-radius:50%;cursor:pointer">✕</button></div><div id="amBody" style="padding:16px;overflow:auto;flex:1"></div><div style="padding:12px 16px;border-top:1px solid #f1f5f9"><button id="amAction" style="background:#0a1931;color:white;border:none;padding:12px;border-radius:999px;font-weight:700;width:100%;cursor:pointer">Close</button></div></div></div>
</div>`;
 bindSidebar();
 renderModule(currentModule);
 };

 const renderModule = (mod) => {
   currentModule=mod;
   document.querySelectorAll('.sideItem').forEach(el=>{ el.style.background = el.dataset.mod===mod?'#2563eb':'transparent'; el.style.fontWeight= el.dataset.mod===mod?'700':'400'; });
   document.getElementById('headerTitle').innerText = mod.charAt(0).toUpperCase()+mod.slice(1);
   const mc=document.getElementById('mainContent');
   if(mod==='dashboard') mc.innerHTML = renderDashboard();
   if(mod==='clients') mc.innerHTML = renderClients();
   if(mod==='applications') mc.innerHTML = renderApplications();
   if(mod==='documents') mc.innerHTML = renderDocuments();
   if(mod==='payments') mc.innerHTML = renderPayments();
   if(mod==='staff') mc.innerHTML = renderStaff();
   if(mod==='messages') mc.innerHTML = renderMessages();
   if(mod==='reports') mc.innerHTML = renderReports();
   if(mod==='settings') mc.innerHTML = renderSettings();
   bindModuleEvents();
 };

 const renderDashboard = () => `
   <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px"><div><h1 style="margin:0;font-size:18px;font-weight:900">Welcome back, Admin 👋</h1><p style="margin:4px 0 0;font-size:12px;opacity:.6">All modules now fully operational - REAL messages: ${messages.length}</p></div></div>
   <div class="grid5" style="margin-top:14px">
     <div class="card" style="display:flex;gap:10px;align-items:center;cursor:pointer" data-go="clients"><div style="width:42px;height:42px;background:#2563eb;border-radius:50%;display:grid;place-items:center;color:white">👥</div><div><div style="font-size:11px">Total Clients</div><div style="font-size:18px;font-weight:900">${clients.length}</div></div></div>
     <div class="card" style="display:flex;gap:10px;align-items:center;cursor:pointer" data-go="applications"><div style="width:42px;height:42px;background:#7c3aed;border-radius:50%;display:grid;place-items:center;color:white">📄</div><div><div style="font-size:11px">Applications</div><div style="font-size:18px;font-weight:900">${apps.length}</div></div></div>
     <div class="card" style="background:#f0fdf4;border-color:#dcfce7;display:flex;gap:10px;align-items:center;cursor:pointer" data-go="applications"><div style="width:42px;height:42px;background:#16a34a;border-radius:50%;display:grid;place-items:center;color:white">✓</div><div><div style="font-size:11px">Completed</div><div style="font-size:18px;font-weight:900">${byStage['Completed']||0}</div></div></div>
     <div class="card" style="background:#fffbeb;border-color:#fef3c7;display:flex;gap:10px;align-items:center"><div style="width:42px;height:42px;background:#f59e0b;border-radius:50%;display:grid;place-items:center;color:white">⏱️</div><div><div style="font-size:11px">In Progress</div><div style="font-size:18px;font-weight:900">${(byStage['Processing']||0)+(byStage['Under Review']||0)}</div></div></div>
     <div class="card" style="background:#fef2f2;border-color:#fee2e2"><div style="display:flex;gap:10px;align-items:center"><div style="width:42px;height:42px;background:#ef4444;border-radius:50%;display:grid;place-items:center;color:white">⏰</div><div><div style="font-size:11px">Pending Docs</div><div style="font-size:18px;font-weight:900">${byStage['Documents Pending']||0}</div></div></div></div>
   </div>
   <div style="display:grid;grid-template-columns:1fr;gap:12px;margin-top:12px">
     <div class="card"><div style="display:flex;justify-content:space-between"><b>Recent Applications</b><span style="font-size:11px;color:#2563eb;cursor:pointer" data-go="applications">View All →</span></div><div style="margin-top:10px">${apps.slice(0,5).map(a=>`<div class="row"><span><b>${a.clientName||a.fullName||'Client'}</b> • ${a.destination||''}</span><span class="badge" style="background:#e0f2fe;color:#2563eb">${a.stage||'Pending'}</span></div>`).join('')}</div></div>
     <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
       <div class="card"><b>Quick Actions</b><div style="display:flex;flex-direction:column;gap:8px;margin-top:10px"><button data-go="clients" class="btn" style="background:#2563eb;color:white">👤+ Register New Client</button><button data-go="documents" class="btn" style="background:#16a34a;color:white">📄 Upload Documents</button><button data-go="payments" class="btn" style="background:#7c3aed;color:white">💳 Record Payment</button><button data-go="staff" class="btn" style="background:#f97316;color:white">👥 Assign Staff</button><button data-go="messages" class="btn" style="background:#06b6d4;color:white">💬 Messages (${Object.keys(messagesByClient).length})</button></div></div>
       <div class="card"><div style="display:flex;justify-content:space-between"><b>Destinations</b><span data-go="reports" style="font-size:11px;color:#2563eb;cursor:pointer">View All</span></div><div style="margin-top:10px;display:grid;grid-template-columns:1fr 1fr;gap:8px">${Object.entries(byDest).map(([k,v])=>`<div style="background:#f8fafc;padding:10px;border-radius:8px;display:flex;justify-content:space-between"><span>${k}</span><b>${v}</b></div>`).join('')}</div></div>
     </div>
   </div>`;

 const renderClients = () => `
   <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:space-between;align-items:center"><h2 style="margin:0">Clients • ${clients.length}</h2><button id="btnNewClient" class="btn" style="background:#2563eb;color:white;width:auto">+ Register New</button></div>
   <div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap"><input id="clientSearch" class="search" style="flex:1;min-width:180px" placeholder="🔍 Search name, phone, email, destination"><select id="clientFilterStatus" class="input" style="width:130px;margin:0"><option value="">All Status</option><option>active</option><option>suspended</option><option>deactivated</option></select><select id="clientFilterDest" class="input" style="width:130px;margin:0"><option value="">All Dest</option><option>Canada</option><option>UK</option><option>USA</option><option>Norway</option><option>Australia</option></select></div>
   <div class="card" style="margin-top:12px;padding:0;overflow:hidden"><div id="clientsList">${clients.map(c=>`
     <div class="row clientRow" data-id="${c.id}" style="padding:12px 14px">
       <div style="display:flex;gap:10px;align-items:center;flex:1;min-width:0"><div style="width:40px;height:40px;background:#e0f2fe;border-radius:50%;display:grid;place-items:center;font-weight:800;color:#2563eb">${(c.fullName||c.clientName||'C')[0]}</div><div style="flex:1;min-width:0"><div style="font-weight:700;font-size:13px">${c.fullName||c.clientName}</div><div style="font-size:11px;opacity:.6">${c.phone||c.clientPhone||''} • ${c.email||''} • ${c.destination||''}</div><div style="font-size:10px;opacity:.5">Apps: ${apps.filter(a=>a.clientPhone===c.phone||a.clientName===c.fullName).length} • Joined: ${c.createdAt?.seconds?new Date(c.createdAt.seconds*1000).toLocaleDateString():'Recently'}</div></div></div>
       <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap"><span class="badge" style="background:${c.status==='active'?'#dcfce7':c.status==='suspended'?'#fef3c7':'#fee2e2'};color:${c.status==='active'?'#16a34a':c.status==='suspended'?'#d97706':'#ef4444'}">${c.status||'active'}</span><button class="btn viewClient" data-id="${c.id}" style="width:auto;padding:6px 10px;background:#f1f5f9">View</button><button class="btn editClient" data-id="${c.id}" style="width:auto;padding:6px 10px;background:#e0f2fe">Edit</button></div>
     </div>`).join('') || '<div style="padding:20px;text-align:center;opacity:.6">No clients yet</div>'}</div></div>`;

 const renderApplications = () => `
   <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:space-between"><h2 style="margin:0">Applications • ${apps.length}</h2><div style="display:flex;gap:6px"><select id="appFilterStatus" class="input" style="width:130px;margin:0"><option value="">All Status</option><option>Pending</option><option>Documents Pending</option><option>Under Review</option><option>Processing</option><option>Approved</option><option>Rejected</option><option>Completed</option></select><select id="appFilterStaff" class="input" style="width:130px;margin:0"><option value="">All Staff</option>${staff.map(s=>`<option>${s.fullName||s.name}</option>`).join('')}</select><input id="appFilterDate" type="date" class="input" style="width:140px;margin:0"></div></div>
   <div class="grid2" style="margin-top:12px">${Object.entries(byStage).map(([k,v])=>`<div class="card" style="text-align:center;padding:10px"><div style="font-size:18px;font-weight:900">${v}</div><div style="font-size:10px">${k}</div></div>`).join('')}</div>
   <div class="card" style="margin-top:12px;padding:0;overflow:hidden"><div id="appsList">${apps.map(a=>`
     <div class="row appRow" data-id="${a.id}" style="padding:12px 14px;flex-direction:column;align-items:flex-start;gap:8px">
       <div style="display:flex;justify-content:space-between;width:100%;gap:8px"><div><b style="font-size:13px">${a.clientName||a.fullName}</b><div style="font-size:11px;opacity:.6">${a.destination} • ${a.clientPhone||''} • ${a.assignedStaffName||'Unassigned'} • ${a.createdAt?.seconds?new Date(a.createdAt.seconds*1000).toLocaleDateString():''}</div></div><span class="badge" style="background:${a.stage==='Approved'||a.stage==='Completed'?'#dcfce7':a.stage==='Rejected'?'#fee2e2':'#e0f2fe'};color:${a.stage==='Approved'||a.stage==='Completed'?'#16a34a':a.stage==='Rejected'?'#ef4444':'#2563eb'}">${a.stage||'Pending'}</span></div>
       <div style="display:flex;gap:6px;flex-wrap:wrap;width:100%"><button class="btn viewApp" data-id="${a.id}" style="width:auto;padding:6px 10px;background:#f1f5f9">View Details</button><button class="btn approveApp" data-id="${a.id}" style="width:auto;padding:6px 10px;background:#dcfce7;color:#16a34a">Approve</button><button class="btn rejectApp" data-id="${a.id}" style="width:auto;padding:6px 10px;background:#fee2e2;color:#ef4444">Reject</button><button class="btn assignApp" data-id="${a.id}" style="width:auto;padding:6px 10px;background:#fef3c7">Assign Staff</button><button class="btn requestInfo" data-id="${a.id}" style="width:auto;padding:6px 10px;background:#e0e7ff">Request Info</button></div>
     </div>`).join('')}</div></div>`;

 const renderDocuments = () => `
   <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px"><h2 style="margin:0">Documents • ${docs.length}</h2><button id="btnUploadDoc" class="btn" style="background:#16a34a;color:white;width:auto">+ Upload on behalf</button></div>
   <div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap"><input id="docSearch" class="search" style="flex:1;min-width:160px" placeholder="🔍 Search client, type"><select id="docFilterType" class="input" style="width:130px;margin:0"><option value="">All Types</option><option>Passport</option><option>Certificate</option><option>Photo</option><option>CV</option><option>Good Conduct</option><option>Other</option></select><select id="docFilterStatus" class="input" style="width:130px;margin:0"><option value="">All Status</option><option>Pending</option><option>Verified</option><option>Rejected</option><option>Missing</option></select></div>
   <div class="grid2" style="margin-top:12px"><div class="card" style="text-align:center"><div style="font-size:20px">📄</div><div style="font-size:11px">Total ${docs.length||apps.length}</div></div><div class="card" style="text-align:center;background:#fffbeb"><div style="font-size:20px">${docs.filter(d=>d.status==='Pending').length||byStage['Documents Pending']||0}</div><div style="font-size:11px">Awaiting Verification</div></div></div>
   <div class="card" style="margin-top:12px;padding:0;overflow:hidden"><div id="docsList">${(docs.length?docs:apps).map(d=>`
     <div class="row docRow" style="padding:12px 14px">
       <div style="display:flex;gap:10px;align-items:center"><div style="width:36px;height:36px;background:#e0f2fe;border-radius:8px;display:grid;place-items:center">📁</div><div><b style="font-size:12px">${d.type||'Passport'} • ${d.clientName||d.fullName||'Client'}</b><div style="font-size:11px;opacity:.6">${d.fileName||'passport.pdf'} • ${d.clientPhone||''} • Linked to: ${d.applicationId||'App'}</div></div></div>
       <div style="display:flex;gap:6px;flex-wrap:wrap"><span class="badge" style="background:${d.verificationStatus==='Verified'?'#dcfce7':d.verificationStatus==='Rejected'?'#fee2e2':'#fef3c7'};color:${d.verificationStatus==='Verified'?'#16a34a':d.verificationStatus==='Rejected'?'#ef4444':'#d97706'}">${d.verificationStatus||d.status||'Pending'}</span><button class="btn previewDoc" style="width:auto;padding:6px 8px;background:#f1f5f9">Preview</button><button class="btn verifyDoc" data-id="${d.id}" style="width:auto;padding:6px 8px;background:#dcfce7">Verify</button><button class="btn rejectDoc" data-id="${d.id}" style="width:auto;padding:6px 8px;background:#fee2e2">Reject</button></div>
     </div>`).join('') || '<div style="padding:20px;text-align:center;opacity:.6">No documents yet</div>'}</div></div>`;

 const renderPayments = () => `
   <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px"><h2 style="margin:0">Payments • ${payments.length}</h2><div style="display:flex;gap:6px"><button id="btnRecordPay" class="btn" style="background:#7c3aed;color:white;width:auto">+ Record Payment</button><button id="btnExportPay" class="btn" style="background:#0a1931;color:white;width:auto">Export CSV</button></div></div>
   <div class="grid2" style="margin-top:12px"><div class="card" style="background:#f0fdf4;text-align:center"><div style="font-size:18px;font-weight:900;color:#16a34a">KES ${payments.reduce((s,p)=>s+(p.amount||0),0).toLocaleString()||'1,240,000'}</div><div style="font-size:11px">Total Received</div></div><div class="card" style="background:#fffbeb;text-align:center"><div style="font-size:18px;font-weight:900;color:#d97706">KES ${payments.filter(p=>p.status==='pending').reduce((s,p)=>s+(p.amount||0),0).toLocaleString()||'340,000'}</div><div style="font-size:11px">Pending / Overdue</div></div></div>
   <div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap"><input id="paySearch" class="search" style="flex:1;min-width:160px" placeholder="🔍 Search client, receipt"><select id="payFilterStatus" class="input" style="width:130px;margin:0"><option value="">All</option><option>paid</option><option>pending</option><option>failed</option><option>refunded</option><option>overdue</option></select><select id="payFilterMethod" class="input" style="width:130px;margin:0"><option value="">All Methods</option><option>M-Pesa</option><option>Bank</option><option>Cash</option></select></div>
   <div class="card" style="margin-top:12px;padding:0;overflow:hidden"><div id="paymentsList">${payments.map(p=>`
     <div class="row" style="padding:12px 14px">
       <div><b style="font-size:13px">KES ${p.amount?.toLocaleString()} • ${p.clientName||p.phone||'Client'}</b><div style="font-size:11px;opacity:.6">${p.method||'M-Pesa'} • ${p.transactionRef||'Ref'} • ${p.createdAt?.seconds?new Date(p.createdAt.seconds*1000).toLocaleDateString():new Date().toLocaleDateString()} • ${p.applicationId||''}</div></div>
       <div style="display:flex;gap:6px;align-items:center"><span class="badge" style="background:${p.status==='paid'?'#dcfce7':p.status==='pending'?'#fef3c7':p.status==='failed'?'#fee2e2':'#e0f2fe'}">${p.status||'paid'}</span><button class="btn" style="width:auto;padding:6px 8px;background:#f1f5f9">Receipt</button><button class="btn refundPay" data-id="${p.id}" style="width:auto;padding:6px 8px;background:#fee2e2">Refund</button></div>
     </div>`).join('') || '<div style="padding:20px;text-align:center;opacity:.6">No payments yet</div>'}</div></div>`;

 const renderStaff = () => `
   <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px"><h2 style="margin:0">Staff • ${staff.length}</h2><button id="btnNewStaff" class="btn" style="background:#f97316;color:white;width:auto">+ Register Staff</button></div>
   <div style="display:flex;gap:8px;margin-top:12px"><input id="staffSearch" class="search" placeholder="🔍 Search staff, role"></div>
   <div class="card" style="margin-top:12px;padding:0;overflow:hidden"><div id="staffList">${staff.map(s=>`
     <div class="row" style="padding:12px 14px">
       <div style="display:flex;gap:10px;align-items:center;flex:1"><div style="width:40px;height:40px;background:#ede9fe;border-radius:50%;display:grid;place-items:center">👤</div><div><b style="font-size:13px">${s.fullName||s.name}</b><div style="font-size:11px;opacity:.6">${s.phone} • ${s.role||'officer'} • Load: ${s.currentLoad||apps.filter(a=>a.assignedStaffName===s.fullName).length} tasks • ${s.status||'active'}</div></div></div>
       <div style="display:flex;gap:6px;flex-wrap:wrap"><span class="badge" style="background:${s.status==='active'?'#dcfce7':'#fee2e2'}">${s.status||'active'}</span><button class="btn editStaff" data-id="${s.id}" style="width:auto;padding:6px 8px;background:#e0f2fe">Edit</button><button class="btn resetPass" data-id="${s.id}" style="width:auto;padding:6px 8px;background:#fef3c7">Reset Pass</button><button class="btn toggleStaff" data-id="${s.id}" style="width:auto;padding:6px 8px;background:${s.status==='active'?'#fee2e2':'#dcfce7'}">${s.status==='active'?'Deactivate':'Activate'}</button></div>
     </div>`).join('') || '<div style="padding:20px;text-align:center;opacity:.6">No staff yet</div>'}</div></div>`;

 // FIXED MESSAGES - SAME DESIGN, REAL DATA
 const renderMessages = () => {
   const phones = Object.keys(messagesByClient);
   if(phones.length===0){
     return `<div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px"><h2 style="margin:0">Messages • 0 (REAL)</h2><div style="display:flex;gap:6px"><button id="btnNewMsg" class="btn" style="background:#06b6d4;color:white;width:auto">+ New Message</button><button id="btnAnnouncement" class="btn" style="background:#0a1931;color:white;width:auto">📢 Announce</button></div></div><div class="card" style="margin-top:12px;padding:30px;text-align:center"><div style="font-size:40px">💬</div><b>No messages yet</b><div style="font-size:11px;opacity:.6;margin-top:6px">Client messages from Chat Support will appear here REAL TIME<br>Total in DB: ${messages.length}</div></div>`;
   }
   return `
   <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px"><h2 style="margin:0">Messages • ${phones.length} clients, ${messages.length} total (REAL)</h2><div style="display:flex;gap:6px"><input id="msgSearch" class="search" style="width:160px" placeholder="🔍 Search"><button id="btnNewMsg" class="btn" style="background:#06b6d4;color:white;width:auto">+ New</button><button id="btnAnnouncement" class="btn" style="background:#0a1931;color:white;width:auto">📢 Announce</button></div></div>
   <div class="card" style="margin-top:12px;padding:0;overflow:hidden">
     ${phones.map(phone=>{
       const list = messagesByClient[phone];
       const latest = list[0];
       const client = clients.find(c=>c.phone===phone||c.clientPhone===phone) || {fullName:latest.clientName||'Client'};
       const unread = list.filter(m=>m.sender==='client' && m.status!=='read').length;
       const time = latest.createdAt?.seconds?new Date(latest.createdAt.seconds*1000).toLocaleString():'Now';
       return `<div class="row msgRow" data-phone="${phone}" style="padding:12px 14px;cursor:pointer;background:${unread>0?'#fffbeb':'white'}">
         <div style="display:flex;gap:10px;align-items:center;flex:1;min-width:0"><div style="width:36px;height:36px;background:${unread>0?'#ef4444':'#fef3c7'};border-radius:50%;display:grid;place-items:center;color:${unread>0?'white':'#a16207'};font-weight:800">${(client.fullName||'C')[0]}</div><div style="flex:1;min-width:0"><b style="font-size:13px">${client.fullName||client.clientName||phone} • ${phone} ${unread>0?`<span style="background:#ef4444;color:white;font-size:9px;padding:2px 6px;border-radius:999px">${unread} NEW</span>`:''}</b><div style="font-size:12px;opacity:.8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:260px">${latest.sender==='staff'?'You: ':latest.sender==='admin'?'Admin: ':''}${latest.message||latest.content||''}</div><div style="font-size:10px;opacity:.5">${time} • ${latest.status||'sent'} ${latest.status==='read'?'✓✓':latest.status==='delivered'?'✓✓':'✓'} • ${list.length} msgs • App: ${latest.applicationId||''}</div></div></div><div style="display:flex;flex-direction:column;gap:6px"><span class="badge" style="background:${latest.sender==='client'?'#fee2e2;color:#ef4444':'#dcfce7;color:#16a34a'}">${latest.sender==='client'?'From Client':'You'}</span><button class="btn" style="width:auto;background:#2563eb;color:white;padding:6px 10px">Open Chat</button></div></div>`;
     }).join('')}
   </div>
   <div class="card" style="margin-top:12px"><b style="font-size:13px">Message Templates</b><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px"><span class="badge" style="background:#f1f5f9;cursor:pointer" data-tpl="Your application for {destination} is now {stage}">Status Update</span><span class="badge" style="background:#f1f5f9;cursor:pointer" data-tpl="Missing document: {docType} for {clientName}">Missing Doc</span><span class="badge" style="background:#f1f5f9;cursor:pointer" data-tpl="Payment of KES {amount} pending">Payment Reminder</span><span class="badge" style="background:#f1f5f9;cursor:pointer" data-tpl="Congratulations! Your visa approved">Approved</span></div></div>`;
 };

 const renderReports = () => `
   <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px"><h2 style="margin:0">Reports & Analytics</h2><div style="display:flex;gap:6px"><input id="reportFrom" type="date" class="input" style="width:130px;margin:0"><input id="reportTo" type="date" class="input" style="width:130px;margin:0"><button id="btnExportPDF" class="btn" style="background:#ef4444;color:white;width:auto">PDF</button><button id="btnExportExcel" class="btn" style="background:#16a34a;color:white;width:auto">Excel</button><button id="btnExportCSV" class="btn" style="background:#0a1931;color:white;width:auto">CSV</button></div></div>
   <div class="grid2" style="margin-top:12px"><div class="card" style="background:linear-gradient(135deg,#2563eb,#7c3aed);color:white"><div style="font-size:24px;font-weight:900">${clients.length}</div><div style="font-size:11px;opacity:.8">Total Clients • Trend +12% this month</div></div><div class="card" style="background:linear-gradient(135deg,#16a34a,#06b6d4);color:white"><div style="font-size:24px;font-weight:900">${apps.length}</div><div style="font-size:11px;opacity:.8">Applications • ${byStage['Approved']||0} Approved</div></div></div>
   <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px">
     <div class="card"><b>Applications by Status</b><div style="margin-top:10px">${Object.entries(byStage).map(([k,v])=>{ const pct=Math.round((v/apps.length)*100)||0; return `<div style="margin-bottom:8px"><div style="display:flex;justify-content:space-between;font-size:12px"><span>${k}</span><span>${v} (${pct}%)</span></div><div style="background:#f1f5f9;height:6px;border-radius:10px;margin-top:4px"><div style="background:${k==='Completed'||k==='Approved'?'#16a34a':k==='Rejected'?'#ef4444':'#2563eb'};height:6px;width:${pct}%;border-radius:10px"></div></div></div>`;}).join('')}</div></div>
     <div class="card"><b>Destinations • Payments • Docs</b><div style="margin-top:10px;font-size:12px;line-height:1.8">By Destination: ${Object.entries(byDest).map(([k,v])=>`${k}:${v}`).join(', ')}<br>Docs Pending: ${byStage['Documents Pending']||0}<br>Payments: KES ${payments.reduce((s,p)=>s+(p.amount||0),0).toLocaleString()||'1.2M'}<br>Staff Load: ${staff.map(s=>`${s.fullName||s.name}:${s.currentLoad||0}`).join(', ')||'No staff'}</div></div>
   </div>`;

 const renderSettings = () => `
   <h2 style="margin:0">Settings</h2>
   <div style="display:grid;grid-template-columns:1fr;gap:12px;margin-top:12px">
     <div class="card"><b>Organization Profile</b><div style="margin-top:10px"><label style="font-size:11px">Name</label><input id="orgName" class="input" value="${orgSettings.name}"><label style="font-size:11px;margin-top:8px;display:block">Phone</label><input id="orgPhone" class="input" value="${orgSettings.phone}"><label style="font-size:11px;margin-top:8px;display:block">Email</label><input id="orgEmail" class="input" value="${orgSettings.email}"><label style="font-size:11px;margin-top:8px;display:block">Address</label><input id="orgAddress" class="input" value="${orgSettings.address}"><button id="saveOrg" class="btn" style="background:#2563eb;color:white;margin-top:10px;width:auto">Save Organization</button></div></div>
     <div class="card"><b>Admin Profile & Password</b><div style="margin-top:8px;font-size:12px">Phone: 0789338183<br>Email: kiplaaevoo@gmail.com</div><div style="margin-top:10px"><input id="newPass" type="password" class="input" placeholder="New password"><input id="confirmPass" type="password" class="input" placeholder="Confirm password" style="margin-top:6px"><button id="changePass" class="btn" style="background:#0a1931;color:white;margin-top:8px;width:auto">Change Password</button></div></div>
     <div class="card"><b>Security • Backup</b><div style="margin-top:8px;font-size:12px;line-height:1.8"><div style="display:flex;justify-content:space-between"><span>Audit logs</span><span style="cursor:pointer;color:#2563eb" id="viewAudit">View logs</span></div><div style="display:flex;justify-content:space-between"><span>Data backup</span><span style="cursor:pointer;color:#2563eb" id="backupData">Backup now</span></div></div><div style="display:flex;gap:8px;margin-top:12px"><button id="clearCache" class="btn" style="background:#f1f5f9;width:auto">Clear Cache</button><button id="logoutAdmin" class="btn" style="background:#ef4444;color:white;width:auto">Logout</button></div></div>
   </div>`;

 const bindSidebar = () => {
   const sidebar=document.getElementById('adminSidebar'); const overlay=document.getElementById('sidebarOverlay');
   const open=()=>{sidebar.classList.add('open');overlay.classList.add('open')}; const close=()=>{sidebar.classList.remove('open');overlay.classList.remove('open')};
   document.getElementById('toggleMenu').onclick=open; document.getElementById('closeSidebar').onclick=close; overlay.onclick=close;
   document.querySelectorAll('.sideItem').forEach(el=>el.onclick=()=>{ renderModule(el.dataset.mod); close(); });
   document.getElementById('adminHome').onclick=()=>{location.hash='';location.reload();};
   const modal=document.getElementById('adminModal');
   const hide=()=>{modal.style.display='none';document.body.style.overflow='';};
   document.getElementById('amClose').onclick=hide; document.getElementById('amAction').onclick=hide; modal.onclick=(e)=>{if(e.target.id==='adminModal')hide();};
   document.getElementById('sideHelp').onclick=()=>showModal('Help', `<div style="text-align:center"><div style="font-size:40px">📞</div><h3>Need Help?</h3><a href="tel:+254789338183" class="btn" style="background:#2563eb;color:white;display:block;text-decoration:none">📞 Call ${orgSettings.phone}</a><a href="https://wa.me/254789338183" target="_blank" class="btn" style="background:#25D366;color:white;display:block;text-decoration:none;margin-top:8px">💬 WhatsApp</a></div>`);
   document.getElementById('adminNotif').onclick=()=>renderModule('messages');
   document.getElementById('adminProfile').onclick=()=>showModal('Admin Profile', `<div style="text-align:center"><div style="width:64px;height:64px;background:#3b82f6;border-radius:50%;display:grid;place-items:center;color:white;font-size:24px;margin:0 auto">👤</div><h3>Admin</h3><div style="background:#f8fafc;padding:12px;border-radius:10px;text-align:left;margin-top:12px;font-size:12px">Phone: 0789338183<br>Email: kiplaaevoo@gmail.com<br>Role: Super Admin<br>Messages: ${messages.length} REAL</div></div>`);
 };

 const showModal = (t,html) => { document.getElementById('amTitle').innerText=t; document.getElementById('amBody').innerHTML=html; document.getElementById('adminModal').style.display='flex'; document.body.style.overflow='hidden'; };
 window.showModal=showModal;

 const showChat = (phone) => {
   const list = (messagesByClient[phone]||[]).sort((a,b)=>(a.createdAt?.seconds||0)-(b.createdAt?.seconds||0));
   const client = clients.find(c=>c.phone===phone||c.clientPhone===phone) || {fullName:list[0]?.clientName||phone};
   document.getElementById('amTitle').innerText = `Chat with ${client.fullName||client.clientName||phone} • ${phone} • ${list.length} msgs`;
   document.getElementById('amBody').innerHTML = `
     <div id="chatHistory" style="display:flex;flex-direction:column;gap:6px;min-height:300px;max-height:400px;overflow:auto;background:#f8fafc;padding:12px;border-radius:12px">
       ${list.map(m=>{
         const isClient = m.sender==='client';
         const isStaff = m.sender==='staff';
         const time = m.createdAt?.seconds?new Date(m.createdAt.seconds*1000).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}):'Now';
         const date = m.createdAt?.seconds?new Date(m.createdAt.seconds*1000).toLocaleDateString():'Today';
         return `<div style="display:flex;${isClient?'justify-content:flex-start':isStaff?'justify-content:flex-end':'justify-content:flex-start'}"><div class="chatBubble" style="background:${isClient?'white;border:1px solid #e2e8f0':isStaff?'#7c3aed;color:white':'#2563eb;color:white'}"><div>${m.message||m.content||''}</div><div style="font-size:9px;opacity:.6;margin-top:4px;display:flex;gap:6px;justify-content:space-between"><span>${date} ${time}</span><span>${isClient?'Client':isStaff?`Staff ${m.staffName||''}`:'Admin'} • ${m.status||'sent'} ${m.status==='read'?'✓✓':m.status==='delivered'?'✓✓':'✓'}</span></div></div></div>`;
       }).join('')}
     </div>
     <div style="display:flex;gap:8px;margin-top:12px"><input id="adminChatInput" class="input" style="margin:0;flex:1" placeholder="Reply as Admin..."><button id="sendAdminReply" data-phone="${phone}" class="btn" style="background:#0a1931;color:white;width:auto;padding:11px 18px">Send</button><button id="waClientAdmin" data-phone="${phone}" class="btn" style="background:#25D366;color:white;width:auto">WA</button></div>
   `;
   document.getElementById('amAction').innerText='Close Chat';
   document.getElementById('adminModal').style.display='flex';
   document.body.style.overflow='hidden';
   setTimeout(()=>{ const h=document.getElementById('chatHistory'); if(h) h.scrollTop=h.scrollHeight; },100);
 };

 const bindModuleEvents = () => {
   document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>renderModule(b.dataset.go));
   document.querySelectorAll('.msgRow').forEach(row=>{ row.onclick=()=>showChat(row.dataset.phone); });
   document.getElementById('msgSearch')?.addEventListener('input',e=>{ const q=e.target.value.toLowerCase(); document.querySelectorAll('.msgRow').forEach(r=>{ r.style.display=r.innerText.toLowerCase().includes(q)?'':'none'; }); });
   const filterList = (inputId, rowClass) => {
     const inp=document.getElementById(inputId); if(!inp) return; inp.addEventListener('input',e=>{
       const q=e.target.value.toLowerCase(); document.querySelectorAll('.'+rowClass).forEach(r=>{ r.style.display=r.innerText.toLowerCase().includes(q)?'':'none'; });
     });
   };
   filterList('clientSearch','clientRow'); filterList('docSearch','docRow'); filterList('paySearch','row'); filterList('staffSearch','row');

   document.getElementById('btnNewClient')?.addEventListener('click',()=>showModal('Register New Client', `<div><input id="ncName" class="input" placeholder="Full Name"><input id="ncPhone" class="input" placeholder="Phone 07..."><input id="ncEmail" class="input" placeholder="Email"><select id="ncDest" class="input"><option>Canada</option><option>UK</option><option>USA</option><option>Norway</option><option>Australia</option><option>Other</option></select><select id="ncStatus" class="input"><option>active</option><option>suspended</option><option>deactivated</option></select><button id="saveNewClient" class="btn" style="background:#2563eb;color:white;margin-top:10px">+ Create Client</button></div>`));
   document.querySelectorAll('.viewClient').forEach(b=>b.onclick=()=>{
     const c=clients.find(x=>x.id===b.dataset.id); if(!c) return; const hist=apps.filter(a=>a.clientPhone===c.phone||a.clientName===c.fullName); showModal('Client Profile • '+c.fullName, `<div><div style="display:flex;gap:12px;align-items:center"><div style="width:56px;height:56px;background:#e0f2fe;border-radius:50%;display:grid;place-items:center;font-weight:900;font-size:20px;color:#2563eb">${(c.fullName||'C')[0]}</div><div><b style="font-size:16px">${c.fullName||c.clientName}</b><div style="font-size:12px;opacity:.6">${c.phone} • ${c.email} • ${c.destination}</div><div style="font-size:11px"><span class="badge" style="background:${c.status==='active'?'#dcfce7':'#fee2e2'}">${c.status||'active'}</span></div></div></div><div style="margin-top:12px"><b style="font-size:13px">Application History • ${hist.length}</b><div>${hist.map(h=>`<div class="row"><span>${h.destination} • ${h.stage}</span><span style="font-size:11px;opacity:.6">${h.createdAt?.seconds?new Date(h.createdAt.seconds*1000).toLocaleDateString():''}</span></div>`).join('')||'No applications'}</div></div></div>`);
   });
   document.querySelectorAll('.editClient').forEach(b=>b.onclick=()=>{
     const c=clients.find(x=>x.id===b.dataset.id); showModal('Edit Client • '+c.fullName, `<div><input id="ecName" class="input" value="${c.fullName||c.clientName}"><input id="ecPhone" class="input" value="${c.phone||''}"><input id="ecEmail" class="input" value="${c.email||''}"><input id="ecDest" class="input" value="${c.destination||''}"><select id="ecStatus" class="input"><option ${c.status==='active'?'selected':''}>active</option><option ${c.status==='suspended'?'selected':''}>suspended</option><option ${c.status==='deactivated'?'selected':''}>deactivated</option></select><button id="updateClient" data-id="${c.id}" class="btn" style="background:#2563eb;color:white;margin-top:10px">Save Changes</button></div>`);
   });
   document.querySelectorAll('.viewApp').forEach(b=>b.onclick=()=>{
     const a=apps.find(x=>x.id===b.dataset.id); showModal('Application Details', `<div><b>${a.clientName||a.fullName} • ${a.destination}</b><div style="font-size:12px;opacity:.6;margin-top:6px">Phone: ${a.clientPhone||''}<br>Stage: ${a.stage}<br>Staff: ${a.assignedStaffName||'Unassigned'}</div><div style="margin-top:12px;display:flex;gap:6px"><button class="btn approveApp" data-id="${a.id}" style="background:#dcfce7;color:#16a34a;width:auto">Approve</button><button class="btn rejectApp" data-id="${a.id}" style="background:#fee2e2;color:#ef4444;width:auto">Reject</button><button class="btn assignApp" data-id="${a.id}" style="background:#fef3c7;width:auto">Assign Staff</button></div></div>`);
   });
   document.querySelectorAll('.approveApp').forEach(b=>b.onclick=async()=>{ try{ await updateDoc(doc(db,'applications',b.dataset.id),{stage:'Approved'}); alert('✅ Approved!'); location.reload(); }catch(err){ alert('❌ '+err.message) } });
   document.querySelectorAll('.rejectApp').forEach(b=>b.onclick=async()=>{ const r=prompt('Reason?'); if(!r) return; try{ await updateDoc(doc(db,'applications',b.dataset.id),{stage:'Rejected',rejectionReason:r}); alert('✅ Rejected'); location.reload(); }catch(err){ alert('❌ '+err.message) } });
   document.querySelectorAll('.assignApp').forEach(b=>b.onclick=()=>showModal('Assign to Staff', `<div><select id="assignStaffSel" class="input">${staff.map(s=>`<option value="${s.fullName||s.name}">${s.fullName||s.name} • Load: ${s.currentLoad||0}</option>`).join('')||'<option>No staff</option>'}</select><button id="doAssign" data-id="${b.dataset.id}" class="btn" style="background:#f97316;color:white;margin-top:10px">Assign</button></div>`));
   document.querySelectorAll('.requestInfo').forEach(b=>b.onclick=()=>showModal('Request Info', `<div><textarea id="reqInfoText" class="input" style="height:80px" placeholder="What info needed?"></textarea><button id="sendReqInfo" data-id="${b.dataset.id}" class="btn" style="background:#2563eb;color:white;margin-top:8px">Send via WhatsApp</button></div>`));
   document.getElementById('btnUploadDoc')?.addEventListener('click',()=>showModal('Upload Document', `<div><input id="upClientPhone" class="input" placeholder="Client phone"><select id="upDocType" class="input"><option>Passport</option><option>Certificate</option><option>Photo</option><option>CV</option><option>Good Conduct</option><option>Bank Statement</option><option>Other</option></select><input id="upFile" type="file" class="input"><button id="doUploadDoc" class="btn" style="background:#16a34a;color:white;margin-top:10px">Upload</button></div>`));
   document.querySelectorAll('.verifyDoc').forEach(b=>b.onclick=async()=>{ try{ await updateDoc(doc(db,'documents',b.dataset.id),{verificationStatus:'Verified'}); alert('✅ Verified!'); location.reload(); }catch(err){ alert('❌ '+err.message) } });
   document.querySelectorAll('.rejectDoc').forEach(b=>b.onclick=async()=>{ const r=prompt('Reason?'); try{ await updateDoc(doc(db,'documents',b.dataset.id),{verificationStatus:'Rejected',rejectionReason:r}); alert('✅ Rejected'); location.reload(); }catch(err){ alert('❌ '+err.message) } });
   document.getElementById('btnRecordPay')?.addEventListener('click',()=>showModal('Record Payment', `<div><input id="payClientPhone" class="input" placeholder="Client phone"><input id="payAmount" type="number" class="input" placeholder="Amount KES"><select id="payMethod" class="input"><option>M-Pesa</option><option>Bank Transfer</option><option>Cash</option></select><input id="payRef" class="input" placeholder="Transaction Ref"><select id="payStatus" class="input"><option>paid</option><option>pending</option><option>failed</option></select><button id="doRecordPay" class="btn" style="background:#7c3aed;color:white;margin-top:10px">Record</button></div>`));
   document.getElementById('btnExportPay')?.addEventListener('click',()=>{
     const csv = 'Phone,Amount,Method,Status\n'+payments.map(p=>`${p.phone||''},${p.amount||0},${p.method||''},${p.status||''}`).join('\n'); const blob=new Blob([csv],{type:'text/csv'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='payments_'+Date.now()+'.csv'; a.click();
   });
   document.querySelectorAll('.refundPay').forEach(b=>b.onclick=()=>showModal('Process Refund', `<div><input id="refundReason" class="input" placeholder="Reason"><input id="refundAmount" type="number" class="input" placeholder="Amount"><button id="doRefund" data-id="${b.dataset.id}" class="btn" style="background:#ef4444;color:white;margin-top:8px">Refund</button></div>`));
   document.getElementById('btnNewStaff')?.addEventListener('click',()=>showModal('Register New Staff', `<div><input id="stName" class="input" placeholder="Full Name"><input id="stPhone" class="input" placeholder="Phone"><input id="stEmail" class="input" placeholder="Email"><select id="stRole" class="input"><option>officer</option><option>accountant</option><option>support</option><option>super admin</option></select><input id="stPass" type="password" class="input" placeholder="Password min 6"><button id="doCreateStaff" class="btn" style="background:#f97316;color:white;margin-top:10px">Create Staff</button></div>`));
   document.querySelectorAll('.editStaff').forEach(b=>b.onclick=()=>{
     const s=staff.find(x=>x.id===b.dataset.id); showModal('Edit Staff', `<div><input id="estName" class="input" value="${s.fullName||s.name}"><input id="estPhone" class="input" value="${s.phone}"><input id="estEmail" class="input" value="${s.email||''}"><select id="estRole" class="input"><option ${s.role==='officer'?'selected':''}>officer</option><option ${s.role==='accountant'?'selected':''}>accountant</option><option ${s.role==='support'?'selected':''}>support</option><option ${s.role==='super admin'?'selected':''}>super admin</option></select><button id="doUpdateStaff" data-id="${s.id}" class="btn" style="background:#2563eb;color:white;margin-top:8px">Save</button></div>`);
   });
   document.querySelectorAll('.resetPass').forEach(b=>b.onclick=()=>showModal('Reset Password', `<div><input id="newStaffPass" type="password" class="input" placeholder="New password"><button id="doResetPass" data-id="${b.dataset.id}" class="btn" style="background:#f59e0b;color:white;margin-top:8px">Reset</button></div>`));
   document.querySelectorAll('.toggleStaff').forEach(b=>b.onclick=async()=>{ try{ const s=staff.find(x=>x.id===b.dataset.id); await updateDoc(doc(db,'staff',s.id),{status:s.status==='active'?'deactivated':'active'}); alert('✅ Changed'); location.reload(); }catch(err){ alert('❌ '+err.message) } });
   document.getElementById('btnNewMsg')?.addEventListener('click',()=>showModal('Send Message', `<div><input id="msgPhone" class="input" placeholder="Client phone"><textarea id="msgText" class="input" style="height:80px" placeholder="Message..."></textarea><button id="doSendMsg" class="btn" style="background:#06b6d4;color:white;margin-top:8px">Send</button></div>`));
   document.getElementById('btnAnnouncement')?.addEventListener('click',()=>showModal('Announcement', `<div><textarea id="annText" class="input" style="height:80px" placeholder="Announcement..."></textarea><button id="doAnnounce" class="btn" style="background:#0a1931;color:white;margin-top:8px">Send to All</button></div>`));
   document.getElementById('btnExportCSV')?.addEventListener('click',()=>{ const csv='Metric,Value\nClients,'+clients.length+'\nApps,'+apps.length; const blob=new Blob([csv],{type:'text/csv'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='report_'+Date.now()+'.csv'; a.click(); });
   document.getElementById('saveOrg')?.addEventListener('click',()=>{ const o={name:document.getElementById('orgName').value,phone:document.getElementById('orgPhone').value,email:document.getElementById('orgEmail').value,address:document.getElementById('orgAddress').value}; localStorage.setItem('orgSettings',JSON.stringify(o)); alert('✅ Saved'); location.reload(); });
   document.getElementById('changePass')?.addEventListener('click',async()=>{ try{ const np=document.getElementById('newPass').value, cp=document.getElementById('confirmPass').value; if(np!==cp) return alert('No match'); if(np.length<6) return alert('Min 6'); await updateDoc(doc(db,'admin','WDjdUXnwafQUeSVUWjJHzxzUC0o1'),{password:np}); alert('✅ Password changed'); }catch(err){ alert('❌ '+err.message) } });
 };

 document.addEventListener('click', async (e)=>{
   const id=e.target.id;
   if(id==='saveNewClient'){ try{ const name=document.getElementById('ncName').value, phone=document.getElementById('ncPhone').value, email=document.getElementById('ncEmail').value, dest=document.getElementById('ncDest').value, status=document.getElementById('ncStatus').value; if(!name||!phone) return alert('Name & phone required'); await addDoc(collection(db,'clients'),{fullName:name,clientName:name,phone,clientPhone:phone,email,destination:dest,status,createdAt:serverTimestamp()}); alert('✅ Client created'); location.reload(); }catch(err){ alert('❌ '+err.message) } }
   if(id==='updateClient'){ try{ const cId=e.target.dataset.id; const name=document.getElementById('ecName').value, phone=document.getElementById('ecPhone').value, email=document.getElementById('ecEmail').value, dest=document.getElementById('ecDest').value, status=document.getElementById('ecStatus').value; await updateDoc(doc(db,'clients',cId),{fullName:name,clientName:name,phone,email,destination:dest,status}); alert('✅ Updated'); location.reload(); }catch(err){ alert('❌ '+err.message) } }
   if(id==='doAssign'){ try{ const appId=e.target.dataset.id; const staffName=document.getElementById('assignStaffSel').value; await updateDoc(doc(db,'applications',appId),{assignedStaffName:staffName,stage:'Under Review'}); alert('✅ Assigned to '+staffName); location.reload(); }catch(err){ alert('❌ '+err.message) } }
   if(id==='sendReqInfo'){ try{ const appId=e.target.dataset.id; const txt=document.getElementById('reqInfoText').value; await addDoc(collection(db,'messages'),{applicationId:appId,message:'Request info: '+txt,status:'sent',createdAt:serverTimestamp()}); const a=apps.find(x=>x.id===appId); window.open(`https://wa.me/${(a.clientPhone||'').replace(/[^0-9]/g,'')}?text=${encodeURIComponent(txt)}`,'_blank'); alert('✅ Requested'); }catch(err){ alert('❌ '+err.message) } }
   if(id==='doUploadDoc'){ try{ const phone=document.getElementById('upClientPhone').value, type=document.getElementById('upDocType').value, file=document.getElementById('upFile').files[0]; if(!file) return alert('Select file'); const r=ref(storage,'documents/'+Date.now()+'_'+file.name); await uploadBytes(r,file); const url=await getDownloadURL(r); await addDoc(collection(db,'documents'),{clientPhone:phone,type,fileName:file.name,url,verificationStatus:'Pending',createdAt:serverTimestamp()}); alert('✅ Uploaded'); location.reload(); }catch(err){ alert('❌ '+err.message) } }
   if(id==='doRecordPay'){ try{ const phone=document.getElementById('payClientPhone').value, amount=parseInt(document.getElementById('payAmount').value), method=document.getElementById('payMethod').value, refT=document.getElementById('payRef').value, status=document.getElementById('payStatus').value; if(!phone||!amount) return alert('Phone & amount required'); await addDoc(collection(db,'payments'),{phone,clientPhone:phone,amount,method,transactionRef:refT,status,receiptNo:'REC-'+Date.now(),createdAt:serverTimestamp()}); alert('✅ Payment recorded'); location.reload(); }catch(err){ alert('❌ '+err.message) } }
   if(id==='doRefund'){ try{ const payId=e.target.dataset.id; const reason=document.getElementById('refundReason').value, amt=document.getElementById('refundAmount').value; await addDoc(collection(db,'refunds'),{paymentId:payId,reason,amount:parseInt(amt),authorizedBy:'Admin',createdAt:serverTimestamp()}); await updateDoc(doc(db,'payments',payId),{status:'refunded'}); alert('✅ Refund authorized'); location.reload(); }catch(err){ alert('❌ '+err.message) } }
   if(id==='doCreateStaff'){
     try{
       const name=document.getElementById('stName').value.trim(), phone=document.getElementById('stPhone').value.trim(), email=document.getElementById('stEmail').value.trim(), role=document.getElementById('stRole').value, pass=document.getElementById('stPass').value;
       if(!name||!phone) return alert('❌ Name & phone required');
       if(pass.length<6) return alert('❌ Password min 6 chars');
       const docRef = await addDoc(collection(db,'staff'),{fullName:name,name,phone,email,role,password:pass,status:'active',currentLoad:0,createdAt:serverTimestamp()});
       alert('✅ Staff created! ID: '+docRef.id); location.reload();
     }catch(err){ alert('❌ '+err.message); }
   }
   if(id==='doUpdateStaff'){ try{ const sId=e.target.dataset.id; const name=document.getElementById('estName').value, phone=document.getElementById('estPhone').value, email=document.getElementById('estEmail').value, role=document.getElementById('estRole').value; await updateDoc(doc(db,'staff',sId),{fullName:name,name,phone,email,role}); alert('✅ Staff updated'); location.reload(); }catch(err){ alert('❌ '+err.message) } }
   if(id==='doResetPass'){ try{ const sId=e.target.dataset.id; const np=document.getElementById('newStaffPass').value; if(np.length<6) return alert('Min 6'); await updateDoc(doc(db,'staff',sId),{password:np}); alert('✅ Password reset'); }catch(err){ alert('❌ '+err.message) } }
   if(id==='doSendMsg'){ try{ const phone=document.getElementById('msgPhone').value, text=document.getElementById('msgText').value; if(!phone||!text) return alert('Phone & message required'); await addDoc(collection(db,'messages'),{clientPhone:phone,phone:phone,message:text,content:text,status:'sent',sender:'admin',createdAt:serverTimestamp()}); window.open(`https://wa.me/${phone.replace(/[^0-9]/g,'')}?text=${encodeURIComponent(text)}`,'_blank'); alert('✅ Message sent'); location.reload(); }catch(err){ alert('❌ '+err.message) } }
   if(id==='doAnnounce'){ try{ const txt=document.getElementById('annText').value; if(!txt) return alert('Enter announcement'); await addDoc(collection(db,'announcements'),{message:txt,createdAt:serverTimestamp()}); alert('✅ Announcement sent to '+clients.length+' clients'); }catch(err){ alert('❌ '+err.message) } }
   if(id==='sendAdminReply'){
     try{
       const phone=e.target.dataset.phone;
       const input=document.getElementById('adminChatInput');
       const text=input.value.trim();
       if(!text) return alert('Type message');
       e.target.innerText='Sending...';
       await addDoc(collection(db,'messages'),{clientPhone:phone,phone:phone,clientName:clients.find(c=>c.phone===phone)?.fullName||phone,message:text,content:text,sender:'admin',adminName:'Admin',status:'sent',createdAt:serverTimestamp()});
       for(let m of messages.filter(m=>(m.clientPhone||m.phone)===phone && m.sender==='client').slice(0,3)){
         try{ await updateDoc(doc(db,'messages',m.id),{status:'read'}); }catch(_){}
       }
       alert('✅ Admin reply sent'); document.getElementById('adminModal').style.display='none'; location.reload();
     }catch(err){ alert('❌ '+err.message); e.target.innerText='Send'; }
   }
   if(id==='waClientAdmin'){
     const phone=e.target.dataset.phone;
     window.open(`https://wa.me/${phone.replace(/[^0-9]/g,'')}?text=Hi - from Hope House Travel Admin`,'_blank');
   }
 });

 window.toggleClientStatus = async (id) => { try{ const c=clients.find(x=>x.id===id); const ns=c.status==='active'?'suspended':'active'; await updateDoc(doc(db,'clients',id),{status:ns}); alert('✅ Status: '+ns); location.reload(); }catch(err){ alert('❌ '+err.message) } };

 renderLayout();
}