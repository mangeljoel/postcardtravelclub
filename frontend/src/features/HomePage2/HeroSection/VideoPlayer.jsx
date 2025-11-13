import { Box, AspectRatio, Icon, Button } from "@chakra-ui/react";
import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import { AiFillPauseCircle, AiFillPlayCircle } from "react-icons/ai";

const DynamicPlayer = dynamic(() => import("react-player"), { ssr: false });

const VideoPlayer = ({ url, customPlay, autoPlay, ...props }) => {
    const [isPlaying, setIsPlaying] = useState(autoPlay || true);
    const playerRef = useRef(null);

    const handlePlayPause = (e) => {
        e.stopPropagation();
        setIsPlaying(!isPlaying);
    };

    return (
        <Box
            mx="auto"
            textAlign={"center"}
            pos="relative"
            {...props}
            _hover={{
                "& .play-pause-btn": {
                    opacity: 1,
                    visibility: "visible"
                }
            }}
        >
            <AspectRatio ratio={16 / 9}>
                <DynamicPlayer
                    ref={playerRef}
                    url={url}
                    style={{ borderRadius: "8px" }}
                    width="100%"
                    height="100%"
                    playing={isPlaying} // Bind playing state
                    config={{
                        youtube: {
                            playerVars: {
                                fs: 1
                            }
                        }
                    }}
                />
            </AspectRatio>
            {customPlay && (
                <Button
                    variant="none"
                    pos="absolute"
                    top="50%"
                    left="50%"
                    transform="translate(-50%, -50%)"
                    bg="transparent"
                    _hover={{ bg: "transparent" }}
                    onClick={handlePlayPause}
                    className="play-pause-btn"
                    opacity={0} // Initially hidden
                    visibility="hidden" // Initially hidden
                    transition="opacity 0.3s ease, visibility 0.3s ease"
                >
                    <Icon
                        as={isPlaying ? AiFillPauseCircle : AiFillPlayCircle}
                        w={["50px", "70px"]}
                        h={["50px", "70px"]}
                        color="white"
                    />
                </Button>
            )}
        </Box>
    );
};

export default VideoPlayer;
