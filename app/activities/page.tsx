import activitiesData from "@/data/activities/activities.json";
import HeroActivities from "@/components/sections/activities/heroActivities";

export default function Page() {
  return (
    <div className="space-y-36 sm:space-y-28 lg:space-y-40 xl:space-y-36">
      <HeroActivities data={[activitiesData]} />
    </div>
  );
}
