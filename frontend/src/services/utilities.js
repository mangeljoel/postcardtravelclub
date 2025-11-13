import * as uuid from "uuid";
import strapi from "../queries/strapi";
import {
    getCountryByName,
    postCountry,
    getCityByName,
    postCity,
    getCountries,
    getPostcardsByUser,
    updateSignup,
    fetchPaginatedResults,
    createDBEntry,
    addBookMark,
    deleteBookMark,
    deleteDBEntry
} from "../queries/strapiQueries";
import {
    apiNames,
    populateAlbumData,
    populatePostcardData
} from "./fetchApIDataSchema";
import { useContext, useState } from "react";
import loadImage from "blueimp-load-image";
import axios from "axios";

export const constants = {
    fetchLimit: 30,
    maxDataToFetch: 1000
};
import { createStandaloneToast } from "@chakra-ui/react";
import AppContext from "../features/AppContext";
import * as ga from "./googleAnalytics";
const { toast } = createStandaloneToast();

export const uploadfile = (base64, refId, refApi, refField, data, callback) => {
    const reader = new FileReader();
    reader.readAsDataURL(base64);
    reader.onload = (e) => {
        const base64Data = reader.result.toString().split(",");
        const byteString =
            base64Data[0].indexOf("base64") >= 0
                ? atob(base64Data[1])
                : decodeURI(base64Data[1]);
        const mimeString = base64Data[0].split(":")[1].split(";")[0];
        const ia = new Uint8Array(byteString.length);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ia], { type: mimeString });
        const form = new FormData();
        let method = "POST";
        if (!refId) {
            //create new entry
            form.append(`files.${refField}`, blob, uuid.v4() + ".jpg");

            form.append("data", JSON.stringify(data));
        } else {
            refApi = refApi + "/" + refId;
            method = "PUT";
            form.append(`files.${refField}`, blob, uuid.v4() + ".jpg");
            form.append("data", JSON.stringify(data));
        }
        fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/${refApi}`, {
            method: method,
            headers: new Headers({
                Authorization: "Bearer " + strapi.getToken()
                // "Content-Type": "multippart/form-data"
            }),
            body: form
        })
            .then((response) => response.json())
            .then((result) => {
                callback(result);
                //console.log("Success:", result);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };
};
export const getBlobFile = (base64) => {
    const reader = new FileReader();
    reader.readAsDataURL(base64);
    reader.onload = (e) => {
        const base64Data = reader.result.toString().split(",");
        const byteString =
            base64Data[0].indexOf("base64") >= 0
                ? atob(base64Data[1])
                : decodeURI(base64Data[1]);
        const mimeString = base64Data[0].split(":")[1].split(";")[0];
        const ia = new Uint8Array(byteString.length);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ia], { type: mimeString });
        return blob;
    };
};
export const ApiUpload = (base64, refId, refApi, refField, callback) => {
    const reader = new FileReader();
    reader.readAsDataURL(base64);
    reader.onload = (e) => {
        const base64Data = reader.result.toString().split(",");
        const byteString =
            base64Data[0].indexOf("base64") >= 0
                ? atob(base64Data[1])
                : decodeURI(base64Data[1]);
        const mimeString = base64Data[0].split(":")[1].split(";")[0];
        const ia = new Uint8Array(byteString.length);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ia], { type: mimeString });
        const form = new FormData();
        form.append("files", blob, uuid.v4() + ".jpg");
        form.append("ref", refApi);
        form.append("refId", "" + refId);
        form.append("field", refField);
        fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/upload`, {
            method: "POST",
            body: form
        })
            .then((response) => response.json())
            .then((result) => {
                callback(result);
                // console.log("Success:", result);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };
};
export const uploadImages = async (files) => {
    const results = await Promise.all(
        files.map(
            (file) =>
                new Promise((resolve, reject) => {
                    getUrlOfUploadImage(
                        file,
                        (image) => resolve(image), // callback resolves with image
                        "", // caption (optional)
                        (progress) => {
                            console.log(`${file.name}: ${progress}%`);
                        }
                    );
                })
        )
    );
    return results;
};

export const getStoryCategories = async (storyCat, categories) => {
    let result = [];
    categories?.map((cat) => {
        if (storyCat) {
            let exist = storyCat.find(
                (storycat) => storycat.toString() === cat.id
            );
            if (exist) {
                result.push(cat);
            }
        }
    });
    return result;
};

export const isOwnStory = (profile, storyProfile) => {
    if (profile && profile.id && storyProfile && storyProfile.id) {
        if (storyProfile?.id.toString() === profile?.id.toString()) return true;
        else return false;
    } else return false;
};

export const getPlaceDetails = (place) => {
    const compIsType = (t, s) => {
        for (let z = 0; z < t.length; ++z) if (t[z] == s) return true;

        return false;
    };
    ////console.log(" from google auto complete place===>",place);
    let poi = {
        lat: null,
        lng: null,
        country: null,
        city: null
    };
    let state = null;
    if (place.geometry !== undefined) {
        const plcGeom = place.geometry;
        if (plcGeom.location !== undefined) {
            poi.lat = plcGeom.location ? plcGeom.location.lat() : "";
            poi.lng = plcGeom.location ? plcGeom.location.lng() : "";
        }
    }

    if (place.address_components !== undefined) {
        let addrComp = place.address_components;
        for (let i = 0; i < addrComp.length; ++i) {
            var typ = addrComp[i].types;
            if (compIsType(typ, "administrative_area_level_1"))
                state = addrComp[i].long_name;
            //store the state
            else if (compIsType(typ, "locality"))
                poi.city = addrComp[i].long_name;
            //store the city
            else if (compIsType(typ, "country"))
                poi.country = addrComp[i].long_name; //store the country
            //we can break early if we find all three data
            if (poi.city != null && poi.country != null) return poi;
        }
    }
    return poi;
};

export const getCountryCodeAndCityCode = async (item) => {
    let rcountry = -1;
    let rcity = -1;
    if (!item) {
        rcountry = null;
        rcity = null;
        return { rcountry, rcity };
    }

    const countries = await getCountryByName(item.country);
    const selectedCountry = countries.find(
        (element) => element.Name === item.country
    );
    if (selectedCountry) {
        rcountry = selectedCountry.id;
    } else {
        const countryData = {
            Name: item.country,
            code: item.country
        };
        const savedCountry = await postCountry(countryData);
        rcountry = savedCountry.id;
    }

    const cities = await getCityByName(rcountry, item.city);
    const selectedCity = cities.find((element) => element.Name === item.city);
    if (selectedCity) {
        rcity = selectedCity.id;
    } else {
        const cityData = {
            Name: item.city,
            rcountry
        };
        const savedCity = await postCity(cityData);
        rcity = savedCity.id;
    }
    return { rcountry, rcity };
};

export const getCountryCode = async (countryName) => {
    let rcountry = -1;
    if (!countryName) {
        return null;
    }

    const countries = await getCountryByName(countryName);
    const selectedCountry = countries.find(
        (element) => element.Name === countryName
    );
    if (selectedCountry) {
        return selectedCountry.id;
    } else {
        const countryData = {
            Name: countryName,
            code: countryName
        };
        const savedCountry = await postCountry(countryData);
        return savedCountry.id;
    }
};
export const myLoader = ({ src }) => {
    return `https://images.postcard.travel${src}`;
};

export const slugify = (str) => {
    str = str.replace(/^\s+|\s+$/g, ""); // trim
    str = str.toLowerCase();
    str = str
        .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
        .replace(/\s+/g, "-") // collapse whitespace and replace by -
        .replace(/-+/g, "-"); // collapse dashes

    return str + Math.random().toString(10).substr(2, 3);
};
export const getProfileSlug = (profile) => {
    if (profile && profile.user_type?.name === "Tour Operators")
        return "/" + profile?.slug;
    else if (
        profile &&
        profile.user_type?.name === "StoryTeller" &&
        profile?.lead
    )
        return "/" + profile?.lead?.slug;
    else if (profile && profile.user_type?.name === "Hotels")
        return "/" + profile?.slug;
    else if (profile) return "/" + profile?.slug;
    else if (!profile) return "/";
    else return "/";
};
export const getCountryList = async () => {
    return await getCountries();
};

export const getFounderStory = async (profileId) => {
    let card = await getPostcardsByUser({ filters: { user: profileId } });
    if (card && card.length > 0)
        return card.filter((item) => item.isFounderStory);
};
export const getHomePagePostcards = async () => {
    //let
    let data = [];
    try {
        let res = await strapi.find("postcards", {
            filters: {
                album: { isFeatured: true },
                isComplete: true
            },
            populate: {
                coverImage: { fields: ["url"] },
                user: {
                    fields: ["fullName", "slug"],
                    populate: ["company", "social"]
                },
                bookmarks: {
                    populate: {
                        user: {
                            fields: ["fullName", "slug"],
                            populate: {
                                profilePic: {
                                    fields: ["url"]
                                }
                            }
                        }
                    }
                },
                album: {
                    fields: ["slug", "name", "website", "signature"],
                    populate: {
                        company: {
                            fields: ["name"]
                        }
                    }
                },
                country: { fields: ["name", "continent"] },
                tags: { fields: ["name"] }
            },
            sort: "updatedAt:DESC",
            pagination: {
                limit: 6
            }
        });
        if (res?.meta) {
            data.push(res.data);
        }
        // pageNo++;
        data = data.flat();
        // Pass data to the page via props
    } catch (err) {
        //console.log(err);
    }
    return data;
};
export const getUpcomingAlbums = async () => {
    let data = [];
    try {
        let res = await strapi.find("albums", {
            filters: {
                isFeatured: true,
                isActive: false
            },
            populate: populateAlbumData,
            sort: "updatedAt:DESC"
        });
        if (res?.meta) {
            data.push(res.data);
        }
        // pageNo++;
        data = data.flat();
        // Pass data to the page via props
    } catch (err) {
        //console.log(err);
    }
    return data;
};

export const getHomePageAlbums = async () => {
    let data = [];
    try {
        let res = await strapi.find("albums", {
            filters: {
                isFeatured: true,
                isActive: true
            },
            populate: populateAlbumData,
            sort: "updatedAt:DESC"
        });
        if (res?.meta) {
            data.push(res.data);
        }
        // pageNo++;
        data = data.flat();
        // Pass data to the page via props
    } catch (err) {
        //console.log(err);
    }
    return data;
};

export const getCountryNameFromList = (listItems) => {
    let countries = [];
    listItems?.map((album) => {
        if (
            album?.country?.id &&
            countries.filter((e) => e.id === album.country.id).length == 0
        ) {
            countries.push(album.country);
        }
    });
    countries.sort((a, b) => a.name.localeCompare(b.name));

    return countries;
};
export const checkUserAvailability = async (email, updateData) => {
    localStorage.clear();

    let data = await strapi.find("users", { filters: { email: email } });

    if (data.length) {
        let res = await updateSignup({ email: email });

        return { ...res, title: "You are in!" };
    } else
        return {
            title: "Join the waitlist!",
            message: "You are not a registered user, please join the waitlist",
            toggle: true
        };
};
export const addToWaitList = async (email, updateData) => {
    localStorage.clear();
    let data = await strapi.find("users", { filters: { email: email } });

    if (data.length) {
        let res = await updateSignup({ email: email });

        return { ...res, title: "You are in!" };
    } else {
        let createData = await strapi.register(updateData);
        localStorage.clear();
        if (createData) {
            let res = await updateSignup({ email: email });
            return { ...res, title: "You are in!" };
        }
    }
};

export const sessionTimeOut = (toastMessage) => {
    toast({
        title: toastMessage.title,
        status: toastMessage.status,
        description: toastMessage.description,
        isClosable: true,
        duration: 2000,
        position: toastMessage.position
    });
    localStorage.clear();
};

export const getUrlOfUploadImage = async (
    file,
    callback,
    caption,
    onProgress = null
) => {
    const formData = new FormData();
    formData.append("files", file);
    if (caption) {
        formData.append("fileInfo", JSON.stringify({ caption }));
    }

    try {
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/upload`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                onUploadProgress: (progressEvent) => {
                    if (onProgress) {
                        const percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        onProgress(percentCompleted);
                    }
                }
            }
        );

        if (response.data && response.data[0]) {
            callback(response.data[0]);
        }
    } catch (error) {
        console.error("Upload error:", error);
    }
};

export const createEmptyStoryPage = async (profile, callback) => {
    if (profile) {
        await createDBEntry(apiNames.newsArticles, {
            creator: profile.id,
            published_at: null,
            status: "draft"
        }).then(async (res) => {
            if (res.data) {
                await createDBEntry(apiNames.album, {
                    user: profile?.id,
                    news_article: res.data?.id
                }).then((alb) => {
                    if (alb && alb.data) callback(res?.data?.id);
                });
            }
        });
    }
};
export const redirectToDashboard = async (profile, callback) => {
    if (profile && profile?.user_type?.name) {
        switch (profile?.user_type?.name) {
            case "Admin":
                callback("/storyteller/admin");
                break;
            case "SuperAdmin":
                callback("/storyteller/admin");
                break;
            case "EditorialAdmin":
                callback("/storyteller/mentor");
                break;
            case "EditorInChief":
                callback("/storyteller/eic");
                break;
            case "StoryTeller":
                callback("/storyteller/creator");
                break;
            default:
                callback("/");
                break;
        }
    }
};

export const addRemoveLikeBookmark = async (
    isLiked,
    likeId,
    userId,
    postcard,
    callback
) => {
    if (!isLiked) {
        const data = {
            user: userId,
            postcard: postcard?.id
        };
        addBookMark(data).then((response) => {
            ga.event({
                action: "click",
                category: "postcard_collected",
                label: "postcard_add_bookmark_click",
                value: 3
            });
            if (userId && postcard?.id) {
                createDBEntry("events", {
                    event_master: 3,
                    user: userId ? userId : null,
                    postcard: postcard?.id,
                    url: postcard?.slug ? "/postcards/" + postcard?.slug : "#"
                });
            }
            callback(response?.data);
        });
    } else {
        deleteBookMark(likeId).then((response) => {
            callback(response?.data);
        });
    }
};

export const addBacklinkEvent = async (userId, url, albumId, postcardId) => {
    if (url && (albumId || postcardId))
        createDBEntry("events", {
            event_master: 1,
            user: userId,
            url: url,
            album: albumId,
            postcard: postcardId
        });
};

export const addAlbumEvent = async (userId, url, albumId, postcardId) => {
    if (url && (albumId || postcardId))
        createDBEntry("events", {
            event_master: 2,
            user: userId,
            url: url,
            album: albumId,
            postcard: postcardId
        });
};

export const followUnfollowAlbum = async (
    isFollowed,
    followId,
    userId,
    albumId,
    callback
) => {
    if (!isFollowed) {
        const data = {
            follower: userId || null,
            album: albumId || null
        };
        createDBEntry("follow-albums", data).then((response) => {
            //create event FOLLOW_ALBUM
            if (userId)
                createDBEntry("events", {
                    event_master: 6,
                    user: userId,
                    album: albumId
                });
            callback(response?.data);
        });
    } else {
        followId &&
            deleteDBEntry("follow-albums", followId).then((response) => {
                callback(response?.data);
            });
    }
};
export const fixImageOrientation = (file) => {
    return new Promise((resolve, reject) => {
        loadImage(
            file,
            (canvas) => {
                if (canvas.type === "error") {
                    reject("Failed to fix orientation");
                } else {
                    canvas.toBlob((blob) => {
                        const correctedFile = new File([blob], file.name, {
                            type: blob.type,
                            lastModified: Date.now()
                        });
                        resolve(correctedFile);
                    }, file.type);
                }
            },
            { orientation: true, canvas: true }
        );
    });
};
export const transformFilterData = (data, keyLabels) => {
    const result = {};
    const sets = keyLabels.map(() => new Set());

    function traverse(obj, level = 0) {
        if (level >= keyLabels.length) return;

        if (Array.isArray(obj)) {
            obj.forEach((item) => {
                if (item !== "empty") {
                    sets[level].add(item);
                }
            });
            return;
        }

        if (typeof obj !== "object" || obj === null) return;

        for (const [key, value] of Object.entries(obj)) {
            if (key !== "empty") {
                sets[level].add(key);
            }
            traverse(value, level + 1);
        }
    }

    traverse(data);

    keyLabels.forEach((label, index) => {
        result[label] = Array.from(sets[index]);
    });

    return result;
};
