import { useSearchParams } from 'react-router-dom';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  paramName?: string;        // 'page' | 'sponsored_page' | comments_page
  className?: string;        // additional style later
}

const PaginationComponent = ({
  currentPage,
  totalPages,
  paramName = 'page',        // by default 'page'
  className = ''
}: PaginationProps) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handlePageChange = (page: number) => {
    if (page === currentPage) return;

    const newParams = new URLSearchParams(searchParams);
    newParams.set(paramName, page.toString());

    setSearchParams(newParams, { replace: true });
    // window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (totalPages <= 1) return null;

  return (
    <div className={`flex justify-center gap-2 mt-12 ${className}`}>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={`px-5 py-3 rounded-xl font-medium transition-all ${
            page === currentPage
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {page}
        </button>
      ))}
    </div>
  );
};

export default PaginationComponent;