let HOST, BASE_URL, WS_SCHEME;

const scheme = {
  HTTP: "http://",
  HTTPS: "https://",
};

HOST = "es-ua.ddns.net:444";
BASE_URL = `${scheme.HTTP}${HOST}`;

const config = {
  PRODUCTION: import.meta.env.PROD,
  HOST,
  BASE_URL,
  API_USER_URL: `${BASE_URL}/auth`,
};

export default config;
