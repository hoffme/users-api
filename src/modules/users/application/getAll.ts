import { UserRepository } from '../domain/userRepository';
import { SessionRepository } from '../domain/sessionRepository';
import { Session } from '../domain/session';

export class GetAll {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly sessionRepository: SessionRepository
	) {}

	public async execute() {
		const users = await this.userRepository.search({});

		const sessions = await this.sessionRepository.search({
			userId: users.data.map((user) => user.id)
		});
		const sessionsMap = sessions.data.reduce((sessionsMap, session) => {
			if (!sessionsMap[session.userId]) {
				sessionsMap[session.userId] = [];
			}

			sessionsMap[session.userId].push(session);

			return sessionsMap;
		}, {} as { [K: number]: Session[] });

		return users.data.map((user) => ({
			user,
			sessions: sessionsMap[user.id] || []
		}));
	}
}
