// Modal Component that displays a modal containing the image and its informations
// Props: imageInfo: Object containing the image information
//        imageURL: Image URL to be displayed
//        open: Boolean that indicates if the modal is open or not

import React from 'react';
import { Box, Button, Grid, Modal, Typography } from '@mui/material';

import './ImageInfoModal.css'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    overflow: 'scroll'

};


export default function ImageInfoModal({ imageInfo, imageURL, parentImageUrl, openImage, setOpenImage }) {

    const [openDetails, setOpenDetails] = React.useState(false);
    const [displayOriginalImage, setDisplayOriginalImage] = React.useState(false);

    const handleCloseImage = () => {
        setOpenImage(false);
        setOpenDetails(false);
        setDisplayOriginalImage(false);
    };


    const bodyImageModale = (
        <div className="contotn">
            <img onClick={() => setDisplayOriginalImage(!displayOriginalImage)} src={displayOriginalImage ? imageInfo.parent_url : imageURL} alt="meme" />
            <Button variant="contained" onClick={() => setOpenDetails(true)}>Details</Button>
        </div>
    );

    const bodyDetailsModale = (
        <div>
            <Box sx={style} style={{ maxHeight: '100vh', overflow: 'auto' }}>
                {openDetails && Object.keys(imageInfo).map((key, index) => {
                    if (imageInfo[key] !== null) {
                        console.log(key, imageInfo[key]);
                        if (key === 'timestamp') {
                            imageInfo[key] = new Date(imageInfo[key].seconds).toLocaleString();
                        }
                        return (
                            <p key={index}> <strong>{key}: </strong> {imageInfo[key]}</p>
                        )
                    }
                })}
            </Box>
        </div>
    );




    return (
        <div>
            <Modal
                open={openImage}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                onClose={() => {
                    setOpenImage(false)
                    setDisplayOriginalImage(false)
                }
                }

            >


                {bodyImageModale}

                {/* Button close modal*/}

            </Modal>
            <Modal
                open={openDetails}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                onClose={() => setOpenDetails(false)}
            >
                {bodyDetailsModale}
            </Modal>
        </div >
    );
}