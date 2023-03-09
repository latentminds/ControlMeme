import cv2
import imutils
import cv2
import numpy as np

# paste transparent logo on bottom left corner of the variation image


def overlay_transparent(background, overlay, x, y):

    background_width = background.shape[1]
    background_height = background.shape[0]

    if x >= background_width or y >= background_height:
        return background

    h, w = overlay.shape[0], overlay.shape[1]

    if x + w > background_width:
        w = background_width - x
        overlay = overlay[:, :w]

    if y + h > background_height:
        h = background_height - y
        overlay = overlay[:h]

    if overlay.shape[2] < 4:
        overlay = np.concatenate(
            [
                overlay,
                np.ones((overlay.shape[0], overlay.shape[1],
                        1), dtype=overlay.dtype) * 255
            ],
            axis=2,
        )

    overlay_image = overlay[..., :3]
    mask = overlay[..., 3:] / 255.0

    background[y:y+h, x:x+w] = (1.0 - mask) * \
        background[y:y+h, x:x+w] + mask * overlay_image

    return background


def overlay_logo(variation_image, logo_image):

    logo_image = cv2.resize(logo_image, (0, 0), fx=0.1, fy=0.1)

    # compute x y coordinates of the logo on the variation image so that it is on the bottom left corner
    logo_x = 10
    logo_y = variation_image.shape[0] - logo_image.shape[0] - 10

    variation_image_with_logo = overlay_transparent(
        variation_image, logo_image, logo_x, logo_y)

    text_to_add = "meme.koll.ai"
    text_x = logo_x + logo_image.shape[1] + 10
    text_y = logo_y + logo_image.shape[0]

    colors = {'white': (255, 255, 255), 'black': (0, 0, 0)}
    variation_image_with_logo_and_text = cv2.putText(img=variation_image_with_logo,
                                                     text=text_to_add, org=(
                                                         text_x, text_y - 10),
                                                     fontFace=cv2.FONT_HERSHEY_SIMPLEX,
                                                     fontScale=1, color=colors["black"],
                                                     thickness=4,
                                                     lineType=cv2.LINE_AA)
    variation_image_with_logo_and_text = cv2.putText(img=variation_image_with_logo_and_text,
                                                     text=text_to_add, org=(
                                                         text_x, text_y - 10),
                                                     fontFace=cv2.FONT_HERSHEY_SIMPLEX,
                                                     fontScale=1, color=colors["white"],
                                                     thickness=2,
                                                     lineType=cv2.LINE_AA)

    return variation_image_with_logo_and_text


# variation_url = "https://storage.googleapis.com/control-meme-public/meme_variation_20230308-203229.jpeg"
# variation_image = imutils.url_to_image(variation_url)

# logo_image = cv2.imread("../images/logo.png", cv2.IMREAD_UNCHANGED)

# variation_image_with_logo_and_text = overlay_logo(variation_image, logo_image)

# cv2.imwrite("../images/meme_variation_20230308-203229_with_signature.jpeg",
#             variation_image_with_logo_and_text)
