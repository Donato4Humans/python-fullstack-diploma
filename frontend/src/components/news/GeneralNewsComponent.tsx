
import GeneralNewsCard from './GeneralNewsCard';
import {INews} from "../../models/INews";

interface GeneralNewsComponentProps {
  news: INews[];
}

const GeneralNewsComponent = ({ news }: GeneralNewsComponentProps) => {
  if (news.length === 0) {
    return <div className="text-center py-8 text-gray-600">No global news available</div>;
  }

  return (
    <div className="space-y-6">
      {news.map((newsItem) => (
        <GeneralNewsCard key={newsItem.id} news={newsItem} />
      ))}
    </div>
  );
};

export default GeneralNewsComponent;