import { Button, Checkbox, CircularProgress, FormControl, FormControlLabel, FormGroup, Grid, MenuItem, Select, Slider, TextField } from "@mui/material";
import { useState, useEffect } from "react";

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import "./GeneratePage.css"
import { ToastContainer, toast } from 'react-toastify';
import { fetchBaseMemesData, fetchBaseMemesUrls, fetchSharedColabs, removeSharedColab } from "../firebase/firestoreCalls";
import 'react-toastify/dist/ReactToastify.css';
import { analytics } from "../firebase/firebaseconfig";
import { logEvent } from "firebase/analytics";
import { addSharedColab } from "../firebase/firestoreCalls";


const notify_error = (message) => toast.error(message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
});

const notify_success = (message) => toast.success(message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
});

export default function GeneratePage(props) {

    const DEFAULT_IMAGE_URL = "https://st3.depositphotos.com/23594922/31822/v/600/depositphotos_318221368-stock-illustration-missing-picture-page-for-website.jpg";

    const handleDragStart = (e) => e.preventDefault();

    const [params, setParams] = useState({
        'prompt': 'Cute cat digital painting, masterpiece',
        'imageb64': null,
        'seed': '31000604',
        'selectedMeme': { 'url': DEFAULT_IMAGE_URL },
    });

    const [baseMemes, setBaseMemes] = useState([]);
    const [generatedImageb64, setGeneratedImageb64] = useState("");

    const [generateButtonDisabled, setGenerateButtonDisabled] = useState(false);
    const [addtopublicButtonDisabled, setAddtopublicButtonDisabled] = useState(false);

    //control_canny [e3fe7712]

    useEffect(() => {
        logEvent(analytics, 'page_view', {
            page_title: 'GeneratePageStep2',
            page_location: window.location.href,
            page_path: window.location.pathname
        });

        fetchBaseMemesData().then((baseMemes) => {
            setBaseMemes(baseMemes)
        });

    }, [])

    // send file to api
    const handleClickGenerate = () => {
        setGenerateButtonDisabled(true)

        const imageElement = document.getElementById('selectedImage');

        // Check if the image element exists
        if (!imageElement) return;        
        
        // Convert image to b64
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = imageElement.width;
        canvas.height = imageElement.height;
        context.drawImage(imageElement, 0, 0);

        const imageb64 = canvas.toDataURL('image/png');

        const args = {
            "prompt": params.prompt,
            "seed": parseInt(params.seed),
            "imageb64": imageb64,
        }

        // call api and get base64 image response
        fetch(props.apiUrl + '/generate/', {
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
                setGenerateButtonDisabled(false)
                setAddtopublicButtonDisabled(false)
                notify_success("Variation generated!")
            }
            )
            .catch((error) => {
                console.error('Error:', error);
                notify_error("Error: API is not responding. Please try again in a minute.")
                setGenerateButtonDisabled(false)
            }
            );

    }

    const handleClickAddToPublic = () => {
        // fetch colab link
        setAddtopublicButtonDisabled(true)
        fetch(props.apiUrl + '/save/', {
            method: 'GET',
            headers: {
                'Bypass-Tunnel-Reminder': 'please'
            },
        })
            .then(response => response.text())
            .then(data => {
                console.log('Success:', data);
                notify_success("Variation added to public gallery")
            }
            )
            .catch((error) => {
                console.error('Error:', error);
                notify_error("Error: API is not responding. Please try again in a minute.")
            }
            );
    }

    // create img list from baseMemesUrls
    const items = baseMemes.map((baseMeme, index) => {
        return (
            <img className={params.selectedMeme.url == baseMeme.url ? "SelectedMeme" : ""} src={baseMeme.url} onDragStart={handleDragStart} role="presentation" onClick={() => setParams({ ...params, selectedMeme: baseMeme })} />
        )
    })



    return (
        <div className="GeneratePageStep2">
            <ToastContainer />

            {/* Display side by side centered*/}
            <Grid container spacing={1} direction="row" justifyContent="center" alignItems="center">
                <Grid item xs={12} sm={5} mx={1} style={{ borderRadius: "10px", border: "1px solid #000" }}>
                    <div className="MemeSelector">
                        <span>
                            {items}
                        </span>
                    </div>
                </Grid>

                <Grid item xs={12} sm={6} mx={1} >
                    {params.selectedMeme.url !== DEFAULT_IMAGE_URL &&
                        <img src={params.selectedMeme.url} alt="controlnet hint" crossOrigin="anonymous" id="selectedImage" />}
                    {params.selectedMeme.url === DEFAULT_IMAGE_URL && <img src={DEFAULT_IMAGE_URL} alt="controlnet hint" className="" />}

                </Grid>
            </Grid>

            <Grid container spacing={1} direction="row" justifyContent="center" alignItems="center">
                <Grid item xs={12} sm={5} mx={1}>


                    <h2> 3. Generate Meme !</h2>


                    <FormControl fullWidth>
                        <TextField label="Prompt" variant="outlined" value={params.prompt} onChange={(e) => setParams({ ...params, prompt: e.target.value })} />
                        <br />
                        
                        {/* align center */}
                        {generateButtonDisabled === true && <CircularProgress style={{ margin: "auto" }} />}
                        {generateButtonDisabled === false &&
                            <Button variant="contained" color="primary" onClick={() => handleClickGenerate()}
                                disabled={generateButtonDisabled === true || props.apiUrl === "" || params.selectedMeme.url === DEFAULT_IMAGE_URL || prompt === "" || params.numInferencesSteps === "" || params.controlnetPreprocess === "" || params.controlnetModel === "" || params.controlnetThresholdA === "" || params.controlnetThresholdB === ""}>
                                Generate
                            </Button>
                        }
                        <br />
                        * You might need to click a second time if the image is not loaded

                    </FormControl>

                </Grid>
                <Grid item xs={12} sm={6} mx={1}>

                    <div className="generatedMeme" >
                        {generatedImageb64 !== "" && <img className="ControlnetHint" src={"data:image/jpeg;base64, " + generatedImageb64} alt="generated image with controlnet" />}
                        {generatedImageb64 === "" && <img className="ControlnetHint" src={DEFAULT_IMAGE_URL} alt="generated image" />}
                    </div>

                    <br />

                    <Button
                        variant="contained" color="primary"
                        onClick={() => handleClickAddToPublic()}
                        disabled={addtopublicButtonDisabled === true || params.selectedMeme.url === DEFAULT_IMAGE_URL || prompt === "" || params.numInferencesSteps === "" || params.controlnetPreprocess === "" || params.controlnetModel === "" || params.controlnetThresholdA === "" || params.controlnetThresholdB === ""}
                    >
                        Add to public gallery
                    </Button>
                </Grid>
            </Grid>
        </div >
    )
}