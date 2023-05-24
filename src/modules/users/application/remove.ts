import z from 'zod';

import { UserRepository } from '../domain/userRepository';
import { ErrorUserNotFound } from '../domain/userErrors';
import { SessionRepository } from '../domain/sessionRepository';

const AuthRemoveParamsSchema = z.object({
	id: z.number()
});

type AuthRemoveParams = z.infer<typeof AuthRemoveParamsSchema>;

export class Remove {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly sessionRepository: SessionRepository
	) {}

	public async execute(params: AuthRemoveParams) {
		const fields = AuthRemoveParamsSchema.parse(params);

		const user = await this.userRepository.find({ id: fields.id });
		if (!user) {
			throw new ErrorUserNotFound();
		}

		await this.userRepository.remove(user);
		await this.sessionRepository.removeAll({ userId: user.id });

		return { user };
	}
}
