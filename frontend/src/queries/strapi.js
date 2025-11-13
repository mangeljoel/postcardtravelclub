import Strapi from "strapi-sdk-js";

const strapi = new Strapi({
    url: `${process.env.NEXT_PUBLIC_STRAPI_API_URL}`,
    store: {
        key: "strapi_jwt",
        useLocalStorage: true,
        cookieOptions: { path: "/" }
    },
    axiosOptions: {}
});
strapi.axios.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const { status } = error.response;
        switch (status) {
            case 401: {
                localStorage.setItem("unAuthorizedUser", true);
                window.dispatchEvent(new Event("storage"));
                window.location.reload();

                break;
            }
            case 403: {
                localStorage.setItem("unAuthorizedUser", true);
                window.dispatchEvent(new Event("storage"));
                window.location.reload();

                break;
            }
            default:
                break;
        }
        return Promise.reject(error);
    }
);

export default strapi;
