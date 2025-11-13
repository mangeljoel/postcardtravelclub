import { NextSeo } from "next-seo";
import Head from "next/head";

const SEOContainer = ({ seoData }) => {
    const globalKeywords = "Postcard Travel Club, Conscious Luxury Travel, Conscious Luxury, Conscious Luxury Lifestyle"

    return (
        seoData && (
            <>
                <Head>
                    <meta name="keywords" content={seoData?.keywords ? globalKeywords + ", " + seoData.keywords : globalKeywords} />
                </Head>
                <NextSeo
                    title={seoData.title}
                    description={seoData.description}
                    url={seoData.url}
                    canonical={seoData.url}
                    image={seoData.image}
                    openGraph={{
                        url: seoData.url,
                        title: seoData.title,
                        description: seoData.description,
                        images: [
                            {
                                url: seoData.image,
                                alt: "Og Image Alt"
                            }
                        ],
                        site_name: seoData.title
                    }}
                    twitter={{
                        handle: "@handle",
                        site: seoData.title,
                        cardType: "summary_large_image"
                    }}
                />
            </>
        )
    );
};
export default SEOContainer;