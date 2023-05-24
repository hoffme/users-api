import { CONFIGS } from './configs';
import { runAPI } from './api';

import { Users } from './modules/users';
import { UsersSeeds } from './seeds/users';

const main = async () => {
	await CONFIGS.load();

	await Users.setup();

	await UsersSeeds();

	runAPI();
};

main().catch(console.error);
