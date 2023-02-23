import { db } from "./firebaseconfig";
import { collection, getDocs } from "firebase/firestore";

export const fetchLastGeneratedMemesUrls = async () => {
    //todo:fix  how many are returned 
    let lastMemesUrls = [];    
    return await getDocs(collection(db, "images"))
        .then((querySnapshot)=>{           
            querySnapshot.forEach((doc) => {
                lastMemesUrls.push(doc.data().url);
            }
            
            );
            return lastMemesUrls;
        })
   
}

export const fetchBaseMemesUrls = async () => {
    let baseMemesUrls = [];    
    return await getDocs(collection(db, "base_memes"))
        .then((querySnapshot)=>{           
            querySnapshot.forEach((doc) => {
                baseMemesUrls.push(doc.data().url);
            }
            );
            return baseMemesUrls;
        }) 
    }