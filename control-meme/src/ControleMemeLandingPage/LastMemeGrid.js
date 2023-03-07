import { fetchLastGeneratedMemesVariations } from "../firebase/firestoreCalls";

import TextField from '@mui/material/TextField'
import Search from '@mui/icons-material/Search'
import InputAdornment from '@mui/material/InputAdornment';

import './LastMemeGrid.css'

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

    //css
    // .GeneratedMeme img {
    //     width: 20em;
    //     height: auto;
    //     margin: auto;
    // }
    
    // .GeneratedMeme {
    //     margin: 0.5em;
    //     display: flex;
    // }
    
    // .LastMemeGrid {
    //     padding-top: 2em;
    //     display: flex;
    //     flex-wrap: wrap;
    //     flex-direction: row;
    
    //     max-width: 100em;
    
    //     margin-left: auto;
    //     margin-right: auto;
    
    //     justify-content: center
    // }
    const style = {
        GeneratedMeme_img : {
            width: '20em',
            height: 'auto',
            margin: 'auto',
            cursor: "pointer"
        },
        GeneratedMeme : {
            margin: '0.5em',
            display: 'flex'
        },
        LastMemeGrid : {
            paddingTop: '2em',
            display: 'flex',
            flexWrap: 'wrap',
            flexDirection: 'row',
            maxWidth: '100em',
            marginLeft: 'auto',
            marginRight: 'auto',
            justifyContent: 'center'
        }
    }



    return (
        <>
            {/* <TextField
                id="standard-basic"
                placeholder="Search meme"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Search />
                        </InputAdornment>
                    ),
                }}
            /> */}

            <div style={style.LastMemeGrid}>
                {lastMemes.map((meme, index) => {
                    return <div className style={style.GeneratedMeme}>
                        <img src={meme.url} alt="meme" key={index}
                            onClick={() => props.onClickImage(meme, meme.url, meme.parent_url)}
                            style={style.GeneratedMeme_img}
                        />
                    </div>
                })}
            </div>
        </>
    )
}