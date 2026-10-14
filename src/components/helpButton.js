export function getHelpButton(){
  return `
<div id="helpAgentBtn" style="position:fixed; bottom:20px; right:20px; z-index:9999; display:flex; flex-direction:column; align-items:flex-end; gap:8px; font-family:Inter;">
  <div id="helpTooltip" style="background:#0f2a5c; color:white; padding:8px 12px; border-radius:12px; font-size:11px; box-shadow:0 8px 24px rgba(0,0,0,0.2); display:none;">Need help? Chat live 💬</div>
  <button style="width:60px; height:60px; border-radius:50%; background:linear-gradient(135deg,#2563eb,#1e40af); border:3px solid white; box-shadow:0 8px 24px rgba(37,99,235,0.4); display:grid; place-items:center; font-size:26px; cursor:pointer;">💬</button>
</div>
`;
}
export function bindHelpButton(){
  const btn=document.getElementById('helpAgentBtn');
  const tip=document.getElementById('helpTooltip');
  if(!btn) return;
  setTimeout(()=>{ if(tip){ tip.style.display='block'; setTimeout(()=>tip.style.display='none',3500); } },2000);
  btn.onclick=()=>{
    location.hash='#messenger';
    location.reload();
  };
}