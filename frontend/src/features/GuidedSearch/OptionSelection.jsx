import { useEffect, useState } from "react";
import { Box, Text } from "@chakra-ui/react";
import { fetchPaginatedResults } from "../../queries/strapiQueries";
import { AutoCompleteField } from "../../patterns/FormBuilder/AutoCompleteField";

const OptionSelection = (props) => {
    const {
        type,
        // countrySet,
        optionSet,
        // selectedCountry,
        selectedOption,
        hideTitle,
        showOptions,
        // setSelectedCountry
        setSelectedOption,
        label,
        name,
        placeholder,
        allCountriesOption
    } = props;
    const [optionList, setOptionList] = useState([]);
    useEffect(() => {
        if (optionSet) {
            if (allCountriesOption)
                setOptionList(
                    [{ name: "All Countries", id: -1 }].concat(optionSet)
                );
            else setOptionList(optionSet);
        } else initializeCountryList();
    }, []);
    const initializeCountryList = async () => {
        let queryString = "albums/findcountries?type=hotels";
        let countries = await fetchPaginatedResults(queryString);
        countries = countries?.sort((a, b) => a.name.localeCompare(b.name));
        // let countryList = [{ name: "All Countries", id: -1 }].concat(countries);
        // setOptionList(countryList);
        if (allCountriesOption)
            setOptionList(
                [{ name: "All Countries", id: -1 }].concat(countries)
            );
        else setOptionList(countries);
    };
    return (
        <Box position={"relative"}>
            <AutoCompleteField
                defaultIsOpen={!selectedOption || showOptions ? true : false}
                optionPosition="relative"
                component={{
                    label: label,
                    isVisible: true,
                    name: name,
                    fieldStyle: {},
                    placeholder: placeholder,
                    options: optionList,
                    optionType: "object",
                    displayKey: "name",
                    valueKey: "id",

                    onChange: (e) => { },
                    onSelectOption: (e) => {
                        // console.log(e, "select");
                    }
                }}
                value={selectedOption}
                onChange={(e) => {
                    setSelectedOption(e);
                }}
            />
        </Box>
    );
};
export default OptionSelection;
