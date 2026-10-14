import { getHeader, getFooter, bindHeader } from '../components/layout/header.js';
import { getHelpButton, bindHelpButton } from '../components/helpButton.js';
import { db } from '../config/firebase.js';
import { collection, addDoc, query, where, onSnapshot, serverTimestamp, getDocs } from 'firebase/firestore';

export function initMessenger(){
  const appEl=document.querySelector('#app');
  const clientPhone=localStorage.getItem('hht_client_phone');
  const role=localStorage.getItem('hht_role');
  const staffId=localStorage.getItem('hht_user_id')||'staff';
  const isStaff=role==='staff'||role==='admin';
  const clientName=localStorage.getItem('hht_client_name')||'Client';

  appEl.innerHTML=`
${getHeader('messenger')}
<div style="font-family:Inter; background:#f8fbff; min-height:100vh;">
  <section style="max-width:1200px; margin:0 auto; padding:16px; display:grid; grid-template-columns:${isStaff?'320px 1fr':'1fr'}; gap:16px; height:calc(100vh - 130px);">
    ${isStaff?`<div style="background:white; border-radius:16px; border:1px solid #eef2f7; display:flex; flex-direction:column; overflow:hidden;">
      <div style="padding:14px; border-bottom:1px solid #f1f5f9; font-weight:900; display:flex; justify-content:space-between;"><span>Chats</span><span style="font-size:10px; background:#eff6ff; padding:4px 8px; border-radius:999px;">${role}</span></div>
      <div id="chatList" style="flex:1; overflow:auto; padding:8px; display:flex; flex-direction:column; gap:6px;"><div style="padding:20px; text-align:center; font-size:11px; opacity:0.6;">Loading...</div></div>
    </div>`:''}
    <div style="background:white; border-radius:16px; border:1px solid #eef2f7; display:flex; flex-direction:column; overflow:hidden;">
      <div style="padding:12px 16px; border-bottom:1px solid #f1f5f9; display:flex; justify-content:space-between; align-items:center;">
        <div style="display:flex; gap:10px; align-items:center;"><div style="width:36px; height:36px; background:#2563eb; border-radius:50%; display:grid; place-items:center; color:white;">${isStaff?'👤':'🎧'}</div><div><div id="chatHeaderName" style="font-weight:800; font-size:13px;">${isStaff?'Select client':'Help Agent — Hope House'}</div><div style="font-size:10px; color:#16a34a;">● Online</div></div></div>
        <div style="display:flex; gap:8px;"><button onclick="window.open('https://wa.me/254789338183','_blank')" style="background:#25D366; color:white; border:none; padding:6px 12px; border-radius:999px; font-size:10px; font-weight:700; cursor:pointer;">WhatsApp</button><button id="closeMessenger" style="background:#f1f5f9; border:none; padding:6px 10px; border-radius:999px; cursor:pointer;">✕</button></div>
      </div>
      <div id="messagesBox" style="flex:1; overflow:auto; padding:16px; background:#f8fbff; display:flex; flex-direction:column; gap:8px;"><div style="text-align:center; padding:20px; font-size:11px; opacity:0.6;">${isStaff?'Select a client to chat':'Hello! 👋 Chat with our staff.'}</div></div>
      <div style="padding:12px; border-top:1px solid #f1f5f9; display:flex; gap:8px;"><input id="msgInput" placeholder="Type message..." style="flex:1; padding:12px 14px; border:1px solid #e2e8f0; border-radius:999px; font-size:12px; outline:none;" /><button id="sendMsgBtn" style="width:44px; height:44px; border-radius:50%; background:#2563eb; color:white; border:none; display:grid; place-items:center; cursor:pointer;">➤</button></div>
    </div>
  </section>
</div>
${getFooter()}
${getHelpButton()}
`;
  setTimeout(()=>{ try{ bindHeader(); }catch{} bindHelpButton(); },50);
  document.getElementById('closeMessenger').onclick=()=>{ location.hash=''; location.reload(); };
  let activePhone=clientPhone;
  let unsub=null;
  const box=document.getElementById('messagesBox');
  const input=document.getElementById('msgInput');

  function render(msgs){
    if(!msgs.length){ box.innerHTML=`<div style="text-align:center; padding:20px; font-size:11px; opacity:0.6;">No messages yet. Start below 👇</div>`; return; }
    box.innerHTML=msgs.map(m=>{
      const isMe=isStaff? m.senderRole!=='client' : m.senderRole==='client';
      const t=m.createdAt?.seconds? new Date(m.createdAt.seconds*1000).toLocaleTimeString() : 'now';
      return `<div style="display:flex; justify-content:${isMe?'flex-end':'flex-start'};"><div style="max-width:70%; background:${isMe?'#2563eb':'white'}; color:${isMe?'white':'#0f2a5c'}; border:1px solid ${isMe?'#2563eb':'#eef2f7'}; padding:10px 12px; border-radius:16px; font-size:12px;">${m.text}<div style="font-size:9px; opacity:0.6; margin-top:4px; text-align:right;">${t}</div></div></div>`;
    }).join('');
    box.scrollTop=box.scrollHeight;
  }
  function listen(phone){
    if(unsub) unsub();
    if(!phone) return;
    activePhone=phone;
    // FIXED: No orderBy = No index needed. Sorting done in JS
    const q=query(collection(db,'messages'), where('clientPhone','==',phone));
    unsub=onSnapshot(q, snap=>{
      const data=snap.docs.map(d=>d.data());
      data.sort((a,b)=> (a.createdAt?.seconds||0) - (b.createdAt?.seconds||0));
      render(data);
    }, err=>{
      box.innerHTML=`<div style="background:#fee2e2; padding:12px; border-radius:10px; font-size:11px;">Error: ${err.message}<br><br>Fix: Wait for index to finish building (your screenshot shows Building...). This version works without index.</div>`;
    });
  }
  async function send(){
    const text=input.value.trim();
    if(!text||!activePhone) return;
    input.value='';
    try{
      await addDoc(collection(db,'messages'), {
        clientPhone:activePhone,
        clientName:isStaff? document.getElementById('chatHeaderName').innerText : clientName,
        staffId:isStaff? staffId : (localStorage.getItem('hht_staff_id')||'unassigned'),
        senderId:isStaff? staffId : (clientPhone||activePhone),
        senderRole:isStaff? role : 'client',
        text, read:false, createdAt:serverTimestamp()
      });
    }catch(e){ alert(e.message); }
  }
  document.getElementById('sendMsgBtn').onclick=send;
  input.addEventListener('keydown', e=>{ if(e.key==='Enter') send(); });

  if(isStaff){
    (async()=>{
      const chatList=document.getElementById('chatList');
      try{
        let snap=await getDocs(collection(db,'applications'));
        let clients=snap.docs.map(d=>d.data());
        if(!clients.length){ try{ let s2=await getDocs(collection(db,'clients')); clients=s2.docs.map(d=>d.data()); }catch{} }
        const uniq={};
        clients.forEach(c=>{ const ph=c.phone||c.clientPhone; if(ph&&!uniq[ph]) uniq[ph]=c; });
        const list=Object.values(uniq);
        if(!list.length){ chatList.innerHTML=`<div style="padding:12px; font-size:11px; opacity:0.6;">No clients yet</div>`; return; }
        chatList.innerHTML=list.map(c=>{ const ph=c.phone||c.clientPhone; const nm=c.fullName||c.name||'Client'; const dest=c.destination||''; return `<div class="clientItem" data-phone="${ph}" data-name="${nm}" style="padding:10px; border-radius:12px; border:1px solid #f1f5f9; cursor:pointer; display:flex; gap:10px; background:white;"><div style="width:32px; height:32px; background:#eff6ff; border-radius:50%; display:grid; place-items:center;">👤</div><div><div style="font-weight:700; font-size:12px;">${nm}</div><div style="font-size:10px; opacity:0.6;">${ph} • ${dest}</div></div></div>`; }).join('');
        chatList.querySelectorAll('.clientItem').forEach(el=>{ el.onclick=()=>{ chatList.querySelectorAll('.clientItem').forEach(x=>x.style.background='white'); el.style.background='#eff6ff'; activePhone=el.getAttribute('data-phone'); document.getElementById('chatHeaderName').innerText=el.getAttribute('data-name')+' — '+activePhone; listen(activePhone); }; });
      }catch(e){ chatList.innerHTML=`<div style="color:red; font-size:11px;">${e.message}</div>`; }
    })();
  } else {
    let guest=clientPhone||localStorage.getItem('guest_chat_id');
    if(!guest){ guest='guest-'+Date.now(); localStorage.setItem('guest_chat_id',guest); }
    activePhone=guest;
    listen(guest);
  }
}