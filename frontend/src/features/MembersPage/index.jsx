import { useEffect, useState } from "react";
import { fetchPaginatedResults } from "../../queries/strapiQueries";
import MembersCard from "./MembersCard";
import { Box, Img, Button, Text, SimpleGrid } from "@chakra-ui/react";
import {
    apiNames,
    filterForRegularMembers
} from "../../services/fetchApIDataSchema";
import { getCountryNameFromList } from "../../services/utilities";
import { useRouter } from "next/router";
import LoadingGif from "../../patterns/LoadingGif";
import CountryFilter from "../AllTours/CountryFilter";
import MembersCardList from "./MemberCardList";

const MembersPage = ({ members, isAffiliation }) => {
    const [displayMembers, setDisplayMembers] = useState([]);
    const [countryList, setCountryList] = useState([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    useEffect(() => {
        if (isAffiliation) prepareAffilData();
        else preparePageData();
    }, []);
    const prepareAffilData = () => {
        setLoading(true);
        if (members) {
            setDisplayMembers(members);
            setLoading(false);
        }
    };
    const preparePageData = () => {
        setLoading(true);
        if (members && members.length > 0) {
            let filteredmembers = members.filter(
                (item) =>
                    item.company &&
                    item.company.name &&
                    item.country
            );
            setDisplayMembers(filteredmembers);
            let countries = getCountryNameFromList(filteredmembers);
            setCountryList(countries);
            setLoading(false);
        }
    };
    const filterMembers = (type, name) => {
        setLoading(true);
        setDisplayMembers([]);
        if (members && members.length > 0) {
            let filteredmembers = members.filter((item) =>
                name === "" || name == "All Countries"
                    ? item.company &&
                    item.company.name &&
                    item.country


                    : item.company &&
                    item.company.name &&
                    item.country &&
                    item.country.name === name
            );
            setDisplayMembers(filteredmembers);
            setLoading(false);
        }
    };

    return (
        <Box
            pos="relative"
            my={["1em", "3%"]}
            pl={{ base: "5%", sm: "5%", md: "5%", lg: "10%" }}
            pr={{ base: "5%", sm: "5%", md: "5%", lg: "10%" }}
            mx="auto"
            textAlign="center"
        >
            {/* <Img
                loading="lazy"
                width={["300px", "350px"]}
                m="auto"
                height={["120px", "130px"]}
                objectFit={"cover"}
                src={"/assets/new_ui/icons/logo_noshad.png"}
                alt="logo"
            /> */}
            <Text
                textAlign="center"
                // mt={"2%"}
                mb="1em"
                fontSize={["24px", "28px"]}
                //color="primary_3"
                fontWeight={700}
            >
                {isAffiliation ? "AFFILIATIONS" : "CHAMPIONS OF CHANGE"}
            </Text>
            <Text
                mt={3}
                //mb={14}
                mx={"auto"}
                fontSize={["16px", "20px"]}
                whiteSpace={"pre-line"}
                w={["95%", "60%"]}
                textAlign="center"
            >
                Postcard partners with value-aligned collectives that bring
                together brands that advance responsible tourism
            </Text>
            {loading ? (
                <LoadingGif />
            ) : (
                <Box my={["6%", "3%"]}>
                    {countryList &&
                        countryList.length > 1 &&
                        !isAffiliation && (
                            <CountryFilter
                                countryList={countryList}
                                // countrySelected={countryName}
                                filterAlbums={filterMembers}
                                isCountry={true}
                                type="stories"
                                allCountriesOption={true}
                            />
                        )}
                    <MembersCardList
                        displayMembers={displayMembers}
                        isAffiliation={isAffiliation}
                    />
                    {/* {!isAffiliation && (
                        <Box my={"5em"} mx="auto">
                            <Text
                                variant="subHeading"
                                whiteSpace={"pre-line"}
                                w={["95%", "60%"]}
                                textAlign="center"
                                fontWeight="bold"
                            >
                                Are you a travel brand that advances responsible
                                tourism?
                            </Text>
                            <Button
                                mt={"2em"}
                                onClick={() => router.push("/partnerships")}
                            >
                                Join as a Champion of Change
                            </Button>
                        </Box>
                    )} */}
                </Box>
            )}
        </Box>
    );
};
export default MembersPage;
