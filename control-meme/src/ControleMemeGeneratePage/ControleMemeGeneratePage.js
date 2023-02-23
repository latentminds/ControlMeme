import { Breadcrumbs, Link, Typography } from "@mui/material";
import { useState } from "react";

export default function ControleMemeGeneratePage(props) {

    const STEPS = ['Colab Connection', 'Base Image Selection', 'ControleNet Generation'];

    const [currentStep, setCurrentStep] = useState(0);


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

            {currentStep === 0 && <ControleMemeGeneratePageStep1 />}
            {currentStep === 1 && <ControleMemeGeneratePageStep2 />}
            {currentStep === 2 && <ControleMemeGeneratePageStep3 />}
        </div>


    )
}


function ControleMemeGeneratePageStep1(props) {
    return (
        <div className="ControleMemeGeneratePageStep1">
            <h1>Step 1</h1>
        </div>
    )
}

function ControleMemeGeneratePageStep2(props) {
    return (
        <div className="ControleMemeGeneratePageStep2">
            <h1>Step 2</h1>
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