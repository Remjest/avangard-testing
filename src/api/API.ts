const API = {
    categories: {
        all: process.env.NEXT_PUBLIC_DOMAIN + '/api/categories',
        byId: process.env.NEXT_PUBLIC_DOMAIN + '/api/categories/',
    },
    subcategories: {
        all: process.env.NEXT_PUBLIC_DOMAIN + '/api/subcategories',
        byId: process.env.NEXT_PUBLIC_DOMAIN + '/api/subcategories/',
        byCategory: process.env.NEXT_PUBLIC_DOMAIN + '/api/subcategories/category/',
    },
    services: {
        post: process.env.NEXT_PUBLIC_DOMAIN + '/api/services',
        byId: process.env.NEXT_PUBLIC_DOMAIN + '/api/services/',
        byAlias: process.env.NEXT_PUBLIC_DOMAIN + '/api/services/search/',
        bySubcategory: process.env.NEXT_PUBLIC_DOMAIN + '/api/services/subcategory/',
        byCategory: process.env.NEXT_PUBLIC_DOMAIN + '/api/services/category/',
        shortByCategory: process.env.NEXT_PUBLIC_DOMAIN + '/api/services/category/short/',
        shortBySubategory: process.env.NEXT_PUBLIC_DOMAIN + '/api/services/subcategory/short/',
    },
    images: {
        postImage: process.env.NEXT_PUBLIC_DOMAIN + '/api/upload/image'
    },
    videos: {
        postVideo: process.env.NEXT_PUBLIC_DOMAIN + '/api/upload/video'
    },
    mainPage: {
        getMainInfo: process.env.NEXT_PUBLIC_DOMAIN + '/api/main-page'
    }
};

export default API;