import HomePage1 from "../src/features/HomePage1";
import SEOContainer from "../src/features/SEOContainer";
import { getConfigs } from "../src/queries/strapiQueries";

const NewPage = ({ config = {} }) => {
  const getSeoData = () => {
    const seoData = {
      title:

        "Postcard Travel - Concierge",
      description:

        "Join an inclusive community of conscious travellers, travel designers, storytellers, and boutique stays that are shaping the furure of travel.",
      url: "https://www.postcard.travel/concierge",
      image: "/assets/images/p_stamp.png",
      keywords: "Concierge, Travel, Travel Community"
    };
    return seoData;
  };

  return (
    <div>
      <SEOContainer seoData={getSeoData()}>
      </SEOContainer>
      <HomePage1 />
    </div>
  );
};

export async function getStaticProps() {
  const configs = await getConfigs();

  return {
    props: {
      config: configs.data,
    },
  };
}

export default NewPage;
