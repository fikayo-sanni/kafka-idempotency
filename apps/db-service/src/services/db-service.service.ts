import { CreateUserDto } from '@app/common/dto/create-user.dto';
import { UpdateUserDto } from '@app/common/dto/update-user.dto';
import { Injectable, Logger } from '@nestjs/common';
import { User } from 'libs/common/src/db/models/user.model';

@Injectable()
export class DbServiceService {
  constructor(
    private readonly userModel: typeof User,
    private readonly logger: Logger,
  ) {}

  async create(data: CreateUserDto): Promise<User> {
    return this.userModel.create({ ...data });
  }

  async findAll(): Promise<Array<User>> {
    return this.userModel.findAll();
  }

  async findById(id: number): Promise<User> {
    return this.userModel.findByPk(id);
  }

  async update(data: UpdateUserDto) {
    const { id, ...user } = data;

    return this.userModel.update(user, { where: { id } });
  }

  async delete(id: number): Promise<number> {
    return this.userModel.destroy({
      where: { id },
    });
  }
}
