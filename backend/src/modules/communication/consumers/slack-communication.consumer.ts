import { OnQueueCompleted, Process, Processor } from '@nestjs/bull';
import { Inject, Logger } from '@nestjs/common';
import { Job } from 'bull';
import { UpdateBoardServiceInterface } from 'src/modules/boards/interfaces/services/update.board.service.interface';
import { TYPES as BOARD_TYPES } from 'src/modules/boards/interfaces/types';
import { TeamDto } from 'src/modules/communication/dto/team.dto';
import { BoardType } from 'src/modules/communication/dto/types';
import { CommunicationApplicationInterface } from 'src/modules/communication/interfaces/communication.application.interface';
import { TYPES } from 'src/modules/communication/interfaces/types';
import { SlackCommunicationProducer } from 'src/modules/communication/producers/slack-communication.producer';
import { SlackCommunicationEventListeners } from './slack-communication-event-listeners';

@Processor(SlackCommunicationProducer.QUEUE_NAME)
export class SlackCommunicationConsumer extends SlackCommunicationEventListeners<
	BoardType,
	TeamDto
> {
	constructor(
		@Inject(TYPES.application.SlackCommunicationApplication)
		private readonly application: CommunicationApplicationInterface,
		@Inject(BOARD_TYPES.services.UpdateBoardService)
		private updateBoardService: UpdateBoardServiceInterface
	) {
		const logger = new Logger(SlackCommunicationConsumer.name);
		super(logger);
	}

	@Process()
	override async communication(job: Job<BoardType>) {
		const board = job.data;

		this.logger.verbose(
			`execute communication for board with id: "${board.id}" and Job id: "${job.id}" (pid ${process.pid})`
		);

		const result = await this.application.execute(board);

		return result;
	}

	// https://github.com/OptimalBits/bull/blob/develop/REFERENCE.md#events
	@OnQueueCompleted()
	override async onCompleted(job: Job<BoardType>, result: TeamDto[]) {
		this.logger.verbose(`Completed Job id: "${job.id}"`);
		this.updateBoardService.updateChannelId(result);
	}
}
