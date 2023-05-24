import z from 'zod';

import { UserRepository } from '../domain/userRepository';
import { SessionRepository } from '../domain/sessionRepository';
import { ErrorPhoneOrPasswordInvalid } from '../domain/userErrors';
import { Session } from '../domain/session';

export const UserLogInParamsSchema = z.object({
	phone: z.string(),
	password: z.string()
});

export type UserLogInParams = z.infer<typeof UserLogInParamsSchema>;

export class LogIn {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly sessionRepository: SessionRepository
	) {}

	public async execute(params: UserLogInParams) {
		const credential = UserLogInParamsSchema.parse(params);

		const user = await this.userRepository.find({
			phone: credential.phone
		});
		if (!user || !user.samePassword(credential.password)) {
			throw new ErrorPhoneOrPasswordInvalid();
		}

		const session = Session.create(user.id);

		await this.sessionRepository.create(session);

		const access = session.getAccess();

		return { user, session, access };
	}
}
