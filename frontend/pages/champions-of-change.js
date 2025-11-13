/* eslint-disable prettier/prettier */
import MembersPage from "../src/features/MembersPage";
import SEOContainer from "../src/features/SEOContainer";
import { fetchPaginatedResults } from "../src/queries/strapiQueries";
import {
  apiNames,
  filterForPartners,
  populatePartnerData,
} from "../src/services/fetchApIDataSchema";

const Members = ({ data }) => {
  const getSeoValues = () => {
    let seoData = {
      title: "Champions of Change",
      description:
        "Join an inclusive community of conscious travellers, travel designers, storytellers, and boutique stays that are shaping the furure of travel.",
      url: "https://www.postcard.travel/champions-of-change",
      image: "/assets/images/p_stamp.png",
      keywords: "Postcard Partners, " + data?.map((partner) => partner.fullName).join(", "),
    };
    return seoData;
  };
  return (
    <div>
      <SEOContainer seoData={getSeoValues()} />
      <MembersPage members={data} />
    </div>
  );
};

export default Members;

export async function getStaticProps({ params, preview = null }) {
  const data = await fetchPaginatedResults(
    apiNames.user,
    filterForPartners,
    populatePartnerData
  );

  return {
    props: {
      preview,
      data,
      revalidate: 300,
    },
  };
}
