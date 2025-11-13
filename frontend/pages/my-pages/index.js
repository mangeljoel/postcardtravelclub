import MyPages from "../../src/features/MyPages";
import SEOContainer from "../../src/features/SEOContainer";
import strapi from "../../src/queries/strapi";

const MyPage = () => {
    const getSeoValues = () => {
        let seoData = {
            title: "My Pages",
            description:"Discover local stories from a global collection of mindful tours and connect with the companies behind them to learn more or personalise your trip.",
            url: "https://www.postcard.travel/my-pages",
            image:"https://images.postcard.travel/images/profilepic.jpg",
        };
        return seoData;
    };
    //console.log(post);
    return (
        <>
            <SEOContainer seoData={getSeoValues()} />
            <MyPages/>
        </>
    );
};

export default MyPage;

