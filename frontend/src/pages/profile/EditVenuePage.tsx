
import { useParams, useNavigate } from 'react-router-dom';
import { useGetVenueQuery, useUpdateVenueMutation  } from '../../redux/api/venueApi';
import {useAddTagToVenueMutation, useGetTagsQuery, useGetVenueTagsQuery} from '../../redux/api/tagApi';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';

const EditVenuePage = () => {
  const { venueId } = useParams<{ venueId: string }>();
  const venueIdNum = Number(venueId);
  const navigate = useNavigate();

  const { data: venue } = useGetVenueQuery(venueIdNum);
  const { data: venueTags = [] } = useGetVenueTagsQuery(venueIdNum);
  const { data: allTags = [], isLoading: tagsLoading } = useGetTagsQuery(undefined);
  const [updateVenue] = useUpdateVenueMutation();
  const [addTagToVenue] = useAddTagToVenueMutation();

  const [selectedTags, setSelectedTags] = useState<number[]>([]);

  const {  handleSubmit, setValue } = useForm();

  useEffect(() => {
    if (venue) {
      setValue('title', venue.title);
      setValue('description', venue.description);
      setValue('schedule', venue.schedule);
      setValue('average_check', venue.average_check);
      setValue('category', venue.category);
      setValue('street', venue.street);
      setValue('city', venue.city);
      setValue('region', venue.region);
      setValue('country', venue.country);
      setValue('house', venue.house);
    }
    if (venueTags) {
      setSelectedTags(venueTags.map(vt => vt.tag.id));
    }
  }, [venue, venueTags, setValue]);

  const onSubmit = async (data: any) => {
    try {
      await updateVenue({ id: venueIdNum, data }).unwrap();

      // Sync tags
      const currentTagIds = venueTags.map(vt => vt.tag.id);
      const toAdd = selectedTags.filter(id => !currentTagIds.includes(id));
      for (const tagId of toAdd) {
        await addTagToVenue({ venueId: venueIdNum, tag_id: tagId });
      }
      // remove tag not implemented here (add delete mutation later)

      navigate('/profile/my-venues');
    } catch (error) {
      alert('Update failed');
    }
  };

  const toggleTag = (tagId: number) => {
    setSelectedTags(prev =>
      prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
    );
  };

  if (!venue) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold mb-8">Edit Venue</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">


        {/* Tags */}
        <div>
          <label className="block text-sm font-bold mb-4">Tags</label>
          {tagsLoading ? (
            <p>Loading tags...</p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {allTags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className={`px-4 py-2 rounded-full border transition ${
                    selectedTags.includes(tag.id)
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-700">
          Update Venue
        </button>
      </form>
    </div>
  );
};

export default EditVenuePage;