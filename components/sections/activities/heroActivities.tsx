import Image from "next/image";

interface Activity {
  id: number;
  title: string;
  description: string;
  image: string;
}

interface HeroActivitiesProps {
  data: Activity[];
}

export default function HeroActivities({ data }: HeroActivitiesProps) {
  return (
    <div className="space-y-20">
      {data.map((act) => (
        <div key={act.id} className="rounded relative">
          <div className="relative w-full aspect-[16/9] overflow-hidden">
            <Image
              src={act.image}
              alt={act.title}
              fill
              priority
              quality={95}
              className="object-cover object-center transition-transform duration-700 ease-out will-change-transform"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 60vw"
            />
          </div>

          <section className="flex flex-col gap-7 lg:gap-x-28 lg:flex-row lg:justify-between sm:gap-11 app-container mt-10">
            <header className="flex-1 sm:max-w-sm lg:max-w-md">
              <div className="space-y-4">
                <h4 className="text-2xl font-semibold">{act.title}</h4>
              </div>
            </header>
            <div className="lg:w-1/2 sm:max-w-lg">
              <div className="space-y-4">
                <p className="text-gray-600">{act.description}</p>
              </div>
            </div>
          </section>
        </div>
      ))}
    </div>
  );
}
