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

export interface PostResponse {
  id: number;
  title: string;
  content: string;
  authorId: number;
  authorUsername: string;
  subjectId: number;
  subjectName: string;
  creationDate: string;
  comments: CommentResponse[]; 
}

export interface CommentResponse {
  id: number;
  content: string;
  author: string;
  creationDate: string;
}

export interface CreateCommentRequest {
  content: string;
}
export interface CreatePostRequest {
  title: string;
  content: string;
  subjectId: number;
}