export interface ITechnicianQuery {
  search?: string;
  location?: string;
  minRating?: string;
  page?: string;
  limit?: string;
};
export interface ITechnicianProfilePayload {
  bio?: string;
  experience: number;
  address: string;
}