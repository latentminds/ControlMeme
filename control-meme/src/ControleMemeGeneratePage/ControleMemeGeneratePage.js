import { Breadcrumbs, Link, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { db } from "../firebase/firebaseconfig"
import { collection, getDocs } from "firebase/firestore";
import { fetchBaseMemesUrls } from "../firebase/firestoreCalls";
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';


export default function ControleMemeGeneratePage(props) {

    const STEPS = ['Colab Connection', 'Base Image Selection', 'ControleNet Generation'];

    const [currentStep, setCurrentStep] = useState(0);
    // get default value from url
    const [colabSessionLink, setColabSessionLink] = useState(new URLSearchParams(window.location.search).get('colabSessionLink') || "");

    const [baseMemesUrls, setBaseMemesUrls] = useState([]);
    // fetch last10 memes from firestore and add them to the state
    

    useEffect(() => {
        fetchBaseMemesUrls().then((baseMemesUrls) =>  {
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
                        color={index === currentStep  ? "text.primary" : "text.secondary"}  
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
            {currentStep === 1 && <ControleMemeGeneratePageStep2 baseMemesUrls={baseMemesUrls}/>}
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

    // create img list from baseMemesUrls
    const items = props.baseMemesUrls.map((url, index) => {
        return (
                <img src={url} onDragStart={handleDragStart} alt='' role="presentation" onClick={() => console.log(index)

                }/>
        )
    })



    return (
        <div className="ControleMemeGeneratePageStep2">
            <h1>Step 2</h1>
            <AliceCarousel items={items} mouseTracking keyboardNavigation responsive={      {
        0: {
            items: 1,
        },
        1024: {
            items: 3,
            itemsFit: 'contain',
        }
      }}/>
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