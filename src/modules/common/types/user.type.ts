export interface IUser {
  id: string;
  email: string;
}

export interface AuthServiceProvider {
  validateUser(details: IUser): Promise<IUser>;
  createUser(details: IUser): Promise<IUser>;
  findUser(discordId: string): Promise<IUser | undefined>;
}

export type Done = (err: Error, user: IUser) => void;
