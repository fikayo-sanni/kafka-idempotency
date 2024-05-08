import { CreateUserDto } from '@app/common/dto/create-user.dto';
import { UpdateUserDto } from '@app/common/dto/update-user.dto';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { User } from 'libs/common/src/db/models/user.model';

@Injectable()
export class DbServiceService {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly userModel: typeof User,
    private readonly logger: Logger,
  ) {}

  async create(data: CreateUserDto): Promise<User> {
    try {
      return (await this.userModel.create({ ...data })).get({
        plain: true,
      });
    } catch (e) {
      throw e;
    }
  }

  async findAll(): Promise<Array<User>> {
    return this.userModel.findAll();
  }

  async findById(id: number): Promise<User> {
    const user = (await this.userModel.findByPk(id)).get({ plain: true });

    return user;
  }

  async update(data: UpdateUserDto) {
    try {
      const { id, ...user } = data;
      this.userModel.update(user, { where: { id } });
    } catch (e) {
      this.logger.log(e);
      throw e;
    }
  }

  async delete(id: number): Promise<number> {
    return this.userModel.destroy({
      where: { id },
    });
  }
}
