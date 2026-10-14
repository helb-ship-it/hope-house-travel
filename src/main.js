import { initLanding } from './pages/landing.js';
import { initAbout } from './pages/about.js';
import { initDestinations } from './pages/destinations.js';
import { initServices } from './pages/services.js';
import { initHowItWorks } from './pages/howItWorks.js';
import { initContact } from './pages/contact.js';
import { initApplyPage } from './pages/apply.js';
import { initClientDashboard } from './pages/client.js';
import { initStaffDashboard } from './pages/staff.js';
import { initAdminDashboard } from './pages/admin.js';
import { initLoginPage } from './pages/login.js';
import { initMessenger } from './pages/messenger.js';

const routes = {
  '': initLanding,
  'home': initLanding,
  'about': initAbout,
  'destinations': initDestinations,
  'services': initServices,
  'how': initHowItWorks,
  'how-it-works': initHowItWorks,
  'contact': initContact,
  'messenger': initMessenger,
  'chat': initMessenger,
  'help': initMessenger,
  'apply': initApplyPage,
  'login': initLoginPage,
  'client-login': () => { sessionStorage.setItem('loginTab','client'); initLoginPage(); },
  'staff-login': () => { sessionStorage.setItem('loginTab','staff'); initLoginPage(); },
  'admin-login': () => { sessionStorage.setItem('loginTab','admin'); initLoginPage(); },
  'client': () => {
    if(!localStorage.getItem('hht_client_phone')){
      location.hash = '#login';
      sessionStorage.setItem('loginTab','client');
      initLoginPage();
      return;
    }
    initClientDashboard();
  },
  'staff': () => {
    const role = localStorage.getItem('hht_role');
    if(role!=='staff' && role!=='admin'){
      location.hash = '#login';
      sessionStorage.setItem('loginTab','staff');
      initLoginPage();
      return;
    }
    initStaffDashboard();
  },
  'admin': () => {
    if(localStorage.getItem('hht_role')!=='admin'){
      location.hash = '#login';
      sessionStorage.setItem('loginTab','admin');
      initLoginPage();
      return;
    }
    initAdminDashboard();
  }
};

function router(){
  try{
    let raw = window.location.hash || '';
    let hash = raw.replace(/^#/, '').trim().toLowerCase();
    hash = hash.split('?')[0].split('/')[0];
    console.log('[ROUTER] Hash:', raw, '=>', hash);
    const appEl = document.querySelector('#app');
    if(!appEl){ setTimeout(router, 100); return; }
    const fn = routes[hash];
    if(fn){ fn(); } else {
      if(hash!==''){ console.warn('[ROUTER] Unknown hash', hash); }
      initLanding();
    }
    window.scrollTo({top:0, behavior:'instant'});
  } catch(e){
    console.error('[ROUTER] Error:', e);
    const appEl = document.querySelector('#app');
    if(appEl){
      appEl.innerHTML = `<div style="padding:40px; font-family:Inter;"><h2>Error loading page</h2><p>${e.message}</p><button onclick="location.hash=''; location.reload()" style="background:#2563eb; color:white; border:none; padding:10px 16px; border-radius:999px; cursor:pointer;">Go Home</button></div>`;
    }
  }
}
window.navigateTo = (hash)=>{ location.hash = hash; setTimeout(()=>location.reload(), 50); };
window.goHome = ()=>{ location.hash = ''; location.reload(); };
if(document.readyState === 'loading'){ document.addEventListener('DOMContentLoaded', router); } else { router(); }
window.addEventListener('hashchange', router);
window.addEventListener('popstate', router);
export { router };