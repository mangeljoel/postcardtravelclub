export const linkStyle = {
    Link: {
        baseStyle: {
            _hover: {
                textDecoration: "none",
                wordBreak: "normal",
                overflowWrap: "normal",
                whiteSpace: "normal"
            },
            _focus: {
                boxShadow: "none!important"
            }
        },
        variants: {
            aboutDescLink: {
                fontFamily: "raleway",
                fontStyle: "normal",
                fontWeight: "normal",
                textAlign: "left",
                fontSize: "16px",
                lineHeight: "24px",
                color: "primary_1",
                marginTop: "2%",
                marginBottom: "2%",
                _hover: {
                    textDecoration: "underline",
                    wordBreak: "normal",
                    overflowWrap: "normal",
                    whiteSpace: "normal"
                },
                _focus: {
                    boxShadow: "none!important"
                }
            }
        }
    }
};
