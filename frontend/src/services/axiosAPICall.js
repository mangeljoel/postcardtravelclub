import axios from "axios";

export const axiosAPICall = (method, url, callback) => {
    const options = {
        method: method,
        url: url,
        headers: {
            "Content-Type": "application/json",
            Authorization:
                "Bearer eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2F1dGguY2FsZW5kbHkuY29tIiwiaWF0IjoxNjM5MTIxNDUxLCJqdGkiOiJlYmFmZjI1MS0zODA5LTRmMWUtODgxMS04OGZjM2JiNWMwMjgiLCJ1c2VyX3V1aWQiOiJIQkNEM0lQRk1XRUNGVEVWIn0.1U5cPQ6Ba3IMNAyUkA8jJx91C9oMW1Rn8mrXNLde3a8"
        }
    };

    axios
        .request(options)
        .then(function (response) {
            callback(response.data);
            //console.log(response.data);
        })
        .catch(function (error) {
            console.error(error);
        });
};
