import React, { useState } from 'react';
import { makeStyles } from '@mui/styles';
import { Card, CardContent, CardMedia, IconButton, Typography } from '@mui/material';
import { ThumbUp, ThumbDown } from '@mui/icons-material';


export const ImageCard = ({ imageSrc }) => {
    const classes = useStyles();
    const [upvoteCount, setUpvoteCount] = useState(0);
    const [downvoteCount, setDownvoteCount] = useState(0);

    const handleUpvote = () => {
        setUpvoteCount(upvoteCount + 1);
    };

    const handleDownvote = () => {
        setDownvoteCount(downvoteCount + 1);
    };

    return (
        <Card className={classes.root}>
            <CardMedia className={classes.media} image={imageSrc} title={title} />
            <CardContent>
                <Typography variant="body2" color="textSecondary" component="p">
                    Upvotes: {upvoteCount}, Downvotes: {downvoteCount}
                </Typography>
                <IconButton aria-label="upvote" onClick={handleUpvote}>
                    <ThumbUp />
                </IconButton>
                <IconButton aria-label="downvote" onClick={handleDownvote}>
                    <ThumbDown />
                </IconButton>
            </CardContent>
        </Card>
    );
};

export default ImageCard;
