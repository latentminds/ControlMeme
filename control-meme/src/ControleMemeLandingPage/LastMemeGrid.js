import { fetchLastGeneratedMemesVariations } from "../firebase/firestoreCalls";

import TextField from '@mui/material/TextField'
import Search from '@mui/icons-material/Search'
import InputAdornment from '@mui/material/InputAdornment';

import { useEffect, useState } from "react";
// Composant that displays the last memes
// fetches the last 10 memes from the firestore db
export default function LastMemeGrid(props) {

    const [lastMemesUrls, setLastMemesUrls] = useState([]);

    // fetch last10 memes from firestore and add them to the state
    // const fetchPost = async () => {
    //     //todo:fix  how many are returned 
    //     await getDocs(collection(db, "images"))
    //         .then((querySnapshot)=>{           
    //             let lastMemesUrls = [];    
    //             querySnapshot.forEach((doc) => {
    //                 console.log(doc.data());
    //                 console.log(lastMemesUrls.length);
    //                 lastMemesUrls.push(doc.data().url);
    //             });
    //             setLastMemesUrls(lastMemesUrls);
    //         })

    // }

    // fetches the last 10 memes from the firestore db at the start of the component
    useEffect(() => {
        fetchLastGeneratedMemesVariations().then((lastMemes => {
            let lastMemesUrls = [];
            lastMemes.forEach((meme) => {
                lastMemesUrls.push(meme.url);
            });
            setLastMemesUrls(lastMemesUrls);
        }
        ))
    }, [])




    return (
        <>
            <TextField
                id="standard-basic"
                placeholder="Search meme"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Search/>
                        </InputAdornment>
                    ),
                }}
            />

            <div className="LastMemeGrid">
                {lastMemesUrls.map((url, index) => {
                    return <img src={url} alt="meme" key={index} height={100} width={100} />
                })}
            </div>
        </>
    )
}