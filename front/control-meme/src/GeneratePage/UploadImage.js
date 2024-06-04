import React, { useState } from 'react';


// Input component that allows the user to upload a locol image to the api
// Display the image when the file is uploaded
export const UploadImage = ({setFile}) => {
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

    const handleImageChange = (e) => {
        e.preventDefault();

        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onloadend = () => {
            setFile(file);
            setImagePreviewUrl(reader.result);
        }

        reader.readAsDataURL(file)
    }

    let $imagePreview = null;
    if (imagePreviewUrl) {
        $imagePreview = (<img src={imagePreviewUrl} />);
    } else {
        $imagePreview = (<div className="previewText">Please select an Image for Preview</div>);
    }

    return (
        <div className="previewComponent">
            <input className="fileInput"
                type="file"
                onChange={(e) => handleImageChange(e)} />
            <div className="imgPreview">
                {$imagePreview}
            </div>
        </div>
    )
}