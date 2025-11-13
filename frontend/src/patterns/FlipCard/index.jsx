import { useRef, useContext, useState } from "react";
import { Box } from "@chakra-ui/react";
import Flippy, { FrontSide, BackSide } from "react-flippy";
import { Waypoint } from "react-waypoint";
import AppContext from "../../features/AppContext";
const FlipCard = (props) => {
    const { frontChild, backChild, borderRadius, indexId } = props;
    const ref = useRef();
    const cardFrontRef = useRef();
    const { firstLoad, setFirstLoad } = useContext(AppContext);
    // const [cardFrontRef, setCardFrontRef] = useState(null);
    return (
        <Flippy
            ref={ref}
            flipDirection="horizontal"
            flipOnHover={false}
            flipOnClick={backChild ? true : false}
        >
            <FrontSide
                animationDuration={1500}
                style={{
                    width: "100%",
                    position: "relative",
                    padding: "0em",
                    ...props
                }}
                className="flip-card" //for border-radius
                ref={cardFrontRef}
            >
                {frontChild}
            </FrontSide>
            <BackSide
                animationDuration={1500}
                style={{
                    height: cardFrontRef ? cardFrontRef.clientHeight : "auto",
                    padding: "0em"
                }}
                className="flip-card" //for border-radius
            >
                <Box
                    h="100%"
                    w="100%"
                    borderRadius={borderRadius}
                    className="iosFlickeringcssfix"
                >
                    {backChild}
                </Box>
            </BackSide>
        </Flippy>
    );
};
export default FlipCard;
