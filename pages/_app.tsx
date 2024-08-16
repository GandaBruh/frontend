import "@/styles/globals.css";
import "@/styles/style.css";
import 'bootstrap/dist/css/bootstrap.min.css';



import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function App({ Component, pageProps }: AppProps) {

  const rounter = useRouter()

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');

    if(!accessToken){
      rounter.push("/login")
    }
  },[])
  return <Component {...pageProps} />;
}
