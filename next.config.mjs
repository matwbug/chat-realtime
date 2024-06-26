/** @type {import('next').NextConfig} */
const nextConfig = {
    logging: {
        fetches: {
          fullUrl: true,
        },
      },
      images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'avatars.githubusercontent.com',
            port: '',
          },
          {
            protocol: 'https',
            hostname: 'github.com',
            port: '',
          },
        ],
      },
};

export default nextConfig;
