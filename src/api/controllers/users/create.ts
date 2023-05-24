import { Users } from '../../../modules/users';

import { CreateController } from '../controller';

export const UsersCreateController = CreateController({
	method: async (props) => {
		const result = await Users.create.execute(props.req.body);

		return {
			code: 200,
			json: {
				id: result.user.id,
				name: result.user.name,
				email: result.user.email,
				phone: result.user.phone,
				address: result.user.address,
				session_active: false
			}
		};
	}
});
