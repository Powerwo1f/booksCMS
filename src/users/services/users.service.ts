import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "../entities/user.entity";
import { CreateUserInput } from "../dto/create-user.input";
import { UpdateUserInput } from "../dto/update-user.input";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
    ) {}

    async create(input: CreateUserInput): Promise<UserEntity> {
        const user = this.userRepository.create(input);
        return this.userRepository.save(user);
    }

    async findAll(): Promise<UserEntity[]> {
        return this.userRepository.find();
    }

    async findOne(id: string): Promise<UserEntity> {
        const user = await this.userRepository.findOneBy({ id });
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }

    async update(id: string, input: Partial<UpdateUserInput>): Promise<UserEntity> {
        const user = await this.findOne(id);
        const updatedUser = Object.assign(user, input);
        return this.userRepository.save(updatedUser);
    }

    async remove(id: string): Promise<boolean> {
        const user = await this.findOne(id);
        await this.userRepository.remove(user);
        return true;
    }
}
