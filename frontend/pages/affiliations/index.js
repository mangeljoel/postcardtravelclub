/* eslint-disable prettier/prettier */
import MembersPage from "../../src/features/MembersPage";
import SEOContainer from "../../src/features/SEOContainer";
import { fetchPaginatedResults } from "../../src/queries/strapiQueries";
import {
    apiNames,
    filterForPartners,
} from "../../src/services/fetchApIDataSchema";

const Members = ({ data }) => {
    const getSeoValues = () => {
        let seoData = {
            title: "Affiliations",
            description:
                "Join an inclusive community of conscious travellers, travel designers, storytellers, and boutique stays that are shaping the furure of travel.",
            url: "https://www.postcard.travel/affiliations",
            image: "/assets/images/p_stamp.png",
            keywords: "Postcard Affiliations " ,
        };
        return seoData;
    };
    return (
        <div>
            <SEOContainer seoData={getSeoValues()} />
            <MembersPage members={Array.isArray(data) ? data : [data]} isAffiliation={true} />
        </div>
    );
};

export default Members;

export async function getStaticProps({ params, preview = null }) {
    let data = await fetchPaginatedResults(
        apiNames.affiliation,
        {},
        {
            companies: { fields: ["name", "slug"] },
            logo: { fields: ["url"] },
        }
    );
    data = Array.isArray(data) ? data : [data]

    return {
        props: {
            preview,
            data,
        },
        revalidate: 300,
    };
}