import React, { useState } from 'react';
import { Card, CardContent, CardMedia, IconButton, Typography } from '@mui/material';
import { ThumbUp, ThumbDown } from '@mui/icons-material';


export const ImageCard = ({ imageSrc }) => {
    const [upvoteCount, setUpvoteCount] = useState(0);
    const [downvoteCount, setDownvoteCount] = useState(0);

    const handleUpvote = () => {
        setUpvoteCount(upvoteCount + 1);
    };

    const handleDownvote = () => {
        setDownvoteCount(downvoteCount + 1);
    };

    console.log('imageSrc', imageSrc)

    return (
        <Card>
            <img src={imageSrc} alt="meme" style={{
                width: '18em',
                height: 'auto',
                margin: 'auto',
                cursor: "pointer"
            }} />
            <CardContent>
                <Typography variant="body2" color="textSecondary" component="p">
                    Upvotes: {upvoteCount}, Downvotes: {downvoteCount}
                </Typography>
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
