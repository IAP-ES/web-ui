let HOST, BASE_URL, WS_SCHEME;

const scheme = {
  HTTP: "http://",
  HTTPS: "https://",
};

HOST = "10.10.11.238";
BASE_URL = `${scheme.HTTPS}${HOST}`;

const config = {
  PRODUCTION: import.meta.env.PROD,
  HOST,
  BASE_URL,
  API_USER_URL: `${BASE_URL}/auth`,
};

export default config;
