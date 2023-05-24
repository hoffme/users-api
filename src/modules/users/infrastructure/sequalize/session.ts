import {
	CreationOptional,
	DataTypes,
	InferAttributes,
	InferCreationAttributes,
	Model,
	Sequelize,
	WhereOptions
} from 'sequelize';

import {
	SessionFindFilter,
	SessionRepository,
	SessionSearchFilter,
	SessionSearchResults
} from '../../domain/sessionRepository';
import { Session } from '../../domain/session';

class sessionSequelize extends Model<
	InferAttributes<sessionSequelize>,
	InferCreationAttributes<sessionSequelize>
> {
	declare id: CreationOptional<number>;
	declare userId: number;
	declare createdAt: Date;
	declare expiredAt: Date;
}

export class SessionRepositorySequelize implements SessionRepository {
	public static async setup(sequelize: Sequelize): Promise<SessionRepositorySequelize> {
		sessionSequelize.init(
			{
				id: {
					type: DataTypes.INTEGER.UNSIGNED,
					autoIncrement: true,
					primaryKey: true
				},
				userId: {
					type: DataTypes.INTEGER.UNSIGNED,
					allowNull: false
				},
				createdAt: {
					type: DataTypes.DATE,
					allowNull: false
				},
				expiredAt: {
					type: DataTypes.DATE,
					allowNull: false
				}
			},
			{
				tableName: 'sessions',
				sequelize
			}
		);

		await sequelize.sync({ force: true });

		return new SessionRepositorySequelize(sequelize);
	}

	private constructor(private readonly sequelize: Sequelize) {}

	public async create(session: Session): Promise<void> {
		const result = await sessionSequelize.create({
			userId: session.userId,
			createdAt: session.createdAt,
			expiredAt: session.expiredAt
		});

		session.update({ id: result.id });
	}

	public async find(params: SessionFindFilter): Promise<Session | null> {
		const filter = 'id' in params ? { id: params.id } : undefined;
		if (!filter) {
			throw new Error('empty invalid filter');
		}

		const result = await sessionSequelize.findOne({ where: filter });
		if (!result) return null;

		return Session.instance({
			id: result.id,
			userId: result.userId,
			createdAt: new Date(result.createdAt),
			expiredAt: new Date(result.expiredAt)
		});
	}

	public async remove(user: SessionFindFilter): Promise<void> {
		await sessionSequelize.destroy({
			where: { id: user.id },
			force: true
		});
	}

	public async search(params: SessionSearchFilter): Promise<SessionSearchResults> {
		const where: WhereOptions<InferAttributes<sessionSequelize>> = {};

		if ('userId' in params) where.userId = params.userId;

		const { count, rows } = await sessionSequelize.findAndCountAll({
			where,
			offset: params.skip,
			limit: params.limit
		});

		return {
			total: count,
			skip: params.skip || 0,
			limit: params.limit || count,
			data: rows.map((row) =>
				Session.instance({
					id: row.id,
					userId: row.userId,
					createdAt: new Date(row.createdAt),
					expiredAt: new Date(row.expiredAt)
				})
			)
		};
	}

	public async removeAll(params: SessionSearchFilter): Promise<number> {
		const where: WhereOptions<InferAttributes<sessionSequelize>> = {};

		if ('userId' in params) where.userId = params.userId;

		if (Object.keys(where).length === 0 && params.limit === 0) {
			throw new Error('Error remove all without filter');
		}

		return await sessionSequelize.destroy({
			where,
			limit: params.limit
		});
	}
}
