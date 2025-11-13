import {
    Tabs,
    TabPanels,
    TabPanel,
    TabList,
    Tab,
    Button,
    Input,
    Box
} from "@chakra-ui/react";
import React, { useCallback, useContext, useState } from "react";
import { useDropzone } from "react-dropzone";

import AppContext from "../AppContext";
import { uploadfile } from "../../services/utilities";
import { createEmptyPostcard } from "../../queries/strapiQueries";

const TabsPart = ({
    tabData,
    createCard,
    orientation,
    defaultTab,
    onTabChange,
    showDraft,
    variant
}) => {
    const { profile } = useContext(AppContext);
    const [newFile, setNewFile] = useState(null);
    const [tabIndex, setTabIndex] = useState(defaultTab ? defaultTab : 0);

    const handleTabsChange = (index) => {
        setTabIndex(index);
        if (onTabChange) onTabChange(index);
    };
    const onDrop = useCallback((acceptedFiles) => {
        acceptedFiles.forEach((file) => {
            setNewFile(file);
            let data = {
                title: "",
                description: "",
                imageURL: "",
                articleURL: "",
                poi: null,
                profile: profile.id,
                visibility: false,
                imageURLCopyrights: "",
                hashtags: []
            };
            createEmptyPostcard(data)
                .then((postcard) => {
                    if (!showDraft) {
                        tabData.push({ id: 9999, name: "Drafts" });
                        setTabIndex(tabData.length - 1);
                    } else {
                        setTabIndex(tabData.length);
                    }
                    // onClick(9999);
                    //console.log(newFile, postcard);
                    uploadfile(
                        newFile,
                        postcard.id,
                        "postcard",
                        "s3imageURL",
                        () => {}
                    );
                })
                .catch((error) => {
                    //console.log(error);
                });
        });
    }, []);
    const { getRootProps, getInputProps } = useDropzone({ onDrop });
    return (
        <>
            {tabData && (
                <Tabs
                    variant={variant ? variant : "categoryList"}
                    // orientation={"vertical"}
                    defaultIndex={tabIndex}
                    index={tabIndex}
                    onChange={handleTabsChange}
                >
                    <TabList justifyContent={"center"}>
                        {tabData.map(
                            (tab, index) =>
                                tab && (
                                    <Box
                                        key={"tab_data_" + tab.name}
                                        paddingLeft="1rem"
                                        paddingRight="1rem"
                                    >
                                        <Tab id={tab.id}>{tab.name}</Tab>
                                    </Box>
                                )
                        )}
                        {showDraft && <Tab id={9999}>Drafts</Tab>}
                    </TabList>

                    <TabPanels>
                        {tabData.map(
                            (tab, index) =>
                                tab &&
                                tab.childComp && (
                                    <TabPanel key={"tab_child_" + index}>
                                        {tab.childComp}
                                    </TabPanel>
                                )
                        )}
                    </TabPanels>
                </Tabs>
            )}
        </>
    );
};
export default TabsPart;
