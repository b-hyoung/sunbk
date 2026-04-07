import workPhotosData from "@/data/work-photos.json";
import Test2AboutClient from "./_components/Test2AboutClient";

export default function AboutPage() {
  return <Test2AboutClient photos={workPhotosData} />;
}
