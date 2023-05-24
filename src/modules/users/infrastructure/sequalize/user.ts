import {
	CreationOptional,
	DataTypes,
	InferAttributes,
	InferCreationAttributes,
	Model,
	Sequelize
} from 'sequelize';

import { User } from '../../domain/user';
import {
	UserFindFilter,
	UserRepository,
	UserSearchFilter,
	UserSearchResults
} from '../../domain/userRepository';

class userSequelize extends Model<
	InferAttributes<userSequelize>,
	InferCreationAttributes<userSequelize>
> {
	declare id: CreationOptional<number>;
	declare name: string;
	declare email: string;
	declare phone: string;
	declare address: string;
	declare passwordHash: string;
}

export class UserRepositorySequelize implements UserRepository {
	public static async setup(sequelize: Sequelize): Promise<UserRepositorySequelize> {
		userSequelize.init(
			{
				id: {
					type: DataTypes.INTEGER.UNSIGNED,
					autoIncrement: true,
					primaryKey: true
				},
				name: {
					type: new DataTypes.STRING(50),
					allowNull: false
				},
				email: {
					type: new DataTypes.STRING(50),
					allowNull: false
				},
				phone: {
					type: new DataTypes.STRING(50),
					allowNull: false
				},
				address: {
					type: new DataTypes.STRING(100),
					allowNull: false
				},
				passwordHash: {
					type: new DataTypes.STRING(120),
					allowNull: false
				}
			},
			{
				tableName: 'users',
				sequelize
			}
		);

		await sequelize.sync({ force: true });

		return new UserRepositorySequelize(sequelize);
	}

	private constructor(private readonly sequelize: Sequelize) {}

	public async create(user: User): Promise<void> {
		const result = await userSequelize.create({
			name: user.name,
			email: user.email,
			phone: user.phone,
			address: user.address,
			passwordHash: user.passwordHash
		});

		user.update({ id: result.id });
	}

	public async find(params: UserFindFilter): Promise<User | null> {
		let filter;

		if ('id' in params) filter = { id: params.id };
		if ('phone' in params) filter = { phone: params.phone };

		if (!filter) {
			throw new Error('empty invalid filter');
		}

		const result = await userSequelize.findOne({ where: filter });
		if (!result) return null;

		return User.instance({
			id: result.id,
			email: result.email,
			name: result.name,
			phone: result.phone,
			address: result.address,
			passwordHash: result.passwordHash
		});
	}

	public async remove(user: User): Promise<void> {
		await userSequelize.destroy({
			where: { id: user.id },
			force: true
		});
	}

	public async search(params: UserSearchFilter): Promise<UserSearchResults> {
		const where = {};

		const { count, rows } = await userSequelize.findAndCountAll({
			where,
			offset: params.skip,
			limit: params.limit
		});

		return {
			total: count,
			skip: params.skip || 0,
			limit: params.limit || count,
			data: rows.map((row) =>
				User.instance({
					id: row.id,
					email: row.email,
					name: row.name,
					phone: row.phone,
					address: row.address,
					passwordHash: row.passwordHash
				})
			)
		};
	}

	public async update(user: User): Promise<void> {
		await userSequelize.update(
			{
				name: user.name,
				email: user.email,
				phone: user.phone,
				address: user.address,
				passwordHash: user.passwordHash
			},
			{
				where: { id: user.id }
			}
		);
	}
}
