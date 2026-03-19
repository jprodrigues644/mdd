export interface PostListResponse {
  id: number;
  title: string;
  content: string;
  authorId: number;
  authorUsername: string;
  subjectId: number;
  subjectName: string;
  creationDate: string;
}