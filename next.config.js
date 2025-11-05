
const nextConfig = {
  webpack(config) {
    config.module.rules.push({
        test: /\.svg$/i,
        use: [ '@svgr/webpack' ],
    },
    {
        test: /\.(mp4|webm|ogg)$/i,
        type: 'asset/resource', // встроенный загрузчик для бинарных файлов
    },
    );
    
    return config;
    },
    images: {
        remotePatterns: [
        {
            protocol: 'https',
            hostname: 'avatars.mds.yandex.net',
            port: '',
            pathname: '/**', // разрешает любой путь
        },
        {
            protocol: 'https',
            hostname: 'avangard-website.onrender.com',
            port: '',
            pathname: '/**', // разрешает любой путь
        },
        ],
    },
};

module.exports = nextConfig;