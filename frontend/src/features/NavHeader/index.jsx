import React, { useState, useContext, useEffect } from "react";
import AppContext from "../AppContext";
import { useRouter } from "next/router";
import PostcardModal from "../PostcardModal";
import { Flex } from "@chakra-ui/react";
import * as ga from "../../services/googleAnalytics";
import NavHeaderDesktop from "./NavHeaderDesktop";
import NavHeaderMobile from "./NavHeaderMobile";
import ExecutionEnvironment from "exenv";
import {
    createEmptyStoryPage,
    redirectToDashboard
} from "../../services/utilities";
import { useSignupModal } from "../SignupModalContext";

const NavHeader = ({ fontcolor }) => {
    const { openLoginModal, openSignUpModal } = useSignupModal()
    const {
        profile,
        setProfile,
        ourStorySecs,
        featuredCountries,
        isUserLoggedIn
    } = useContext(AppContext);

    const isLoggedIn = isUserLoggedIn();

    const router = useRouter();

    const NAV_ITEMS = [
        // { label: "Wanderlust", href: "/wanderlust" },
        { label: "Things to Do", href: "/experiences" },
        { label: "Places to Stay", href: "/stays" },
        { label: "Destination Experts", href: "/destination-experts" },
        { label: "Travel Concierge", href: "/concierge" },
        // { label: "F&B", href: "/food-and-beverages" },
        // { label: "City Guide", href: "/cityguide" },

        // { label: "Shopping", href: "/shopping" },
        // { label: "Tours", href: "/tours" },

        {
            primary: profile
                ? [
                    ...(profile.user_type &&
                        profile.user_type?.name == "Hotels"
                        ? [
                            {
                                label: "My Pages",
                                onClick: () => {
                                    router.push("/my-pages");
                                }
                            }
                        ]
                        : []),
                    ...(profile.user_type &&
                        [
                            "Admin",
                            "SuperAdmin",
                            "EditorialAdmin",
                            "EditorInChief",
                            "StoryTeller"
                        ].includes(profile.user_type?.name)
                        ? [
                            {
                                label: "Editorial Dashboard",
                                onClick: () => {
                                    redirectToDashboard(profile, (path) => {
                                        router.push(path);
                                    });
                                }
                            }
                        ]
                        : []),
                    ...(profile.user_type && [
                        "Admin",
                        "SuperAdmin",
                        // "DestinationExpert"
                    ].includes(profile.user_type?.name)
                        ? [
                            {
                                label: "DX Dashboard",
                                onClick: () => {
                                    router.push(`/destination-experts/admin`);
                                }
                            }
                        ]
                        : []),
                    ...(profile.user_type && [
                        "Admin",
                        "SuperAdmin",
                        "DestinationExpert"
                    ].includes(profile.user_type?.name)
                        ? [
                            {
                                label: "Deck Dashboard",
                                onClick: () => {
                                    router.push(`/postcard-deck/admin`);
                                }
                            }
                        ]
                        : []),
                    ...(profile.user_type &&
                        ["Admin", "SuperAdmin", "Hotels"].includes(
                            profile.user_type?.name
                        )
                        ? [
                            {
                                label: "Analytics",
                                onClick: () => {
                                    router.push(`/postcard-analytics`);
                                }
                            }
                        ]
                        : []),
                    //   {
                    //       label: "Concierge",
                    //       onClick: () => {
                    //           router.push(`/concierge`);
                    //       }
                    //   },
                    //   {
                    //       label: "Billing",
                    //       onClick: () => {
                    //           router.push(`/billing`);
                    //       }
                    //   },
                    // {
                    //     label: "My Collection",
                    //     onClick: () => {
                    //         //   if (
                    //         //       profile &&
                    //         //       profile.slug &&
                    //         //       profile.firstName &&
                    //         //       profile.firstName !== "" &&
                    //         //       profile.lastName &&
                    //         //       profile.lastName !== ""
                    //         //   ) {
                    //         router.push(`/${profile?.slug}`);
                    //         //   } else router.push("/edit-profile");
                    //     }
                    // },
                    // ...(profile.user_type && profile.user_type?.name === "DestinationExpert"
                    //     // ...(profile
                    //     ? [
                    //         {
                    //             label: "Destination Expert",
                    //             onClick: () => {
                    //                 router.push(`/destination-experts`);
                    //             }
                    //         }
                    //     ]
                    //     : []),
                    {
                        label: "Sign Out",
                        onClick: () => {
                            itemClicked("LOGOUT", "/");
                        },
                        borderWidth: "2px",
                        borderRadius: "8px",
                        my: 3
                    }
                ]
                : []
        }
    ];

    const itemClicked = (title, path) => {
        if (title === "LOGOUT") {
            setProfile(null);
            localStorage.clear();
            // router.push("/");
        } else {
            if (path.startsWith("http")) {
                window.open(path, "_blank");
            } else {
                router.push(path);
            }
        }
    };

    return (
        <Flex
            pos={fontcolor === "white" ? "absolute" : "relative"}
            top={0}
            zIndex={100}
            w="100%"
            justifyContent={["flex-start", "space-between"]}
        >
            <Flex display={{ base: "flex", sm: "none" }} width={"100%"}>
                <NavHeaderMobile
                    isLoggedIn={profile ? true : false}
                    profile={profile}
                    fontcolor={fontcolor}
                    // menuBoxItems={menuBoxItems}
                    NAV_ITEMS={NAV_ITEMS}
                    itemClicked={itemClicked}
                    onClick={(mode) => {
                        if (mode == "login") openLoginModal()
                        else openSignUpModal()
                        // if (ExecutionEnvironment.canUseDOM) {
                        //     ga.event({
                        //         action: "click",
                        //         category:
                        //             mode === "login" ? "Sign in" : "signup",
                        //         label:
                        //             mode === "login"
                        //                 ? "signin_popup_click"
                        //                 : "signup_popup_click",
                        //         value: 2
                        //     });
                        // }
                    }}
                />
            </Flex>
            <Flex display={{ base: "none", sm: "flex" }}>
                <NavHeaderDesktop
                    isLoggedIn={profile ? true : false}
                    profile={profile}
                    fontcolor={fontcolor}
                    NAV_ITEMS={NAV_ITEMS}
                    itemClicked={itemClicked}
                    onClick={(mode) => {
                        if (mode == "login") openLoginModal()
                        else openSignUpModal()
                        // ga.event({
                        //     action: "click",
                        //     category: mode === "login" ? "Sign in" : "signup",
                        //     label:
                        //         mode === "login"
                        //             ? "signin_popup_click"
                        //             : "signup_popup_click",
                        //     value: 2
                        // });
                    }}
                />
            </Flex>
        </Flex>
    );
};

export default NavHeader;
