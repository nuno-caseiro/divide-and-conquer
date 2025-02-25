import TeamUserDto from 'src/modules/teamUsers/dto/team.user.dto';
import { TeamUserRepositoryInterface } from '../interfaces/repositories/team-user.repository.interface';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { TYPES } from '../interfaces/types';
import { INSERT_FAILED } from 'src/libs/exceptions/messages';
import TeamUser from 'src/modules/teamUsers/entities/team.user.schema';
import { UseCase } from 'src/libs/interfaces/use-case.interface';

@Injectable()
export class CreateTeamUsersUseCase implements UseCase<TeamUserDto[], TeamUser[]> {
	constructor(
		@Inject(TYPES.repositories.TeamUserRepository)
		private readonly teamUserRepository: TeamUserRepositoryInterface
	) {}

	async execute(teamUsers: TeamUserDto[]): Promise<TeamUser[]> {
		const teamUsersSaved = await this.teamUserRepository.insertMany(teamUsers);

		if (teamUsersSaved.length < 1) throw new BadRequestException(INSERT_FAILED);

		return teamUsersSaved;
	}
}
