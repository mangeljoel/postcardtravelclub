import React, { useContext, useEffect, useMemo, useState } from 'react'
import EditExpertPage from '../../src/features/DestinationExpert/EditExpertPage'
import AppContext from '../../src/features/AppContext'
import { createDBEntry, fetchPaginatedResults } from '../../src/queries/strapiQueries'
import LoadingGif from "../../src/patterns/LoadingGif";
import { useRouter } from 'next/navigation';
import { Flex, Text } from '@chakra-ui/react';
import LandingPage from '../../src/features/DestinationExpert/LandingPage';
import SEOContainer from '../../src/features/SEOContainer';

const index = (post) => {
    const getSeoValues = () => {
        let seoData = {
            title: "Postcard Destination Experts ",
            description: "Discover a collection of conscious luxury properties that curate immersive experiences and advance responsible tourism.",
            url: "https://www.postcard.travel/destination-experts",
            image: "/assets/images/stays.jpg",
            keywords: "Postcard Destination Experts,Destination Experts",
        };
        return seoData;
    };
    return (
        <div>
            <SEOContainer seoData={getSeoValues()} />
            <LandingPage destinationExperts={Array.isArray(post?.post) ? post?.post : [post?.post]} />
        </div>
    )
}

export default index;
export async function getStaticProps({ params, preview = null }) {
    let data = null;
    try {
        data = await fetchPaginatedResults("destination-experts",
            { status: "published" },
            {
                coverImage: true,
                user: {
                    populate: {
                        company: {
                            fields: ["id", "name", "icon"],
                            populate: { icon: true }
                        },
                    }
                },
                founderMessage: {
                    populate: { founderImage: true }
                },
                country: true

            })

        // console.log(data,"****");
        // Pass data to the page via props
    } catch (err) {
        //console.log(err);
    }
    return {
        props: {
            preview,
            post: data,
        },
        revalidate: 300,
    };
}
