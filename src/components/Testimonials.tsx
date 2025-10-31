"use client";

import React from "react";
import { Quote } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      quote: "Clipverse transformed our marketing strategy. We saw a 3x increase in engagement and our ROI has never been better. The performance-based model is a game-changer!",
      author: "Sarah Chen",
      role: "Marketing Director, AuraTech",
      avatar: "/placeholder.svg", // Placeholder for an avatar image
    },
    {
      quote: "As a creator, Clipverse has opened up incredible opportunities. I get to work with brands I genuinely love, and the payment process is always smooth and transparent. Highly recommend!",
      author: "Jake 'The Gamer' Miller",
      role: "Content Creator",
      avatar: "/placeholder.svg", // Placeholder for an avatar image
    },
    {
      quote: "Finding authentic creators used to be a headache. Clipverse makes it effortless, connecting us with talent that truly resonates with our audience. The results speak for themselves.",
      author: "Emily Rodriguez",
      role: "Brand Partnerships Lead, FreshBites",
      avatar: "/placeholder.svg", // Placeholder for an avatar image
    },
    {
      quote: "The analytics dashboard is fantastic! I can see exactly how my content is performing and how much I'm earning in real-time. It's motivating and helps me refine my strategy.",
      author: "Chloe 'StyleVibe' Lee",
      role: "Fashion & Lifestyle Creator",
      avatar: "/placeholder.svg", // Placeholder for an avatar image
    },
  ];

  return (
    <section className="bg-gray-900 py-20 px-6 md:px-12 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 animate-in fade-in-0 slide-in-from-top-8 duration-700">
            What Our Users Say
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto animate-in fade-in-0 slide-in-from-top-6 duration-700 delay-100">
            Hear directly from the brands and creators thriving with Clipverse.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-gray-700 shadow-xl flex flex-col animate-in fade-in-0 slide-in-from-bottom-8 duration-700"
              style={{ animationDelay: `${index * 100 + 200}ms` }}
            >
              <Quote className="h-8 w-8 text-indigo-400 mb-4" />
              <p className="text-lg text-gray-200 mb-6 flex-grow">"{testimonial.quote}"</p>
              <div className="flex items-center">
                {/* You can replace this with an actual image if available */}
                <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center text-gray-400 mr-4">
                  {testimonial.author.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-white">{testimonial.author}</p>
                  <p className="text-sm text-gray-400">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;