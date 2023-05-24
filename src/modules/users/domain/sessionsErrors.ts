import { DomainError } from '../../shared/domain/error';

export class ErrorSessionNotFound extends DomainError {
	constructor() {
		super('session not found');
	}
}

export class ErrorTokenInvalid extends DomainError {
	constructor() {
		super('token invalid');
	}
}
