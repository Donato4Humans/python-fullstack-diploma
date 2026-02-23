import GeneralNewsCard from './GeneralNewsCard';
import type { INews } from "../../models/INews";
import { useSearchParams } from "react-router-dom";
import PaginationComponent from "../common/PaginationComponent.tsx";

interface GeneralNewsComponentProps {
  news: INews[];
}

const PAGE_SIZE = 2;

const GeneralNewsComponent = ({ news }: GeneralNewsComponentProps) => {
  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;
  const totalPages = Math.ceil((news.length || 0) / PAGE_SIZE);
  const paginatedNews = news.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  if (news.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500 text-lg">
        Немає загальних новин сайту
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Section Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Загальні новини
        </h2>
        <p className="text-gray-600">
          Останні події та оновлення від команди Piyachok
        </p>
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {paginatedNews.map((newsItem) => (
          <GeneralNewsCard key={newsItem.id} news={newsItem} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center pt-6">
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
};

export default GeneralNewsComponent;