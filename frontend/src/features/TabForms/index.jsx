import React, { useState } from "react";
import {
    Avatar,
    Box,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Flex,
    Button,
    Text
} from "@chakra-ui/react";
import FormSections from "./FormSections";
import FormBuilder from "../../patterns/FormBuilder";
import { makeConfig } from "./editProfileConfig";
import ProfileFotoEdit from "./ProfileFotoEdit";

const TabForms = ({ editData, onChange }) => {
    const [activeTab, setActiveTab] = useState(0);
    const tabData = [
        {
            configFile: makeConfig(editData)
        }
    ];

    const handleTabChange = (index) => {
        setActiveTab(index);
    };

    return (
        <Box
            display="flex"
            width={["100%", "60%"]}
            mx="auto"
            //textAlign={"center"}
            alignItems="center"
            justifyContent="center"
            // margin="5"
        >
            <Tabs
                width="100vw"
                orientation={"vertical"}
                variant="unstyled"
                isLazy
                index={activeTab}
                onChange={handleTabChange}
            >
                {tabData && tabData.length > 1 && (
                    <TabList width="6vw" textAlign={"left"}>
                        {tabData.map((tab, index) => (
                            <Tab
                                // _selected={{
                                //     //color: "primary_1",
                                //     borderBottomColor: "primary_1",
                                //     borderBottomWidth: "9px",
                                //     fontWeight: "bold"
                                // }}
                                key={index}
                                justifyContent={"left"}
                            >
                                {tab.label}
                            </Tab>
                        ))}
                    </TabList>
                )}
                <TabPanels>
                    {tabData.map((tab, index) => (
                        <TabPanel key={index} w="100%">
                            {/* <FormSections tab={tab.fields} /> */}
                            <Box
                                //mx={["2em", "5em"]}
                                boxShadow="rgba(149, 157, 165, 0.2) 0px 8px 24px"
                                borderRadius="8px"
                                bg="primary_15"
                                p="1em"
                                my="1em"
                            >
                                <Text
                                    variant="formLabel"
                                    my="1em"
                                    fontWeight={500}
                                >
                                    Profile photo
                                </Text>
                                <ProfileFotoEdit
                                    editData={editData}
                                    onChange={onChange}
                                />
                            </Box>
                            <FormBuilder {...tab.configFile} />
                        </TabPanel>
                    ))}
                </TabPanels>
            </Tabs>
        </Box>
    );
};

export default TabForms;
