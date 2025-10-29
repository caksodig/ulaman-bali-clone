"use client";
export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#E8E4DC] text-white z-50 animate-fadeIn">
      <div className="relative text-4xl font-semibold tracking-wider">
        <span className="relative inline-block text-transparent bg-clip-text bg-linear-to-r from-gray-500 to-[#C69C4D] animate-shimmer">
          Map Page
        </span>
      </div>

      <style jsx>{`
        /* Fade in screen */
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
        }

        /* Shimmer text */
        @keyframes shimmer {
          0% {
            background-position: -300% 0;
          }
          100% {
            background-position: 300% 0;
          }
        }
        .animate-shimmer {
          background-size: 400% 100%;
          animation: shimmer 5s ease-in-out infinite;
          filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.2));
        }
      `}</style>
    </div>
  );
}
