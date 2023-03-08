import { db } from "./firebaseconfig";
import { collection, endBefore, getDocs, limit, orderBy, query, startAfter, startAt } from "firebase/firestore";

export const fetchAllGeneratedMemesVariations = async () => {
    //todo: replace with better query when variation are in the db with parent_url

    let variations = [];
    let baseMemes = [];
    // collection is BaseMemes > id of the base meme > Variations
    // order by first sooner datetime
    // also add the url with the parent_uuid = base meme uuid

    await getDocs(collection(db, "Variations"))
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                let meme = doc.data();
                meme.uuid = doc.id;
                variations.push(meme);
            }
            );
            console.log(variations)
            //sort by date
            variations.sort((a, b) => {
                return new Date(b.timestamp.seconds) - new Date(a.timestamp.seconds);
            });
            console.log(variations)
        }
        )

    await getDocs(collection(db, "BaseMemes"))
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                let baseMeme = doc.data();
                baseMeme.uuid = doc.id;
                baseMemes.push(baseMeme);
            }
            );
            console.log(baseMemes)
        }
        )

    // add the parent url to the variations
    variations.forEach((variation) => {
        baseMemes.forEach((baseMeme) => {
            if (variation.parent_uuid === baseMeme.uuid) {
                variation.parent_url = baseMeme.url;
            }
        })
    })

    // sort by timestamp.seconds desc
    variations.sort((a, b) => {
        return new Date(b.timestamp.seconds) - new Date(a.timestamp.seconds);
    });

    console.log(variations);

    return variations;

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

let variationsSnapshot = null;

// fetches Variations between startIndex and endIndex when ordered by timestamp desc
export async function fetchVariationPaginated() {

    if (variationsSnapshot === null) {
        variationsSnapshot = await getDocs(
            query(
                collection(db, "Variations"),
                orderBy("timestamp", "desc"),
                limit(10)
            ));
    } else {
        let lastVisible = variationsSnapshot.docs[variationsSnapshot.docs.length - 1];
        variationsSnapshot = await getDocs(
            query(
                collection(db, "Variations"),
                orderBy("timestamp", "desc"),
                startAfter(lastVisible),
                limit(10)
            ));
    }


    const variations = [];
    variationsSnapshot.forEach((doc) => {
        const data = doc.data();
        let meme = doc.data();
        meme.uuid = doc.id;
        variations.push(meme);
    });


    return variations;
}





