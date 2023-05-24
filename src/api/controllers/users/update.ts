import { Users } from '../../../modules/users';

import { ErrorUserNotFound } from '../../../modules/users/domain/userErrors';

import { CreateController } from '../controller';

export const UsersUpdateController = CreateController({
	method: async (props) => {
		const id = parseInt(props.req.params.id?.toString() || '');
		if (!id || isNaN(id)) {
			return { code: 400, json: { error: 'invalid query id param' } };
		}

		try {
			const result = await Users.update.execute({
				...props.req.body,
				id
			});

			return {
				code: 200,
				json: {
					name: result.user.name,
					email: result.user.email,
					phone: result.user.phone,
					address: result.user.address,
					passwordHash: result.user.passwordHash
				}
			};
		} catch (e) {
			if (e instanceof ErrorUserNotFound) {
				return { code: 404, json: { error: e.message } };
			} else {
				throw e;
			}
		}
	}
});
