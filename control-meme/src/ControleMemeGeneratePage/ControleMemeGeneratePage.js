import { Breadcrumbs, Button, FormControl, Grid, InputLabel, Link, MenuItem, Select, Slider, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { db } from "../firebase/firebaseconfig"
import { collection, getDocs } from "firebase/firestore";
import { fetchBaseMemesData, fetchBaseMemesUrls } from "../firebase/firestoreCalls";
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import { UploadImage } from "./UploadImage";


import { ControleMemeGeneratePageStep2 } from "./ControleMemeGeneratePageStep2";

export default function ControleMemeGeneratePage({ colabSessionLink, setColabSessionLink }) {

    const STEPS = ['Colab Connection', 'ControlNet Generation'];

    const [currentStep, setCurrentStep] = useState(0);
    // get default value from url

    const [baseMemes, setBaseMemes] = useState([]);
    // fetch last10 memes from firestore and add them to the state


    useEffect(() => {
        fetchBaseMemesData().then((baseMemes) => {
            setBaseMemes(baseMemes)
            console.log(baseMemes)
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
            {currentStep === 1 && <ControleMemeGeneratePageStep2 colabSessionLink={colabSessionLink} setColabSessionLink={setColabSessionLink}
                baseMemes={baseMemes} />}
            {currentStep === 2 && <ControleMemeGeneratePageStep3 />}
        </div>


    )
}

function ControleMemeGeneratePageStep1(props) {
    return (
        <div className="ControleMemeGeneratePageStep1">
            <h1>Step 1: Connect to colab backend</h1>

            <p>1. Open the <a href="https://colab.research.google.com/github/koll-ai/control-meme-api/blob/main/Controlmeme_Colab_API.ipynb">Colab Link</a> in another tab</p>
            <p>2. Run all the cells until are given the session link</p>
            <p>3. Copy the session link and paste it in the input below</p>
            <p>4. Click on the next button</p>
            <p>if you've clicked on the link from colab, it should already be pasted in the field below</p>
            <TextField label="Colab Session Link" variant="outlined" value={props.colabSessionLink} onChange={(e) => props.setColabSessionLink(e.target.value)} />
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