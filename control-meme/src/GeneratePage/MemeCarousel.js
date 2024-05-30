import { Carousel } from "react-responsive-carousel"

    // Carousel base on baseMemesUrls
export const CarouselUrl = ({imagesUrls}) => {
    return(
        <Carousel>
            {imagesUrls.map((url, index) => {
                        <div>
                            <img src={url} />
                            <p className="legend">Legend {index}</p>
                        </div>
            })}

        </Carousel>
    )
}