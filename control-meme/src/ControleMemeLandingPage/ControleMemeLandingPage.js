import { useState } from "react";
import ImageInfoModal from "./ImageInfoModal"
import LastMemeGrid from "./LastMemeGrid"

export default function ControleMemeLandingPage(props) {

    const [clickedImageUrl, setClickedImageUrl] = useState(null);
    const [showModalImageInfo, setShowModalImageInfo] = useState(false);
    const [clickedImageInfo, setClickedImageInfo] = useState(null); // dict or args


    // on click on a meme, open the modal
    const handleOpenModalImageInfo = (imageInfo, imageURL) => {
        console.log(imageInfo);
        setClickedImageInfo(imageInfo);
        setClickedImageUrl(imageURL);
        setShowModalImageInfo(true);
    }

    return (
        <div className="ControleMemeLandingPage">
            <h1>Welcome To ControlMeme !</h1>
            <ImageInfoModal imageInfo={clickedImageInfo}
                imageURL={clickedImageUrl}
                openImage={showModalImageInfo} setOpenImage={setShowModalImageInfo} />
            <LastMemeGrid setClickedImageInfo={setClickedImageInfo}
                setClickedImageUrl={setClickedImageUrl}
                setShowModalImageInfo={setShowModalImageInfo}
                onClickImage={handleOpenModalImageInfo} />
        </div>
    )
}