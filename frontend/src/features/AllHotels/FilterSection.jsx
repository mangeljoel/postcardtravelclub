import { Box, Text, Flex, useCheckboxGroup } from "@chakra-ui/react";
import { AutoCompleteField } from "../../patterns/FormBuilder/AutoCompleteField";
import { useContext, useState } from "react";
import {
    fetchPaginatedResults,
    getCountryByWord,
    getTagsByWord
} from "../../queries/strapiQueries";
import AppContext from "../AppContext";
import { CustomCheckbox } from "../../styles/CustomComponents/CustomCheckbox";

const FilterSection = (props) => {
    const { setSelectedValues, countryList, experienceList } = props;
    const { TourCountries, HotelCountries } = useContext(AppContext);
    // const [countryList, setCountryList] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
    const { value, setValue, getCheckboxProps } = useCheckboxGroup({
        onChange: (e) => {
            setSelectedValues((prev) => ({ ...prev, experience: e }));
        }
    });
    const resetCheckBoxGroup = () => {
        setValue([]);
    };
    return (
        <Box {...props} p={3}>
            <Text variant="articleDescription" fontWeight={"bold"} mb={5}>
                {" "}
                Apply Filters
            </Text>
            <Box w="50%" mx="auto">
                <Text variant="formLabel">Select a Country</Text>
                <AutoCompleteField
                    component={{
                        label: "country",
                        isVisible: true,
                        name: "Country",
                        fieldStyle: {},

                        placeholder: "Select Country",
                        options: [{ id: 0, name: "All" }].concat(countryList),
                        optionType: "object",
                        displayKey: "name",
                        valueKey: "id",

                        onChange: (e) => {},
                        onSelectOption: (e) => {
                            // console.log(e, "select");
                        }
                    }}
                    value={null}
                    onChange={(e) => {
                        setSelectedValues((prev) => ({
                            ...prev,
                            country: e
                        }));
                        resetCheckBoxGroup();
                    }}
                />
            </Box>

            <Text mt="2%" variant="formLabel">
                Select your Interests
            </Text>
            <Flex
                w={"100%"}
                maxH="400px"
                justifyContent="center"
                flexWrap="wrap"
                overflowY={"auto"}
                textAlign={"center"}
                margin="auto"
                mt={["3%", "1%"]}
            >
                {experienceList &&
                    experienceList.length > 0 &&
                    experienceList.map((exp, index) => {
                        const checkbox = getCheckboxProps({
                            value: exp
                        });
                        return (
                            <CustomCheckbox key={exp} {...checkbox}>
                                <Text
                                    fontFamily={"raleway"}
                                    fontWeight={450}
                                    fontSize={["12px", "15px"]}
                                >
                                    {exp}
                                </Text>
                            </CustomCheckbox>
                        );
                    })}
            </Flex>
            {/* <AutoCompleteField
                component={{
                    label: "tag",
                    isVisible: true,
                    name: "Tag",
                    fieldStyle: {
                        // width: ["100%", "50%"],
                        onChange: async (e) => {
                            if (e.target.value) {
                                let tags = await getTagsByWord(
                                    e.target.value.toString()
                                );
                                if (tags && tags.data)
                                    setExperienceList(tags.data);
                            }
                        }
                    },
                    placeholder: "Select Experience",
                    options: experienceList,
                    optionType: "object",
                    displayKey: "name",
                    valueKey: "id",

                    onChange: (e) => {},
                    onSelectOption: (e) => {
                        // console.log(e, "select");
                    }
                }}
                value={null}
                onChange={(e) => {
                    setSelectedValues((prev) => ({ ...prev, experience: e }));
                }}
            /> */}
        </Box>
    );
};
export default FilterSection;
