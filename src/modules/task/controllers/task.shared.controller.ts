import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ClientSession, Connection } from 'mongoose';
import { InjectDatabaseConnection } from 'src/database/decorators/db.decorator';
import { TaskService } from '../services/task.service';
import {
  AuthJwtAccessProtected,
  AuthJwtPayload,
} from 'src/modules/auth/decorators/auth.jwt.decorator';
import { UserDocument } from 'src/modules/user/entity/user.entity';
import { UserParsePipe } from 'src/modules/user/pipes/user.parse.pipe';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { TaskCreateRequestDto } from '../dtos/request/task.create.request.dto';
import { TaskUpdateParamDto } from '../dtos/request/task.update.param.dto';
import { TaskUpdateRequestDto } from '../dtos/request/task.update.request.dto';
import { ActivityService } from 'src/modules/activity/services/activity.service';
import { ENUM_ACTIVITY_TYPE } from 'src/modules/activity/enums/activity.enum';

@Controller({
  path: '/task',
})
export class TaskSharedController {
  constructor(
    @InjectDatabaseConnection()
    private readonly databaseConnection: Connection,
    private readonly taskService: TaskService,
    private readonly activityService: ActivityService,
  ) {}

  @AuthJwtAccessProtected()
  @Get('/list')
  async list(
    @AuthJwtPayload('_id', UserParsePipe)
    user: UserDocument,
    @Query()
    { page, per_page }: PaginationDto,
  ) {
    const tasks = await this.taskService.findAllByUser(user._id, {
      paging: {
        limit: per_page,
        offset: per_page * (page - 1),
      },
    });
    const total = await this.taskService.getTotalByUser(user._id);

    return await this.taskService.mapList(tasks, total, {
      page,
      per_page,
    });
  }

  @AuthJwtAccessProtected()
  @Post('/')
  async createTask(
    @AuthJwtPayload('_id', UserParsePipe)
    user: UserDocument,
    @Body()
    { title, description }: TaskCreateRequestDto,
  ) {
    const session: ClientSession = await this.databaseConnection.startSession();
    session.startTransaction();

    try {
      const task = await this.taskService.createByUser(user, {
        title,
        description,
      });
      await this.activityService.createByUser(user, {
        description: `User create task: ${title}`,
        type: ENUM_ACTIVITY_TYPE.TASK,
        type_id: task._id,
      });

      await session.commitTransaction();
      await session.endSession();

      return { message: 'Task created' };
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();

      throw new InternalServerErrorException({
        message: 'internalServerError',
        _error: error.message,
      });
    }
  }

  @AuthJwtAccessProtected()
  @Put('/:uuid')
  async updateTask(
    @AuthJwtPayload('_id', UserParsePipe)
    user: UserDocument,
    @Param() { uuid }: TaskUpdateParamDto,
    @Body()
    { title, description, status }: TaskUpdateRequestDto,
  ) {
    if (!title && !description && !status) {
      throw new UnprocessableEntityException({
        message: 'At least one data to update',
      });
    }

    const task = await this.taskService.findOneById(uuid);
    if (!task) {
      throw new NotFoundException({
        message: 'Task Not Found',
      });
    }

    const session: ClientSession = await this.databaseConnection.startSession();
    session.startTransaction();

    try {
      // const {
      //   title: oldTitle,
      //   description: oldDescription,
      //   status: oldStatus,
      // } = task;

      await this.taskService.updateTask(task, {
        title,
        description,
        status,
      });

      // await this.activityService.createByUser(user, {
      //   description: `User updated task: ${title}`,
      // });

      await session.commitTransaction();
      await session.endSession();

      return { message: 'Task updated' };
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();

      throw new InternalServerErrorException({
        message: 'internalServerError',
        _error: error.message,
      });
    }
  }

  @AuthJwtAccessProtected()
  @Delete('/:uuid')
  async deleteTask(
    @AuthJwtPayload('_id', UserParsePipe)
    user: UserDocument,
    @Param() { uuid }: TaskUpdateParamDto,
  ) {
    const task = await this.taskService.findOneById(uuid);
    if (!task) {
      throw new NotFoundException({
        message: 'Task Not Found',
      });
    }

    const session: ClientSession = await this.databaseConnection.startSession();
    session.startTransaction();

    try {
      const { _id, title } = task;
      await this.taskService.deleteTaskById(uuid);
      await this.activityService.createByUser(user, {
        description: `User deleted task: ${title}`,
        type: ENUM_ACTIVITY_TYPE.TASK,
        type_id: _id,
      });

      await session.commitTransaction();
      await session.endSession();

      return { message: 'Task deleted' };
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();

      throw new InternalServerErrorException({
        message: 'internalServerError',
        _error: error.message,
      });
    }
  }
}
