/** @type {import('next').NextConfig} */
const isVercel = !!process.env.VERCEL
const nextConfig = {
  ...(isVercel ? {} : { distDir: 'next-build' }),
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
