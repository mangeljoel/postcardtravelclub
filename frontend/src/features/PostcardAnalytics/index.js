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
import { useCountries } from "../../hooks/useCountriesHook";
import { set } from "lodash";

const MemoizedTableComponent = React.memo(TableComponent);
const PostcardAnalytics = ({ isHotel, companyId }) => {
    // console.log(isHotel, companyId);
    const initialTabIndex = 0;
    const [tabsIndex, setTabsIndex] = useState(initialTabIndex);
    const tabColumns = [AffiliationsColumn, PropertiesColumn, PostcardColumn];

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(0);
    const [pageCount, setPageCount] = useState(1);
    // const [filters, setFilters] = useState({});

    const [selectedCountry, setSelectedCountry] = useState(null);
    // const [countryList, setCountryList] = useState(null);
    const countryList = useCountries('albums')

    const [partnerList, setPartnerList] = useState([]);
    const [showPartnerFilter, setShowPartnerFilter] = useState(false);
    const [selectedPartner, setSelectedPartner] = useState(null);

    const [editTags, setEditTags] = useState([]);
    const [tagList, setTagList] = useState([]);

    const [sortField, setSortField] = useState("albumCount");
    const [sortOrder, setSortOrder] = useState("desc");

    // useEffect(() => {
    //     isHotel && setTabsIndex(0);
    // }, [isHotel]);

    useEffect(() => {
        fetchExperienceList();
    }, [selectedCountry, selectedPartner]);

    useEffect(() => {
        fetchPartnersList();
    }, [selectedCountry]);

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
                "tags/gettags",
                // "tags/gettagsbydirectory" + queryHotelString,
                {},
                {}
            );
        }
        // console.log("itags", experienceHotelList);
        // experienceHotelList = experienceHotelList.map(
        //     (tag) => tag.charAt(0).toUpperCase() + tag.slice(1).trim()
        // );
        // let unique = [...new Set(experienceHotelList)];

        // setTagList(unique.sort((a, b) => a.localeCompare(b)));

        const unique = [
            ...new Map(
                experienceHotelList.map(tag => [tag.name.toLowerCase(), {
                    id: tag.id,
                    name: tag.name.charAt(0).toUpperCase() + tag.name.slice(1).trim()
                }])
            ).values()
        ];

        setTagList(unique.sort((a, b) => a.name.localeCompare(b.name)));

        // setLoading(false);
    };

    const fetchPartnersList = async () => {
        const partners = await fetchPaginatedResults(
            apiNames.album,
            {
                isFeatured: true,
                isActive: true,
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

    useEffect(() => {
        setLoading(true); // Start loading

        if (tabsIndex === 1) {
            Promise.all([
                fetchAffiliationsPaginated(),
                getTotalRecords(apiNames.affiliation)
            ])
                .then(([affiliations, totalRecords]) => {
                    setData(affiliations);
                    setPageCount(Math.ceil(totalRecords / itemsPerPage));
                })
                .finally(() => setLoading(false));
            return;
        }

        if (tabsIndex === 2) {
            const queryParts = [
                `page=${currentPage}`,
                `pageSize=${itemsPerPage}`,
                `sortBy=${sortField}`,
                `order=${sortOrder}`,
                isHotel ? `company=${companyId}` : "",
                selectedCountry ? `country=${selectedCountry.id}` : "",
                selectedPartner ? `propertyId=${selectedPartner.id}` : "",
                editTags.length > 0 ? `tags=${editTags.map(t => t.id).join(',')}` : ""
            ].filter(Boolean).join('&');

            strapi.find(`events/getAlbumsSorted${queryParts ? `?${queryParts}` : ''}`)
                .then((response) => {
                    setData(response?.result || []);
                    setPageCount(Math.ceil((response?.total || 0) / itemsPerPage));
                })
                .finally(() => setLoading(false));
            return;
        }

        if (tabsIndex === 3) {
            const queryParts = [
                `page=${currentPage}`,
                `pageSize=${itemsPerPage}`,
                `sortBy=${sortField}`,
                `order=${sortOrder}`,
                isHotel ? `company=${companyId}` : "",
                selectedCountry ? `country=${selectedCountry.id}` : "",
                selectedPartner ? `propertyId=${selectedPartner.id}` : "",
                editTags.length > 0 ? `tags=${editTags.map(t => t.id).join(',')}` : ""
            ].filter(Boolean).join('&');

            strapi.find(`events/getPostcardsSorted${queryParts ? `?${queryParts}` : ''}`)
                .then((response) => {
                    setData(response?.result || []);
                    setPageCount(Math.ceil((response?.total || 0) / itemsPerPage));
                })
                .finally(() => setLoading(false));
            return;
        }

    }, [tabsIndex, selectedCountry, selectedPartner, editTags, currentPage, sortField, sortOrder]);


    useEffect(() => {
        if (currentPage > pageCount - 1) setCurrentPage(0);
    }, [currentPage, pageCount]);

    const fetchAffiliationsPaginated = async () => {
        let data;
        const response = await fetchPaginatedResults(
            apiNames.affiliation,
            {},
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
                        loading={loading}
                        columns={tabColumns[0]}
                        data={data}
                        isHotel={isHotel}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        pageCount={pageCount}
                        onRowClick={handleRowClick}
                        withPagination={true}
                        sortField={sortField}
                        setSortField={setSortField}
                        sortOrder={sortOrder}
                        setSortOrder={setSortOrder}
                        tabsIndex={tabsIndex}
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
                            {!(isHotel && countryList?.length <= 1) && (
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
                        loading={loading}
                        columns={tabColumns[1]}
                        data={data}
                        isHotel={isHotel}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        pageCount={pageCount}
                        onRowClick={handleRowClick}
                        withPagination={true}
                        sortField={sortField}
                        setSortField={setSortField}
                        sortOrder={sortOrder}
                        setSortOrder={setSortOrder}
                        tabsIndex={tabsIndex}
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
                            {!(isHotel && countryList?.length <= 1) && (
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
                        loading={loading}
                        columns={tabColumns[2]}
                        data={data}
                        isHotel={isHotel}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        pageCount={pageCount}
                        withPagination={true}
                        sortField={sortField}
                        setSortField={setSortField}
                        sortOrder={sortOrder}
                        setSortOrder={setSortOrder}
                        tabsIndex={tabsIndex}
                    />
                </>
            )
        },
    ];

    const handleTabChange = React.useCallback((e) => {
        setTabsIndex(e);
        // setSelectedAffliliation(null);
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
                {/* <TabPanels>
                    {tabsData.map((tab, index) => (
                        <TabPanel p={4} key={index}>
                            {tab.content}
                        </TabPanel>
                    ))}
                </TabPanels> */}
                {tabsIndex == 0 && tabsData[0].content}
                {tabsIndex == 1 && tabsData[1].content}
                {tabsIndex == 2 && tabsData[2].content}
                {tabsIndex == 3 && tabsData[3].content}
            </Tabs>
        </>
    );
};

export default PostcardAnalytics;
