import { useState } from "react";
import ResponsiveAppBar from "./AppBar/ResponsiveAppBar";
import ControleMemeGeneratePage from "./ControleMemeGeneratePage/ControleMemeGeneratePage";
import ControleMemeLandingPage from "./ControleMemeLandingPage/ControleMemeLandingPage";

export default function ControleMeme() {

    const [currentPage, setCurrentPage] = useState('Browse');


    return (
        <div>
            <ResponsiveAppBar setCurrentPage={(newPage) => {
                console.log(newPage);
                setCurrentPage(newPage)} 
                }/>


            {currentPage === 'Browse' && <ControleMemeLandingPage />}
            {currentPage === 'Generate' && <ControleMemeGeneratePage /> }
            {currentPage === 'About' && <h1>About</h1>}
        </div>
    );
}
