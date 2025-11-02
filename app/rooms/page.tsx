import AccommodationSection from "@/components/sections/rooms/AccommodationSection";
import DoorRevealSection from "@/components/sections/rooms/DoorRevealSection";
import HeroRooms from "@/components/sections/rooms/Hero";
import RoomShowcase from "@/components/sections/rooms/RoomShowcase.";
import CallToActionSection from "@/components/ui/CallToActionSection";
import heroData from "@/data/rooms/heroRooms.json";
import roomsList from "@/data/rooms/index.json";

export default async function RoomsPage() {
  const rooms = await Promise.all(
    roomsList.map(async (room) => {
      const data = await import(`@/data/rooms/${room.file}`);
      return data.default;
    })
  );
  return (
    <main>
      <HeroRooms images={heroData.images} aspectRatio="3/2" />
      <DoorRevealSection
        title="Discover our eco Luxury State-of-the-Art Villas."
        image="/image/rooms/reveral.avif"
        backgroundColor="#EFEBE2"
        textColor="#C69C4D"
        scrollHeight={150}
      />
      <AccommodationSection />
      {rooms
        .filter((room) => room && Array.isArray(room.images))
        .map((room, i) => (
          <RoomShowcase key={i} room={room} />
        ))}

      {/* <RevealWrapper /> */}
      <CallToActionSection pageKey="rooms" />
    </main>
  );
}
