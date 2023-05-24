import z from 'zod';

import { UserRepository } from '../domain/userRepository';
import { ErrorUserNotFound } from '../domain/userErrors';
import { SessionRepository } from '../domain/sessionRepository';

const AuthFindParamsSchema = z.object({
	id: z.number()
});

type AuthFindParams = z.infer<typeof AuthFindParamsSchema>;

export class GetOne {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly sessionRepository: SessionRepository
	) {}

	public async execute(params: AuthFindParams) {
		const { id } = AuthFindParamsSchema.parse(params);

		const user = await this.userRepository.find({ id });
		if (!user) {
			throw new ErrorUserNotFound();
		}

		const sessions = await this.sessionRepository.search({
			userId: user.id
		});

		return { user, sessions: sessions.data };
	}
}
