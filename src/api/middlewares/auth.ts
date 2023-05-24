import { Handler, NextFunction, Request, Response } from 'express';

import { Users } from '../../modules/users';

export const AuthMiddleware = (): Handler => {
	return (req: Request, res: Response, next: NextFunction) => {
		const token = req.headers.authorization?.replace('Bearer ', '');
		if (!token) {
			res.status(401).json({ error: 'unauthorized' });
			return;
		}

		Users.access
			.execute({ token })
			.then((result) => {
				req.auth = result;
				next();
			})
			.catch(() => {
				res.status(401).json({ error: 'unauthorized' });
			});
	};
};
