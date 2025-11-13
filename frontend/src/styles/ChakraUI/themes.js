import { createBreakpoints } from "@chakra-ui/theme-tools";
import { buttonStyle } from "./buttonStyles";
import { headingStyle } from "./headingStyles";
import { textStyle } from "./textStyles";
import { tabStyle } from "./tabStyles";
import { linkStyle } from "./linkStyles";
import { textAreaStyle } from "./textAreaStyles";
import { accordionStyle } from "./accordionStyles";
import { closeButtonStyle } from "./closeButtonStyles";
import { layerStyle } from "./boxLayerStyles";
import { customIcon } from "./customIcons";
import { flexBoxStyle } from "./flexBox";
import { tagStyle } from "./tagStyles";
import { editableStyle } from "./editableStyles";
// import { StepsStyleConfig as Steps } from "chakra-ui-steps";

const breakpoints = {
    sm: "48em",
    md: "62em",
    lg: "80em",
    xl: "96em",
    xxl: "120em"
};
const override = {
    components: {
        ...buttonStyle,
        ...headingStyle,
        ...textStyle,
        ...tabStyle,
        ...linkStyle,
        ...textAreaStyle,
        ...accordionStyle,
        ...closeButtonStyle,
        ...flexBoxStyle,
        ...tagStyle,
        ...editableStyle,
        Modal: {
            baseStyle: {
                overlay: {
                    zIndex: 1800
                },
                dialogContainer: {
                    zIndex: 1800
                }
            }
        },
        Popover: {
            baseStyle: {
                content: {
                    zIndex: 800
                }
            }
        }
        // Steps
    },
    colors: {
        background: "#f7ede2",
        // background: "#EFE9E4",
        // primary_1: "#f5896d",
        // PTC Orange
        primary_1: "#EA6146",
        primary_2: "#05131c",
        // primary_3: "#568DFB",
        // PTC Blue
        primary_3: "#307FE2",
        primary_4: "#888",
        primary_5: "#ff715f",
        primary_6: "#212121",
        primary_7: "#555",
        primary_8: "#568DFB",
        primary_9: "#555555",
        primary_10: "#232232",
        primary_11: "#2E2E2E",
        primary_12: "#ccd7db",
        primary_13: "#212529",
        primary_14: "#00000",
        primary_15: "#ffffff",
        primary_16: "#1A202C",
        cardBackground: "#fbf8f5",
        facebook: "#3b5998",
        primary: {
            100: "#0081df",
            500: "#0081df",
            900: "0081df"
        },
        twitter: "#55acee",
        google: "#dc4e41"
    },
    breakpoints,
    fonts: {
        cabin: "Cabin",
        raleway: "Raleway, sans-serif",
        lora: "Lora, serif"
    },
    layerStyles: {
        ...layerStyle
    },
    icons: {
        ...customIcon.icons
    }
};
export default override;
