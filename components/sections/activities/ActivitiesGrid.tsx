import Image from "next/image";
import { getFirstSentence } from "@/lib/text";

type Activity = {
  id: number;
  title: string;
  price: string;
  image: string;
  description: string;
};

type Props = {
  items: Activity[];
};

export default function ActivitiesGrid({ items }: Props) {
  if (!items.length) {
    return (
      <div className="text-center text-[#C69C4D] italic">
        No activities available for this category.
      </div>
    );
  }

  return (
    <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <div key={item.id} className="flex flex-col space-y-4">
          <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>

          <div className="space-y-2">
            <p className="text-sm text-[#C69C4D] font-medium">{item.price}</p>
            <h3 className="text-lg text-[#C69C4D] leading-snug">
              {item.title}
            </h3>
            <p className="text-sm text-[#7d7158]">
              {getFirstSentence(item.description)}
            </p>
          </div>

          <div className="flex gap-6 text-sm font-medium">
            <button className="text-[#C69C4D] hover:underline">ENQUIRE</button>
            <button className="text-[#C69C4D]/70 hover:text-[#C69C4D] transition-all">
              LEARN MORE
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
