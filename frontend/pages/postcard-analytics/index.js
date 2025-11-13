import SEOContainer from "../../src/features/SEOContainer";
import AnalyticsDashboard from "../../src/features/PostcardAnalytics/AnalyticsDashboard";

const Analytics = () => {
  const getSeoValues = () => {
    let seoData = {
      title: "Postcard Analytics",
      description:
        "Discover inspiration for your next adventure with boutique brands that offer immersive experiences and advance responsible tourism.",
      url: "https://www.postcard.travel/postcard-analytics",
      image: "/assets/images/p_stamp.png",
    };
    return seoData;
  };

  return (
    <>
      <SEOContainer seoData={getSeoValues()} />
      <AnalyticsDashboard />
    </>
  );
};

export default Analytics;
