import { Request, Response } from 'express';
import { ZodError } from 'zod';

import { DomainError } from '../../modules/shared/domain/error';

export type ControllerResponse = {
	code: number;
	json: unknown;
};

export const CreateController = (params: {
	method: (params: { req: Request; res: Response }) => Promise<ControllerResponse>;
}) => {
	return (req: Request, res: Response) => {
		params
			.method({ req, res })
			.then((result) => {
				res.status(result.code).json(result.json);
			})
			.catch((e) => {
				if (e instanceof ZodError) {
					res.status(400).json({ error: e.message });
				} else if (e instanceof DomainError) {
					res.status(400).json({ error: e.message });
				} else {
					res.status(500).json({ error: 'internal server error' });
				}
			});
	};
};
