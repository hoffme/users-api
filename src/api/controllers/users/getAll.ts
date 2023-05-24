import { Users } from '../../../modules/users';

import { ErrorUserNotFound } from '../../../modules/users/domain/userErrors';

import { CreateController } from '../controller';

export const UsersGetAllController = CreateController({
	method: async () => {
		try {
			const result = await Users.getAll.execute();

			return {
				code: 200,
				json: result.map((row) => ({
					id: row.user.id,
					name: row.user.name,
					phone: row.user.phone,
					email: row.user.email,
					address: row.user.address,
					session_active: row.sessions.some((session) => {
						return session.expiredAt > new Date();
					})
				}))
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
