// "use client";

// import { useState } from "react";
// import Image from "next/image";
// import Link from "next/link";

// interface VillaCardProps {
//   title: string;
//   images: string[];
//   description: string;
//   cta: {
//     text: string;
//     link: string;
//   };
// }

// export default function VillaCard({
//   title,
//   images,
//   description,
//   cta,
// }: VillaCardProps) {
//   const [currentIndex, setCurrentIndex] = useState(0);

//   const nextImage = () => {
//     setCurrentIndex((prev) => (prev + 1) % images.length);
//   };

//   const prevImage = () => {
//     setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
//   };

//   return (
//     <div className="relative group overflow-hidden transition-all hover:-translate-y-1 md:pl-16 max-w-sm">
//       {/* Image */}
//       <div className="relative w-full h-64 sm:h-80 overflow-hidden">
//         <Image
//           src={images[currentIndex]}
//           alt={title}
//           fill
//           className="object-cover transition-transform duration-700 group-hover:scale-105"
//         />

//         {/* Navigation Buttons */}
//         <button
//           onClick={prevImage}
//           className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/60 hover:bg-white text-gray-800 p-2 rounded-full backdrop-blur-md transition-all"
//         >
//           <svg
//             className="w-5 h-5"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M15 19l-7-7 7-7"
//             />
//           </svg>
//         </button>
//         <button
//           onClick={nextImage}
//           className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/60 hover:bg-white text-gray-800 p-2 rounded-full backdrop-blur-md transition-all"
//         >
//           <svg
//             className="w-5 h-5"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M9 5l7 7-7 7"
//             />
//           </svg>
//         </button>

//         {/* Indicator dots */}
//         <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
//           {images.map((_, idx) => (
//             <div
//               key={idx}
//               className={`w-2 h-2 rounded-full ${
//                 idx === currentIndex ? "bg-white" : "bg-white/50"
//               }`}
//             />
//           ))}
//         </div>
//       </div>

//       {/* Content */}
//       <div className="py-4 ">
//         <h3 className="text-xl text-[#343E35] font-semibold mb-2">{title}</h3>
//         <p className="text-[#343E35] mb-4 text-sm">{description}</p>

//         <Link
//           href={cta.link}
//           className="inline-block py-2 text-sm font-medium text-[#C69C4D] rounded-full transition-all"
//         >
//           {cta.text}
//         </Link>
//       </div>
//     </div>
//   );
// }

"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface VillaCardProps {
  title: string;
  description: string;
  images: string[];
  cta: { text: string; link: string };
}

export default function VillaCard({
  title,
  description,
  images,
  cta,
}: VillaCardProps) {
  const [current, setCurrent] = useState(0);

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative group md:pl-4 overflow-hidden">
      {/* Image Slider */}
      <div className="relative w-full h-72 overflow-hidden">
        <Image
          src={images[current]}
          alt={title}
          fill
          className="object-cover transition-all duration-700"
        />

        {/* Navigation Buttons */}
        <div className="absolute inset-x-0 bottom-3 flex justify-between px-4">
          <button
            onClick={handlePrev}
            className="bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={handleNext}
            className="bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
              //{" "}
            </svg>
          </button>
        </div>
      </div>

      {/* Text & CTA */}
      <div className="py-2 text-[#343E35]">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-sm mb-4">{description}</p>
        <Link
          href={cta.link}
          className="relative inline-block text-[#C69C4D] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#C69C4D] after:origin-right after:scale-x-0 hover:after:origin-left hover:after:scale-x-100 after:transition-transform after:duration-300"
        >
          {cta.text}
        </Link>
      </div>
    </div>
  );
}
