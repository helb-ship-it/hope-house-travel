import { getStep2YesHtml } from './step2Yes.js';
import { getStep2NoHtml } from './step2No.js';

export function getStep2Html(destOptions, countyOptions){
  return `
    <h2 style="font-size:18px; font-weight:900; margin:0;">Step 2 — Travel Details *</h2>
    <div style="background:#eff6ff; border:1px solid #bfdbfe; border-radius:14px; padding:14px; margin-top:14px;">
      <div style="font-size:14px; font-weight:900; color:#0f2a5c;">Do you have travelling documents? *</div>
      <div style="display:flex; gap:12px; margin-top:12px;">
        <label style="flex:1; display:flex; gap:8px; align-items:center; background:white; border:2px solid #e2e8f0; padding:12px; border-radius:12px; cursor:pointer; font-size:13px; font-weight:700;"><input type="radio" name="hasDocs" value="Yes" id="hasDocsYes"> Yes (opens details)</label>
        <label style="flex:1; display:flex; gap:8px; align-items:center; background:white; border:2px solid #e2e8f0; padding:12px; border-radius:12px; cursor:pointer; font-size:13px; font-weight:700;"><input type="radio" name="hasDocs" value="No" id="hasDocsNo"> No (Continue first without)</label>
      </div>
    </div>
    <div id="yesBox" style="display:none; margin-top:16px;">${getStep2YesHtml(destOptions, countyOptions)}</div>
    <div id="noBox" style="display:none; margin-top:16px;">${getStep2NoHtml(destOptions, countyOptions)}</div>
    <div style="display:flex; gap:10px; margin-top:18px;"><button id="backTo1" style="flex:1; background:#f1f5f9; border:none; padding:14px; border-radius:12px; font-weight:700; cursor:pointer;">← Back</button><button id="toStep3" style="flex:2; background:linear-gradient(90deg,#2563eb,#1e40af); color:white; padding:14px; border-radius:12px; border:none; font-weight:800; cursor:pointer;">Continue to Step 3 →</button></div>
  `;
}