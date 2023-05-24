import { Users } from '../../../modules/users';

import { ErrorUserNotFound } from '../../../modules/users/domain/userErrors';

import { CreateController } from '../controller';

export const UsersGetOneController = CreateController({
	method: async (props) => {
		const id = parseInt(props.req.params.id?.toString() || '');
		if (!id || isNaN(id)) {
			return { code: 400, json: { error: 'invalid query id param' } };
		}

		try {
			const result = await Users.getOne.execute({ id });

			return {
				code: 200,
				json: {
					id: result.user.id,
					name: result.user.name,
					phone: result.user.phone,
					email: result.user.email,
					address: result.user.address,
					session_active: result.sessions.some((session) => {
						return session.expiredAt > new Date();
					})
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
