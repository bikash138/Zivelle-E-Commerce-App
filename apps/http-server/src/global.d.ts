interface UserType {
    id: number;
    email: string;
}

declare global {
  namespace Express {
    interface Request {
      user: UserType;
    }
  }
}
