import "../styles/globals.css";
import type { AppProps } from "next/app";
import Axios from "axios";
import { AuthProvider } from "../context/auth";

function MyApp({ Component, pageProps }: AppProps) {
    Axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_BASE_URL + "/api";
    return <Component {...pageProps} />;
}

export default MyApp;
