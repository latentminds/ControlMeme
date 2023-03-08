import { fetchVariationPaginated, fetchGeneratedMemesBetween } from "../firebase/firestoreCalls";

import TextField from '@mui/material/TextField'
import Search from '@mui/icons-material/Search'
import InputAdornment from '@mui/material/InputAdornment';
import InfiniteScroll from 'react-infinite-scroller';


import { useEffect, useState } from "react";
// Composant that displays the last memes
// fetches the last 10 memes from the firestore db
export default function LastMemeGrid(props) {

    const [paginationHasMore, setPaginationHasMore] = useState(true);

    const lastMemes = props.lastMemes;
    const setLastMemes = props.setLastMemes;


    const style = {
        GeneratedMeme_img: {
            width: '18em',
            height: 'auto',
            margin: 'auto',
            cursor: "pointer"
        },
        GeneratedMeme: {
            margin: '0.5em',
            display: 'flex'
        },
        LastMemeGrid: {
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

    // TODO: find a better way to do this
    useEffect(() => {
        if (lastMemes.length > 1) {
            if (lastMemes[lastMemes.length - 1].url === "https://storage.googleapis.com/control-meme-public/meme_variation_20230302-154342.jpeg") {
                setPaginationHasMore(false);
            }
        }
    }, [lastMemes])




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




            <InfiniteScroll
                pageStart={0}
                loadMore={() => {
                    fetchVariationPaginated().then((lastMemes => {
                        setLastMemes((prevState) => [...prevState, ...lastMemes]);
                    }
                    ))
                }}
                hasMore={paginationHasMore}
                loader={<div className="loader" key={0}>Loading ...</div>}

            >
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

            </InfiniteScroll>

            {/* End of scroll text */}
            {paginationHasMore ? true :
                <div style={{ textAlign: 'center', marginTop: '2em' }}>
                    <p>You've reached the end</p>
                </div>
            }

        </>
    )
}