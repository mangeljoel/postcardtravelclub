export const defaultSort = "updatedAt:DESC";
export const populateConfigData = {
    sharedSeo: {
        populate: {
            metaImage: {
                fields: ["url"]
            }
        }
    }
};
export const populatePartnerData = {
    company: {
        follow_companies: {
            fields: ["id"]
        }
    }
};
export const populatePostcardData = {
    coverImage: { fields: ["url"] },
    user: {
        fields: ["fullName", "slug"],
        populate: ["company", "social"]
    },
    bookmarks: {
        populate: {
            user: {
                fields: ["fullName", "slug"],
                populate: {
                    profilePic: {
                        fields: ["url"]
                    }
                }
            }
        }
    },
    album: {
        fields: ["slug", "name", "website", "signature"],
        populate: {
            company: {
                fields: ["name"]
            },
            news_article: {
                fields: ["id", "status"],
                populate: {
                    creator: true
                }
            },
            region: { fields: ["name"] }
        }
    },
    country: { fields: ["name", "continent"] },
    tags: {
        fields: ["name"],
        populate: {
            tag_group: {
                fields: ["id", "name"]
            }
        }
    }
};
export const populateDirectoryData = {
    fields: ["label"],
    logo: {
        fields: ["url"]
    },

    albums: {
        filters: {
            intro: {
                $notNull: true
            },
            on_boarding: {
                // state: "approved"
            }
        },
        populate: {
            country: {
                fields: ["name"]
            },
            company: {
                fields: ["name"]
            },
            coverImage: { fields: ["url"] },
            on_boarding: { fields: ["state"] },
            postcards: {
                sort: "updatedAt:DESC",
                populate: {
                    coverImage: { fields: ["url"] },
                    user: {
                        fields: ["fullName", "slug"],
                        populate: ["company", "social"]
                    },
                    country: { fileds: ["name"] },
                    tags: { fields: ["name"] }
                }
            },
            user: { fields: ["slug", "fullName"], populate: ["social"] }
        },
        sort: "updatedAt:DESC"
    }
};
export const populateAlbumData = {
    coverImage: { fields: ["url"] },
    directories: true,
    cuisines: true,
    environment: true,
    news_article: {
        fields: ["id", "status", "title"],
        populate: {
            blog: { fields: ["content"] },
            assignto: { fields: ["id", "username", "fullname"] },
            creator: { fields: ["id", "username", "fullname"] },
            image: { fields: ["id", "url"] }
        }
    },
    // on_boarding: { fields: ["state"] },
    bestMonth: true,
    avgPricePerPerson: true,
    fixedDates: true,
    album_themes: true,
    user: { fields: ["slug"], populate: ["social"] },
    postcards: {
        sort: ["createdAt:desc"],
        populate: {
            coverImage: { fields: ["url"] },
            user: {
                fields: ["fullName", "slug"],
                populate: ["company", "social"]
            },
            country: { fields: ["name", "continent"] },
            tags: {
                fields: ["name"],
                populate: {
                    tag_group: {
                        fields: ["id", "name"]
                    }
                }
            },
            album: {
                fields: ["name", "slug", "website", "signature"],
                populate: {
                    region: { fields: ["name"] }
                }
            },
            bookmarks: {
                populate: {
                    user: {
                        fields: ["fullName", "slug"],
                        populate: {
                            profilePic: {
                                fields: ["url"]
                            }
                        }
                    }
                }
            }
        }
    },
    company: {
        fields: ["name"],
        populate: {
            affiliations: {
                populate: {
                    companies: { fields: ["name", "slug"] },
                    logo: { fields: ["url"] }
                }
            },
            icon: {
                populate: ["url"]
            }
        }
    },
    country: { fields: ["name"] },
    region: { fields: ["name"] },
    follow_albums: { populate: ["follower"] }
};
export const populateMinimalAlbumData = [
    "coverImage",
    "user",
    "postcards",
    "company",
    "country"
];
export const populateCompanyData = {
    fields: ["name"],

    affiliations: {
        fields: ["name"]
    }
};
export const podCastData = {
    preview: {
        poupulate: ["*"]
    }
};

export const populateEvents = {
    user: {
        populate: {
            profilePic: true
        }
    },
    event_master: true,
    postcard: {
        populate: {
            album: {
                populate: {
                    news_article: { populate: { image: true } },
                    follow_albums: { fields: ["id"] },
                    coverImage: true,
                    country: true,
                    region: { fields: ["name"] },
                    company: {
                        populate: {
                            icon: true
                        }
                    }
                }
            },
            coverImage: true,
            country: true,
            bookmarks: {
                fields: ["id"],
                populate: {
                    user: true
                }
            }
        }
    },
    album: {
        populate: {
            news_article: { populate: { image: true } },
            follow_albums: {
                fields: ["id"],
                populate: {
                    follower: {
                        fields: ["id"]
                    }
                }
            },
            country: true,
            region: { fields: ["name"] },
            company: {
                populate: {
                    icon: true
                }
            },
            coverImage: true
        }
    },
    user: {
        populate: {
            follows: { fields: ["id"] },
            profilePic: true,
            user_type: true,
            country: true
        }
    },
    following: {
        populate: {
            profilePic: true,
            country: true,
            user_type: true,
            social: true,
            coverImage: true
        }
    }
};
export const apiNames = {
    album: "albums",
    contentReview: "content-reviews",
    postcard: "postcards",
    user: "users",
    directory: "directories",
    company: "companies",
    country: "countries",
    config: "config",
    podcast: "podcasts",
    event: "events",
    newsArticles: "news-articles",
    affiliation: "affiliations"
};
export const filterForRegularMembers = {
    user_type: {
        name: "Regular"
    }
};
export const filterForPartners = {
    user_type: {
        name: { $in: ["Hotels", "DestinationExpert"] }
    }
};

export const filterForKeywordSearch = (keyword) => {
    return {
        tags: {
            name:
                keyword.toString().charAt(0).toUpperCase() +
                keyword.toString().slice(1)
        }
    };
};

export const filterForKeywordCountrySearch = (keyword, country) => {
    return {
        tags: {
            name:
                keyword.toString().charAt(0).toUpperCase() +
                keyword.toString().slice(1)
        },
        country: { name: country.toString() }
    };
};

export const populatePodcastData = {
    thumbnail: { fields: ["url"] },
    album: {
        populate: {
            company: { fields: ["name"] }
        }
    }
};
export const populateContentReviewData = {
    user: { fields: ["email", "fullName", "username"] },
    news_article: {
        fields: ["title", "status"]
    }
};

export const populateNewsArticles = {
    image: { fields: ["id", "url"] },
    creator: { fields: ["fullName", "id"] },
    album: {
        populate: populateAlbumData
    },
    blog: { fields: ["title", "content"] },
    block: {
        populate: {
            album_section: true,
            image: true
        }
    }
};
