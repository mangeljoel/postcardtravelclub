/* eslint-disable import/no-anonymous-default-export */
export default {
    title: "Postcard Travel Club",
    description:
        "Join a global membership community of mindful travellers and receive extraordinary rewards for travelling mindfully and promoting responsible tourism",
    image: "https://images.postcard.travel/postcardv2/seo_Image_ba094dfc06.jpg",
    url: "https://postcard.travel",
    openGraph: {
        type: "website",
        locale: "en_IE",
        url: "https://postcard.travel/",
        site_name: "Postcard Travel Club",
        images: [
            {
                url: "https://images.postcard.travel/postcardv2/seo_Image_ba094dfc06.jpg",

                alt: "Og Image Alt"
            }
        ]
    },
    twitter: {
        handle: "@handle",
        site: "Postcard Travel Club",
        cardType: "summary_large_image"
    }
};

export const getTravelStorySeoValues = (seoData) => {
    let returnData = {
        title:
            seoData.name ?? "Postcard Travel - Mindful Travel & Storytelling!",
        description:
            seoData.intro ?? "Postcard Travel - Mindful Travel & Storytelling!",
        url: seoData.slug
            ? "https://www.postcard.travel/postcards/" + seoData.slug
            : "https://www.postcard.travel",
        image:
            seoData.coverImage?.url ??
            "https://www.postcard.travel/assets/images/p_stamp.png"
    };
    return returnData;
};
