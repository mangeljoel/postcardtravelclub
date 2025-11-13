import { Box } from "@chakra-ui/react";
import {
    des,
    description,
    flipperContainer,
    is_bottom_overflowing,
    is_top_overflowing
} from "./index.module.scss";
const FadeTextOnScroll = (props) => {
    const { children, indexId, ...restProps } = props;
    const handleScroll = (el) => {
        const isScrollable = el.scrollHeight > el.clientHeight;

        if (!isScrollable) {
            el.classList.remove("is-bottom-overflowing", "is-top-overflowing");
            return;
        }

        const isScrolledToBottom =
            el.scrollHeight <= Math.ceil(el.clientHeight + el.scrollTop);
        const isScroledlToTop = el.scrollTop === 0;
        el.classList.toggle(is_bottom_overflowing, !isScrolledToBottom);
        el.classList.toggle(is_top_overflowing, !isScroledlToTop);
        //console.log(e);

        //debouncedScrollHandler();
    };
    return (
        <Box
            className={`${description} ${des}`}
            id={"contentscroll" + indexId}
            height={"100%"}
            onScroll={(e) => {
                let el = e.currentTarget;
                handleScroll(el);
            }}
            style={{
                whiteSpace: "pre-line"
                // overflow: ""
            }}
            {...restProps}
        >
            {children}
        </Box>
    );
};
export default FadeTextOnScroll;
