import { Session } from './session';

export type SessionFindFilter = {
	id: number;
};

export type SessionSearchFilter = {
	userId?: number | number[];
	limit?: number;
	skip?: number;
};

export type SessionSearchResults = {
	data: Session[];
	total: number;
	limit: number;
	skip: number;
};

export interface SessionRepository {
	find(filter: SessionFindFilter): Promise<Session | null>;
	search(filter: SessionSearchFilter): Promise<SessionSearchResults>;
	create(session: Session): Promise<void>;
	remove(filter: SessionFindFilter): Promise<void>;
	removeAll(filter: SessionSearchFilter): Promise<number>;
}
