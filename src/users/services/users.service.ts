import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "../entities/user.entity";
import { CreateUserInput } from "../dto/create-user.input";
import { UpdateUserInput } from "../dto/update-user.input";
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) {}

    async create(input: CreateUserInput): Promise<UserEntity> {
        const hashedPassword = await bcrypt.hash(input.password, 10);
        const user = this.userRepository.create({
            ...input,
            password: hashedPassword,
        });
        return this.userRepository.save(user);
    }

    async findByEmail(email: string): Promise<UserEntity> {
        return this.userRepository.findOne({
            where: { email },
            relations: ["permissions", "permissions.permission"], // добавляем связи
        });
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

        if (input.password) {
            input.password = await bcrypt.hash(input.password, 10);
        }

        const updatedUser = Object.assign(user, input);
        return this.userRepository.save(updatedUser);
    }

    async remove(id: string): Promise<boolean> {
        const user = await this.findOne(id);
        await this.userRepository.remove(user);
        return true;
    }
}
