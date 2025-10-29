import InteractiveMap from "@/components/ui/InteractiveMap";

export default function page() {
  return (
    <div>
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
        backgroundColor="#E8E4DC"
        accentColor="#C69C4D"
      />
    </div>
  );
}
