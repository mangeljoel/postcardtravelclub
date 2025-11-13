import { useEffect, useContext, useState } from "react";
import CountryFilter from "../AllTours/CountryFilter";
import NewStoryList from "../TravelGuide/NewStoryList";
import { getOwnStories } from "../../queries/strapiQueries";
import { uploadfile, getFounderStory } from "../../services/utilities";
import { updateDBValue } from "../../queries/strapiQueries";
import { Text, Box, Image, AspectRatio, Button } from "@chakra-ui/react";
import AppContext from "../AppContext";
import ImageUpload from "../ImageUpload";

const MyPages = () => {
    const { profile, isTabletOrMobile, featuredCountries } =
        useContext(AppContext);

    const [loading, setLoading] = useState(true);
    const [countryList, setCountryList] = useState([]);
    const [pages, setPages] = useState([]);
    const [filteredAlbums, setFilteredAlbums] = useState([]);
    const [uploadImage, setUploadImage] = useState({
        show: false,
        type: {},
        multiple: false,
        callbackType: "pageCover",
        cropImage: true
    });
    // const [showShareModal, setShowShareModal] = useState(false);
    // const [shareData, setShareData] = useState(null);

    useEffect(() => {
        if (profile) {
            getData(profile?.id);
        }
    }, [profile]);
    const getCountryList = (albums) => {
        let countries = [];
        albums.map((album) => {
            if (
                album.country?.id &&
                countries.filter((e) => e.id === album.country.id).length == 0
            ) {
                countries.push(album.country);
            }
        });
        countries.sort((a, b) => a.name.localeCompare(b.name));

        setCountryList(countries);
    };
    const getData = async (profileId) => {
        let pages = await getOwnStories(profileId);
        getCountryList(pages);
        setPages(pages);
        setFilteredAlbums(pages);
        setTimeout(() => setLoading(false), 1000);
    };
    const filterAlbums = async (type, name) => {
        if (name === "") {
            // show all

            setFilteredAlbums(pages);
        } else {
            let filtered = pages.filter((alb) => alb.country?.name === name);
            //console.log(filtered);
            setFilteredAlbums(filtered);
        }
    };
    const createPage = async (key, croppedImage) => {
        if (key === "pageCover") {
            let data = {
                user: profile?.id
            };
            uploadfile(
                croppedImage,
                null,
                "albums",
                "coverImage",
                data,
                async (resp) => {
                    if (resp?.data?.id && profile) {
                        let hasFounderStory = await getFounderStory(profile.id);
                        if (hasFounderStory && hasFounderStory.length > 0) {
                            let data = {
                                postcards: hasFounderStory[0].id
                            };
                            updateDBValue("albums", resp.data.id, data);
                        }
                    }
                    setUploadImage(false);
                    getData(profile?.id);
                }
            );
        }
    };
    return (
        <Box
            pos="relative"
            mt={["12%", "3%"]}
            pl={{ base: "5%", sm: "5%", md: "5%", lg: "10%" }}
            pr={{ base: "5%", sm: "5%", md: "5%", lg: "10%" }}
            mx="auto"
            textAlign="center"
        >
            <Text textAlign="center" mt={"5%"} variant="Heading">
                My Pages
            </Text>
            {loading ? (
                <Box w="100%" mx="auto" my={50}>
                    <Image
                        loading="lazy"
                        margin="auto"
                        textAlign="center"
                        src={"/assets/balloon.gif"}
                        alt="loading"
                    />
                </Box>
            ) : (
                <>
                    {pages && pages.length > 0 ? (
                        <Box mt="3em">
                            <CountryFilter
                                countryList={countryList}
                                filterAlbums={filterAlbums}
                                isCountry={true}
                                type="stories"
                            />
                            <NewStoryList
                                stories={filteredAlbums || []}
                                isMobile={isTabletOrMobile}
                                isStoriesLoading={false}
                                refetch={() => getData(profile?.id)}
                            />
                        </Box>
                    ) : (
                        <Box>
                            <Text
                                mt={["5%", "2%"]}
                                mb={["5%", "2%"]}
                                w={["90%", "70%"]}
                                variant="subHeading"
                                whiteSpace={"pre-line"}
                                textAlign="center"
                            >
                                Create your First Postcard Page
                            </Text>
                            <Button
                                my="1em"
                                p="2em"
                                lineHeight="1.5em"
                                onClick={(e) =>
                                    setUploadImage({
                                        show: true,
                                        type: {
                                            unit: "%",
                                            width: 100,
                                            height: "400px",
                                            aspect: 1
                                        },
                                        multiple: false,
                                        callbackType: "pageCover",
                                        cropImage: true
                                    })
                                }
                            >
                                {" "}
                                Upload a Cover Image
                            </Button>
                            {uploadImage.show && (
                                <ImageUpload
                                    openFile={uploadImage.show}
                                    cropImage={uploadImage.cropImage}
                                    cropType={uploadImage.type}
                                    multiple={uploadImage.multiple}
                                    callbackType={uploadImage.callbackType}
                                    resetUpload={() => setUploadImage(false)}
                                    callBackOnUpload={(
                                        callbackType,
                                        croppedImage
                                    ) => {
                                        setLoading(true);
                                        createPage(callbackType, croppedImage);
                                    }}
                                />
                            )}
                        </Box>
                    )}
                </>
            )}
        </Box>
    );
};
export default MyPages;
