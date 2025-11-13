import { Flex, useRadioGroup, Box, Button } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import PostcardModal from "../../PostcardModal";
import OptionSelection from "../../GuidedSearch/OptionSelection";
const CountryFilter = ({
    countryList,
    filterAlbums,
    filterStatus,
    filterPublications,
    setSelectedData,
    countrySelected,
    type,
    isCountry,
    isStatus,
    isPublish,
    allCountriesOption
}) => {
    const [selectedCountry, setSelectedCountry] = useState(
        allCountriesOption ? "All Countries" : null
    );

    const [showCountryFilter, setShowCountryFilter] = useState(false);

    const { setValue } = useRadioGroup({
        defaultValue: -1
    });
    useEffect(() => {
        if (countrySelected) {
            if (isCountry) toggleCountry(countrySelected);
            else {
                setSelectedCountry(countrySelected);
                if (setSelectedData) setSelectedData(countrySelected);
                setValue(countrySelected);
            }
        }
    }, [countrySelected]);

    const toggleCountry = (name) => {
        if (name === "All") {
            setSelectedCountry(null);
            if (setSelectedData) setSelectedData("");
            //setFilteredAlbums(data.data);
            setValue("-1");
            if (isCountry) filterAlbums(type, "");
            if (isStatus) filterStatus(type, "");
            if (isPublish) filterPublications(type, "");
        } else {
            setSelectedCountry(name);
            // let filtered = data.data.filter(
            //     (alb) => alb.country?.name === name
            // );
            // setFilteredAlbums(filtered);
            if (setSelectedData) setSelectedData(name);
            setValue(name);
            if (isCountry) filterAlbums(type, name);
            if (isStatus) filterStatus(type, name);
            if (isPublish) filterPublications(type, name);
        }
    };
    return (
        <Flex
            w={["100%", "30%"]}
            justifyContent="center"
            flexWrap="wrap"
            textAlign={"center"}
            margin="auto"
            mt={["3%", "1%"]}
        >
            <Box
                onClick={() => {
                    setShowCountryFilter(!showCountryFilter);
                }}
            >
                {selectedCountry ? (
                    <Button
                        borderRadius="43px"
                        mr="1em"
                        h="30px"
                        fontSize="16px"
                        px={6}
                    >
                        {selectedCountry}
                    </Button>
                ) : (
                    <Button
                        borderRadius="43px"
                        mr="1em"
                        h="30px"
                        fontSize="16px"
                        px={6}
                    >
                        Select Country
                    </Button>
                )}
                <PostcardModal
                    isShow={showCountryFilter}
                    headerText={"Select Country"}
                    children={
                        <OptionSelection
                            hideTitle={true}
                            optionSet={countryList}
                            showOptions={true}
                            setSelectedOption={(e) => {
                                //setFilterSteps({ step: filterSteps.step + 1 });
                                // setSelectedValues({
                                //     country: e
                                // });
                                toggleCountry(e.name);
                                // selectAllTags();
                                setShowCountryFilter(false);
                            }}
                            selectedOption={null}
                            label={"country"}
                            name={"Country"}
                            placeholder={"Select Country"}
                            allCountriesOption={allCountriesOption}
                        />
                    }
                    handleClose={() => {
                        setShowCountryFilter(false);
                    }}
                    style={{
                        padding: "20px",
                        width: "100%",
                        minHeight: "50vh"
                    }}
                    size={"lg"}
                />
            </Box>
        </Flex>
    );
};
export default CountryFilter;
