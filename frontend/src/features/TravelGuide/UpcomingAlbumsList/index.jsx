import { useEffect, useState } from "react";
import { getUpcomingAlbums } from "../../../services/utilities";
import NewStoryList from "../NewStoryList";

const UpcomingAlbumList = ({
    upcomingAlbums,
    type,
    selectedCountry,
    ...props
}) => {
    return (
        upcomingAlbums?.length > 0 && (
            <NewStoryList
                title="Upcoming..."
                stories={upcomingAlbums || []}
                isStoriesLoading={false}
                isHotel={true}
                {...props}
                //px={["5vw", "10vw"]}
            />
        )
    );
};

export default UpcomingAlbumList;
