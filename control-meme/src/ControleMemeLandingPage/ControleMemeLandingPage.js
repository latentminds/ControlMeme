import { useState } from "react";
import ImageInfoModal from "./ImageInfoModal"
import LastMemeGrid from "./LastMemeGrid"

export default function ControleMemeLandingPage(props) {

    const [clickedImageUrl, setClickedImageUrl] = useState(null);
    const [clickedImageParentUrl, setClickedImageParentUrl] = useState(null);

    const [showModalImageInfo, setShowModalImageInfo] = useState(false);
    const [clickedImageInfo, setClickedImageInfo] = useState(null); // dict or args


    // on click on a meme, open the modal
    const handleOpenModalImageInfo = (imageInfo, imageURL, parentURL) => {
        console.log(parentURL)
        console.log(imageInfo);
        setClickedImageInfo(imageInfo);
        setClickedImageUrl(imageURL);
        setClickedImageParentUrl(parentURL);
        setShowModalImageInfo(true);
    }

    return (
        <div className="ControleMemeLandingPage">
            <ImageInfoModal imageInfo={clickedImageInfo}
                imageURL={clickedImageUrl}
                parentImageURL={clickedImageParentUrl}
                openImage={showModalImageInfo} setOpenImage={setShowModalImageInfo} />
            <LastMemeGrid setClickedImageInfo={setClickedImageInfo}
                setClickedImageUrl={setClickedImageUrl}
                setShowModalImageInfo={setShowModalImageInfo}
                onClickImage={handleOpenModalImageInfo}
                setClickedImageParentUrl={setClickedImageParentUrl}
                parentImageURL={clickedImageParentUrl}
                lastMemes={props.lastMemes}
                setLastMemes={props.setLastMemes}
            />
        </div>
    )
}