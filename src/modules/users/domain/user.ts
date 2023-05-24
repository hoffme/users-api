import bcrypt from 'bcrypt';
import z from 'zod';

import { CONFIGS } from '../../../configs';

const EntrySchema = z.object({
	id: z.number(),
	name: z.string(),
	email: z.string(),
	phone: z.string(),
	address: z.string(),
	passwordHash: z.string()
});

type Entry = z.infer<typeof EntrySchema>;

interface UpdateFields {
	id: number;
	name: string;
	email: string;
	phone: string;
	address: string;
	password: string;
}

export class User {
	public static create(): User {
		return new User({
			id: 0,
			name: '',
			email: '',
			phone: '',
			passwordHash: '',
			address: ''
		});
	}

	public static instance(entry: Entry): User {
		return new User(entry);
	}

	private constructor(private entry: Entry) {}

	public get id() {
		return this.entry.id;
	}
	public get name() {
		return this.entry.name;
	}
	public get email() {
		return this.entry.email;
	}
	public get phone() {
		return this.entry.phone;
	}
	public get passwordHash() {
		return this.entry.passwordHash;
	}
	public get address() {
		return this.entry.address;
	}

	public update(params: Partial<UpdateFields>) {
		const nextEntry = { ...this.entry };

		if (params.id) nextEntry.id = params.id;
		if (params.name) nextEntry.name = params.name;
		if (params.email) nextEntry.email = params.email;
		if (params.phone) nextEntry.phone = params.phone;
		if (params.address) nextEntry.address = params.address;
		if (params.password) {
			nextEntry.passwordHash = bcrypt.hashSync(params.password, CONFIGS.get.PASSWORD_ROUNDS);
		}

		this.entry = EntrySchema.parse(nextEntry);
	}

	public samePassword(password: string): boolean {
		return bcrypt.compareSync(password, this.passwordHash);
	}
}
