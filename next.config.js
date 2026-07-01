/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverMinification: false,
  },
  async redirects() {
    return [
      { source: '/contato', destination: '/atendimento', permanent: true },
    ]
  },
}

module.exports = nextConfig
