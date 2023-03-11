import { useEffect, useState } from "react";
import ImageInfoModal from "./ImageInfoModal"
import LastMemeGrid from "./LastMemeGrid"
import { logEvent } from "firebase/analytics";
import { analytics } from "../firebase/firebaseconfig"

export default function ControleMemeLandingPage(props) {

    const [clickedImageUrl, setClickedImageUrl] = useState(null);
    const [clickedImageParentUrl, setClickedImageParentUrl] = useState(null);
    const [clickedImageHintUrl, setClickedImageHintUrl] = useState(null);

    const [showModalImageInfo, setShowModalImageInfo] = useState(false);
    const [clickedImageInfo, setClickedImageInfo] = useState(null); // dict or args

    useEffect(() => {
        logEvent(analytics, 'page_view', {
            page_title: 'Landing Page',
            page_location: window.location.href,
            page_path: window.location.pathname
        });
    }, [])


    // on click on a meme, open the modal
    const handleOpenModalImageInfo = (imageInfo, imageURL, parentURL, hintURL) => {
        logEvent(analytics, 'select_content', {
            page_title: 'Landing Page',
            url: imageURL
        });

        console.log(parentURL)
        console.log(imageInfo);
        setClickedImageInfo(imageInfo);
        setClickedImageUrl(imageURL);
        setClickedImageParentUrl(parentURL);
        setClickedImageHintUrl(hintURL);
        setShowModalImageInfo(true);
    }

    return (
        <div className="ControleMemeLandingPage">
            <ImageInfoModal imageInfo={clickedImageInfo}
                imageURL={clickedImageUrl}
                parentImageURL={clickedImageParentUrl}
                hintURL={clickedImageHintUrl}
                openImage={showModalImageInfo} setOpenImage={setShowModalImageInfo} />
            <LastMemeGrid setClickedImageInfo={setClickedImageInfo}
                setClickedImageUrl={setClickedImageUrl}
                setShowModalImageInfo={setShowModalImageInfo}
                onClickImage={handleOpenModalImageInfo}
                lastMemes={props.lastMemes}
                setLastMemes={props.setLastMemes}
            />
        </div>
    )
}