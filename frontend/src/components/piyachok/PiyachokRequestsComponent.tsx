import { useSearchParams } from "react-router-dom";
import { useGetActiveRequestsQuery } from '../../redux/api/piyachokApi';
import PiyachokRequestComponent from './PiyachokRequestComponent';
import PaginationComponent from "../common/PaginationComponent.tsx";

const PAGE_SIZE = 1;

const PiyachokRequestsComponent = () => {
  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  const { data: requests = [], isLoading, isError } = useGetActiveRequestsQuery();

  const totalPages = Math.ceil((requests.length || 0) / PAGE_SIZE);
  const paginatedRequests = requests.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  if (isLoading) {
    return <div className="text-center py-20 text-gray-600">Завантажуємо активні запити...</div>;
  }

  if (isError) {
    return <div className="text-center py-20 text-red-600">Помилка завантаження запитів</div>;
  }

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-3">
          Активні запити Пиячок
        </h2>
        <p className="text-gray-600 text-lg">
          Люди шукають компанію для зустрічі
        </p>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-xl">Наразі немає активних запитів</p>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {paginatedRequests.map((request) => (
              <PiyachokRequestComponent key={request.id} request={request} />
            ))}
          </div>

          <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
          />
        </>
      )}
    </div>
  );
};

export default PiyachokRequestsComponent;