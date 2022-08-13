import { Moderation } from '@typings';
import { MyBot } from './MyBot';

type WarnOptionsBase = {
	guildId: string;
	userId: string;
};

export class ModerationClient {
	public constructor(private client: MyBot) {}

	public async getWarnCount(where: WarnOptionsBase): Promise<number> {
		return this.client.db.warns.count({ where });
	}

	public async getAllWarns(where: WarnOptionsBase) {
		return this.client.db.warns.findMany({ where });
	}

	public async warn(data: WarnOptionsBase, reason: string, createdBy: string) {
		return this.client.db.warns.create({
			data: { ...data, reason, createdBy },
		});
	}

	public async unwarn(
		where: WarnOptionsBase,
		index: Moderation.IndexOptions = 'latest'
	) {
		const warns = await this.client.db.warns.findMany({
			where,
			orderBy: { createdAt: 'asc' },
		});
		if (typeof index === 'number') {
			return this.client.db.warns.delete({
				where: { id: warns[index - 1].id },
			});
		}

		if (index === 'first' || index === 'latest') {
			const auxIndex = index === 'first' ? 0 : warns.length - 1;
			return this.client.db.warns.delete({
				where: { id: warns[auxIndex].id },
			});
		}

		return null;
	}

	public async removeAllWarns(where: WarnOptionsBase) {
		return this.client.db.warns.deleteMany({ where });
	}
}
