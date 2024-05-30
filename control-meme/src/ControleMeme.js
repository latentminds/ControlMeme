import { useState } from "react";
import ResponsiveAppBar from "./AppBar/ResponsiveAppBar";
import { ControleMemeAboutPage } from "./ControleMemeAboutPage/ControleMemeAboutPage";
import GeneratePage from "./GeneratePage/GeneratePage";
import ControleMemeLandingPage from "./ControleMemeLandingPage/ControleMemeLandingPage";

export default function ControleMeme() {

    const [currentPage, setCurrentPage] = useState('Browse');

    const [loadedVariations, setLoadedVariations] = useState([]);

    return (
        <div>
            <ResponsiveAppBar setCurrentPage={(newPage) => {
                setCurrentPage(newPage)
            }
            } />

            <div className="content">
                {currentPage === 'Browse' && <ControleMemeLandingPage lastMemes={loadedVariations} setLastMemes={setLoadedVariations} />}
                {currentPage === 'Generate' && <GeneratePage />}
                {currentPage === 'About' && <ControleMemeAboutPage />}
            </div>
        </div>
    );
}
