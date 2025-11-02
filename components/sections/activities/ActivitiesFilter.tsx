type Props = {
  types: string[];
  categories: string[];
  activeType: string;
  activeCategory: string;
  onTypeChange: (type: string) => void;
  onCategoryChange: (category: string) => void;
};

export default function ActivitiesFilter({
  types,
  categories,
  activeType,
  activeCategory,
  onTypeChange,
  onCategoryChange,
}: Props) {
  return (
    <div className="space-y-8 max-w-2xl">
      {/* Tabs (In House / Outdoor) */}
      <div className="flex gap-16 border-b border-[#d4b26b]">
        {types.map((type) => (
          <button
            key={type}
            onClick={() => onTypeChange(type)}
            className={`text-2xl font-[Gilda Display] pb-2 transition-all ${
              activeType === type
                ? "text-[#C69C4D] border-b-2 border-[#C69C4D]"
                : "text-[#C69C4D] hover:text-[#C69C4D]"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-4">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`px-5 py-2 rounded-md border text-sm transition-all ${
              activeCategory === category
                ? "bg-[#C69C4D] text-white border-[#C69C4D]"
                : "border-[#C69C4D] text-[#C69C4D] hover:bg-[#C69C4D]/10"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
