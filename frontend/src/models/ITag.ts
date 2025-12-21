
export interface ITag {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface IVenueTag {
  id: number;
  tag: ITag;
  created_at: string;
  updated_at: string;
}