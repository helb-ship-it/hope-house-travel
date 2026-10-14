export function getStep2YesHtml(destOptions, countyOptions){
  return `
    <div style="background:white; border:2px solid #bfdbfe; border-radius:16px; padding:16px;">
      <div style="font-size:12px; font-weight:900; color:#2563eb; margin-bottom:12px;">✅ Yes — Full Travel Details (Per your list)</div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
        <select id="lpDest" style="padding:12px; border-radius:12px; border:1px solid #bfdbfe; font-size:13px; background:white; font-weight:600;"><option value="">Destination * (195+ countries)</option>${destOptions}</select>
        <select id="lpPurpose" style="padding:12px; border-radius:12px; border:1px solid #e2e8f0; font-size:13px; background:white;"><option value="">Purpose *</option><option selected>Work</option><option>Study</option><option>Visit</option></select>
      </div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:12px;">
        <select id="lpVisaType" style="padding:12px; border-radius:12px; border:1px solid #bfdbfe; font-size:13px; background:white;"><option value="">Visa Type / Category *</option><option>Work Permit</option><option>Student Visa</option><option>Tourist Visa</option><option>Business</option><option>Transit</option><option>Other</option></select>
        <input id="lpTravelDate" type="date" style="padding:12px; border-radius:12px; border:1px solid #bfdbfe; font-size:13px;">
      </div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:12px;">
        <select id="lpDuration" style="padding:12px; border-radius:12px; border:1px solid #bfdbfe; font-size:13px; background:white;"><option value="">Duration of Stay</option><option>3 Months</option><option>6 Months</option><option>1 Year</option><option>2 Years</option><option>Permanent</option><option>Open</option></select>
        <select id="lpHasTraveled" style="padding:12px; border-radius:12px; border:1px solid #bfdbfe; font-size:13px; background:white;"><option value="">Have you traveled before?</option><option>Yes</option><option>No</option></select>
      </div>
      <input id="lpPrevDest" placeholder="Previous Destination / Travel History (If Yes — list countries)" style="width:100%; padding:12px; border-radius:12px; border:1px solid #bfdbfe; font-size:13px; margin-top:12px; display:none;">
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:12px;">
        <select id="lpPassportStatus" style="padding:12px; border-radius:12px; border:1px solid #bfdbfe; font-size:13px; background:white;"><option value="">Passport Status *</option><option>Have Passport</option><option>No Passport</option><option>Processing</option></select>
        <input id="lpPassportNo" placeholder="Passport Number *" style="padding:12px; border-radius:12px; border:1px solid #bfdbfe; font-size:13px;">
      </div>
      <input id="lpPassportExpiry" type="date" style="width:100%; padding:12px; border-radius:12px; border:1px solid #bfdbfe; font-size:13px; margin-top:12px;">
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:12px;">
        <select id="lpFunding" style="padding:12px; border-radius:12px; border:1px solid #bfdbfe; font-size:13px; background:white;"><option value="">Funding Source</option><option>Self</option><option>Sponsor</option><option>Scholarship</option><option>Employer</option></select>
        <input id="lpJobCourse" placeholder="Job / Course Interested In" style="padding:12px; border-radius:12px; border:1px solid #bfdbfe; font-size:13px;">
      </div>
      <div id="sponsorBox" style="display:none; margin-top:12px; background:#f8fafc; border:1px solid #eef2f7; border-radius:12px; padding:12px;">
        <div style="font-size:11px; font-weight:800; margin-bottom:8px;">Sponsor Details</div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
          <input id="lpSponsorName" placeholder="Sponsor Name" style="padding:12px; border-radius:12px; border:1px solid #e2e8f0; font-size:13px;">
          <input id="lpSponsorContact" placeholder="Sponsor Contact" style="padding:12px; border-radius:12px; border:1px solid #e2e8f0; font-size:13px;">
        </div>
      </div>
      <div style="margin-top:14px; background:#f8fafc; border:1px solid #eef2f7; border-radius:12px; padding:12px;">
        <div style="font-size:11px; font-weight:800; margin-bottom:8px;">Location Tracking Country → County → SubCounty</div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
          <select id="lpCountryYes" style="padding:12px; border-radius:12px; border:1px solid #bfdbfe; font-size:13px; background:white; font-weight:600;"><option value="">Country *</option><option value="Kenya" selected>Kenya 🇰🇪</option><option value="Uganda">Uganda</option><option value="Tanzania">Tanzania</option><option value="Rwanda">Rwanda</option><option value="Burundi">Burundi</option><option value="South Sudan">South Sudan</option><option value="Ethiopia">Ethiopia</option><option value="Somalia">Somalia</option><option value="DR Congo">DR Congo</option><option value="Nigeria">Nigeria</option><option value="Ghana">Ghana</option><option value="South Africa">South Africa</option><option value="USA">USA</option><option value="Canada">Canada</option><option value="UK">UK</option><option value="Australia">Australia</option><option value="NZ">NZ</option><option value="India">India</option><option value="China">China</option><option value="UAE">UAE</option><option value="Other">Other</option></select>
          <select id="lpCountyYes" style="padding:12px; border-radius:12px; border:1px solid #bfdbfe; font-size:13px; background:white;">${countyOptions}</select>
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:10px;">
          <input id="lpConstituencyYes" placeholder="SubCounty / Constituency *" style="padding:12px; border-radius:12px; border:1px solid #e2e8f0; font-size:13px;">
          <input id="lpWardYes" placeholder="Ward / Village / Estate (Optional)" style="padding:12px; border-radius:12px; border:1px solid #e2e8f0; font-size:13px;">
        </div>
        <div style="margin-top:10px; background:#eff6ff; border:1px solid #dbeafe; border-radius:10px; padding:10px; font-size:11px;"><b>Full Location Auto:</b> <span id="fullLocationYes">Kenya, Bomet</span></div>
      </div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:12px;">
        <input id="lpReferralYes" placeholder="Referral Code HH-... (Optional)" style="padding:12px; border-radius:12px; border:1px solid #e2e8f0; font-size:13px;">
        <input id="lpReferredByYes" placeholder="Referred By (Direct / Staff Name)" style="padding:12px; border-radius:12px; border:1px solid #e2e8f0; font-size:13px;">
      </div>
      <textarea id="lpNotesYes" placeholder="Additional Notes / Reason for Travel" style="width:100%; padding:12px; border-radius:12px; border:1px solid #e2e8f0; font-size:13px; height:80px; margin-top:12px;"></textarea>
    </div>
  `;
}