import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "../styles/[loader].module.css";

const Loader = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = (url) => {
      url !== router.asPath;
      setLoading(true);
    };
    const handleComplete = (url) => {
      url === router.asPath;
      setLoading(false);
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  return (
    loading && (
      <div className={styles.fullscreen}>
        <img className={styles.loader} src="/NewLoader.gif" alt="" />
      </div>
    )

    // loading && (
    //   <div className={styles.fullscreen}>
    //     <img src="/logo.png" alt="" className={styles.logo} />
    //     <br />
    //     <img className={styles.loader} src="/NewLoader.gif" alt="" />
    //     <h2>पिंपरी चिंचवड महानगरपालिका</h2>
    //   </div>
    // )
  );
};

export default Loader;
