export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface UserScore {
  userId: string;
  userName: string;
  points: number;
  exactResults: number;
  correctOutcomes: number;
}
