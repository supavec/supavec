import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { MinusSmallIcon, PlusSmallIcon } from "@heroicons/react/24/outline";

const faqs = [
  {
    question:
      "Is credit card information required to access this free Chat with PDF tool?",
    answer:
      "No, credit card information is not required to access this free Chat with PDF tool. This is 100% free.",
  },
  {
    question: "How did you build this?",
    answer:
      "I built this using Supavec. It's an open source platform to create apps with RAG.",
  },
  {
    question: "Do you store the PDFs I uploaded?",
    answer: "No. we delete PDFs uploaded on this free tool after 24 hours.",
  },
];

export const FAQ = () => {
  return (
    <section className="mx-auto w-full text-center px-6 pt-24 sm:pt-32 lg:px-8">
      <div className="mx-auto max-w-4xl divide-y text-muted-foreground">
        <div>
          <h2 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Frequently asked questions
          </h2>
          <p className="mt-4 text-lg font-medium text-muted-foreground">
            Answers to common questions about our free Chat with PDF app.
          </p>
        </div>
        <dl className="mt-10 space-y-6 divide-y text-muted-foreground">
          {faqs.map((faq) => (
            <Disclosure key={faq.question} as="div" className="pt-6">
              <dt>
                <DisclosureButton className="group flex w-full items-start justify-between text-left text-foreground">
                  <span className="text-base/7 font-semibold text-left">
                    {faq.question}
                  </span>
                  <span className="ml-6 flex h-7 items-center">
                    <PlusSmallIcon
                      aria-hidden="true"
                      className="size-6 group-data-open:hidden"
                    />
                    <MinusSmallIcon
                      aria-hidden="true"
                      className="size-6 group-[&:not([data-open])]:hidden"
                    />
                  </span>
                </DisclosureButton>
              </dt>
              <DisclosurePanel as="dd" className="mt-2 pr-12">
                <p className="text-base/7 text-muted-foreground text-left">
                  {faq.answer}
                </p>
              </DisclosurePanel>
            </Disclosure>
          ))}
        </dl>
      </div>
    </section>
  );
};
