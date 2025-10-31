"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQSection = () => {
  const faqs = [
    {
      question: "How does Clipverse ensure performance for brands?",
      answer: "Clipverse operates on a performance-based model. Brands set specific goals (e.g., views, clicks, conversions), and payments to creators are only released after their content is verified through platform APIs to have met those metrics. This ensures you only pay for real, measurable results.",
    },
    {
      question: "What kind of creators can I expect to work with?",
      answer: "We partner with a diverse range of authentic creators across TikTok, Instagram Reels, and YouTube Shorts. Our platform focuses on matching brands with creators whose audience demographics and content style align with campaign goals, ensuring genuine engagement.",
    },
    {
      question: "How do creators get paid?",
      answer: "Creators earn based on the performance of their submitted clips, as defined by the campaign brief (e.g., per-view, per-like, or per-approved-clip). Once a clip is verified through platform APIs and meets the campaign's criteria, payouts are processed weekly every Friday directly to the creator's linked wallet.",
    },
    {
      question: "Is there a minimum budget for brands?",
      answer: "While there's no strict minimum, most brands start with test campaigns ranging from $250 to $1,000 to understand performance and optimize their strategy. Our flexible budgeting allows you to scale up or down based on your results.",
    },
    {
      question: "What if a creator's content doesn't meet campaign requirements?",
      answer: "Our system automatically verifies each submitted clip against the campaign's requirements (e.g., hashtags, links, view counts) using platform APIs. If a clip doesn't meet the criteria, it won't be approved for payment, protecting your budget from underperforming content.",
    },
    {
      question: "Can creators choose which campaigns to join?",
      answer: "Absolutely! Creators have full autonomy to browse available campaigns and choose those that resonate with their personal brand and audience. This ensures authenticity and higher quality content, as creators are genuinely interested in the products/services they promote.",
    },
  ];

  return (
    <section className="bg-gray-950 py-20 px-6 md:px-12 text-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 animate-in fade-in-0 slide-in-from-top-8 duration-700">
            Frequently Asked Questions
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto animate-in fade-in-0 slide-in-from-top-6 duration-700 delay-100">
            Find answers to common questions about how Clipverse works for brands and creators.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border-b border-gray-700 animate-in fade-in-0 slide-in-from-bottom-8 duration-700"
              style={{ animationDelay: `${index * 100 + 200}ms` }}
            >
              <AccordionTrigger className="text-lg font-semibold text-white hover:no-underline py-4 text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-300 text-base pb-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;