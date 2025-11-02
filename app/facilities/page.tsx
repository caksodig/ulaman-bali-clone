import Header from "@/components/sections/facilities/Header";
import HeroRooms from "@/components/sections/facilities/Hero";
import CallToActionSection from "@/components/ui/CallToActionSection";
import InteractiveMap from "@/components/ui/InteractiveMap";
import heroData from "@/data/facilities/heroFaciilities.json";

export default function Facilitiespage() {
  return (
    <main>
      <div className={`space-y-36 sm:space-y-28 lg:space-y-40 xl:space-y-36`}>
        <HeroRooms images={heroData.images} aspectRatio="3/2" />
        <Header />
        <InteractiveMap
          title="Discover Ulaman from above"
          instruction="Tap on an icon"
          mapImage="/image/ulaman-map.jpg"
          hotspots={[
            {
              id: "villa-1",
              name: "Pool Villa",
              description: "Luxury private villa",
              icon: "villa",
              position: { x: 30, y: 45 },
              link: "/villa/pool-villa",
            },
            // More hotspots...
          ]}
          backgroundColor="##EFEBE2"
          accentColor="#C69C4D"
        />
        <CallToActionSection pageKey="facilities" />
      </div>
    </main>
  );
}
