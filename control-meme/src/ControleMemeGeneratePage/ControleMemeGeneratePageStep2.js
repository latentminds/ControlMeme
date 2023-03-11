import { Button, Checkbox, CircularProgress, FormControl, FormControlLabel, FormGroup, Grid, MenuItem, Select, Slider, TextField } from "@mui/material";
import { useState } from "react";

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import "./ControlMemeGeneratePage.css"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


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

const ParamsPanel = ({
    params, setParams,
    colabSessionLink,
    controlnetHintb64, setControlnetHintb64
}) => {




    const [previewButtonDisabled, setPreviewButtonDisabled] = useState(false);

    const DEFAULT_IMAGE_URL = "https://st3.depositphotos.com/23594922/31822/v/600/depositphotos_318221368-stock-illustration-missing-picture-page-for-website.jpg";
    console.log(params.selectedMeme)
    const handleClickHintPreview = () => {
        setPreviewButtonDisabled(true);
        // call api with with the following args
        const args = {
            'controlnet_basememe_url': params.selectedMeme.url,
            'controlnet_module': params.controlnetPreprocess,
            'controlnet_preprocessor_res': params.controlnetRes,
            'controlnet_threshold_a': params.controlnetThresholdA,
            'controlnet_threshold_b': params.controlnetThresholdB
        }
        console.log(args)

        // call api POST at /hint/ and get base64 image response
        fetch(colabSessionLink + '/hint/', {
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
                setPreviewButtonDisabled(false);
            }
            )
            .catch((error) => {
                console.error('Error:', error);
                setPreviewButtonDisabled(false);
                notify_error("Error: Automatic1111 api is not responding. Please try again in a minute.")
            }
            );
    }

    return (
        <div className="ParamsPanel">

            <Grid container spacing={1} direction="row" justifyContent="center" alignItems="center">
                <Grid item xs={12} sm={5} mx={1}>

                    <FormControl fullWidth>
                        <br />
                        {/* Select one of canny, hed, mlsd, depth, depths_leres, normal_map, openpose, openpose_hand, fake_skribble, segmentation, pidinet */}
                        <Typography gutterBottom textAlign={"left"} id="label-select-preprocess">Controlnet Preprocess</Typography>
                        <Select
                            labelId="label-select-preprocess"
                            id="demo-simple-select"
                            value={params.controlnetPreprocess}
                            onChange={(e) => setParams({ ...params, controlnetPreprocess: e.target.value })}
                            defaultValue="canny"
                        >
                            <MenuItem value={"canny"}>Canny</MenuItem>
                            <MenuItem value={"hed"}>HED</MenuItem>
                            <MenuItem value={"mlsd"}>MLSD</MenuItem>
                            <MenuItem value={"depth"}>Depth</MenuItem>
                            <MenuItem value={"depths_leres"}>Depth LERES</MenuItem>
                            <MenuItem value={"normal_map"}>Normal Map</MenuItem>
                            <MenuItem value={"openpose"}>OpenPose</MenuItem>
                            <MenuItem value={"fake_scribble"}>Fake Skribble</MenuItem>
                            <MenuItem value={"segmentation"}>Segmentation</MenuItem>
                            <MenuItem value={"binary"}>Binary</MenuItem>
                            <MenuItem value={"color"}>Color</MenuItem>
                            <MenuItem value={"none"}>None</MenuItem>
                        </Select>

                        <br />


                        <br />

                        <Typography gutterBottom textAlign={"left"} id="label-select-threshold-a">Preprocess Threshold A:</Typography>
                        <Slider
                            defaultValue={params.controlnetThresholdA}
                            aria-labelledby="continuous-slider-A"
                            valueLabelDisplay="auto"
                            step={1}
                            min={0}
                            max={200}
                            onChangeCommitted={(e, value) => setParams({ ...params, controlnetThresholdA: value })}
                        />
                        <br />
                        <Typography gutterBottom textAlign={"left"} id="label-select-threshold-b">Preprocess Threshold B:</Typography>
                        <Slider
                            defaultValue={params.controlnetThresholdB}
                            aria-labelledby="continuous-slider-B"
                            valueLabelDisplay="auto"
                            step={1}
                            min={0}
                            max={200}
                            onChangeCommitted={(e, value) => setParams({ ...params, controlnetThresholdB: value })}
                        />

                        <br />
                        <Typography gutterBottom textAlign={"left"} id="label-select-res">Preprocess Resolution:</Typography>
                        <Slider
                            defaultValue={params.controlnetRes}
                            aria-labelledby="continuous-slider-res"
                            valueLabelDisplay="auto"
                            step={64}
                            min={64}
                            max={512}
                            onChangeCommitted={(e, value) => setParams({ ...params, controlnetRes: value })}
                        />
                        <br />
                        {previewButtonDisabled === true && <CircularProgress style={{ margin: "auto" }} />}
                        {previewButtonDisabled === false &&

                            <Button variant="contained" color="primary" onClick={handleClickHintPreview}
                                disabled={(params.selectedMeme === null || params.controlnetPreprocess === "none") || previewButtonDisabled === true}
                            >
                                Generate Hint Preview
                            </Button>
                        }
                        <br />
                        * You might need to click a second time if the image is not loaded
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} mx={1} >

                    {controlnetHintb64 !== "" && <img src={"data:image/jpeg;base64, " + controlnetHintb64} alt="controlnet hint" className="ControlnetHint" />}
                    {controlnetHintb64 === "" && <img src={DEFAULT_IMAGE_URL} alt="controlnet hint" className="ControlnetHint" />}

                </Grid>
            </Grid>


        </div >
    )
}

export function ControleMemeGeneratePageStep2(props) {
    const DEFAULT_IMAGE_URL = "https://st3.depositphotos.com/23594922/31822/v/600/depositphotos_318221368-stock-illustration-missing-picture-page-for-website.jpg";

    const handleDragStart = (e) => e.preventDefault();

    const [params, setParams] = useState({
        'prompt': 'Cute cat digital painting, masterpiece',
        'numInferencesSteps': 10,
        'controlnetPreprocess': 'canny',
        'controlnetModel': 'control_canny-fp16 [e3fe7712]',
        'controlnetThresholdA': 30,
        'controlnetThresholdB': 100,
        'controlnetRes': 128,
        'selectedMeme': { 'url': DEFAULT_IMAGE_URL },
        'negativePrompt': 'bad',
        'seed': -1,
        'subseed': -1,
        'subseedStrength': 0,
        'cfgScale': 5,
        'restoreFaces': true,
        'eta': 0,
        'samplerIndex': 'Euler a'
    });

    const [controlnetHintb64, setControlnetHintb64] = useState("");
    const [generatedImageb64, setGeneratedImageb64] = useState("");

    const [generateButtonDisabled, setGenerateButtonDisabled] = useState(false);
    const [addtopublicButtonDisabled, setAddtopublicButtonDisabled] = useState(false);

    //control_canny [e3fe7712]

    useEffect(() => {
        logEvent(analytics, 'page_view', {
            page_title: 'ControleMemeGeneratePageStep2',
            page_location: window.location.href,
            page_path: window.location.pathname
        });
    }, [])

    // send file to api
    const handleClickGenerate = () => {
        setGenerateButtonDisabled(true)
        // convert steps to int
        console.log("selectedMeme", params.selected_meme)
        const selectedMemeUUID = params.selectedMeme.uuid

        const args = {
            "uuid": selectedMemeUUID,
            "controlnet_basememe_url": params.selectedMeme.url,
            "controlnet_module": params.controlnetPreprocess,
            "controlnet_threshold_a": params.controlnetThresholdA,
            "controlnet_threshold_b": params.controlnetThresholdB,
            'controlnet_preprocessor_res': params.controlnetRes,
            "controlnet_model": params.controlnetModel,

            "prompt": params.prompt,
            "steps": parseInt(params.numInferencesSteps),
            "negative_prompt": params.negativePrompt,
            "seed": parseInt(params.seed),
            "subseed": parseInt(params.subseed),
            "subseed_strength": parseInt(params.subseedStrength),
            "cfg_scale": parseInt(params.cfgScale),
            "restore_faces": params.restoreFaces,
            "eta": parseInt(params.eta),
            "sampler_index": params.samplerIndex
        }

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
                setGenerateButtonDisabled(false)
                setAddtopublicButtonDisabled(false)
                notify_success("Variation generated!")
            }
            )
            .catch((error) => {
                console.error('Error:', error);
                notify_error("Error: Automatic1111 api is not responding. Please try again in a minute.")
                setGenerateButtonDisabled(false)
            }
            );

    }

    const handleClickAddToPublic = () => {
        // fetch colab link
        setAddtopublicButtonDisabled(true)
        fetch(props.colabSessionLink + '/save_last/', {
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
                notify_error("Error: Automatic1111 api is not responding. Please try again in a minute.")
            }
            );
    }



    // create img list from baseMemesUrls
    const items = props.baseMemes.map((baseMeme, index) => {
        return (
            <img className={params.selectedMeme.url == baseMeme.url ? "SelectedMeme" : ""} src={baseMeme.url} onDragStart={handleDragStart} role="presentation" onClick={() => setParams({ ...params, selectedMeme: baseMeme })} />
        )
    })



    return (
        <div className="ControleMemeGeneratePageStep2">
            <ToastContainer />
            <h2>1. Select a base image</h2>
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
                        <img style={{ width: "auto", height: "33.5em", maxHeight: "33.5em", borderRadius: "10px", border: "1px solid #000" }}
                            src={params.selectedMeme.url} alt="controlnet hint" className="" />}
                    {params.selectedMeme.url === DEFAULT_IMAGE_URL && <img src={DEFAULT_IMAGE_URL} alt="controlnet hint" className="" />}

                </Grid>
            </Grid>



            <h2> 2. Select & Preview Preprocess</h2>
            {/* Display side by side */}
            <div className="ParamsPanel">
                <ParamsPanel
                    params={params} setParams={setParams}
                    colabSessionLink={props.colabSessionLink}
                    controlnetHintb64={controlnetHintb64} setControlnetHintb64={setControlnetHintb64}
                />

            </div>

            <Grid container spacing={1} direction="row" justifyContent="center" alignItems="center">
                <Grid item xs={12} sm={5} mx={1}>


                    <h2> 3. Generate Meme !</h2>


                    <FormControl fullWidth>
                        <TextField label="Prompt" variant="outlined" value={params.prompt} onChange={(e) => setParams({ ...params, prompt: e.target.value })} />
                        <br />
                        <TextField label="Num Inferences Steps" type="number" variant="outlined" value={params.numInferencesSteps} onChange={(e) => setParams({ ...params, numInferencesSteps: e.target.value })} />
                        <br />
                        <Typography gutterBottom id="label-select-sampler" textAlign={"left"}>Sampler:</Typography>
                        <Select
                            labelId="label-select-sampler"
                            id="demo-simple-select"
                            value={params.samplerIndex}
                            onChange={(e) => setParams({ ...params, samplerIndex: e.target.value })}
                            defaultValue={"Euler a"}
                        >
                            <MenuItem value={"Euler a"}>Euler a</MenuItem>
                        </Select>
                        <br />
                        <Typography gutterBottom id="label-select-model" textAlign={"left"}>Controlnet Model <strong>(You need to choose according to the preprocess)</strong>: </Typography>
                        <Select
                            labelId="label-select-model"
                            id="demo-simple-select"
                            value={params.controlnetModel}
                            onChange={(e) => setParams({ ...params, controlnetModel: e.target.value })}
                            defaultValue={"control_canny-fp16 [e3fe7712]"}
                        >
                            <MenuItem value={"control_canny-fp16 [e3fe7712]"}>control_canny-fp16 [e3fe7712]</MenuItem>
                            <MenuItem value={"control_depth-fp16 [400750f6]"}>control_depth-fp16 [400750f6]</MenuItem>
                            <MenuItem value={"control_hed-fp16 [13fee50b]"}>control_hed-fp16 [13fee50b]</MenuItem>
                            <MenuItem value={"control_mlsd-fp16 [e3705cfa]"}>control_mlsd-fp16 [e3705cfa]</MenuItem>
                            <MenuItem value={"control_normal-fp16 [63f96f7c]"}>control_normal-fp16 [63f96f7c]</MenuItem>
                            <MenuItem value={"control_openpose-fp16 [9ca67cc5]"}>control_openpose-fp16 [9ca67cc5]</MenuItem>
                            <MenuItem value={"control_scribble-fp16 [c508311e]"}>control_scribble-fp16 [c508311e]</MenuItem>
                            <MenuItem value={"control_seg-fp16 [b9c1cc12]"}>control_seg-fp16 [b9c1cc12]</MenuItem>


                        </Select>

                        <br />
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography>Advanced Params</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <FormGroup fullWidth>
                                    <TextField label="Negative Prompt" variant="outlined" value={params.negativePrompt} onChange={(e) => setParams({ ...params, negativePrompt: e.target.value })} />
                                    <br />
                                    <TextField label="Seed" type="number" variant="outlined" value={params.seed} onChange={(e) => setParams({ ...params, seed: e.target.value })} />
                                    <br />
                                    <TextField label="Subseed" type="number" variant="outlined" value={params.subseed} onChange={(e) => setParams({ ...params, subseed: e.target.value })} />
                                    <br />
                                    <TextField label="Subseed Strength" type="number" variant="outlined" value={params.subseedStrength} onChange={(e) => setParams({ ...params, subseedStrength: e.target.value })} />
                                    <br />
                                    <Typography id="discrete-slider" textAlign={"left"}>
                                        Cfg Scale
                                    </Typography>

                                    <Slider
                                        defaultValue={params.cfgScale}
                                        aria-labelledby="discrete-slider"
                                        valueLabelDisplay="auto"
                                        step={1}
                                        marks
                                        min={1}
                                        max={14}
                                        onChange={(e, value) => setParams({ ...params, cfgScale: value })}
                                    />
                                    <br />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={params.restoreFaces}
                                                onChange={(e) => setParams({ ...params, restoreFaces: e.target.checked })}
                                                name="restoreFaces"
                                                color="primary"
                                            />
                                        }
                                        label="Restore Faces"
                                    />
                                    <br />
                                    <TextField label="Eta" type="number" variant="outlined" value={params.eta} onChange={(e) => setParams({ ...params, eta: e.target.value })} />
                                    <br />
                                </FormGroup>
                            </AccordionDetails>
                        </Accordion>
                        <br />
                        {/* align center */}
                        {generateButtonDisabled === true && <CircularProgress style={{ margin: "auto" }} />}
                        {generateButtonDisabled === false &&
                            <Button variant="contained" color="primary" onClick={() => handleClickGenerate()}
                                disabled={generateButtonDisabled === true || props.colabSessionLink === "" || params.selectedMeme.url === DEFAULT_IMAGE_URL || prompt === "" || params.numInferencesSteps === "" || params.controlnetPreprocess === "" || params.controlnetModel === "" || params.controlnetThresholdA === "" || params.controlnetThresholdB === ""}>
                                Generate
                            </Button>
                        }
                        <br />
                        * You might need to click a second time if the image is not loaded

                    </FormControl>

                </Grid>
                <Grid item xs={12} sm={6} mx={1}>

                    <div className="generatedMeme" >
                        {generatedImageb64 !== "" && <img className="ControlnetHint" src={"data:image/jpeg;base64, " + generatedImageb64} alt="generated image with controlnet" className="GeneratedMeme" />}
                        {generatedImageb64 === "" && <img className="ControlnetHint" src={DEFAULT_IMAGE_URL} alt="generated image" className="GeneratedMeme" />}
                    </div>

                    <br />
                    <Button variant="contained" color="primary" onClick={() => handleClickAddToPublic()}
                        disabled={addtopublicButtonDisabled === true || props.colabSessionLink === "" || params.selectedMeme.url === DEFAULT_IMAGE_URL || prompt === "" || params.numInferencesSteps === "" || params.controlnetPreprocess === "" || params.controlnetModel === "" || params.controlnetThresholdA === "" || params.controlnetThresholdB === ""}
                    >Add to public gallery</Button>
                </Grid>
            </Grid>
        </div >
    )
}