import { Injectable } from '@nestjs/common';
import { Document } from 'mongoose';
import { plainToInstance } from 'class-transformer';
import { TaskRepository } from '../repository/task.repository';
import { HelperDateService } from 'src/core/helper/services/helper.date.service';
import { UserDocument } from 'src/modules/user/entity/user.entity';
import { TaskDocument, TaskEntity } from '../entity/task.entity';
import { ENUM_TASK_STATUS } from '../enums/task.enum';
import { TaskCreateRequestDto } from '../dtos/request/task.create.request.dto';
import { IDatabaseOptions } from 'src/database/interface/db.interface';
import { PaginatedDto, PaginatedMetaDto } from 'src/common/dto/paginated.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { TaskListResponseDto } from '../dtos/response/task.list.response.dto';
import { TaskUpdateRequestDto } from '../dtos/request/task.update.request.dto';

@Injectable()
export class TaskService {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly dateService: HelperDateService,
  ) {}

  async createByUser(
    user: UserDocument,
    { title, description }: TaskCreateRequestDto,
  ): Promise<TaskDocument> {
    const createdAt = this.dateService.create();
    const task: TaskEntity = new TaskEntity();
    task.user = user._id;
    task.by = user._id;
    task.title = title;
    task.description = description;
    task.status = ENUM_TASK_STATUS.ONGOING;
    task.createdAt = createdAt;
    task.updatedAt = createdAt;

    return this.taskRepository.create<TaskEntity>(task);
  }

  async updateTask(
    task: TaskDocument,
    { title, description, status }: TaskUpdateRequestDto,
  ) {
    task.title = title ?? task.title;
    task.description = description ?? task.description;
    task.status = status ?? task.status;
    task.updatedAt = this.dateService.create();

    return this.taskRepository.save(task);
  }

  async findAllByUser(user: string, options?: IDatabaseOptions<TaskDocument>) {
    return this.taskRepository.findAll<TaskDocument>({
      find: { user },
      paging: options?.paging,
      join: true,
    });
  }

  async findOneById(
    _id: string,
    options?: IDatabaseOptions<TaskDocument>,
  ): Promise<TaskDocument> {
    return this.taskRepository.findOneById(_id, options);
  }

  async deleteTaskById(_id: string) {
    return this.taskRepository.deleteOneById(_id);
  }

  async getTotalByUser(user: string): Promise<number> {
    return this.taskRepository.count({ find: { user } });
  }

  async mapList(items: TaskDocument[], total: number, paging: PaginationDto) {
    return new PaginatedDto(
      plainToInstance(
        TaskListResponseDto,
        items.map((item: TaskDocument) =>
          item instanceof Document ? item.toObject() : item,
        ),
      ),
      new PaginatedMetaDto(total, paging),
    );
  }
}
