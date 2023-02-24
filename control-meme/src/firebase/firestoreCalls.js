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

export const fetchBaseMemesData = async () => {
    //fetch base memes data with uuid from firestore
    let baseMemes = [];
    return await getDocs(collection(db, "BaseMemes"))
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                let meme = doc.data();
                meme.uuid = doc.id;
                baseMemes.push(meme);
            }
            );
            console.log(baseMemes);
            return baseMemes;
        }
        )
}
