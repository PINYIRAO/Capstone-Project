export type UserSignUp = {
  email: string;
  password: string;
  displayName: string;
  photoURL: string;
};

export type UserUpdate = {
  password: string;
  userName: string;
  photoURL: string;
};

export type User = {
  id: string;
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: string;
  status: "Active" | "Locked" | "Disabled" | "Deleted";
  createdAt: Date;
  updatedAt: Date;
};
