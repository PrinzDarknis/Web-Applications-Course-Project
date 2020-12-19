export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  privacy: string;
  friends: {
    _id: string;
    username: string;
  }[];
  friendsAsked: {
    _id: string;
    username: string;
  }[];
}

export interface User_Register {
  name: string;
  username: string;
  email: string;
  password: string;
}

export interface Post {
  _id: string;
  title: string;
  text: string;
  author: string | Author; // TODO
  postDate: Date;
  image: boolean;
  comments: Comment[];
}

export interface Author {
  _id: string;
  username: string;
}

export interface Comment {
  _id: string;
  author: string;
  text: string;
  date: Date;
}

// User Responses
export interface RegisterResponse {
  success: boolean;
  msg: string;
  error: any;
}

export interface GetUserResponse {
  success: boolean;
  result: User;
  msg: string;
  error: any;
}

export interface AuthenticateResponse {
  success: boolean;
  token: string;
  result: User;
  msg: string;
  error: any;
}

export interface ChangeUserDataResponse {
  success: boolean;
  result: User;
  msg: string;
  error: any;
}

export interface RegisterResponse {
  success: boolean;
  msg: string;
  error: any;
}

export interface AskFriendshipResponse {
  success: boolean;
  state: string;
  msg: string;
  error: any;
}

// Post Responses

export interface WritePostResponse {
  success: boolean;
  result: Post;
  msg: string;
  error: any;
}

export interface WriteCommentResponse {
  success: boolean;
  result: Comment;
  msg: string;
  error: any;
}

export interface GetPostResponse {
  success: boolean;
  result: Post;
  msg: string;
  error: any;
}

export interface GetPostsResponse {
  success: boolean;
  result: Post[];
  firstDate: Date;
  lastDate: Date;
  msg: string;
  error: any;
}
