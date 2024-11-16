let HOST, BASE_URL, WS_SCHEME;

const scheme = {
  HTTP: "http://",
  HTTPS: "https://",
};

HOST = "alb-1912597159.eu-north-1.elb.amazonaws.com:444";
BASE_URL = `${scheme.HTTPS}${HOST}`;

const config = {
  PRODUCTION: import.meta.env.PROD,
  HOST,
  BASE_URL,
  API_USER_URL: `${BASE_URL}/auth`,
};

export default config;
