import { db } from "./firebaseconfig";
import { collection, getDocs } from "firebase/firestore";

export const fetchLastGeneratedMemesVariations = async () => {
    let lastVariations = [];
    // collection is BaseMemes > id of the base meme > Variations
    return await getDocs(collection(db, "Variations"))
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                let meme = doc.data();
                meme.uuid = doc.id;
                lastVariations.push(meme);
            }
            );
            console.log(lastVariations);
            return lastVariations;
        }
        )
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
