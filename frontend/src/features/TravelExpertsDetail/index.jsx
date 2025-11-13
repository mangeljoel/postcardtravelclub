import React, { useEffect, useState, useContext } from "react";
import { useQuery } from "react-query";

import { useRouter } from "next/router";
import { Box, Text, Button, Link } from "@chakra-ui/react";

import AppContext from "../AppContext";

import TravelExpertsDetailHeader from "./TravelExpertsDetailHeader";
import TravelExpertsDetailContainer from "./TravelExpertsDetailContainer";

import strapi from "../../queries/strapi.js";
import {
    getBkmStory,
    getOwnStories,
    getPostcardsByUser
} from "../../queries/strapiQueries";
import { get } from "lodash";
import CountryFilter from "../AllTours/CountryFilter";

const TravelExpertsDetail = ({
    expert,
    id,
    slug,
    type,
    leadData,
    allowView
}) => {
    const { profile, setMetaValues, isActiveProfile } = useContext(AppContext);
    const [expertPostcards, setExpertPostcards] = useState([]);
    const [expertAlbums, setExpertAlbums] = useState([]);
    const [countrySet, setCountries] = useState([]);
    const [initialData, setInitialData] = useState({});

    useEffect(() => {
        if (expert.id) fetchPageData(expert.id);
    }, [expert]);
    const fetchPageData = async (expert) => {
        let postcards = await getPostcardsByUser({ filters: { user: expert } });
        let albums = await getOwnStories(expert);
        getCountryList(postcards, albums);
        setExpertPostcards(postcards);
        setExpertAlbums(albums);
        setInitialData({
            postcards: postcards,
            albums: albums
        });
    };
    const getCountryList = async (postcards, albums) => {
        let countries = [];
        albums.map((album) => {
            if (
                album.country?.id &&
                countries.filter((e) => e.id === album.country.id).length == 0
            ) {
                countries.push(album.country);
            }
        });
        postcards.map((postcard) => {
            if (
                postcard.country?.id &&
                countries.filter((e) => e.id === postcard.country.id).length ==
                    0
            ) {
                countries.push(postcard.country);
            }
        });
        countries.sort((a, b) => a.name.localeCompare(b.name));

        setCountries(countries);
    };
    const filterData = (type, name) => {
        if (name === "" && expert.id) {
            fetchPageData(expert.id);
        } else {
            let filteredPostcards = initialData.postcards.filter(
                (pc) => pc.country?.name === name
            );

            setExpertPostcards(filteredPostcards);
            let filteredAlbums = initialData.albums.filter(
                (alb) => alb.country?.name === name
            );
            setExpertAlbums(filteredAlbums);
        }
    };
    return (
        <Box mx="auto" w="100%" textAlign={"center"}>
            <TravelExpertsDetailHeader
                expert={expert}
                profile={profile}
                refetch={() => {
                    fetchPageData(expert.id);
                }}
            ></TravelExpertsDetailHeader>
            {/* <Box mt="2em" mb="4em" mx="auto" textAlign={"center"}>
                {expert.social?.blogURL && (
                    <Link
                        textAlign={"center"}
                        mx="auto"
                        color="primary_1"
                        fontSize={"1.2em"}
                        fontWeight={"semibold"}
                        textDecor="underline"
                        href={expert.social.blogURL}
                        target="_blank"
                    >
                        {expert.social.blogURL}
                    </Link>
                )}
            </Box> */}
            <CountryFilter
                countryList={countrySet}
                //countrySelected={countryName}
                filterAlbums={filterData}
                isCountry={true}
                type="stories"
            />

            <TravelExpertsDetailContainer
                postcardsData={expertPostcards}
                stories={expertAlbums}
                expertType={expert?.user_type?.name}
                refetch={() => {
                    fetchPageData(expert.id);
                }}
            ></TravelExpertsDetailContainer>
        </Box>
    );
};

export default TravelExpertsDetail;
