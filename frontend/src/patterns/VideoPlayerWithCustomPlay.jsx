import { Box, AspectRatio, Icon, Text } from "@chakra-ui/react";
import { useState, useRef } from "react";
// import ReactPlayer from "react-player";
import { AiFillPauseCircle, AiFillPlayCircle } from "react-icons/ai";
import dynamic from "next/dynamic";

const DynamicPlayer = dynamic(() => import("react-player"), { ssr: false });

const VideoPlayerWithCustomPlay = (props) => {
    const { url } = props;
    const [isPlaying, setIsPlaying] = useState(false);
    const playerRef = useRef(null);
    const handlePlayPause = (e) => {
        e.stopPropagation();
        setIsPlaying(!isPlaying);
    };
    return (
        <Box mx="auto" textAlign={"center"} pos="relative" {...props}>
            <AspectRatio ratio={16 / 9}>
                <DynamicPlayer
                    url={url}
                    style={{ borderRadius: "8px" }}
                    width="100%"
                    height="100%"
                    playing="true"
                />
            </AspectRatio>
        </Box>
    );
};
export default VideoPlayerWithCustomPlay;
