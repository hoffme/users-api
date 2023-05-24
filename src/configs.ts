import dotenv from 'dotenv';
import z from 'zod';

const Schema = z.object({
	ENV: z.enum(['production', 'development']).default('production'),
	PORT: z.union([z.number(), z.string()]).default(3000),
	POSTGRES_PATH: z.string(),
	JWT_SECRET: z.string().default('shh'),
	PASSWORD_ROUNDS: z.number().default(10),
	SESSION_DURATION: z.number().default(60 * 60 * 24 * 30), // 30 days,
	ACCESS_DURATION: z.number().default(60 * 10) // 10 minutes,
});

export class CONFIGS {
	private static configs: z.infer<typeof Schema> | undefined = undefined;

	public static async load(): Promise<void> {
		dotenv.config();

		this.configs = Schema.parse(process.env);
	}

	public static get get() {
		if (!this.configs) {
			throw new Error('Configs not loaded');
		}

		return this.configs;
	}
}
