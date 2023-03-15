import { Breadcrumbs, Button, FormControl, Grid, InputLabel, Link, MenuItem, Select, Slider, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { db } from "../firebase/firebaseconfig"
import { collection, getDocs } from "firebase/firestore";
import { fetchBaseMemesData, fetchBaseMemesUrls, fetchSharedColabs, removeSharedColab } from "../firebase/firestoreCalls";
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import { UploadImage } from "./UploadImage";
import { logEvent } from "firebase/analytics";
import { analytics } from "../firebase/firebaseconfig";

import { ControleMemeGeneratePageStep2 } from "./ControleMemeGeneratePageStep2";

export default function ControleMemeGeneratePage({ colabSessionLink, setColabSessionLink }) {

    // get default value from url

    const [baseMemes, setBaseMemes] = useState([]);
    // fetch last10 memes from firestore and add them to the state


    useEffect(() => {
        fetchBaseMemesData().then((baseMemes) => {
            setBaseMemes(baseMemes)
            console.log(baseMemes)
        })

    }, [])

    return (
        <div className="ControleMemeGeneratePage">

            {console.log(colabSessionLink)}

            {
                colabSessionLink == "https://null" &&
                <ControleMemeGeneratePageStep1 colabSessionLink={colabSessionLink} setColabSessionLink={setColabSessionLink} />
            }

            {
                colabSessionLink != "https://null" &&
                <>
                    <ControleMemeGeneratePageStep2 colabSessionLink={colabSessionLink} setColabSessionLink={setColabSessionLink} baseMemes={baseMemes} />
                </>
            }
        </div>
    )
}

function ControleMemeGeneratePageStep1(props) {

    const [sharedColabs, setSharedColabs] = useState([]);

    useEffect(() => {
        // fetch available colab sessions

        let colabsInBdd = []
        fetchSharedColabs().then((sharedColabs) => {
            console.log(sharedColabs)
            colabsInBdd = sharedColabs

            colabsInBdd.forEach((colab) => {
                fetch(colab.url + "/hello/",
                    {
                        method: "GET",
                        headers: {
                            'Bypass-Tunnel-Reminder': 'please',
                        },
                    })
                    .then((response) => {
                        if (response.status == 200) {
                            console.log("colab is working")
                            setSharedColabs((sharedColabs) => [...sharedColabs, colab])
                        } else {
                            console.log("colab is not working, deleting")
                            removeSharedColab(colab.uuid)
                        }
                    })
            }
            )
        })



    }, [])


    useEffect(() => {
        logEvent(analytics, 'page_view', {
            page_title: 'Generate Page Step 1',
            page_location: window.location.href,
            page_path: window.location.pathname
        });
    }, [])



    return (
        <div className="ControleMemeGeneratePageStep1">
            <h1>Please connect to Google Colab backend</h1>

            <p>Current state: <strong>WORKING :D</strong></p>

            <h2>Method 1: Connect to a community backend</h2>
            <p>1. Select a community backend from the table below</p>
            <p>2. Click the link and go back to this page to start creating new memes !</p>
            <table style={{ margin: "auto", border: "1px solid black", borderCollapse: "collapse" }}>
                <tr>
                    <th>Date</th>
                    <th>Link</th>
                    <th>Connect</th>
                </tr>
                {
                    sharedColabs.map((colab) => {
                        return (
                            <tr>
                                <td>
                                    {new Date(
                                        colab.timestamp.seconds * 1000 + colab.timestamp.nanoseconds / 1000000,
                                    ).toLocaleTimeString()}
                                </td>
                                <td><p>{colab.url}</p></td>
                                <td><Button variant="outlined"
                                    onClick={() => {
                                        props.setColabSessionLink(colab.url)
                                    }}>Connect</Button></td>
                            </tr>
                        )
                    })
                }
            </table>


            <h2>Method 2: Run your own Colab backend</h2>
            <p>1. Open the <a onClick={() => {
                logEvent(analytics, 'select_content', {
                    page_title: 'Generate Page Step 1',
                    url: "https://colab.research.google.com/github/koll-ai/control-meme-api/blob/main/Controlmeme_Colab_API.ipynb"
                });

            }}
                href="https://colab.research.google.com/github/koll-ai/control-meme-api/blob/main/Controlmeme_Colab_API.ipynb" target="_blank"> Colab Link</a> in another tab</p>
            <p>2. Blindly Run all  cells until you see a meme.koll.ai link (this can take a while)</p>
            <p>3. Click the link in the output of the last cell and go back to this page to start creating new memes !</p>

            <br></br>

            <a target="_blank" href="https://colab.research.google.com/github/koll-ai/control-meme-api/blob/main/Controlmeme_Colab_API.ipynb">
                <img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open In Colab" />
            </a>






        </div>
    )
}