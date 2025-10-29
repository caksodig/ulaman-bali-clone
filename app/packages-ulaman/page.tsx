import PackagesPage from "@/components/sections/packagePage/packagesPage";
import packagesData from "@/data/package-ulaman/packages.json";

export default function Page() {
  return <PackagesPage data={packagesData} />;
}
