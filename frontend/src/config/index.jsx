const {default: axios} = require("axios");


export const BASE_URL = "https://proconnect-1-ksss.onrender.com/";

export const clientServer = axios.create({
    baseURL: BASE_URL,
});

export default clientServer;