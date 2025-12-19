export interface IMessage {
  id: number;
  text: string;
  user_name: string;
  user_role: string;
  room: string;
}

export interface IChatRoom {
  id: number;
  name: string;
  participants: Array<{
    name: string;
    role: string;
  }>;
}

export interface IChatRoomDetailResponse {
  room_id: number;
  room_name: string;
  messages: IMessage[];
}