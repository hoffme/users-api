import { Users } from '../../../modules/users';

import { ErrorUserNotFound } from '../../../modules/users/domain/userErrors';

import { CreateController } from '../controller';

export const UsersDeleteController = CreateController({
	method: async (props) => {
		const id = parseInt(props.req.params.id?.toString() || '');
		if (!id || isNaN(id)) {
			return { code: 400, json: { error: 'invalid query id param' } };
		}

		try {
			await Users.remove.execute({ id });
			return { code: 204, json: { ok: true } };
		} catch (e) {
			if (e instanceof ErrorUserNotFound) {
				return { code: 404, json: { error: e.message } };
			} else {
				throw e;
			}
		}
	}
});
