import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

const Carousel = ({ children }) => {
    var settings = {
        centerMode: true,
        // className: "center",
        centerPadding: "0",
        swipeToSlide: true,
        infinite: true,
        slidesToShow: 3,
        arrows: true,
        dots: true,
        responsive: [
            {
                breakpoint: 480, // mobile breakpoint
                settings: {
                    centerPadding: "60px",
                    centerMode: true,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    arrows: false
                }
            }
        ]
    };
    return (
        <Slider {...settings}>
            {children.map((child) => {
                return child;
            })}
        </Slider>
    );
};
export default Carousel;
