import { useEffect } from "react";
import { analytics } from "../firebase/firebaseconfig";
import { logEvent } from "firebase/analytics";

export const ControleMemeAboutPage = () => {

    useEffect(() => {
        logEvent(analytics, 'page_view', {
            page_title: 'About Page',
            page_location: window.location.href,
            page_path: window.location.pathname
        });
    }, [])


    return (
        <div>
            <h1>About</h1>
            <p> Use AI to generate variations of your favourite memes </p>
            
            {/* Authors */}
            <h2>Authors</h2>
            <p> Philippe Saade:  <a href="https://github.com/PhilSad">GitHub</a>  <a href="https://www.linkedin.com/in/philippe-saad%C3%A9-26972b149/">LinkedIn</a> </p>
            <p> Ruben Gres: <a href="https://github.com/RubenGres">GitHub</a> <a href="https://www.linkedin.com/in/ruben-gres-484930158/">LinkedIn </a> </p>
        </div>
    );
};
