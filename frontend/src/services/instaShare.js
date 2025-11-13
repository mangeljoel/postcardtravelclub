let errorMessage = "";
export const shareOnInsta = async (
    facebookUserAccessToken,
    imageurl,
    description,
    onSuccessInstaShare
) => {
    const facebookPages = await getFacebookPages(
        facebookUserAccessToken,
        onSuccessInstaShare
    );
    const instagramAccountId = await getInstagramAccountId(
        facebookPages[0]?.id,
        facebookUserAccessToken,
        onSuccessInstaShare
    );
    const mediaObjectContainerId = await createMediaObjectContainer(
        facebookUserAccessToken,
        instagramAccountId,
        imageurl,
        description
    );

    await publishMediaObjectContainer(
        facebookUserAccessToken,
        instagramAccountId,
        mediaObjectContainerId,
        onSuccessInstaShare
    );
};
const getFacebookPages = (facebookUserAccessToken, onSuccessInstaShare) => {
    return new Promise((resolve) => {
        window.FB.api(
            "me/accounts",
            { access_token: facebookUserAccessToken },
            (response) => {
                if (response) resolve(response.data);
                else onSuccessInstaShare("no page linked");
            }
        );
    });
};

const getInstagramAccountId = (
    facebookPageId,
    facebookUserAccessToken,
    onSuccessInstaShare
) => {
    return new Promise((resolve) => {
        if (facebookPageId) {
            window.FB.api(
                facebookPageId,
                {
                    access_token: facebookUserAccessToken,
                    fields: "instagram_business_account"
                },
                (response) => {
                    if (response && response.instagram_business_account)
                        resolve(response.instagram_business_account.id);
                    else
                        onSuccessInstaShare(
                            "Please link proper instagram business account"
                        );
                }
            );
        } else {
            onSuccessInstaShare("signIn");
        }
    });
};

const createMediaObjectContainer = (
    facebookUserAccessToken,
    instagramAccountId,
    imageurl,
    description
) => {
    return new Promise((resolve) => {
        window.FB.api(
            `${instagramAccountId}/media`,
            "POST",
            {
                access_token: facebookUserAccessToken,
                image_url: imageurl,
                caption: description
            },
            (response) => {
                if (!response.id) {
                    errorMessage = response.error.message;
                }
                resolve(response.id);
            }
        );
    });
};

const publishMediaObjectContainer = (
    facebookUserAccessToken,
    instagramAccountId,
    mediaObjectContainerId,
    onSuccessInstaShare
) => {
    return new Promise((resolve) => {
        window.FB.api(
            `${instagramAccountId}/media_publish`,
            "POST",
            {
                access_token: facebookUserAccessToken,
                creation_id: mediaObjectContainerId
            },
            (response) => {
                resolve(response.id);
                var resMessage = response.id ? null : errorMessage;
                onSuccessInstaShare(resMessage);
            }
        );
    });
};
