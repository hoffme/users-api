import { User } from './user';

export type UserFindFilter =
	| {
			id: number;
	  }
	| {
			phone: string;
	  };

export type UserSearchFilter = {
	limit?: number;
	skip?: number;
};

export type UserSearchResults = {
	data: User[];
	total: number;
	limit: number;
	skip: number;
};

export interface UserRepository {
	find(filter: UserFindFilter): Promise<User | null>;
	search(filter: UserSearchFilter): Promise<UserSearchResults>;
	create(user: User): Promise<void>;
	update(user: User): Promise<void>;
	remove(user: User): Promise<void>;
}
