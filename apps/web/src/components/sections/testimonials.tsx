"use client";

import { Section } from "@/components/section";
import { useEffect, useRef } from "react";

export function Testimonials() {
  const senjaContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // This ensures the widget only loads on the client side after hydration
    if (senjaContainerRef.current) {
      const script = document.createElement("script");
      script.src =
        "https://widget.senja.io/widget/401b382e-0d8c-41b5-9160-96adc4d5f3e3/platform.js";
      script.type = "text/javascript";
      script.async = true;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, []);

  return (
    <Section id="testimonials" title="Testimonials">
      <div className="border-t border-x">
        <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 h-2/6 w-[calc(100%-2px)] overflow-hidden bg-gradient-to-t from-background to-transparent"></div>

        {/* Client-side only rendering of the Senja widget */}
        <div
          ref={senjaContainerRef}
          className="senja-embed"
          data-id="401b382e-0d8c-41b5-9160-96adc4d5f3e3"
          data-mode="shadow"
          data-lazyload="false"
          style={{ display: "block", width: "100%" }}
        ></div>
      </div>
    </Section>
  );
}
