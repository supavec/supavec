"use client";

import { useEffect, useRef } from "react";

export const Testimonials = () => {
  const senjaContainerRef = useRef<HTMLDivElement>(null);
  const senjaContainerRef2 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (senjaContainerRef.current) {
      const script = document.createElement("script");
      script.src =
        "https://widget.senja.io/widget/fbd84a7e-61cb-4140-80c5-746dc0c3b3eb/platform.js";
      script.async = true;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, []);

  useEffect(() => {
    if (senjaContainerRef2.current) {
      const script = document.createElement("script");
      script.src =
        "https://widget.senja.io/widget/99489516-c9b7-4162-9558-50851e82e446/platform.js";
      script.async = true;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, []);

  return (
    <section className="mt-20 md:mt-24">
      <h2 className="text-2xl md:text-4xl font-bold text-center mb-8 md:mb-12">
        What people are saying
      </h2>
      <div className="flex justify-center gap-4 mb-8 md:mb-12">
        <a
          href="https://www.producthunt.com/posts/supavec?embed=true&utm_source=badge-top-post-badge&utm_medium=badge&utm_souce=badge-supavec"
          target="_blank"
          rel="noopener noreferrer"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://api.producthunt.com/widgets/embed-image/v1/top-post-badge.svg?post_id=871672&theme=dark&period=daily&t=1741056944849"
            alt="Supavec - The&#0032;open&#0032;source&#0032;RAG&#0032;as&#0032;a&#0032;service&#0032;platform | Product Hunt"
            style={{ width: "250px", height: "54px" }}
            width={250}
            height={54}
          />
        </a>
        <a
          href="https://www.producthunt.com/posts/supavec?embed=true&utm_source=badge-top-post-topic-badge&utm_medium=badge&utm_souce=badge-supavec"
          target="_blank"
          rel="noopener noreferrer"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://api.producthunt.com/widgets/embed-image/v1/top-post-topic-badge.svg?post_id=871672&theme=dark&period=weekly&topic_id=267&t=1741056944849"
            alt="Supavec - The&#0032;open&#0032;source&#0032;RAG&#0032;as&#0032;a&#0032;service&#0032;platform | Product Hunt"
            style={{ width: "250px", height: "54px" }}
            width={250}
            height={54}
          />
        </a>
        <a
          href="https://www.producthunt.com/posts/supavec?embed=true&utm_source=badge-top-post-topic-badge&utm_medium=badge&utm_souce=badge-supavec"
          target="_blank"
          rel="noopener noreferrer"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://api.producthunt.com/widgets/embed-image/v1/top-post-topic-badge.svg?post_id=871672&theme=dark&period=monthly&topic_id=267&t=1741056944849"
            alt="Supavec - The&#0032;open&#0032;source&#0032;RAG&#0032;as&#0032;a&#0032;service&#0032;platform | Product Hunt"
            style={{ width: "250px", height: "54px" }}
            width={250}
            height={54}
          />
        </a>
      </div>
      <div
        ref={senjaContainerRef2}
        className="senja-embed"
        data-id="99489516-c9b7-4162-9558-50851e82e446"
        data-mode="shadow"
        data-lazyload="false"
        style={{ display: "block", marginTop: "2rem" }}
      ></div>
      <div
        ref={senjaContainerRef}
        className="senja-embed mt-[-30px]"
        data-id="fbd84a7e-61cb-4140-80c5-746dc0c3b3eb"
        data-mode="shadow"
        data-lazyload="false"
        style={{ display: "block" }}
      ></div>
    </section>
  );
};
