"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";

export default function Footer() {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const bottomMarqueeRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const createInfiniteScroll = (
      container: HTMLElement,
      speed: number = 0.3,
      gap: number = 80,
      seamless: boolean = false
    ) => {
      const original = container.innerHTML;

      container.innerHTML = `
      <div class="marquee-track" style="display:flex; gap:${gap}px;">
        ${original}
      </div>
      <div class="marquee-track" style="display:flex; gap:${gap}px;">
        ${original}
      </div>
    `;

      const totalWidth = container.scrollWidth / 2;
      let x = 0;

      const step = () => {
        x -= speed;
        if (x <= -totalWidth) x = 0;
        container.style.transform = `translateX(\${x}px)`;
        requestAnimationFrame(step);
      };

      step();
    };

    // Smooth infinite marquee untuk logo awards
    if (marqueeRef.current) createInfiniteScroll(marqueeRef.current, 0.4, 80);

    // Seamless scrolling untuk teks bawah (tanpa jeda)
    if (bottomMarqueeRef.current)
      createInfiniteScroll(bottomMarqueeRef.current, 0.6, 0, true);
  }, []);

  return (
    <footer className="bg-[#606d61] text-white pt-20 pb-8 relative overflow-hidden">
      {/* Section Map & Description (di atas footer) */}
      <section className="bg-[#606d61] text-white py-24 px-8 md:px-16 lg:px-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <div className="flex flex-col gap-2 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <span className="text-white font-medium">4.7</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4 text-[#C69C4D]"
                >
                  <path d="M12 .587l3.668 7.431L24 9.748l-6 5.848 1.416 8.268L12 19.771l-7.416 3.993L6 15.596 0 9.748l8.332-1.73z" />
                </svg>
                <span>/ 742 Google Reviews</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white font-medium">4.8</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4 text-[#C69C4D]"
                >
                  <path d="M12 .587l3.668 7.431L24 9.748l-6 5.848 1.416 8.268L12 19.771l-7.416 3.993L6 15.596 0 9.748l8.332-1.73z" />
                </svg>
                <span>/ 295 TripAdvisor Reviews</span>
              </div>
            </div>

            <div className="border-t border-gray-400 pt-6 mt-4">
              <h2 className="text-3xl md:text-4xl font-serif leading-snug">
                Tucked Within Majestic <br /> Balinese Nature.
              </h2>
              <p className="mt-4 text-gray-300 text-sm leading-relaxed max-w-md">
                Strategically located near popular areas like Canggu and Ubud,
                experience tranquil nature and luxury. With endless activities,
                you’ll never want to leave Ulaman.
              </p>
            </div>
          </div>

          {/* Right Map */}
          <div className="flex justify-center md:justify-end">
            <Image
              src="/image/footer/map-footer.avif"
              alt="Map of Ulaman Bali"
              width={550}
              height={400}
              className="rounded-lg border border-gray-500 object-cover"
            />
          </div>
        </div>
      </section>

      {/* TOP SECTION */}
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-12 border-b border-gray-500 pb-12">
        {/* LEFT: FORM */}
        <div>
          <h3 className="text-xl font-serif mb-6">
            Get Notified On Our Offers
          </h3>
          <form className="space-y-6 max-w-xs">
            <div>
              <label className="block text-sm mb-1 opacity-80">
                Your Name*
              </label>
              <input
                type="text"
                className="w-full bg-transparent border-b border-white/50 focus:border-white outline-none py-1"
              />
            </div>
            <div>
              <label className="block text-sm mb-1 opacity-80">
                Your Email*
              </label>
              <input
                type="email"
                className="w-full bg-transparent border-b border-white/50 focus:border-white outline-none py-1"
              />
            </div>
            <button
              type="submit"
              className="uppercase tracking-widest text-sm font-light hover:opacity-70 transition"
            >
              Submit
            </button>
          </form>
        </div>

        {/* CENTER: EXPLORE */}
        <div className="md:pl-12">
          <h3 className="text-xl font-serif mb-6">Explore</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {[
              "Home",
              "Dining",
              "Retreats",
              "Facilities",
              "About",
              "Contact",
              "Villas",
              "Spa",
              "Experiences",
              "Ulaman Map",
              "Articles",
              "Video Testimonials",
            ].map((item) => (
              <a
                key={item}
                href="#"
                className="hover:opacity-70 transition tracking-wide"
              >
                {item}
              </a>
            ))}
          </div>
        </div>

        {/* RIGHT: CONNECT */}
        <div>
          <h3 className="text-xl font-serif mb-6">Connect</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {[
              "Whatsapp",
              "TripAdvisor",
              "Facebook",
              "Directions",
              "Instagram",
            ].map((item) => (
              <a
                key={item}
                href="#"
                className="hover:opacity-70 transition tracking-wide"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* AWARDS MARQUEE */}
      <div className="overflow-hidden py-10 relative">
        <div
          ref={marqueeRef}
          className="flex gap-16 whitespace-nowrap will-change-transform"
        >
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-16">
              {[
                "/image/footer/awards1.avif",
                "/image/footer/awards2.avif",
                "/image/footer/awards3.avif",
                "/image/footer/awards4.avif",
                "/image/footer/awards5.avif",
                "/image/footer/awards6.avif",
                "/image/footer/awards7.avif",
              ].map((src, index) => (
                <Image
                  key={index}
                  src={src}
                  alt={`Award ${index}`}
                  width={120}
                  height={80}
                  className="opacity-90 object-contain"
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* COPYRIGHT BAR */}
      <div className="text-xs text-gray-200 mt-6 text-center md:text-left px-6 flex flex-col md:flex-row justify-between items-center gap-3">
        <div className="flex gap-4">
          <a href="#">Terms</a>
          <a href="#">Privacy</a>
          <a href="#">Ulaman Bookings</a>
          <span>Kids under 6 are not advised.</span>
        </div>
        <div>
          © 2024-2025 Two Moons Studio for{" "}
          <a href="https://ulamanbali.com" className="underline">
            ulamanbali.com
          </a>{" "}
          — Made with ❤️ by Two Moons Studio
        </div>
      </div>

      {/* BOTTOM MARQUEE TEXT */}
      <div className="overflow-hidden border-t border-gray-600 py-4 mt-6">
        <div
          ref={bottomMarqueeRef}
          className="flex whitespace-nowrap will-change-transform text-gray-200 text-sm"
        >
          {[
            "• The Ultimate Honeymoon | 3 days 2 nights",
            "• The Avatar Experience | 3 days 2 nights",
            "• The Ultimate Experience | 3 days 2 nights",
            "• The Jungle Retreat | 4 days 3 nights",
            "• Eco Wellness Escape | 3 days 2 nights",
          ].map((item, idx) => (
            <span key={idx} className="mx-6 opacity-90">
              {item}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
