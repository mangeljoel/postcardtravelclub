import React from "react";
import ReactPlayer from "react-player";
import Wavesurfer from "./WaveSurferPage";
import dynamic from "next/dynamic";
// const Wavesurfer = dynamic(() => import("./Wavesurfer"), {
//     ssr: false
// });

const AudioPlayer = () => {
    const videoUrl = "/assets/podcasts/raj_gyawali.mp4";

    return (
        <div>
            <ReactPlayer url={videoUrl} controls />
        </div>
    );
};

export default AudioPlayer;
