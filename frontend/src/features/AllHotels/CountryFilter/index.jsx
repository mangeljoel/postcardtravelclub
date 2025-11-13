import { Flex, useRadioGroup, Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { Categories } from "../../../styles/CustomComponents/Categories";
const CountryFilter = ({
    countryList,
    filterAlbums,
    filterStatus,
    filterPublications,
    countrySelected,
    setSelectedData,
    type,
    isCountry,
    isStatus,
    isPublish
}) => {
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [filteredAlbums, setFilteredAlbums] = useState([]);
    const { value, setValue, getRadioProps } = useRadioGroup({
        defaultValue: -1
    });
    useEffect(() => {
        if (countrySelected) {
            toggleCountry(countrySelected);
        }
    }, [countrySelected])
    const toggleCountry = (name) => {
        if (name === selectedCountry) {
            // show all
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
            w={["100%", "70%"]}
            justifyContent="center"
            flexWrap="wrap"
            textAlign={"center"}
            margin="auto"
            mt={["3%", "1%"]}
        >
            {countryList?.length > 0 &&
                countryList.map((country, index) => {
                    const radio = getRadioProps({ value: country.name });
                    return (
                        <Categories
                            key={"cat_" + index}
                            onClick={(name) => toggleCountry(name)}
                            value={country.id}
                            {...radio}
                        >
                            <Text
                                fontFamily={"raleway"}
                                fontWeight={450}
                                fontSize={["12px", "15px"]}
                            >
                                {country.name}
                            </Text>
                        </Categories>
                    );
                })}
        </Flex>
    );
};
export default CountryFilter;
