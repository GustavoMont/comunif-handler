export interface Community {
  id: number;
  name: string;
  subjectId: number;
  banner: string | null;
  isActive: boolean;
}

export interface UpdateCommunity {
  name?: string;
  isActive?: boolean;
  banner: string | FileList | null;
}
