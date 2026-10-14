import { db } from '../config/firebase.js';
import { DESTS } from '../constants/destinations.js';
import { kenyaCounties, ugandaCounties } from '../constants/counties.js';
import { applyData } from '../state.js';
import { genRef } from '../utils/refGenerator.js';
import { isValidPhone, calcAgeFromDob } from '../utils/validators.js';
import { autoAssignLeastLoaded } from '../utils/autoAssign.js';
import { getStep1Html } from '../components/apply/step1.js';
import { getStep2Html } from '../components/apply/step2.js';
import { collection, addDoc, getDocs, query, where, serverTimestamp, doc, setDoc } from 'firebase/firestore';

export function initApplyPage(){
  const appEl=document.querySelector('#app');
  const savedDest = applyData.destination || sessionStorage.getItem('applyDestination') || '';
  let destOptions=''; DESTS.forEach(d=>{ const sel=d===savedDest?'selected':''; destOptions+=`<option value="${d}" ${sel}>${d}</option>`; });
  let ageOptions='<option value="">Select Age *</option>'; for(let i=19;i<=41;i++){ ageOptions+=`<option value="${i}">${i}</option>`; }
  let countyOptions='<option value="">County *</option>'; kenyaCounties.forEach(c=>{ const sel=c==='Bomet'?'selected':''; countyOptions+=`<option value="${c}" ${sel}>${c}</option>`; });

  appEl.innerHTML=`
<div style="min-height:100vh; background:#f8fbff; font-family:Inter,system-ui;">
  <header style="background:white; border-bottom:1px solid #eef2f7; padding:14px 18px; display:flex; justify-content:space-between; align-items:center;">
    <div style="display:flex; gap:10px; align-items:center;"><div style="width:36px; height:36px; background:linear-gradient(135deg,#0ea5e9,#2563eb); border-radius:12px; display:grid; place-items:center; color:white;">✈️</div><div style="font-weight:900;">Hope House Travel — Apply Now (Steps Page)</div></div>
    <button onclick="location.hash=''; location.reload()" style="background:#f1f5f9; border:none; padding:8px 16px; border-radius:999px; font-size:12px; cursor:pointer; font-weight:700;">← Back Home</button>
  </header>
  <div style="max-width:860px; margin:0 auto; padding:20px 16px;">
    <div style="background:white; border-radius:20px; padding:16px; border:1px solid #eef2f7; display:grid; grid-template-columns:repeat(4,1fr); gap:8px; margin-bottom:16px;">
      <div id="step1Ind" style="text-align:center; padding:12px; background:#eff6ff; border:1px solid #dbeafe; border-radius:12px;"><div style="width:28px; height:28px; background:#2563eb; color:white; border-radius:50%; display:grid; place-items:center; margin:0 auto; font-size:12px; font-weight:800;">1</div><div style="font-size:11px; font-weight:800; margin-top:6px;">Step 1<br>Applicant Details</div></div>
      <div id="step2Ind" style="text-align:center; padding:12px; background:#f8fafc; border:1px solid #f1f5f9; border-radius:12px; opacity:0.5;"><div style="width:28px; height:28px; background:#e2e8f0; border-radius:50%; display:grid; place-items:center; margin:0 auto; font-size:12px; font-weight:800;">2</div><div style="font-size:11px; font-weight:800; margin-top:6px;">Step 2<br>Travel Details</div></div>
      <div id="step3Ind" style="text-align:center; padding:12px; background:#f8fafc; border:1px solid #f1f5f9; border-radius:12px; opacity:0.5;"><div style="width:28px; height:28px; background:#e2e8f0; border-radius:50%; display:grid; place-items:center; margin:0 auto; font-size:12px; font-weight:800;">3</div><div style="font-size:11px; font-weight:800; margin-top:6px;">Step 3<br>Review & Submit</div></div>
      <div id="step4Ind" style="text-align:center; padding:12px; background:#f8fafc; border:1px solid #f1f5f9; border-radius:12px; opacity:0.5;"><div style="width:28px; height:28px; background:#e2e8f0; border-radius:50%; display:grid; place-items:center; margin:0 auto; font-size:12px; font-weight:800;">4</div><div style="font-size:11px; font-weight:800; margin-top:6px;">Step 4<br>Confirmation</div></div>
    </div>
    <div style="background:white; border-radius:20px; padding:24px; border:1px solid #eef2f7; box-shadow:0 12px 32px rgba(0,0,0,0.06);">
      <div id="s1">${getStep1Html(ageOptions)}</div>
      <div id="s2" style="display:none;">${getStep2Html(destOptions, countyOptions)}</div>
      <div id="s3" style="display:none;">
        <h2 style="font-size:18px; font-weight:900; margin:0;">Step 3 — Review & Submit</h2><div id="reviewBox" style="background:#f8fafc; border:1px solid #eef2f7; border-radius:12px; padding:14px; font-size:12px; line-height:1.8; margin-top:12px;"></div>
        <div style="display:flex; gap:10px; margin-top:18px;"><button id="backTo2" style="flex:1; background:#f1f5f9; border:none; padding:14px; border-radius:12px; font-weight:700; cursor:pointer;">← Back</button><button id="finalSubmit" style="flex:2; background:linear-gradient(90deg,#16a34a,#15803d); color:white; padding:14px; border-radius:12px; border:none; font-weight:800; cursor:pointer;">🚀 Submit & Get Reference</button></div>
        <p id="lpStatus" style="display:none; font-size:11px; margin-top:12px; padding:12px; background:#eff6ff; border:1px solid #dbeafe; border-radius:12px;"></p>
      </div>
      <div id="s4" style="display:none; text-align:center;">
        <div style="width:72px; height:72px; background:#dcfce7; border-radius:50%; display:grid; place-items:center; margin:0 auto; font-size:36px;">✅</div><h2 style="margin:16px 0 8px; font-size:20px; font-weight:900;">Application Confirmation</h2><div id="confirmBox" style="background:#eff6ff; border:1px solid #dbeafe; border-radius:16px; padding:16px; margin:16px 0; text-align:left; font-size:12px;"></div><div style="display:flex; gap:10px;"><a href="#" id="goClient" style="flex:1; background:linear-gradient(90deg,#2563eb,#1e40af); color:white; padding:14px; border-radius:12px; text-decoration:none; font-weight:800; display:block;">Go to Client Login →</a><a href="#" onclick="location.hash=''; location.reload()" style="flex:1; background:#f1f5f9; color:#0f2a5c; padding:14px; border-radius:12px; text-decoration:none; font-weight:700; display:block;">Back Home</a></div>
      </div>
    </div>
  </div>
</div>`;

  function updateSteps(active){
    ['step1Ind','step2Ind','step3Ind','step4Ind'].forEach((id,idx)=>{
      const el=document.getElementById(id);
      const isActive=(idx+1)<=active;
      el.style.opacity=isActive?'1':'0.5';
      el.style.background=(idx+1)===active?'#eff6ff': isActive?'#f0fdf4':'#f8fafc';
    });
  }

  document.getElementById('lpDob').onchange=function(){
    const age=calcAgeFromDob(this.value);
    if(age>=19 && age<=41){ document.getElementById('lpAge').value=age; }
  };
  document.getElementById('toStep2').onclick=()=>{
    const n=document.getElementById('lpName').value.trim(), p=document.getElementById('lpPhone').value.trim(), e=document.getElementById('lpEmail').value.trim(), a=document.getElementById('lpAge').value, edu=document.getElementById('lpEdu').value, gender=document.getElementById('lpGender').value;
    if(!n||!p||!e||!a||!edu||!gender){ alert('Fill required in Step 1'); return; }
    if(!isValidPhone(p)){ alert('Phone must be valid'); return; }
    document.getElementById('s1').style.display='none'; document.getElementById('s2').style.display='block'; updateSteps(2);
  };
  document.getElementById('hasDocsYes').onchange=function(){ if(this.checked){ document.getElementById('yesBox').style.display='block'; document.getElementById('noBox').style.display='none'; } };
  document.getElementById('hasDocsNo').onchange=function(){ if(this.checked){ document.getElementById('yesBox').style.display='none'; document.getElementById('noBox').style.display='block'; } };
  document.getElementById('lpHasTraveled')?.addEventListener('change', function(){ const el=document.getElementById('lpPrevDest'); if(el) el.style.display=this.value==='Yes'?'block':'none'; });
  document.getElementById('lpFunding')?.addEventListener('change', function(){ const el=document.getElementById('sponsorBox'); if(el) el.style.display=this.value==='Sponsor'?'block':'none'; });

  function populateCounty(selectId, countryVal){
    const sel=document.getElementById(selectId); if(!sel) return; sel.innerHTML='<option value="">County *</option>';
    let list=countryVal==='Kenya'?kenyaCounties:countryVal==='Uganda'?ugandaCounties:["Other County"];
    list.forEach(c=>{ const o=document.createElement('option'); o.value=c; o.textContent=c; sel.appendChild(o); });
    if(countryVal==='Kenya') sel.value='Bomet';
  }
  document.getElementById('lpCountryYes')?.addEventListener('change', function(){ populateCounty('lpCountyYes', this.value); });
  document.getElementById('lpCountryNo')?.addEventListener('change', function(){ populateCounty('lpCountyNo', this.value); });

  document.getElementById('backTo1').onclick=()=>{ document.getElementById('s2').style.display='none'; document.getElementById('s1').style.display='block'; updateSteps(1); };
  document.getElementById('toStep3').onclick=()=>{
    const hasDocsEl=document.querySelector('input[name="hasDocs"]:checked');
    if(!hasDocsEl){ alert('Select Yes/No for travelling docs'); return; }
    const hasDocs=hasDocsEl.value;
    let dest, country, county, constituency;
    if(hasDocs==='Yes'){
      dest=document.getElementById('lpDest').value; country=document.getElementById('lpCountryYes').value; county=document.getElementById('lpCountyYes').value; constituency=document.getElementById('lpConstituencyYes').value.trim();
      if(!dest||!country||!county||!constituency){ alert('Fill Destination, Country, County, SubCounty'); return; }
    } else {
      dest=document.getElementById('lpDestNo').value; country=document.getElementById('lpCountryNo').value; county=document.getElementById('lpCountyNo').value; constituency=document.getElementById('lpConstituencyNo').value.trim();
      if(!dest||!country||!county||!constituency){ alert('Fill Destination, Country, County, SubCounty'); return; }
    }
    document.getElementById('reviewBox').innerHTML=`<b>Applicant:</b> ${document.getElementById('lpName').value} • ${document.getElementById('lpPhone').value}<br><b>Docs:</b> ${hasDocs}<br><b>Destination:</b> ${dest}<br><b>Location:</b> ${country} → ${county} → ${constituency}`;
    document.getElementById('s2').style.display='none'; document.getElementById('s3').style.display='block'; updateSteps(3);
  };
  document.getElementById('backTo2').onclick=()=>{ document.getElementById('s3').style.display='none'; document.getElementById('s2').style.display='block'; updateSteps(2); };

  document.getElementById('finalSubmit').onclick=async function(){
    const fullName=document.getElementById('lpName').value.trim(); const dob=document.getElementById('lpDob').value; const phone=document.getElementById('lpPhone').value.trim(); const altPhone=document.getElementById('lpAltPhone').value.trim(); const email=document.getElementById('lpEmail').value.trim(); const age=document.getElementById('lpAge').value; const edu=document.getElementById('lpEdu').value; const gender=document.getElementById('lpGender').value; const idPass=document.getElementById('lpIdPass').value.trim(); const field=document.getElementById('lpField').value.trim(); const marital=document.getElementById('lpMarital').value; const residence=document.getElementById('lpResidence').value.trim(); const kinName=document.getElementById('lpKinName').value.trim(); const kinPhone=document.getElementById('lpKinPhone').value.trim();
    const hasDocs=document.querySelector('input[name="hasDocs"]:checked')?.value||'No';
    let destination, purpose, visaType, travelDate, duration, hasTraveled, prevDest, passportStatus, passportNo, passportExpiry, funding, sponsorName, sponsorContact, jobCourse, country, county, constituency, ward, referral, referredBy, notes;
    if(hasDocs==='Yes'){
      destination=document.getElementById('lpDest').value; purpose=document.getElementById('lpPurpose').value; visaType=document.getElementById('lpVisaType').value; travelDate=document.getElementById('lpTravelDate').value; duration=document.getElementById('lpDuration').value; hasTraveled=document.getElementById('lpHasTraveled').value; prevDest=document.getElementById('lpPrevDest').value.trim(); passportStatus=document.getElementById('lpPassportStatus').value; passportNo=document.getElementById('lpPassportNo').value.trim(); passportExpiry=document.getElementById('lpPassportExpiry').value; funding=document.getElementById('lpFunding').value; sponsorName=document.getElementById('lpSponsorName').value.trim(); sponsorContact=document.getElementById('lpSponsorContact').value.trim(); jobCourse=document.getElementById('lpJobCourse').value.trim(); country=document.getElementById('lpCountryYes').value; county=document.getElementById('lpCountyYes').value; constituency=document.getElementById('lpConstituencyYes').value.trim(); ward=document.getElementById('lpWardYes').value.trim(); referral=document.getElementById('lpReferralYes').value.trim(); referredBy=document.getElementById('lpReferredByYes').value.trim(); notes=document.getElementById('lpNotesYes').value.trim();
    } else {
      destination=document.getElementById('lpDestNo').value; purpose=document.getElementById('lpPurposeNo').value; country=document.getElementById('lpCountryNo').value; county=document.getElementById('lpCountyNo').value; constituency=document.getElementById('lpConstituencyNo').value.trim(); ward=document.getElementById('lpWardNo').value.trim(); referral=document.getElementById('lpReferralNo').value.trim(); notes=document.getElementById('lpNotesNo').value.trim();
      visaType=''; travelDate=''; duration=''; hasTraveled=''; prevDest=''; passportStatus='No Passport'; passportNo=''; passportExpiry=''; funding=''; sponsorName=''; sponsorContact=''; jobCourse=''; referredBy='';
    }
    const btn=this; const st=document.getElementById('lpStatus');
    btn.disabled=true; btn.innerText='⏳ Saving...'; st.style.display='block'; st.innerText='Checking duplicate phone...';
    try{
      const snap=await getDocs(query(collection(db,'clients'), where('phone','==',phone)));
      if(!snap.empty){ st.innerHTML='⚠️ Phone '+phone+' already exists ref '+snap.docs[0].data().referralCode; btn.disabled=false; btn.innerText='🚀 Submit & Get Reference'; return; }
      const refCode=genRef(fullName); const fullLocation=country+', '+county;
      
      st.innerText='Assigning least-loaded staff...';
      // Create temp doc id for assignment
      const tempId = 'temp_'+Date.now();
      const assignedStaff = await autoAssignLeastLoaded(tempId);

      const clientData = {
        fullName, dob, age, gender, idPass, phone, altPhone, email, edu, field, marital, residence, kinName, kinPhone,
        hasTravelDocs:hasDocs, destination, purpose, visaType, travelDate, duration, hasTraveled, prevDest, passportStatus, passportNo, passportExpiry, funding, sponsorName, sponsorContact, jobCourse,
        country, county, constituency, ward, location:fullLocation,
        referralCode:refCode, referredBy:referral||referredBy||'Direct', additionalNotes:notes,
        status:'Application received', stage:'Documents Pending', assignedTo: assignedStaff? assignedStaff.id : '', assignedStaffName: assignedStaff? assignedStaff.fullName : 'Unassigned',
        loginPass:phone.slice(-4), createdAt:serverTimestamp(),
        history:[{status:'Application received', at:new Date().toISOString(), by:'system'}]
      };

      const docRef = await addDoc(collection(db,'clients'), clientData);

      // Also create in applications collection for admin stats
      await addDoc(collection(db,'applications'), {
        clientId: docRef.id,
        clientName: fullName,
        clientPhone: phone,
        destination,
        stage: 'Documents Pending',
        assignedStaffId: assignedStaff? assignedStaff.id : '',
        assignedStaffName: assignedStaff? assignedStaff.fullName : 'Unassigned',
        createdAt: serverTimestamp()
      });

      // Re-assign correctly with real id if needed
      if(assignedStaff && assignedStaff.id){
        await setDoc(doc(db,'staff', assignedStaff.id), { currentLoad: (assignedStaff.currentLoad||0)+1 }, {merge:true});
      }

      localStorage.setItem('hht_client_phone', phone);
      document.getElementById('s3').style.display='none'; document.getElementById('s4').style.display='block'; updateSteps(4);
      const assignText=assignedStaff?`Assigned to ${assignedStaff.fullName} - ${assignedStaff.phone} (least-loaded)`:`Unassigned - Admin will assign`;
      document.getElementById('confirmBox').innerHTML=`<div style="font-size:10px; opacity:0.5;">REFERENCE</div><div style="font-size:22px; font-weight:900; color:#2563eb;">${refCode}</div><div style="margin-top:10px; line-height:1.8;"><b>Travel Docs:</b> ${hasDocs}<br><b>Destination:</b> ${destination} - ${purpose}<br><b>Location:</b> ${fullLocation} → ${constituency} ${ward?`→ ${ward}`:''}<br><b>Status:</b> ${assignText}<br><b>Login Password:</b> Last 4 digits ${phone.slice(-4)}</div>`;
      document.getElementById('goClient').onclick=(e)=>{ e.preventDefault(); location.hash='#client'; location.reload(); };
      st.style.display='none';
    }catch(e){ st.innerHTML='❌ Error: '+e.message; console.error(e); btn.disabled=false; btn.innerText='🚀 Submit & Get Reference'; }
  };
}