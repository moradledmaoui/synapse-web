/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://116.203.235.44:8000/api/:path*',
      },
    ]
  },
}

module.exports = nextConfig
