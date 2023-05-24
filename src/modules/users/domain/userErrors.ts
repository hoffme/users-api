import { DomainError } from '../../shared/domain/error';

export class ErrorUserNotFound extends DomainError {
	constructor() {
		super('user not found');
	}
}

export class ErrorUserAlreadyExistsWithThisPhone extends DomainError {
	constructor(phone: string) {
		super(`user already exist with phone: '${phone}'`);
	}
}

export class ErrorPhoneOrPasswordInvalid extends DomainError {
	constructor() {
		super('phone or password invalid');
	}
}
