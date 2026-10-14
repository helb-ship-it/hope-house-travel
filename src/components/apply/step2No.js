export function getStep2NoHtml(destOptions, countyOptions){
  return `
    <div style="background:#fffbeb; border:2px solid #fde68a; border-radius:16px; padding:16px;">
      <div style="font-size:12px; font-weight:900; color:#92400e;">No — Continue first without travelling documents</div>
      <p style="font-size:11px; opacity:0.7; margin:6px 0 12px;">You selected No — We will guide you to get documents later.</p>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
        <select id="lpDestNo" style="padding:12px; border-radius:12px; border:1px solid #fde68a; font-size:13px; background:white; font-weight:600;"><option value="">Destination * (195+ countries)</option>${destOptions}</select>
        <select id="lpPurposeNo" style="padding:12px; border-radius:12px; border:1px solid #e2e8f0; font-size:13px; background:white;"><option>Work</option><option>Study</option><option>Visit</option></select>
      </div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:12px;">
        <select id="lpCountryNo" style="padding:12px; border-radius:12px; border:1px solid #fde68a; font-size:13px; background:white; font-weight:600;"><option value="">Country *</option><option value="Kenya" selected>Kenya 🇰🇪</option><option value="Uganda">Uganda</option><option value="Tanzania">Tanzania</option><option value="Other">Other</option></select>
        <select id="lpCountyNo" style="padding:12px; border-radius:12px; border:1px solid #fde68a; font-size:13px; background:white;">${countyOptions}</select>
      </div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:12px;">
        <input id="lpConstituencyNo" placeholder="SubCounty / Constituency *" style="padding:12px; border-radius:12px; border:1px solid #e2e8f0; font-size:13px;">
        <input id="lpWardNo" placeholder="Ward / Village / Estate (Optional)" style="padding:12px; border-radius:12px; border:1px solid #e2e8f0; font-size:13px;">
      </div>
      <div style="margin-top:10px; background:white; border:1px solid #fde68a; border-radius:10px; padding:10px; font-size:11px;"><b>Full Location Auto:</b> <span id="fullLocationNo">Kenya, Bomet</span></div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:12px;">
        <input id="lpReferralNo" placeholder="Referral Code HH-... (Optional)" style="padding:12px; border-radius:12px; border:1px solid #e2e8f0; font-size:13px;">
        <textarea id="lpNotesNo" placeholder="Additional Notes / Reason for Travel" style="padding:12px; border-radius:12px; border:1px solid #e2e8f0; font-size:13px; height:60px;"></textarea>
      </div>
    </div>
  `;
}