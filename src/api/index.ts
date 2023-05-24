import Express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import { User } from '../modules/users/domain/user';
import { Session } from '../modules/users/domain/session';

import { CONFIGS } from '../configs';

import { routesV1 } from './routes';

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace Express {
		export interface Request {
			auth?: {
				user: User;
				session: Session;
			};
		}
	}
}

export const runAPI = () => {
	const app = Express();

	app.use(morgan('combined'));
	app.use(cors({ origin: '*' }));

	app.use(Express.urlencoded({ extended: false }));
	app.use(Express.json());

	app.use('/api/v1', routesV1());

	app.listen(CONFIGS.get.PORT, () => {
		console.log(`🚀 Started app in ${CONFIGS.get.PORT} in ${CONFIGS.get.ENV}`);
	});
};
