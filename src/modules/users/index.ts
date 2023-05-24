import { Sequelize } from 'sequelize';

import { UserRepositorySequelize } from './infrastructure/sequalize/user';
import { SessionRepositorySequelize } from './infrastructure/sequalize/session';

import { CONFIGS } from '../../configs';

import { LogIn } from './application/login';
import { Access } from './application/access';
import { Create } from './application/create';
import { Update } from './application/update';
import { Remove } from './application/remove';
import { GetOne } from './application/getOne';
import { GetAll } from './application/getAll';

export class Users {
	public static login: LogIn;
	public static access: Access;
	public static getOne: GetOne;
	public static getAll: GetAll;
	public static create: Create;
	public static update: Update;
	public static remove: Remove;

	public static async setup() {
		const config = CONFIGS.get;

		const sequelize = new Sequelize(config.POSTGRES_PATH);
		await sequelize.authenticate();

		const userRepository = await UserRepositorySequelize.setup(sequelize);
		const sessionRepository = await SessionRepositorySequelize.setup(sequelize);

		this.login = new LogIn(userRepository, sessionRepository);
		this.access = new Access(userRepository);
		this.getOne = new GetOne(userRepository, sessionRepository);
		this.getAll = new GetAll(userRepository, sessionRepository);
		this.create = new Create(userRepository);
		this.update = new Update(userRepository);
		this.remove = new Remove(userRepository, sessionRepository);
	}
}
