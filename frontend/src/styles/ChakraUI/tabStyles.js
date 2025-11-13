export const tabStyle = {
    Tabs: {
        parts: ["root", "tab", "tablist", "tabpanel"],
        variants: {
            categoryList: {
                root: {
                    position: "relative",
                    width: "100%"
                },

                tablist: {
                    position: "relative"
                    // borderBottom: "1px solid rgb(222, 226, 230)"
                    // paddingLeft: ["5%", "10%"],
                    // paddingRight: ["5%", "10%"]
                },

                tab: {
                    fontFamily: "cabin",
                    fontStyle: "normal",
                    fontWeight: "normal",
                    fontSize: ["14px", "20px"],
                    lineHeight: ["17px", "24px"],
                    color: "primary_9",
                    tabIndex: "-1",
                    paddingLeft: "0px",
                    paddingRight: "0px",
                    _selected: {
                        borderBottomColor: "primary_1",
                        borderBottomWidth: "9px",
                        fontWeight: "bold"
                    },
                    _focus: {
                        boxShadow: "none!important"
                    }
                },
                tabpanel: {
                    paddingLeft: "0px",
                    paddingRight: "0px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }
            },
            callList: {
                root: {
                    position: "relative",
                    width: "100%"
                },

                tablist: {
                    position: "relative",
                    //borderBottom: "1px solid rgb(222, 226, 230)",
                    paddingLeft: ["5%", "10%"],
                    paddingRight: ["5%", "10%"]
                },

                tab: {
                    fontFamily: "cabin",
                    fontStyle: "normal",
                    fontWeight: "normal",
                    fontSize: ["14px", "20px"],
                    lineHeight: ["17px", "24px"],
                    color: "primary_9",
                    tabIndex: "-1",
                    paddingLeft: "0px",
                    paddingRight: "0px",
                    _selected: {
                        borderBottomColor: "primary_1",
                        borderBottomWidth: "9px",
                        fontWeight: "bold"
                    },
                    _focus: {
                        boxShadow: "none!important"
                    }
                },
                tabpanel: {
                    paddingLeft: "0px",
                    paddingRight: "0px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }
            },
            profileEdit: {
                root: {
                    position: "relative",
                    width: "100%"
                },

                tablist: {
                    position: "relative",
                    // borderBottom: "1px solid rgb(222, 226, 230)",
                    paddingLeft: ["5%", "10%"],
                    paddingRight: ["5%", "10%"]
                },

                tab: {
                    fontFamily: "cabin",
                    fontStyle: "normal",
                    fontWeight: "normal",
                    fontSize: ["14px", "20px"],
                    lineHeight: ["17px", "24px"],
                    color: "primary_9",
                    tabIndex: "-1",
                    _selected: {
                        borderBottomColor: "primary_1",
                        borderBottomWidth: "9px",
                        fontWeight: "bold"
                    },
                    _focus: {
                        boxShadow: "none!important"
                    }
                }
            },

            lastTab: {
                tab: {
                    position: ["relative", "absolute"],
                    right: ["auto", 0],
                    fontFamily: "cabin",
                    fontStyle: "normal",
                    fontWeight: "normal",
                    fontSize: ["14px", "20px"],
                    lineHeight: ["17px", "24px"],
                    color: "primary_9",
                    tabIndex: "-1",
                    _selected: {
                        borderBottomColor: "primary_1",
                        borderBottomWidth: "9px"
                    },
                    _focus: {
                        boxShadow: "none!important"
                    }
                }
            }
        }
    }
};
