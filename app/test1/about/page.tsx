import workPhotosData from "@/data/work-photos.json";
import AboutClient from "./_components/AboutClient";

export default function AboutPage() {
  return <AboutClient photos={workPhotosData} />;
}
