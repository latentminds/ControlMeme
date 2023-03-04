import { fetchLastGeneratedMemesVariations } from "../firebase/firestoreCalls";

import TextField from '@mui/material/TextField'
import Search from '@mui/icons-material/Search'
import InputAdornment from '@mui/material/InputAdornment';

import { useEffect, useState } from "react";
// Composant that displays the last memes
// fetches the last 10 memes from the firestore db
export default function LastMemeGrid(props) {

    const [lastMemes, setLastMemes] = useState([]);

    useEffect(() => {
        fetchLastGeneratedMemesVariations().then((lastMemes => {
            setLastMemes(lastMemes);
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
                            <Search />
                        </InputAdornment>
                    ),
                }}
            />

            <div className="LastMemeGrid">
                {lastMemes.map((meme, index) => {
                    return <img src={meme.url} alt="meme" key={index} height={100} width={100}
                        onClick={() => props.onClickImage(meme, meme.url)}
                        style={{ cursor: "pointer" }}
                    />
                })}
            </div>
        </>
    )
}