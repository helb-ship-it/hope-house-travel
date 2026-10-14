export function isValidPhone(p){ return /^[0-9+\s-]{10,15}$/.test(p.replace(/\s/g,'')); }
export function calcAgeFromDob(dobStr){
  if(!dobStr) return null;
  const dob=new Date(dobStr); const diff=Date.now()-dob.getTime(); const age=Math.abs(new Date(diff).getUTCFullYear()-1970); return age;
}