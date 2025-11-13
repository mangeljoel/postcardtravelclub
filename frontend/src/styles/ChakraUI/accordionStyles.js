export const accordionStyle = {
    Accordion: {
        parts: ["container", "panel", "button"],
        variants: {
            generic: {
                container: {
                    "border-bottom-width": "1px",
                    "border-top-width": "0px"
                },
                panel: {
                    display: "flex",
                    "flex-direction": ["column", "row"],
                    "justify-content": "flex-start",
                    "flex-wrap": "wrap",
                    paddingRight: "0px",
                    paddingLeft: "0px"
                },
                button: {
                    paddingRight: "0px",
                    paddingLeft: "0px",
                    _focus: {
                        boxShadow: "none!important"
                    }
                }
            }
        }
    }
};
