import Experiences from "../src/features/Experiences";
import SEOContainer from "../src/features/SEOContainer";

const ImmersiveExperiences = () => {
  const getSeoValues = () => {
    let seoData = {
      title: "Postcard Wanderlust",
      description:
        "Discover inspiration for your next adventure with boutique brands that offer immersive experiences and advance responsible tourism.",
      url: "https://www.postcard.travel/wanderlust",
      image: "/assets/images/p_stamp.png",
    };
    return seoData;
  };
  return (
    <div>
      <SEOContainer seoData={getSeoValues()} />
      <Experiences
        type="experiences"
        isSearch={true}
        description={"Boutique Luxury Travel Research Made Fast, Fun & Easy!"}
        title={"POSTCARD SEARCH"}
      />
    </div>
  );
};

export default ImmersiveExperiences;
