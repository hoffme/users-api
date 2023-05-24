import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';

import SwaggerDocument from '../../docs/swagger.json';

import { CONFIGS } from '../configs';

import { AuthMiddleware } from './middlewares/auth';

import * as Users from './controllers/users';

export const routesV1 = () => {
	const router = Router();

	router.use('/users', routesUsers());

	if (CONFIGS.get.ENV === 'development') {
		router.use('/docs', swaggerUi.serve, swaggerUi.setup(SwaggerDocument));
	}

	return router;
};

const routesUsers = () => {
	const router = Router();

	router.get(`/:id`, AuthMiddleware(), Users.UsersGetOneController);
	router.put(`/:id`, AuthMiddleware(), Users.UsersUpdateController);
	router.delete(`/:id`, AuthMiddleware(), Users.UsersDeleteController);

	router.post(`/login`, Users.UsersLoginController);
	router.get(`/`, Users.UsersGetAllController);
	router.post(`/`, AuthMiddleware(), Users.UsersCreateController);

	return router;
};
