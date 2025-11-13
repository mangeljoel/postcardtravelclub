export const flexBoxStyle = {
    FlexBox: {
        baseStyle: {
            display: "flex",
            flexDirection: "column",
            // alignItems: "center",
            // justifyContent: "space-between",
            width: "100%",
            //paddingBottom: "20px",
            boxSizing: "border-box",
            paddingLeft: ["5%", "10%"],
            paddingRight: ["5%", "10%"]
        },
        variants: {
            homePage: {
                alignItems: "center",
                justifyContent: "space-between",
                paddingBottom: "20px"
            },
            searchPage: {
                alignItems: "flex-start",
                justifyContent: ["center", "flex-start"],
                marginLeft: ["0px", "16px"],
                marginBottom: "16px"
            },
            travelExpert: {
                marginTop: ["6%", "3%"],
                textAlign: "center"
            }
        }
    }
};
