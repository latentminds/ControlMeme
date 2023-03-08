import { useState } from "react";
import ResponsiveAppBar from "./AppBar/ResponsiveAppBar";
import { ControleMemeAboutPage } from "./ControleMemeAboutPage/ControleMemeAboutPage";
import ControleMemeGeneratePage from "./ControleMemeGeneratePage/ControleMemeGeneratePage";
import ControleMemeLandingPage from "./ControleMemeLandingPage/ControleMemeLandingPage";

export default function ControleMeme() {

    const [currentPage, setCurrentPage] = useState('Browse');
    const [colabSessionLink, setColabSessionLink] = useState("https://" + new URLSearchParams(window.location.search).get('gpuURL') || "https://");

    const [loadedVariations, setLoadedVariations] = useState([]);




    return (
        <div>
            <ResponsiveAppBar setCurrentPage={(newPage) => {
                setCurrentPage(newPage)
            }
            } />

            <div className="content">
                {currentPage === 'Browse' && <ControleMemeLandingPage lastMemes={loadedVariations} setLastMemes={setLoadedVariations} />}
                {currentPage === 'Generate' && <ControleMemeGeneratePage colabSessionLink={colabSessionLink} setColabSessionLink={setColabSessionLink} />}
                {currentPage === 'About' && <ControleMemeAboutPage />}
            </div>
        </div>
    );
}
