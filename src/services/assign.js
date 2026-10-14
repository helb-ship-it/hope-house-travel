import { db } from '../config/firebase.js';
import { collection, getDocs } from 'firebase/firestore';

export async function assignStaffLeastLoaded(){
  const staffSnap = await getDocs(collection(db,'staff'));
  if(staffSnap.empty){
    return { id:'unassigned', name:'Unassigned', phone:'0789338183' };
  }
  let least = null;
  let minCount = Infinity;

  for(const doc of staffSnap.docs){
    const staffId = doc.id;
    const appsSnap = await getDocs(collection(db,'applications'));
    // count applications assigned to this staff where status not completed
    let count = 0;
    appsSnap.forEach(a=>{
      const d=a.data();
      if(d.assignedStaffId===staffId && d.stage!=='Completed') count++;
    });
    if(count < minCount){
      minCount=count;
      least={ id:staffId,...doc.data() };
    }
  }
  return least;
}