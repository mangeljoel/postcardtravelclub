import {
    Box,
    Button,
    Checkbox,
    Flex,
    position,
    Select,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Text,
    VStack
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import TableComponent from "./TableComponent";
import {
    AffiliationsColumn,
    PostcardColumn,
    PropertiesColumn
} from "./ColumnDefinitions";
import {
    fetchPaginatedResults,
    getCountries,
    getTotalRecords
} from "../../queries/strapiQueries";
import { apiNames } from "../../services/fetchApIDataSchema";
import SelectCountry from "./Filters/SelectCountry";
import SelectPartner from "./Filters/SelectPartner";
import SelectInterest from "./Filters/SelectInterest";
import SelectAffiliation from "./Filters/SelectAffiliation";
import PostcardTrends from "./PostcardTrends";
import strapi from "../../queries/strapi";

const MemoizedTableComponent = React.memo(TableComponent);
const PostcardAnalytics = ({ isHotel, companyId }) => {
    // console.log(isHotel, companyId);
    const initialTabIndex = 0;
    const [tabsIndex, setTabsIndex] = useState(initialTabIndex);
    const tabColumns = [AffiliationsColumn, PropertiesColumn, PostcardColumn];

    const [data, setData] = useState([]);
    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(0);
    const [pageCount, setPageCount] = useState(1);
    // const [filters, setFilters] = useState({});

    const [selectedCountry, setSelectedCountry] = useState(null);
    const [countryList, setCountryList] = useState(null);

    const [partnerList, setPartnerList] = useState([]);
    const [showPartnerFilter, setShowPartnerFilter] = useState(false);
    const [selectedPartner, setSelectedPartner] = useState(null);

    const [editTags, setEditTags] = useState([]);
    const [tagList, setTagList] = useState([]);

    const [showAffiliationList, setShowAffiliationList] = useState(false);
    const [selectedAffiliation, setSelectedAffliliation] = useState(null);
    const [affiliationList, setAffiliationList] = useState([]);

    // useEffect(() => {
    //     isHotel && setTabsIndex(0);
    // }, [isHotel]);

    useEffect(() => {
        fetchExperienceList();
    }, [selectedCountry, selectedPartner]);

    useEffect(() => {
        fetchPartnersList();
        fetchAffiliations();
    }, [selectedCountry]);

    useEffect(() => {
        selectedAffiliation || isHotel
            ? fetchCountryList().then((response) => setCountryList(response))
            : setCountryList(null);
    }, [selectedAffiliation, isHotel]);

    const fetchExperienceList = async () => {
        let experienceHotelList = [];
        // &filters[directories][slug][$in][0]=mindful-luxury-hotels
        let queryHotelString = "?directory=mindful-luxury-hotels";

        if (selectedPartner) {
            experienceHotelList = await fetchPaginatedResults(
                "albums/gettags?albumId=" + selectedPartner?.id,
                {},
                {}
            );
        } else if (isHotel) {
            const albumList = await fetchPaginatedResults(
                apiNames.album,
                {
                    isFeatured: true,
                    isActive: true,
                    on_boarding: { state: "approved" },
                    // directories: {
                    //     slug: {
                    //         $in: ["mindful-luxury-hotels"]
                    //     }
                    // },
                    ...(selectedCountry
                        ? { country: selectedCountry?.id }
                        : {}),
                    ...(selectedPartner ? { id: selectedPartner?.id } : {}),
                    ...(isHotel ? { company: { id: companyId } } : {})
                },
                { country: true }
            );
            if (albumList && albumList.length > 0) {
                for (const album of albumList) {
                    experienceHotelList.push(
                        ...(await fetchPaginatedResults(
                            "albums/gettags?albumId=" + album?.id,
                            {},
                            {}
                        ))
                    );
                }
            }
        } else {
            if (selectedCountry) {
                queryHotelString =
                    queryHotelString + "&country=" + selectedCountry.id;
            }
            // else if (selectedAffiliation) {

            // }

            experienceHotelList = await fetchPaginatedResults(
                "tags/gettagsbydirectory" + queryHotelString,
                {},
                {}
            );
        }
        // console.log("itags", experienceHotelList);
        experienceHotelList = experienceHotelList.map(
            (tag) => tag.charAt(0).toUpperCase() + tag.slice(1).trim()
        );
        let unique = [...new Set(experienceHotelList)];

        setTagList(unique.sort((a, b) => a.localeCompare(b)));

        // setLoading(false);
    };

    const fetchPartnersList = async () => {
        const partners = await fetchPaginatedResults(
            apiNames.album,
            {
                isFeatured: true,
                isActive: true,
                on_boarding: { state: "approved" },
                // directories: {
                //     slug: {
                //         $in: ["mindful-luxury-hotels"]
                //     }
                // },
                ...(selectedCountry ? { country: selectedCountry?.id } : {}),
                ...(isHotel ? { company: { id: companyId } } : {})
            },
            { country: true, coverImage: true }
        );
        setPartnerList(
            Array.isArray(partners)
                ? partners.sort((a, b) => a.name.localeCompare(b.name))
                : [partners]
        );
    };

    const fetchAffiliations = async () => {
        const affiliations = await fetchPaginatedResults(
            apiNames.affiliation,
            {},
            {
                companies: { fields: ["name", "slug"] },
                logo: { fields: ["url"] }
            }
        );
        if (Array.isArray(affiliations)) setAffiliationList(affiliations);
        else setAffiliationList([affiliations]);
    };

    const fetchCountryList = async () => {
        if (selectedAffiliation || isHotel) {
            const propertyList = await fetchPaginatedResults(
                apiNames.album,
                {
                    isFeatured: true,
                    isActive: true,
                    on_boarding: { state: "approved" },
                    company: isHotel
                        ? { id: companyId }
                        : { affiliations: selectedAffiliation.id }
                },
                { country: true }
            );

            const unique = new Set();
            const ids = new Set();
            if (Array.isArray(propertyList)) {
                propertyList.forEach((album) => {
                    if (!ids.has(album.country.id)) {
                        unique.add({
                            id: album?.country.id,
                            name: album?.country.name
                        });
                        ids.add(album.country.id);
                    }
                });
            } else {
                unique.add({
                    id: propertyList?.country.id,
                    name: propertyList?.country.name
                });
            }
            // console.log("unique", [...unique]);

            return [...unique];
        } else {
            return null;
        }
    };

    useEffect(() => {
        const countryFilter = selectedCountry
            ? { country: selectedCountry?.id }
            : {};
        if (tabsIndex == 1) {
            fetchAffiliationsPaginated().then((response) => setData(response));
            getTotalRecords(apiNames.affiliation, {
                ...(selectedAffiliation ? { id: selectedAffiliation.id } : {})
            }).then((response) =>
                setPageCount(Math.ceil(response / itemsPerPage))
            );
        } else if (tabsIndex == 2) {
            fetchPartnersPaginated(countryFilter).then((response) =>
                setData(response)
            );
            getTotalRecords(apiNames.album, {
                isFeatured: true,
                isActive: true,
                on_boarding: { state: "approved" },
                // directories: {
                //     slug: {
                //         $in: ["mindful-luxury-hotels"]
                //     }
                // },
                ...countryFilter,
                ...(selectedPartner ? { id: selectedPartner?.id } : {}),
                ...(editTags.length > 0
                    ? {
                        postcards: {
                            tags: {
                                name: {
                                    $in: editTags.map((item) => {
                                        return item?.toLowerCase();
                                    })
                                }
                            }
                        }
                    }
                    : {}),
                ...(isHotel ? { company: { id: companyId } } : {}),
                ...(selectedAffiliation
                    ? {
                        company: {
                            affiliations: selectedAffiliation.id
                        }
                    }
                    : {})
            }).then((response) =>
                setPageCount(Math.ceil(response / itemsPerPage))
            );
        } else if (tabsIndex == 3) {
            fetchPostcardsPaginated(countryFilter).then((response) =>
                setData(response)
            );
            getTotalRecords(apiNames.postcard, {
                album: {
                    isFeatured: true,
                    isActive: true,
                    on_boarding: { state: "approved" },
                    // directories: {
                    //     slug: {
                    //         $in: ["mindful-luxury-hotels"]
                    //     }
                    // },
                    ...(selectedPartner ? { id: selectedPartner?.id } : {}),
                    ...(isHotel ? { company: { id: companyId } } : {}),
                    ...(selectedAffiliation
                        ? {
                            company: {
                                affiliations: selectedAffiliation.id
                            }
                        }
                        : {})
                },
                ...countryFilter,
                ...(editTags.length > 0
                    ? {
                        tags: {
                            name: {
                                $in: editTags.map((item) => {
                                    return item?.toLowerCase();
                                })
                            }
                        }
                    }
                    : {})
            }).then((response) =>
                setPageCount(Math.ceil(response / itemsPerPage))
            );
        }
    }, [
        tabsIndex,
        selectedAffiliation,
        selectedCountry,
        selectedPartner,
        editTags,
        affiliationList,
        currentPage
    ]);

    useEffect(() => {
        if (currentPage > pageCount - 1) setCurrentPage(0);
    }, [currentPage, pageCount]);

    const fetchAffiliationsPaginated = async () => {
        let data;
        const response = await fetchPaginatedResults(
            apiNames.affiliation,
            {
                ...(selectedAffiliation ? { id: selectedAffiliation.id } : {})
            },
            {
                companies: { fields: ["name", "slug"] },
                logo: { fields: ["url"] }
            },
            undefined,
            currentPage * itemsPerPage,
            itemsPerPage
        );
        // console.log("response", response);
        if (Array.isArray(response)) data = response;
        else data = [response];

        const newData = Promise.all(
            data.map(async (aff) => {
                const res = await strapi.find(
                    `events/affiliationStats?id=` + aff?.id
                );
                return { ...aff, ...res };
            })
        );
        return newData;
    };

    const fetchPartnersPaginated = async (countryFilter) => {
        let data;
        const response = await fetchPaginatedResults(
            apiNames.album,
            {
                isFeatured: true,
                isActive: true,
                on_boarding: { state: "approved" },
                // directories: {
                //     slug: {
                //         $in: ["mindful-luxury-hotels"]
                //     }
                // },
                ...(isHotel ? { company: { id: companyId } } : {}),
                ...(selectedAffiliation
                    ? {
                        company: {
                            affiliations: selectedAffiliation.id
                        }
                    }
                    : {}),
                // ...countryFilter,
                ...(selectedCountry ? { country: selectedCountry?.id } : {}),
                ...(selectedPartner ? { id: selectedPartner?.id } : {}),
                ...(editTags.length > 0
                    ? {
                        postcards: {
                            tags: {
                                name: {
                                    $in: editTags.map((item) => {
                                        return item?.toLowerCase();
                                    })
                                }
                            }
                        }
                    }
                    : {})
            },
            {
                country: true,
                company: true,
                coverImage: true,
                news_article: { fields: ["id"] },
                postcards: true
            },
            undefined,
            currentPage * itemsPerPage,
            itemsPerPage
        );
        // console.log("response", response);
        if (Array.isArray(response)) data = response;
        else data = [response];

        const newData = Promise.all(
            data.map(async (partner) => {
                const res = await strapi.find(
                    `events/albumStats?id=` + partner?.id
                );
                return { ...partner, ...res };
            })
        );
        return newData;
    };

    const fetchPostcardsPaginated = async (countryFilter) => {
        let data;
        const response = await fetchPaginatedResults(
            apiNames.postcard,
            {
                album: {
                    isFeatured: true,
                    isActive: true,
                    on_boarding: { state: "approved" },
                    // directories: {
                    //     slug: {
                    //         $in: ["mindful-luxury-hotels"]
                    //     }
                    // },
                    ...(selectedPartner ? { id: selectedPartner?.id } : {}),
                    ...(isHotel ? { company: { id: companyId } } : {}),
                    ...(selectedAffiliation
                        ? {
                            company: {
                                affiliations: selectedAffiliation.id
                            }
                        }
                        : {})
                },
                ...countryFilter,
                ...(editTags.length > 0
                    ? {
                        tags: {
                            name: {
                                $in: editTags.map((item) => {
                                    return item?.toLowerCase();
                                })
                            }
                        }
                    }
                    : {})
            },
            { coverImage: true, tags: true, album: true },
            undefined,
            currentPage * itemsPerPage,
            itemsPerPage
        );
        // console.log("response", response);
        if (Array.isArray(response)) data = response;
        else data = [response];

        const newData = Promise.all(
            data.map(async (postcard) => {
                const res = await strapi.find(
                    `events/postcardStats?id=` + postcard?.id
                );
                return { ...postcard, ...res };
            })
        );
        return newData;
    };

    const handleRowClick = (rowData) => {
        // if (tabsIndex == 0) {
        //     //user is on affiliations tab
        //     setSelectedAffliliation({ id: rowData.id, name: rowData.name });
        //     setTabsIndex(1); //switch tab to properties
        // } else
        if (tabsIndex == 2) {
            //user is on Property tab
            setSelectedCountry(rowData.country);
            setSelectedPartner({ id: rowData.id, name: rowData.name });
            setTabsIndex(3); //switch tab to properties
            setCurrentPage(0);
        }
    };

    const tabsData = [
        {
            label: "Trends",
            content: (
                <PostcardTrends
                    isHotel={isHotel}
                    companyId={companyId}
                />
            )
        },
        {
            label: "Affiliations",
            content: !isHotel && (
                <>
                    <Flex
                        justifyContent={"center"}
                        alignItems={"center"}
                        mb={"3em"}
                    >
                        <Box position={"relative"} gap="10px">
                            {/* <SelectAffiliation
                                selectedAffiliation={selectedAffiliation}
                                setSelectedAffliliation={
                                    setSelectedAffliliation
                                }
                                showAffiliationList={showAffiliationList}
                                setShowAffiliationList={setShowAffiliationList}
                                affiliationList={affiliationList}
                                setSelectedCountry={setSelectedCountry}
                                setEditTags={setEditTags}
                                setSelectedPartner={setSelectedPartner}
                            /> */}
                        </Box>
                    </Flex>
                    <MemoizedTableComponent
                        columns={tabColumns[0]}
                        data={data}
                        isHotel={isHotel}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        pageCount={pageCount}
                        onRowClick={handleRowClick}
                        withPagination={true}
                    />
                </>
            )
        },
        {
            label: "Properties",
            content: (
                <>
                    <Flex
                        justifyContent={"center"}
                        alignItems={"center"}
                        mb={"3em"}
                    >
                        <Box display={"flex"} position={"relative"} gap="10px">
                            {/* {!isHotel && (
                                <SelectAffiliation
                                    selectedAffiliation={selectedAffiliation}
                                    setSelectedAffliliation={
                                        setSelectedAffliliation
                                    }
                                    showAffiliationList={showAffiliationList}
                                    setShowAffiliationList={
                                        setShowAffiliationList
                                    }
                                    affiliationList={affiliationList}
                                    setSelectedCountry={setSelectedCountry}
                                    setEditTags={setEditTags}
                                    setSelectedPartner={setSelectedPartner}
                                />
                            )} */}
                            {!(
                                (isHotel || selectedAffiliation) &&
                                countryList?.length <= 1
                            ) && (
                                    <SelectCountry
                                        selectedCountry={selectedCountry}
                                        setSelectedCountry={setSelectedCountry}
                                        setEditTags={setEditTags}
                                        setSelectedPartner={setSelectedPartner}
                                        countryList={countryList}
                                    />
                                )}
                            {!(partnerList?.length <= 1) && (
                                <SelectPartner
                                    showPartnerFilter={showPartnerFilter}
                                    setShowPartnerFilter={setShowPartnerFilter}
                                    selectedPartner={selectedPartner}
                                    setSelectedPartner={setSelectedPartner}
                                    partnerList={partnerList}
                                    setEditTags={setEditTags}
                                />
                            )}
                            <SelectInterest
                                editTags={editTags}
                                setEditTags={setEditTags}
                                tagList={tagList}
                            />
                        </Box>
                    </Flex>
                    <MemoizedTableComponent
                        columns={tabColumns[1]}
                        data={data}
                        isHotel={isHotel}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        pageCount={pageCount}
                        onRowClick={handleRowClick}
                        withPagination={true}
                    />
                </>
            )
        },
        {
            label: "Postcard",
            content: (
                <>
                    <Flex
                        justifyContent={"center"}
                        alignItems={"center"}
                        mb={"3em"}
                    >
                        <Box display="flex" position={"relative"} gap="10px">
                            {/* {!isHotel && (
                                <SelectAffiliation
                                    selectedAffiliation={selectedAffiliation}
                                    setSelectedAffliliation={
                                        setSelectedAffliliation
                                    }
                                    showAffiliationList={showAffiliationList}
                                    setShowAffiliationList={
                                        setShowAffiliationList
                                    }
                                    affiliationList={affiliationList}
                                    setSelectedCountry={setSelectedCountry}
                                    setEditTags={setEditTags}
                                    setSelectedPartner={setSelectedPartner}
                                />
                            )} */}
                            {!(
                                (isHotel || selectedAffiliation) &&
                                countryList?.length <= 1
                            ) && (
                                    <SelectCountry
                                        selectedCountry={selectedCountry}
                                        setSelectedCountry={setSelectedCountry}
                                        setEditTags={setEditTags}
                                        setSelectedPartner={setSelectedPartner}
                                        countryList={countryList}
                                    />
                                )}
                            {!(partnerList?.length <= 1) && (
                                <SelectPartner
                                    showPartnerFilter={showPartnerFilter}
                                    setShowPartnerFilter={setShowPartnerFilter}
                                    selectedPartner={selectedPartner}
                                    setSelectedPartner={setSelectedPartner}
                                    partnerList={partnerList}
                                    setEditTags={setEditTags}
                                />
                            )}
                            <SelectInterest
                                editTags={editTags}
                                setEditTags={setEditTags}
                                tagList={tagList}
                            />
                        </Box>
                    </Flex>
                    <MemoizedTableComponent
                        columns={tabColumns[2]}
                        data={data}
                        isHotel={isHotel}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        pageCount={pageCount}
                        withPagination={true}
                    />
                </>
            )
        },
    ];

    const handleTabChange = React.useCallback((e) => {
        setTabsIndex(e);
        setSelectedAffliliation(null);
        setSelectedCountry(null);
        setSelectedPartner(null);
        setEditTags([]);
        setCurrentPage(0);
    }, []);

    return (
        <>
            <Tabs
                variant="unstyled"
                width="100%"
                display={"flex"}
                flexDirection={"column"}
                justifyContent={"center"}
                alignItems={"center"}
                index={tabsIndex}
                onChange={handleTabChange}
            >
                <TabList
                    border="1px solid #EA6147"
                    borderRadius="12px"
                    defaultIndex={tabsIndex}
                    marginY="35px"
                >
                    {tabsData.map((tab, index) => {
                        if (index == 1 && isHotel)
                            return <Tab key={index} display={"none"}></Tab>;
                        return (
                            <Tab
                                key={index}
                                width="120px"
                                color={"primary_1"}
                                fontWeight={"500"}
                                _selected={{
                                    bg: "#EA6147",
                                    borderRadius: "10px",
                                    color: "white"
                                }}
                                // Add transition effect for background color
                                _hover={{
                                    transition: "background-color 0.5s ease"
                                }}
                            >
                                {tab.label}
                            </Tab>
                        );
                    })}
                </TabList>
                <TabPanels>
                    {/* {tabsData.map((tab, index) => (
                        <TabPanel p={4} key={index}>
                            {tab.content}
                        </TabPanel>
                    ))} */}
                    {tabsIndex == 0 && tabsData[0].content}
                    {tabsIndex == 1 && tabsData[1].content}
                    {tabsIndex == 2 && tabsData[2].content}
                    {tabsIndex == 3 && tabsData[3].content}
                </TabPanels>
            </Tabs>
        </>
    );
};

export default PostcardAnalytics;
