import activitiesData from "@/data/activities/activities.json";
import { HeroActivities } from "@/components/sections/activities/heroActivities";
import CallToActionSection from "@/components/ui/CallToActionSection";
import IntroSection from "@/components/sections/activities/introSection";
import ActivitiesSection from "@/components/sections/activities/ActivitiesSection";

export default function Page() {
  const { hero } = activitiesData;
  return (
    <div className="space-y-36 sm:space-y-28 lg:space-y-40 xl:space-y-36">
      <HeroActivities title={hero.title} image={hero.image} />
      <IntroSection />
      <ActivitiesSection />
      <CallToActionSection pageKey="activities" />
    </div>
  );
}
