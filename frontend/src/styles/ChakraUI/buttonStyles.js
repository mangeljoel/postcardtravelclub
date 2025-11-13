export const buttonStyle = {
    Button: {
        baseStyle: {
            fontSize: ["16px", "20px"]
        },

        variants: {
            disabledButton: {
                borderColor: "#808080",
                color: "#808080",
                borderWidth: "1px",
                bg: "transparent",
                fontSize: ["16px", "20px"],
                cursor: "pointer",
                boxShadow: "none",
                _hover: {
                    background: "transparent",
                    boxShadow: "none"
                },
                _focus: {
                    background: "transparent",
                    boxShadow: "none"
                }
            },
            outline: {
                borderColor: "primary_1",
                color: "primary_1",
                bg: "white",
                //borderWidth: "1px",
                fontSize: ["16px", "20px"],
                cursor: "pointer",
                boxShadow: "none",
                _hover: {
                    background: "white",
                    boxShadow: "none"
                },
                _focus: {
                    background: "white",
                    boxShadow: "none"
                }
            },
            outlinewithnobg: {
                borderColor: "white",
                color: "white",
                bg: "transparent",
                borderWidth: "1px",
                fontSize: ["16px", "20px"],
                boxShadow: "none",
                _hover: {
                    background: "transparent",
                    boxShadow: "none"
                },
                _focus: {
                    background: "transparent",
                    boxShadow: "none"
                }
            },
            login: {
                marginTop: "24px",
                padding: "0 25px 0 25px",
                boxSizing: "border-box",
                lineHeight: "48px",
                whiteSpace: "nowrap",
                borderRadius: "0.2em",
                width: "70%",
                height: "48px",
                color: "#ffffff",
                marginBottom: "24px",
                marginLeft: "auto",
                marginRight: "auto",
                textAlign: "center",
                textShadow: "0 -1px 0 #354C8C",
                boxShadow: "none"
            },
            editIcon: {
                background: "transparent",
                color: "primary_1",
                fontSize: "20px"
            },
            faceBook: {
                colorScheme: "facebook"
            },
            // 4. We can override existing variants
            solid: () => ({
                _hover: {
                    background: "primary_1",
                    boxShadow: "none"
                },
                fontSize: ["16px", "20px"],
                _focus: {
                    background: "primary_1",
                    boxShadow: "none"
                },
                color: "white",
                bg: "primary_1"
            })
        }
    }
};
