import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { UserDocument, UserEntity } from '../entity/user.entity';
import { IDatabaseOptions } from 'src/database/interface/db.interface';
import { DatabaseHelperQueryContain } from 'src/database/decorators/db.decorator';
import { ENUM_USER_SIGN_UP_FROM, ENUM_USER_STATUS } from '../enums/user.enum';
import { AuthRegisterRequestDto } from 'src/modules/auth/dtos/request/auth.register.request.dto';
import { IAuthPassword } from 'src/modules/auth/interfaces/auth.interface';
import { HelperDateService } from 'src/core/helper/services/helper.date.service';
import { HelperStringService } from 'src/core/helper/services/helper.string.service';
import { plainToInstance } from 'class-transformer';
import { UserProfileResponseDto } from '../dtos/response/user.profile.response.dto';
import { Document } from 'mongoose';
import { UserUpdateUsernameRequestDto } from '../dtos/request/user.update-username.dto';
import { UserUpdateProfileRequestDto } from '../dtos/request/user.update-profile.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly dateService: HelperDateService,
    private readonly stringService: HelperStringService,
  ) {}

  async findAll(
    options?: IDatabaseOptions<UserDocument>,
  ): Promise<UserDocument[]> {
    return this.userRepository.findAll<UserDocument>(options);
  }

  async findTotal(options?: IDatabaseOptions<UserDocument>): Promise<number> {
    return this.userRepository.count(options);
  }

  async findOne(
    find: IDatabaseOptions<UserDocument>['find'],
    options?: IDatabaseOptions<UserDocument>,
  ): Promise<UserDocument> {
    return this.userRepository.findOne(find, options);
  }

  async findOneById(
    _id: string,
    options?: IDatabaseOptions<UserDocument>,
  ): Promise<UserDocument> {
    return this.userRepository.findOneById(_id, options);
  }

  async findOneByEmail(
    email: string,
    options?: IDatabaseOptions<UserDocument>,
  ): Promise<UserDocument> {
    return this.userRepository.findOne<UserDocument>({ email }, options);
  }

  async existByEmail(email: string): Promise<boolean> {
    return this.userRepository.findExists(
      DatabaseHelperQueryContain('email', email, { fullWord: true }),
    );
  }

  async existByUsername(username: string): Promise<boolean> {
    return this.userRepository.findExists(
      DatabaseHelperQueryContain('username', username, {
        fullWord: true,
      }),
    );
  }

  async createRandomUsername(): Promise<string> {
    const suffix = this.stringService.random(6);

    return `user-${suffix}`;
  }

  async signUp(
    { email, name }: AuthRegisterRequestDto,
    { passwordCreated, passwordExpired, passwordHash, salt }: IAuthPassword,
  ): Promise<UserDocument> {
    const username = await this.createRandomUsername();

    const form: UserEntity = new UserEntity();
    form.name = name;
    form.email = email;
    form.username = username;
    form.status = ENUM_USER_STATUS.ACTIVE;
    form.password = passwordHash;
    form.salt = salt;
    form.passwordCreated = passwordCreated;
    form.passwordExpired = passwordExpired;
    form.signUpDate = this.dateService.create();
    form.signUpFrom = ENUM_USER_SIGN_UP_FROM.PUBLIC;
    return this.userRepository.create(form);
  }

  async updateUsername(
    repository: UserDocument,
    { username }: UserUpdateUsernameRequestDto,
  ) {
    repository.username = username;
    repository.usernameUpdatedAt = this.dateService.create();
    return this.userRepository.save(repository);
  }

  async canUpdateUsername(user: UserDocument): Promise<boolean> {
    if (user.usernameUpdatedAt) {
      const now = this.dateService.create();
      const diff = this.dateService.getDiff(
        user.usernameUpdatedAt,
        now,
        'hours',
      );

      return diff > 1;
    }

    return true;
  }

  async updateProfile(
    repository: UserDocument,
    { name, gender }: UserUpdateProfileRequestDto,
  ) {
    repository.name = name;
    repository.gender = gender;
    repository.updatedAt = this.dateService.create();
    return this.userRepository.save(repository);
  }

  async canUpdateProfile(user: UserDocument): Promise<boolean> {
    if (user.updatedAt) {
      const now = this.dateService.create();
      const diff = this.dateService.getDiff(user.updatedAt, now, 'minutes');

      return diff > 1;
    }
    return true;
  }

  async mapProfile(user: UserDocument) {
    return plainToInstance(
      UserProfileResponseDto,
      user instanceof Document ? user.toObject() : user,
    );
  }
}
