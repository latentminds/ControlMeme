import { Breadcrumbs, Button, FormControl, InputLabel, Link, MenuItem, Select, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { db } from "../firebase/firebaseconfig"
import { collection, getDocs } from "firebase/firestore";
import { fetchBaseMemesUrls } from "../firebase/firestoreCalls";
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import { UploadImage } from "./UploadImage";

import "./ControlMemeGeneratePage.css"

export default function ControleMemeGeneratePage(props) {

    const STEPS = ['Colab Connection', 'Base Image Selection', 'ControleNet Generation'];

    const [currentStep, setCurrentStep] = useState(0);
    // get default value from url
    const [colabSessionLink, setColabSessionLink] = useState(new URLSearchParams(window.location.search).get('colabSessionLink') || "");

    const [baseMemesUrls, setBaseMemesUrls] = useState([]);
    // fetch last10 memes from firestore and add them to the state


    useEffect(() => {
        fetchBaseMemesUrls().then((baseMemesUrls) => {
            setBaseMemesUrls(baseMemesUrls)
            console.log(baseMemesUrls)
        })
    }, [])

    const breadcrumbs = <Breadcrumbs aria-label="breadcrumb" separator=">">
        {
            STEPS.map((step, index) => {
                return (
                    //last link is primary color
                    <Link
                        underline="hover"
                        key={index}
                        color={index === currentStep ? "text.primary" : "text.secondary"}
                        //make bold if current step
                        sx={{ fontWeight: index === currentStep ? "bold" : "normal" }}
                        onClick={() => setCurrentStep(index)}
                    >
                        {step}
                    </Link>
                )
            })
        }
    </Breadcrumbs>

    return (
        <div className="ControleMemeGeneratePage">
            {breadcrumbs}

            {currentStep === 0 && <ControleMemeGeneratePageStep1 colabSessionLink={colabSessionLink}
                setColabSessionLink={setColabSessionLink} />}
            {currentStep === 1 && <ControleMemeGeneratePageStep2 baseMemesUrls={baseMemesUrls} />}
            {currentStep === 2 && <ControleMemeGeneratePageStep3 />}
        </div>


    )
}

function ControleMemeGeneratePageStep1(props) {
    return (
        <div className="ControleMemeGeneratePageStep1">
            <h1>Step 1: Connect to colab backend</h1>
            <p>1. Open the Colab in another tab</p>
            <p>2. Run all the cells until are given the session link</p>
            <p>3. Copy the session link and paste it in the input below</p>
            <p>4. Click on the next button</p>
            <p>if you've clicked on the link from colab, it should already be pasted in the field below</p>
            <TextField label="Colab Session Link" variant="outlined" value={props.colabSessionLink} onChange={(e) => props.setColabSessionLink(e.target.value)} />
        </div>
    )
}

function ControleMemeGeneratePageStep2(props) {
    const handleDragStart = (e) => e.preventDefault();

    const [prompt, setPrompt] = useState("");
    const [controlnetPreprocess, setControlnetPreprocess] = useState("none");
    const [controlnetModel, setControlnetModel] = useState("none");

    const [selectedMeme, setSelectedMeme] = useState("https://st3.depositphotos.com/23594922/31822/v/600/depositphotos_318221368-stock-illustration-missing-picture-page-for-website.jpg");

    const [uploadedFile, setUploadedFile] = useState(null);
    console.log(uploadedFile)

    // send file to api
    const handleClickGenerate = () => {
        const formData = new FormData();
        formData.append('file', uploadedFile);
        //put other params in dict and stringify it to formdata
        // todo: if image selected from coroussel, add base_image_link to args 
        const args = {
            'prompt': prompt,
            'controlnetPreprocess': controlnetPreprocess,
            'controlnetModel': controlnetModel,
            'base_image_origin': 'upload'
        }
        formData.append('args', JSON.stringify(args));

        console.log(formData)
        fetch('http://localhost:5000/api/generate', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(result => {
                console.log('Success:', result);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }



    // create img list from baseMemesUrls
    const items = props.baseMemesUrls.map((url, index) => {
        return (
            <img src={url} className="MemeSelectionImage selected" onDragStart={handleDragStart} alt='' role="presentation" onClick={() => setSelectedMeme(url) 
            } />
        )
    })

    // Component to upload image to api



    return (
        <div className="ControleMemeGeneratePageStep2">
            <h1>Step 2</h1>
            <h2>1. Select a base image</h2>
            <AliceCarousel items={items} mouseTracking keyboardNavigation responsive={
                {
                    0: {
                        items: 1,
                    },
                    1024: {
                        items: 5,
                        itemsFit: 'contain',
                    }
                }}
            />

            <img src={selectedMeme} className="SelectedMeme"/>


            <h2>2. Prompt and params: </h2>
            <FormControl fullWidth>
                <TextField label="Prompt" variant="outlined" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
                <br />
                <TextField select
                    id="select-controlnet-preprocess"
                    value={controlnetPreprocess}
                    label="Controlnet Preprocess"
                    onChange={(e) => setControlnetPreprocess(e.target.value)}
                >
                    <MenuItem value="none">None</MenuItem>
                    <MenuItem value="depth">depth</MenuItem>
                </TextField>
                <br />

                <TextField select
                    id="select-controlnet-model"
                    value={controlnetModel}
                    label="Controlnet Model"
                    onChange={(e) => setControlnetModel(e.target.value)}
                >
                    <MenuItem value="none">None</MenuItem>
                    <MenuItem value="depth">depth</MenuItem>
                </TextField>
            </FormControl>

            <h2> 3. Generate meme !</h2>

            <FormControl fullWidth>
                <Button variant="contained" color="primary" onClick={() => handleClickGenerate()}>Generate</Button>
            </FormControl>

        </div>
    )
}

function ControleMemeGeneratePageStep3(props) {
    return (
        <div className="ControleMemeGeneratePageStep3">
            <h1>Step 3</h1>
        </div>
    )
}