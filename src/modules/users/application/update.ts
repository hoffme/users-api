import z from 'zod';

import { UserRepository } from '../domain/userRepository';
import { ErrorUserAlreadyExistsWithThisPhone, ErrorUserNotFound } from '../domain/userErrors';

const AuthUpdateParamsSchema = z.object({
	id: z.number(),
	name: z.string().optional(),
	email: z.string().optional(),
	phone: z.string().optional(),
	address: z.string().optional(),
	password: z.string().optional()
});

type AuthUpdateParams = z.infer<typeof AuthUpdateParamsSchema>;

export class Update {
	constructor(private readonly userRepository: UserRepository) {}

	public async execute(params: AuthUpdateParams) {
		const fields = AuthUpdateParamsSchema.parse(params);

		const user = await this.userRepository.find({ id: fields.id });
		if (!user) {
			throw new ErrorUserNotFound();
		}

		if (fields.phone) {
			const userWithPhone = await this.userRepository.find({
				phone: fields.phone
			});
			if (userWithPhone) {
				throw new ErrorUserAlreadyExistsWithThisPhone(userWithPhone.phone);
			}
		}

		user.update(fields);

		await this.userRepository.update(user);

		return { user };
	}
}
