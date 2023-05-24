import { Users } from '../modules/users';

export const UsersSeeds = async () => {
	const users = await Users.getAll.execute();
	if (users.length > 0) return;

	await Users.create.execute({
		name: 'Usuario Root',
		email: 'test@test.com',
		phone: '54 12 3456 8900',
		address: 'Buenos Aires, Argentina',
		password: '123456'
	});
};
