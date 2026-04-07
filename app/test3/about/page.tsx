import workPhotosData from "@/data/work-photos.json";
import Test3AboutClient from "./_components/Test3AboutClient";

export default function Test3AboutPage() {
  return <Test3AboutClient photos={workPhotosData} />;
}
