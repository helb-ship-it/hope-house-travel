export function genRef(name){
  const p=(name.split(' ').map(n=>n[0]).join('').toUpperCase()||'HH').substring(0,2);
  const n=Math.floor(10+Math.random()*90);
  return 'HH-'+p+'M-'+(4200+n);
}