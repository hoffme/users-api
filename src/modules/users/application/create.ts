import z from 'zod';

import { UserRepository } from '../domain/userRepository';
import { User } from '../domain/user';
import { ErrorUserAlreadyExistsWithThisPhone } from '../domain/userErrors';

const AuthCreateParamsSchema = z.object({
	name: z.string(),
	email: z.string(),
	phone: z.string(),
	address: z.string(),
	password: z.string()
});

type AuthCreateParams = z.infer<typeof AuthCreateParamsSchema>;

export class Create {
	constructor(private readonly userRepository: UserRepository) {}

	public async execute(params: AuthCreateParams) {
		const fields = AuthCreateParamsSchema.parse(params);

		const userWithPhone = await this.userRepository.find({
			phone: fields.phone
		});
		if (userWithPhone) {
			throw new ErrorUserAlreadyExistsWithThisPhone(userWithPhone.phone);
		}

		const user = User.create();
		user.update(fields);

		await this.userRepository.create(user);

		return { user };
	}
}
