"use client";

import React, { useState, useMemo } from "react";
import activitiesData from "@/data/activities/dataActivities.json";
import ActivitiesFilter from "./ActivitiesFilter";
import ActivitiesGrid from "./ActivitiesGrid";

type Activity = {
  id: number;
  title: string;
  type: string;
  category: string;
  price: string;
  image: string;
  description: string;
};

export default function ActivitiesSection() {
  const { filters, activities } = activitiesData as {
    filters: { types: string[]; categories: string[] };
    activities: Activity[];
  };

  const [activeType, setActiveType] = useState("In House");
  const [activeCategory, setActiveCategory] = useState("All Experiences");

  // ✅ Clean filtering logic
  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => {
      const typeMatch = activity.type === activeType;

      // jika All Experiences → hanya filter berdasarkan type
      if (activeCategory === "All Experiences") {
        return typeMatch;
      }

      // selain itu → filter berdasarkan type dan kategori
      return typeMatch && activity.category === activeCategory;
    });
  }, [activities, activeType, activeCategory]);

  return (
    <section className="space-y-16 px-8 lg:px-32">
      <ActivitiesFilter
        types={filters.types}
        categories={filters.categories}
        activeType={activeType}
        activeCategory={activeCategory}
        onTypeChange={setActiveType}
        onCategoryChange={setActiveCategory}
      />
      <ActivitiesGrid items={filteredActivities} />
    </section>
  );
}
