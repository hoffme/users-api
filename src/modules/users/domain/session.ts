import jwt from 'jsonwebtoken';
import z from 'zod';

import { CONFIGS } from '../../../configs';

import { ErrorTokenInvalid } from './sessionsErrors';

export const EntrySchema = z.object({
	id: z.number(),
	userId: z.number(),
	createdAt: z.date(),
	expiredAt: z.date()
});

type Entry = z.infer<typeof EntrySchema>;

export class Session {
	public static create(userId: number): Session {
		const createdAt = new Date();

		const expiredAt = new Date(createdAt);
		expiredAt.setUTCSeconds(expiredAt.getUTCSeconds() + CONFIGS.get.SESSION_DURATION);

		return new Session({
			id: 0,
			userId,
			createdAt,
			expiredAt
		});
	}

	public static instance(entry: Entry): Session {
		return new Session(entry);
	}

	public static fromToken(token: string): Session {
		const data = jwt.verify(token, CONFIGS.get.JWT_SECRET);
		if (typeof data !== 'object') {
			throw new ErrorTokenInvalid();
		}

		try {
			const fields = EntrySchema.parse({
				id: data.id,
				userId: data.userId,
				createdAt: new Date(data.createdAt),
				expiredAt: new Date(data.expiredAt)
			});

			return new Session(fields);
		} catch (e) {
			throw new ErrorTokenInvalid();
		}
	}

	private constructor(private entry: Entry) {}

	public get id() {
		return this.entry.id;
	}
	public get userId() {
		return this.entry.userId;
	}
	public get createdAt() {
		return this.entry.createdAt;
	}
	public get expiredAt() {
		return this.entry.expiredAt;
	}

	public update(params: Partial<Entry>) {
		this.entry = { ...this.entry, ...params };
	}

	public getAccess() {
		const expiresIn = CONFIGS.get.ACCESS_DURATION * 1000;

		const expiredAt = new Date();
		expiredAt.setUTCMilliseconds(expiredAt.getUTCMilliseconds() + expiresIn);

		const token = jwt.sign({ ...this.entry }, CONFIGS.get.JWT_SECRET, {
			expiresIn
		});

		return { token, expiredAt };
	}
}
