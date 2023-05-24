import z from 'zod';

import { UserRepository } from '../domain/userRepository';
import { ErrorUserNotFound } from '../domain/userErrors';
import { Session } from '../domain/session';

export const UserAccessParamsSchema = z.object({
	token: z.string()
});

export type AuthAccessParams = z.infer<typeof UserAccessParamsSchema>;

export class Access {
	constructor(private readonly userRepository: UserRepository) {}

	public async execute(params: AuthAccessParams) {
		const { token } = UserAccessParamsSchema.parse(params);

		const session = Session.fromToken(token);

		const user = await this.userRepository.find({
			id: session.userId
		});
		if (!user) {
			throw new ErrorUserNotFound();
		}

		return { user, session };
	}
}
