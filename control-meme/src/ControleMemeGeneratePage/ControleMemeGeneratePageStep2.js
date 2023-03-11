import { Button, Checkbox, FormControl, FormControlLabel, Grid, MenuItem, Select, Slider, TextField } from "@mui/material";
import { useState } from "react";

import "./ControlMemeGeneratePage.css"

const ParamsPanel = ({
    params, setParams,
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
        fetch(params.colabSessionLink + '/hint/', {
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
            }
            );
    }

    return (
        <div className="ParamsPanel">
            <Grid container spacing={1}>
                <Grid item xs={5} sx={{ m: 1 }}>

                    <FormControl fullWidth>
                        <br />
                        {/* Select one of canny, hed, mlsd, depth, depths_leres, normal_map, openpose, openpose_hand, fake_skribble, segmentation, pidinet */}
                        <label id="label-select-preprocess">Controlnet Preprocess</label>
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
                            <MenuItem value={"openpose_hand"}>OpenPose Hand</MenuItem>
                            <MenuItem value={"fake_skribble"}>Fake Skribble</MenuItem>
                            <MenuItem value={"segmentation"}>Segmentation</MenuItem>
                            <MenuItem value={"pidinet"}>PIDINet</MenuItem>
                        </Select>

                        <br />


                        <br />
                        <label id="label-select-res">Preprocess Resolution</label>
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
                        <label id="label-select-threshold-a">Preprocess Threshold A</label>
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
                        <label id="label-select-threshold-b">Preprocess Threshold B</label>
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
                        <Button variant="contained" color="primary" onClick={handleClickHintPreview}
                            disabled={(params.selectedMeme === null || params.controlnetPreprocess === "none") || previewButtonDisabled === true}
                        >
                            Generate Hint Preview
                        </Button>
                    </FormControl>
                </Grid>
                <Grid item xs={6} sx={{ m: 1 }}>

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
        'controlnetModel': 'control_canny [e3fe7712]',
        'controlnetThresholdA': 30,
        'controlnetThresholdB': 100,
        'controlnetRes': 128,
        'selectedMeme': { 'url': DEFAULT_IMAGE_URL },
    });

    const [controlnetHintb64, setControlnetHintb64] = useState("");
    const [generatedImageb64, setGeneratedImageb64] = useState("");

    const [generateButtonDisabled, setGenerateButtonDisabled] = useState(false);
    const [addtopublicButtonDisabled, setAddtopublicButtonDisabled] = useState(false);

    //control_canny [e3fe7712]


    // send file to api
    const handleClickGenerate = () => {
        setGenerateButtonDisabled(true)
        // convert steps to int
        console.log("selectedMeme", params.selected_meme)
        const selectedMemeUUID = params.selectedMeme.uuid

        const args = {
            "uuid": selectedMemeUUID,
            "prompt": prompt,
            "nb_steps": parseInt(params.numInferencesSteps),
            "controlnet_basememe_url": params.selectedMeme.url,
            "controlnet_module": params.controlnetPreprocess,
            "controlnet_threshold_a": params.controlnetThresholdA,
            "controlnet_threshold_b": params.controlnetThresholdB
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
            }
            )
            .catch((error) => {
                console.error('Error:', error);
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
            }
            )
            .catch((error) => {
                console.error('Error:', error);
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

            <h2>1. Select a base image</h2>

            <div className="MemeSelector">
                <span>
                    {items}
                </span>
            </div>

            <h2> 2. Select & Preview Preprocess</h2>
            {/* Display side by side */}
            <div className="ParamsPanel">
                <ParamsPanel
                    params={params} setParams={setParams}
                    controlnetHintb64={controlnetHintb64} setControlnetHintb64={setControlnetHintb64}
                />

            </div>

            <Grid container spacing={3}>
                <Grid item xs={6} mx={1} >


                    <h2> 3. Generate Meme !</h2>

                    {/* body = {
                        "prompt": kwargs.get("prompt", ""),
                    "negative_prompt": kwargs.get("negative_prompt", ""),
                    "seed": kwargs.get("seed", -1),
                    "subseed": kwargs.get("subseed", -1),
                    "subseed_strength": kwargs.get("subseed_strength", 0),
                    "batch_size": kwargs.get("batch_size", 1),
                    "n_iter": kwargs.get("n_iter", 1),
                    "steps": kwargs.get("steps", 30),
                    "cfg_scale": kwargs.get("cfg_scale", 7),
                    "width": width,
                    "height": height,
                    "restore_faces": kwargs.get("restore_faces", True),
                    "eta": kwargs.get("eta", 0),
                    "sampler_index": kwargs.get("sampler_index", "Euler a"),
                    "controlnet_input_image": [input_image_b64],
                    "controlnet_module": module,
                    "controlnet_model": model,
                    "controlnet_guidance": kwargs.get("controlnet_guidance", 1.0),
                    'conytolnet_threshold_a': kwargs.get('controlnet_threshold_a', 100),
                    'controlnet_threshold_b': kwargs.get('controlnet_threshold_b', 100),
                    'controlnet_preprocessor_res': kwargs.get('controlnet_preprocessor_res', 64),
        } */}

                    {/* Params list:
                        - prompt : str: text field
                        - numInferencesSteps : int: integer field
                        - controlnetModel : str: select field
                        - samplerIndex : str: select field
                        - negativePrompt : str: text field
                        - seed : int: text field
                        - subseed : int: text field
                        - subseedStrength : int: text field
                        - cfgScale : int: slider from 1 to 14 (default 7)
                        - restoreFaces : bool: checkbox
                        - eta : int: text field

                    */}

                    <FormControl fullWidth>
                        <TextField label="Prompt" variant="outlined" value={params.prompt} onChange={(e) => setParams({ ...params, prompt: e.target.value })} />
                        <br />
                        <TextField label="Num Inferences Steps" type="number" variant="outlined" value={params.numInferencesSteps} onChange={(e) => setParams({ ...params, numInferencesSteps: e.target.value })} />
                        <br />
                        <label id="label-select-model">Controlnet Model</label>
                        <Select
                            labelId="label-select-model"
                            id="demo-simple-select"
                            value={params.controlnetModel}
                            onChange={(e) => setParams({ ...params, controlnetModel: e.target.value })}
                            defaultValue={"control_canny [e3fe7712]"}
                        >
                            <MenuItem value={"control_canny [e3fe7712]"}>control_canny [e3fe7712]</MenuItem>
                            <MenuItem value={"control_depth [400750f6]"}>control_depth [400750f6]</MenuItem>
                            <MenuItem value={"control_hed-fp16 [13fee50b]"}>control_hed-fp16 [13fee50b]</MenuItem>
                            <MenuItem value={"control_mlsd-fp16 [e3705cfa]"}>control_mlsd-fp16 [e3705cfa]</MenuItem>
                            <MenuItem value={"control_normal-fp16 [63f96f7c]"}>control_normal-fp16 [63f96f7c]</MenuItem>
                            <MenuItem value={"control_openpose-fp16 [9ca67cc5]"}>control_openpose-fp16 [9ca67cc5]</MenuItem>
                            <MenuItem value={"control_scribble-fp16 [c508311e]"}>control_scribble-fp16 [c508311e]</MenuItem>
                            <MenuItem value={"control_seg-fp16 [b9c1cc12]"}>control_seg-fp16 [b9c1cc12]</MenuItem>
                        </Select>

                        <br />
                        <label id="label-select-sampler">Sampler Index</label>
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
                        <TextField label="Negative Prompt" variant="outlined" value={params.negativePrompt} onChange={(e) => setParams({ ...params, negativePrompt: e.target.value })} />
                        <br />
                        <TextField label="Seed" type="number" variant="outlined" value={params.seed} onChange={(e) => setParams({ ...params, seed: e.target.value })} />
                        <br />
                        <TextField label="Subseed" type="number" variant="outlined" value={params.subseed} onChange={(e) => setParams({ ...params, subseed: e.target.value })} />
                        <br />
                        <TextField label="Subseed Strength" type="number" variant="outlined" value={params.subseedStrength} onChange={(e) => setParams({ ...params, subseedStrength: e.target.value })} />
                        <br />
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


                        <Button variant="contained" color="primary" onClick={() => handleClickGenerate()}
                            disabled={generateButtonDisabled === true || props.colabSessionLink === "" || params.selectedMeme.url === DEFAULT_IMAGE_URL || prompt === "" || params.numInferencesSteps === "" || params.controlnetPreprocess === "" || params.controlnetModel === "" || params.controlnetThresholdA === "" || params.controlnetThresholdB === ""}>
                            Generate</Button>
                    </FormControl>

                </Grid>
                <Grid item xs={6}>

                    <h2> 4. See AI Variation </h2>

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