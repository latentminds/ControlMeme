import { Breadcrumbs, Button, FormControl, Grid, InputLabel, Link, MenuItem, Select, Slider, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { db } from "../firebase/firebaseconfig"
import { collection, getDocs } from "firebase/firestore";
import { fetchBaseMemesData, fetchBaseMemesUrls } from "../firebase/firestoreCalls";
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import { UploadImage } from "./UploadImage";
import { logEvent } from "firebase/analytics";
import { analytics } from "../firebase/firebaseconfig";

import { ControleMemeGeneratePageStep2 } from "./ControleMemeGeneratePageStep2";

export default function ControleMemeGeneratePage({ colabSessionLink, setColabSessionLink }) {

    // get default value from url

    const [baseMemes, setBaseMemes] = useState([]);
    // fetch last10 memes from firestore and add them to the state


    useEffect(() => {
        fetchBaseMemesData().then((baseMemes) => {
            setBaseMemes(baseMemes)
            console.log(baseMemes)
        })

    }, [])

    return (
        <div className="ControleMemeGeneratePage">

            {console.log(colabSessionLink)}

            {
                colabSessionLink == "https://null" &&
                <ControleMemeGeneratePageStep1 colabSessionLink={colabSessionLink} setColabSessionLink={setColabSessionLink} />
            }

            {
                colabSessionLink != "https://null" &&
                <>
                    <ControleMemeGeneratePageStep2 colabSessionLink={colabSessionLink} setColabSessionLink={setColabSessionLink} baseMemes={baseMemes} />
                </>
            }
        </div>
    )
}

function ControleMemeGeneratePageStep1(props) {

    useEffect(() => {
        logEvent(analytics, 'page_view', {
            page_title: 'Generate Page Step 1',
            page_location: window.location.href,
            page_path: window.location.pathname
        });
    }, [])


    return (
        <div className="ControleMemeGeneratePageStep1">
            <h1>Please connect to Google Colab backend</h1>

            <p>1. Open the <a onClick={() => {
                logEvent(analytics, 'select_content', {
                    page_title: 'Generate Page Step 1',
                    url: "https://colab.research.google.com/github/koll-ai/control-meme-api/blob/main/Controlmeme_Colab_API.ipynb"
                });

            }}
                href="https://colab.research.google.com/github/koll-ai/control-meme-api/blob/main/Controlmeme_Colab_API.ipynb" target="_blank"> Colab Link</a> in another tab</p>
            <p>2. Blindly Run all  cells until you see a meme.koll.ai link (this can take a while)</p>
            <p>3. Click the link in the output of the last cell and go back to this page to start creating new memes !</p>

            <br></br>

            <a target="_blank" href="https://colab.research.google.com/github/koll-ai/control-meme-api/blob/main/Controlmeme_Colab_API.ipynb">
                <img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open In Colab" />
            </a>

        </div>
    )
}