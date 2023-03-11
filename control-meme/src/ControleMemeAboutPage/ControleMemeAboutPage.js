import { logEvent } from "firebase/analytics";
import { useEffect } from "react";
import { analytics } from "../firebase/firebaseconfig";

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
            <p>This app uses ControlNet and StableDiffusion 1.5 to generate infinite meme variation.</p>
            <p>
                You can use the app for free and without registration with the <a href="https://colab.research.google.com/github/https://colab.research.google.com/github/koll-ai/control-meme-api/blob/main/Controlmeme_Colab_API.ipynb">Colab Backend</a>
                <a target="_blank" href="https://colab.research.google.com/github/https://colab.research.google.com/github/koll-ai/control-meme-api/blob/main/Controlmeme_Colab_API.ipynb">
                    <img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open In Colab" />
                </a>
            </p>
            <p>You can <a href="https://discord.gg/Twqvecb7"> Join our Discord</a> to follow for updates and give feedback.</p>
            {/* Authors */}
            <h2>Authors</h2>
            <p> Philippe Saade:  <a href="https://github.com/PhilSad">GitHub</a>  <a href="https://www.linkedin.com/in/philippe-saad%C3%A9-26972b149/">LinkedIn</a> </p>
            <p> Ruben Gres: <a href="https://github.com/RubenGres">GitHub</a> <a href="https://www.linkedin.com/in/ruben-gres-484930158/">LinkedIn </a> </p>
        </div>
    );
};
