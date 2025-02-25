import { Test, TestingModule } from '@nestjs/testing';
import BoardsController from 'src/modules/boards/controller/boards.controller';
import * as Boards from 'src/modules/boards/interfaces/types';
import SocketGateway from 'src/modules/socket/gateway/socket.gateway';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { GetBoardGuard } from 'src/libs/guards/getBoardPermissions.guard';
import { BoardUserGuard } from 'src/libs/guards/boardRoles.guard';
import { BoardPhases } from 'src/libs/enum/board.phases';
import { UpdateBoardApplicationInterface } from '../interfaces/applications/update.board.application.interface';
import { CreateBoardApplicationInterface } from '../interfaces/applications/create.board.application.interface';
import { GetBoardApplicationInterface } from '../interfaces/applications/get.board.application.interface';
import { DeleteBoardApplicationInterface } from '../interfaces/applications/delete.board.application.interface';

describe('BoardsController', () => {
	let controller: BoardsController;
	let updateBoardAppMock: DeepMocked<UpdateBoardApplicationInterface>;
	const boardPhaseDto = { boardId: '6405f9a04633b1668f71c068', phase: BoardPhases.ADDCARDS };

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [BoardsController],
			providers: [
				{
					provide: Boards.TYPES.applications.CreateBoardApplication,
					useValue: createMock<CreateBoardApplicationInterface>()
				},
				{
					provide: Boards.TYPES.applications.GetBoardApplication,
					useValue: createMock<GetBoardApplicationInterface>()
				},
				{
					provide: Boards.TYPES.applications.UpdateBoardApplication,
					useValue: createMock<UpdateBoardApplicationInterface>()
				},
				{
					provide: Boards.TYPES.applications.DeleteBoardApplication,
					useValue: createMock<DeleteBoardApplicationInterface>()
				},
				{
					provide: SocketGateway,
					useValue: createMock<SocketGateway>()
				}
			]
		})
			.overrideGuard(GetBoardGuard)
			.useValue({ canActivate: () => true })
			.overrideGuard(BoardUserGuard)
			.useValue({ canActivate: () => true })
			.compile();
		controller = module.get<BoardsController>(BoardsController);
		updateBoardAppMock = module.get(Boards.TYPES.applications.UpdateBoardApplication);
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	describe('updateBoardPhase', () => {
		it('should be defined', () => {
			expect(controller.updateBoardPhase).toBeDefined();
		});

		it('should recieve boardPhaseDto in updateBoardApp and be called once', async () => {
			await controller.updateBoardPhase(boardPhaseDto);
			expect(updateBoardAppMock.updatePhase).toHaveBeenNthCalledWith(1, boardPhaseDto);
		});
	});
});
