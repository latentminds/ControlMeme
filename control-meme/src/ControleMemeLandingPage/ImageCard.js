import React, { useState } from 'react';
import { Card, CardContent, CardMedia, IconButton, Typography } from '@mui/material';
import { ThumbUp, ThumbDown } from '@mui/icons-material';
import { auth } from '../firebase/firebaseconfig';


export const ImageCard = ({ meme }) => {
    const URL_UPVOTE = "http://127.0.0.1:5001/control-meme-67c47/us-central1/upvoteVariation";

    const [upvoteCount, setUpvoteCount] = useState(0);
    const [downvoteCount, setDownvoteCount] = useState(0);



    const handleUpvote = () => {
        setUpvoteCount(upvoteCount + 1);


        auth.currentUser.getIdToken(true).then((idToken) => {

            fetch(URL_UPVOTE + "?variationId=" + meme.uuid, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + idToken
                },
            })
                .then(response => response.json())
                .then(data => {
                    console.debug('Success:', data);
                }
                )
                .catch((error) => {
                    console.error('Error:', error);
                }
                );
        });




    };

    const handleDownvote = () => {
        setDownvoteCount(downvoteCount + 1);
    };

    console.debug('meme', meme)

    return (
        <Card>
            <img src={meme.url} alt="meme" style={{
                width: '18em',
                height: 'auto',
                margin: 'auto',
                cursor: "pointer"
            }} />
            <CardContent>
                <IconButton aria-label="upvote" onClick={handleUpvote}>
                    <ThumbUp />
                </IconButton>
                {upvoteCount - downvoteCount}
                <IconButton aria-label="downvote" onClick={handleDownvote}>
                    <ThumbDown />
                </IconButton>
            </CardContent>
        </Card>
    );
};

export default ImageCard;
