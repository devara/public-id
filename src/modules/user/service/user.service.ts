import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { UserDocument, UserEntity } from '../entity/user.entity';
import { IDatabaseOptions } from 'src/database/interface/db.interface';
import { DatabaseHelperQueryContain } from 'src/database/decorators/db.decorator';
import { ENUM_USER_SIGN_UP_FROM, ENUM_USER_STATUS } from '../enum/user.enum';
import { AuthRegisterRequestDto } from 'src/modules/auth/dtos/request/auth.register.request.dto';
import { IAuthPassword } from 'src/modules/auth/interfaces/auth.interface';
import { HelperDateService } from 'src/core/helper/services/helper.date.service';
import { plainToInstance } from 'class-transformer';
import { UserProfileResponseDto } from '../dtos/response/user.profile.response.dto';
import { Document } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly dateService: HelperDateService,
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

  async signUp(
    { email, name }: AuthRegisterRequestDto,
    { passwordCreated, passwordExpired, passwordHash, salt }: IAuthPassword,
  ): Promise<UserDocument> {
    const form: UserEntity = new UserEntity();
    form.name = name;
    form.email = email;
    form.status = ENUM_USER_STATUS.ACTIVE;
    form.password = passwordHash;
    form.salt = salt;
    form.passwordCreated = passwordCreated;
    form.passwordExpired = passwordExpired;
    form.signUpDate = this.dateService.create();
    form.signUpFrom = ENUM_USER_SIGN_UP_FROM.PUBLIC;
    return this.userRepository.create(form);
  }

  async mapProfile(user: UserDocument) {
    return plainToInstance(
      UserProfileResponseDto,
      user instanceof Document ? user.toObject() : user,
    );
  }
}
