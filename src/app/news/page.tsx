import BeeNews from "@/features/news/ui/newsUi";
import { fetchGoogleNews } from "@/features/news/api/newsApi";

export default async function NewsPage() {
  // 서버사이드에서 초기 데이터 로드
  const initialData = await fetchGoogleNews("꿀벌").catch(() => []);
  
  return <BeeNews initialData={initialData} />;
}