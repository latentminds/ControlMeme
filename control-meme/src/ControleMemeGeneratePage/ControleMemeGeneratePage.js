import { Breadcrumbs, Button, FormControl, Grid, InputLabel, Link, MenuItem, Select, Slider, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { db } from "../firebase/firebaseconfig"
import { collection, getDocs } from "firebase/firestore";
import { fetchBaseMemesData, fetchBaseMemesUrls } from "../firebase/firestoreCalls";
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import { UploadImage } from "./UploadImage";

import "./ControlMemeGeneratePage.css"

export default function ControleMemeGeneratePage({colabSessionLink, setColabSessionLink}) {

    const STEPS = ['Colab Connection', 'Base Image Selection', 'ControleNet Generation'];

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
            {currentStep === 1 && <ControleMemeGeneratePageStep2 colabSessionLink={colabSessionLink} 
                                                                 baseMemes={baseMemes} />}
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
    const DEFAULT_IMAGE_URL = "https://st3.depositphotos.com/23594922/31822/v/600/depositphotos_318221368-stock-illustration-missing-picture-page-for-website.jpg";

    const handleDragStart = (e) => e.preventDefault();

    const [prompt, setPrompt] = useState("");
    const [numInferencesSteps, setNumInferencesSteps] = useState(50);
    const [controlnetPreprocess, setControlnetPreprocess] = useState("none");
    const [controlnetModel, setControlnetModel] = useState("none");
    const [controlnetThresholdA, setControlnetThresholdA] = useState(0);
    const [controlnetThresholdB, setControlnetThresholdB] = useState(0);

    const [selectedMeme, setSelectedMeme] = useState(DEFAULT_IMAGE_URL);
    const [controlnetHintb64, setControlnetHintb64] = useState("");

    const [generatedImageb64, setGeneratedImageb64] = useState("");


//control_canny [e3fe7712]
    

    // send file to api
    const handleClickGenerate = () => {
        // convert steps to int
        console.log("selectedMeme", selectedMeme)
        const selectedMemeUUID = selectedMeme.uuid

        const args = {
            "uuid": selectedMemeUUID,
            "prompt": prompt,
            "nb_steps": parseInt(numInferencesSteps),
            "controlnet_basememe_url": selectedMeme.url,
            "controlnet_module": controlnetPreprocess,
            "controlnet_threshold_a": controlnetThresholdA,
            "controlnet_threshold_b": controlnetThresholdB
        }
        console.log(args)
        // call api and get base64 image response
        fetch(props.colabSessionLink + '/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Bypass-Tunnel-Reminder': 'please'
            },
            body: JSON.stringify(args),
        })
            .then(response => response.text())
            .then(data => {
                console.log('Success:', data);
                setGeneratedImageb64(data)
            }
            )
            .catch((error) => {
                console.error('Error:', error);
            }
            );

    }

    const handleClickAddToPublic = () => {
        // fetch colab link
        fetch(props.colabSessionLink+'/save_last/', {
            method: 'GET',
            headers: {
                'Bypass-Tunnel-Reminder': 'please'
            },
        })
            .then(response => response.text())
            .then(data => {
                console.log('Success:', data);
            }
            )
            .catch((error) => {
                console.error('Error:', error);
            }
            );
    }


    const handleClickHintPreview = () => {
        // call api with with the following args
        const args = {
            'controlnet_basememe_url': selectedMeme.url,
            'controlnet_module': controlnetPreprocess,
            'controlnet_threshold_a': controlnetThresholdA,
            'controlnet_threshold_b': controlnetThresholdB
        }
        console.log(args)

        // call api POST at /hint/ and get base64 image response
        fetch(props.colabSessionLink + '/hint/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Bypass-Tunnel-Reminder': 'please'
            },
            body: JSON.stringify(args),
        })
            .then(response => response.text())
            .then(data => {
                console.log('Success:', data);
                setControlnetHintb64(data)
            }
            )
            .catch((error) => {
                console.error('Error:', error);
            }
            );
    }


                
        
    const changeControlnetThresholdA = (event, newValue) => {
        console.log('called')
        setControlnetThresholdA(newValue);
    };
    const changeControlnetThresholdB = (event, newValue) => {
        setControlnetThresholdB(newValue);
    };


    // create img list from baseMemesUrls
    const items = props.baseMemes.map((baseMeme, index) => {
        return (
            <img src={baseMeme.url} className="MemeSelectionImage selected" onDragStart={handleDragStart} alt='' role="presentation" onClick={() => setSelectedMeme(baseMeme) 
            } />
        )
    })

    // panel for prompt and params options
    const ParamsPanel = () => {
        return (
    <div className="ParamsPanel">
        <Grid container spacing={2}>
            <Grid item xs={6}>

                <FormControl fullWidth>
                    <TextField label="Prompt" variant="outlined" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
                    <br />
                    <TextField label="Num Inferences Steps" variant="outlined" value={numInferencesSteps} onChange={(e) => setNumInferencesSteps(e.target.value)} />
                    <br />
                    {/* Select one of canny, hed, mlsd, depth, depths_leres, normal_map, openpose, openpose_hand, fake_skribble, segmentation, pidinet */}
                    <label id="demo-simple-select-label">Controlnet Preprocess</label>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={controlnetPreprocess}
                        onChange={(e) => setControlnetPreprocess(e.target.value)}
                    >
                        <MenuItem value={"none"}>None</MenuItem>
                        <MenuItem value={"canny"}>Canny</MenuItem>
                        <MenuItem value={"hed"}>HED</MenuItem>
                        <MenuItem value={"mlsd"}>MLSD</MenuItem>
                        <MenuItem value={"depth"}>Depth</MenuItem>
                        <MenuItem value={"depths_leres"}>Depth LERES</MenuItem>
                        <MenuItem value={"normal_map"}>Normal Map</MenuItem>
                        <MenuItem value={"openpose"}>OpenPose</MenuItem>
                        <MenuItem value={"openpose_hand"}>OpenPose Hand</MenuItem>
                        <MenuItem value={"fake_skribble"}>Fake Skribble</MenuItem>
                        <MenuItem value={"segmentation"}>Segmentation</MenuItem>
                        <MenuItem value={"pidinet"}>PIDINet</MenuItem>
                    </Select>

                    <br />
                    <TextField label="Controlnet Model" variant="outlined" value={controlnetModel} onChange={(e) => setControlnetModel(e.target.value)} />
                    <br />
                    <Slider 
                            defaultValue={controlnetThresholdA}
                            aria-labelledby="continuous-slider-A" 
                            valueLabelDisplay="auto"
                            step={1}
                            min={0}
                            max={200}
                            onChangeCommitted={changeControlnetThresholdA}
                             />
                    <br />
                    <Slider
                            defaultValue={controlnetThresholdB}
                            aria-labelledby="continuous-slider-B" 
                            valueLabelDisplay="auto"
                            step={1}
                            min={0}
                            max={200}
                            onChangeCommitted={changeControlnetThresholdB}
                        />

                    <br />
                    <Button variant="contained" color="primary" onClick={handleClickHintPreview}>
                        Generate Hint Preview
                    </Button>
                </FormControl>
            </Grid>
            <Grid item xs={6}>

                {controlnetHintb64 !== "" && <img src={"data:image/jpeg;base64, " + controlnetHintb64} alt="controlnet hint" className="ControlnetHint"/>}
                {controlnetHintb64 === "" && <img src={DEFAULT_IMAGE_URL} alt="controlnet hint" className="ControlnetHint"/>}
            </Grid>
        </Grid>


    </div>
        )
    }



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

            <img src={selectedMeme.url} className="SelectedMeme"/>

            <h2> 2. Add a prompt and params</h2>
            {/* Display side by side */}
            <div className="ParamsPanel">
                <ParamsPanel />
            </div>

            <h2> 3. Generate meme !</h2>

            <FormControl fullWidth>
                <Button variant="contained" color="primary" onClick={() => handleClickGenerate()}>Generate</Button>
            </FormControl>

            <h2> 4. See IA Variation !</h2>
            
            {generatedImageb64 !== "" && <img src={"data:image/jpeg;base64, " + generatedImageb64} alt="generated image" className="GeneratedMeme"/>} 
            {generatedImageb64 === "" && <img src={DEFAULT_IMAGE_URL} alt="generated image" className="GeneratedMeme"/>}

            
            <br />
            <Button variant="contained" color="primary" onClick={() => handleClickAddToPublic()}>Add to public gallery</Button>
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