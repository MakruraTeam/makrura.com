export type LoginPayload = {
  login: string;
  password: string;
};
export type LoginResponse = { token: string };

export type RegisterPayload = {
  login: string;
  email: string;
  password: string;
  repeatPassword: string;
};
export type RegisterResponse = {
  user: { _id?: string; id?: string; login: string; email: string };
};
