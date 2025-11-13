import React, { useState, useEffect } from "react";
import strapi from "../../queries/strapi.js";
import * as ga from "../../services/googleAnalytics";
import {
    createDBEntry,
    getExpertbyUserLink,
    updateDBValue
} from "../../queries/strapiQueries";
import { useToast } from "@chakra-ui/react";
import { slugify } from "../../services/utilities.js";
import ProfileFormPopup from "../ProfileFormPopup/index.jsx";
import axios from "axios";
import { useRouter } from "next/router.js";

const AppContext = React.createContext({});
export function useMediaQuery(mediaQueryString) {
    const [matches, setMatches] = useState(null);

    useEffect(() => {
        const mediaQueryList = window.matchMedia(mediaQueryString);
        const listener = () => setMatches(!!mediaQueryList.matches);
        listener();
        mediaQueryList.addListener(listener);
        return () => mediaQueryList.removeListener(listener);
    }, [mediaQueryString]);

    return matches;
}

export const AppContextContainer = ({ children }) => {
    const [profile, setProfile] = useState(null);
    const [firstLoad, setFirstLoad] = useState([]);
    const [featuredAlbums, setFeaturedAlbums] = useState([])
    const [featuredPostcards, setFeaturedPostcards] = useState([])
    const [maxFeaturedCount, setMaxFeaturedCount] = useState(null)
    const [showProfilePopup, setShowProfilePopup] = useState(false)
    const router = useRouter();

    const toast = useToast();
    const handleSessionTimeOut = (showMessage) => {
        setProfile(null);
        localStorage.clear();
        toast({ ...showMessage });
    };

    const fetchFeaturedItems = async () => {
        const { data } = await strapi.find("config", {
            fields: ["maxFeaturedPostcards", "maxFeaturedAlbums"],
            populate: {
                featuredPostcards: {
                    fields: ["id"]
                },
                featuredAlbums: {
                    fields: ["id"]
                }
            }
        });
        if (data) {
            const { maxFeaturedAlbums, maxFeaturedPostcards, featuredAlbums, featuredPostcards } = data
            setMaxFeaturedCount({ maxFeaturedAlbums, maxFeaturedPostcards })
            setFeaturedAlbums(featuredAlbums?.map(item => item.id) || []);
            setFeaturedPostcards(featuredPostcards?.map(item => item.id) || []);
        }
    }

    const updateFeaturedItems = async (type, id) => {
        if (type === "albums") {
            if (featuredAlbums.includes(id)) return;

            setFeaturedAlbums(prev => {
                const updated = [...prev];
                if (updated.length >= maxFeaturedCount?.maxFeaturedAlbums) {
                    updated.pop();
                }
                updated.unshift(id);

                // Update backend
                updateFeaturedInBackend("featuredAlbums", updated);
                return updated;
            });
        } else {
            if (featuredPostcards.includes(id)) return;

            setFeaturedPostcards(prev => {
                const updated = [...prev];
                if (updated.length >= maxFeaturedCount?.maxFeaturedPostcards) {
                    updated.pop();
                }
                updated.unshift(id);

                // Update backend
                updateFeaturedInBackend("featuredPostcards", updated);
                return updated;
            });
        }
    };

    const updateFeaturedInBackend = async (field, updatedArray) => {
        try {
            //  strapi.update("config", 1, {
            //     maxFeaturedPostcards: 4 // Directly store the array of IDs
            // });
            const form = new FormData();
            let method = "PUT";
            form.append("data", JSON.stringify({
                [field]: updatedArray
            }));
            await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/config`, {
                method: method,
                headers: new Headers({
                    Authorization: "Bearer " + strapi.getToken()
                }),
                body: form
            });

        } catch (error) {
            console.error(`Failed to update ${field} in backend:`, error);
        }
    };

    const handleSession = async () => {
        try {
            // Check if a valid session exists
            const existingSession = JSON.parse(localStorage.getItem("session"));
            // console.log("existingSession", existingSession);

            const { data: ipDetails } = await axios.get('https://apip.cc/json');
            const sessionData = {
                user: profile?.id,
                ipCountry: ipDetails?.CountryName,
                ipAddress: ipDetails?.query,
            };

            if (existingSession && existingSession.expiry > Date.now() && existingSession?.ipAddress === ipDetails?.query) {
                // Update existing session in Strapi
                await updateDBValue("sessions", existingSession.id, sessionData);
                // console.log("Updated existing session:", existingSession.id);
            } else {
                // Create new session in Strapi
                const response = await createDBEntry("sessions", sessionData);
                // console.log("New session created:", response);

                if (response?.data) {
                    localStorage.setItem("session", JSON.stringify({
                        id: response.data.id,
                        expiry: Date.now() + 10 * 60 * 1000, // 60 seconds expiry
                        ipAddress: ipDetails?.query,
                    }));
                }
            }
        } catch (error) {
            // console.error("Error handling session:", error);
        }
    };

    useEffect(() => {
        const initialGetData = async () => {
            const data = JSON.parse(localStorage.getItem("profile"));
            const checkAuthorization = localStorage.getItem("unAuthorizedUser");

            if (data) {
                getExpertbyUserLink(data?.slug).then((response) => setProfile(Array.isArray(response) ? response[0] : response))
            }
        };
        handleSession();
        initialGetData();
    }, []);

    useEffect(() => {
        if (profile?.user_type?.name == "Admin") {
            fetchFeaturedItems();
        }
        if (profile) {
            // if (!profile?.firstName || !profile?.lastName || !profile?.country) setShowProfilePopup(true)
            // else setShowProfilePopup(false)
            handleSession();
        }
    }, [profile])

    const updateUser = async (profile) => {
        let data = profile;
        if (!data && strapi.getToken()) data = await strapi.fetchUser();
        if (data) {
            localStorage.setItem("profile", JSON.stringify(data));
            setProfile(data);
        } else if (strapi.getToken()) logOut();
    };

    const handleProfile = (profile) => {
        setProfile(profile);
        // getProfileLikes({ ...profile });
        // getProfileInvitations({ ...profile });
        localStorage.setItem("profile", JSON.stringify(profile));
        // if (router.pathname == "/" && profile) {
        //     router.push(profile.slug);
        // }


        // if (!profile?.isReload && !profile?.isScheduler) {
        //     window.location.reload();
        // }
    };

    const CheckActiveProfile = (currentProfile) => {
        if (profile && profile.slug === currentProfile?.slug) return true;
        return false;
    };

    const isTabletOrMobile = useMediaQuery("(max-width: 640px)");
    const isTablet = useMediaQuery("(max-width: 1224px,min-width:640px)");
    const logOut = () => {
        setProfile(null);
        localStorage.clear();
        //router.push("/").then(() => {});
    };

    const callAuthService = async (provider, token, isSchedulerOpen, user) => {
        try {
            const respData = await strapi.authenticateProvider(provider, token);
            let userData = respData.user;
            if (!userData.firstName || !userData.lastName || !userData.slug) {
                const response = await fetch(
                    "https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const userInfo = await response.json();
                // console.log("userInfp", userInfo);
                let data = {
                    ...(!userData.firstName ? { firstName: userInfo.given_name } : {}),
                    ...(!userData.lastName ? { lastName: userInfo.family_name } : {}),
                    ...(!userData.slug ? { slug: slugify(userData.email) } : {})
                }
                await updateDBValue('users', userData.id, data).then(() => {
                    userData = {
                        ...userData,
                        ...data
                    }
                })
            }
            ga.event({
                action: "event",
                category: "existinguser_signin_success",
                label: "signin_success_google",
                value: 1
            });
            if (userData) {
                // if (isSchedulerOpen) userData.isScheduler = true;
                getExpertbyUserLink(userData?.slug).then((response) => handleProfile(Array.isArray(response) ? response[0] : response))
                // handleProfile(userData);
            }
        } catch (error) {
            //console.log(error);
        }
    };
    const isUserLoggedIn = () => {
        if (
            typeof window !== "undefined" &&
            typeof localStorage !== "undefined"
        ) {
            const profile = JSON.parse(localStorage.getItem("profile"));
            return profile !== null;
        }
        return false;
    };

    const callTokenLogin = async (respData, isSchedulerOpen) => {
        try {
            const userData = respData.user;
            if (userData) {
                // ga.event({
                //     action: "click",
                //     category: "current_user_signin_success",
                //     label: "signin_success",
                //     value: 3
                // });

                getExpertbyUserLink(userData?.slug).then((response) => handleProfile(Array.isArray(response) ? response[0] : response))
            }
        } catch (error) {
            //console.log(error);
            alert(error.toString());
        }
    };

    const canCreatePostcard = (newsArticle) => {
        if (profile &&
            (["EditorialAdmin", "EditorInChief", "Admin", "SuperAdmin"].includes(profile?.user_type?.name)
                || (profile?.user_type?.name == "StoryTeller" && newsArticle?.creator?.id == profile?.id))
        ) {
            // console.log(newsArticle)
            return true
        }
        return false
    }

    return (
        <AppContext.Provider
            value={{
                firstLoad,
                setFirstLoad,
                profile,
                setProfile: handleProfile,
                isTabletOrMobile,
                isTablet,
                isActiveProfile: CheckActiveProfile,
                isUserLoggedIn,
                canCreatePostcard,
                callAuthService,
                callTokenLogin,
                updateUser,
                logOut,
                handleSessionTimeOut,
                featuredPostcards,
                featuredAlbums,
                updateFeaturedItems,
            }}
        >
            {showProfilePopup && <ProfileFormPopup open={showProfilePopup} profile={profile} updateUser={updateUser} />}
            {children}
        </AppContext.Provider>
    );
};

export default AppContext;
