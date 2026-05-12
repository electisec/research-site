import nextConfig from "eslint-config-next";

const configs = Array.isArray(nextConfig) ? nextConfig : nextConfig.default ? [...nextConfig.default] : [nextConfig];

export default configs;
