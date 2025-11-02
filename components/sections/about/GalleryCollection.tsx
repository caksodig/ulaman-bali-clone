"use client";
import React from "react";
import Image from "next/image";
import galleryData from "@/data/about/gallery.json";

interface AspectRatio {
  mobile: string;
  tablet: string;
  desktop: string;
  wide: string;
}

interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  aspectRatio: AspectRatio;
}

const GalleryCollection: React.FC = () => {
  return (
    <section className="w-full">
      <figure className="columns-2 gap-1.5 space-y-2 md:columns-3 md:gap-2 xl:column">
        {galleryData.map((item: GalleryItem) => (
          <div
            key={item.id}
            className={`
              aspect-[${item.aspectRatio.mobile}] 
              sm:aspect-[${item.aspectRatio.tablet}] 
              lg:aspect-[${item.aspectRatio.desktop}] 
              xl:aspect-[${item.aspectRatio.wide}]
            `}
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              priority
              className="rounded-md object-cover"
              sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
            />
          </div>
        ))}
      </figure>
    </section>
  );
};

export default GalleryCollection;
