import { db } from '../config/firebase.js';
import { collection, getDocs } from 'firebase/firestore';

export async function autoAssignLeastLoaded(clientId){
  try{
    const staffSnap = await getDocs(collection(db,'staff'));
    if(staffSnap.empty) return null;
    let least=null; let min=Infinity;
    staffSnap.forEach(d=>{
      const data=d.data();
      const load = data.currentLoad || 0;
      if(load < min){ min=load; least={ id:d.id, ...data }; }
    });
    // also check clients count as fallback
    if(!least) {
      const first = staffSnap.docs[0];
      return { id:first.id, ...first.data() };
    }
    return least;
  }catch(e){
    console.log('assign error', e);
    return null;
  }
}