
import { useGetSponsoredTopQuery } from '../../redux/api/topApi';
import VenueCard from '../venues/VenueCard';
import {useSearchParams} from "react-router-dom";
import PaginationComponent from "../common/PaginationComponent.tsx";

const PAGE_SIZE = 1;

const SponsoredTopComponent = () => {
  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get('sponsored_page')) || 1;

  const { data: sponsored = [], isLoading, isError } = useGetSponsoredTopQuery();

  const totalPages = Math.ceil((sponsored.length || 0) / PAGE_SIZE);
  const paginatedVenues = sponsored.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  if (isLoading) {
    return <div className="text-center py-8 text-gray-600">Завантаження платного топу...</div>;
  }

  if (isError || sponsored.length === 0) {
    return <div className="text-center py-8 text-gray-600">Платні заклади відсутні</div>;
  }

  return (
    <div className="mb-16">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Платний топ
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {paginatedVenues.map((item) => (
          <VenueCard key={item.id} venue={item.venue} mode="grid" />
        ))}
      </div>

      <PaginationComponent
        currentPage={currentPage}
        totalPages={totalPages}
        paramName={'sponsored_page'}
      />
    </div>
  );
};

export default SponsoredTopComponent;