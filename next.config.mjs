/** @type {import('next').NextConfig} */
const nextConfig = {
    server: {
        port: process.env.NEXT_PUBLIC_PORT || 3000,
    },
};

export default nextConfig;
