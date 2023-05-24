import { Users } from '../../../modules/users';

import {
	ErrorPhoneOrPasswordInvalid,
	ErrorUserNotFound
} from '../../../modules/users/domain/userErrors';

import { CreateController } from '../controller';

export const UsersLoginController = CreateController({
	method: async (props) => {
		try {
			const result = await Users.login.execute(props.req.body);

			return {
				code: 200,
				json: {
					user: {
						id: result.user.id,
						name: result.user.name,
						session_active: !!result.session,
						email: result.user.email,
						phone: result.user.phone,
						address: result.user.address
					},
					access_token: result.access.token,
					token_type: 'bearer'
				}
			};
		} catch (e) {
			if (e instanceof ErrorPhoneOrPasswordInvalid) {
				return { code: 400, json: { error: e.message } };
			} else if (e instanceof ErrorUserNotFound) {
				return { code: 404, json: { error: e.message } };
			} else {
				throw e;
			}
		}
	}
});
