import { Controller, Get, Post, Body, Param, Delete, Query, UseFilters, UseInterceptors, Req } from '@nestjs/common/decorators';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { GenderEnum, RoleEnum } from '@prisma/client';
import { HttpExceptionFilter, } from 'src/model/http-exception.filter';
import { BadRequestException, ClassSerializerInterceptor, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserEntity, UserProfileEntity } from './entities/user.entity';
import { Request } from 'express';
// import { IsAuthMiddleware } from 'src/middlewares/middlewares.service';


@Controller()
export class UserController {
  constructor(private readonly userService: UserService) { }

  // create user
  @UseFilters(HttpExceptionFilter)
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('/user')
  async create(@Req() req: Request, @Body() createUserDto: CreateUserDto) {
    const user = req.payload
    if (user.role !== 'ADMIN') throw new UnauthorizedException('🚫 User is Un-Authorized 🚫')
    if (!createUserDto.name) throw new BadRequestException('Name is required');
    if (!createUserDto.email) throw new BadRequestException('Email is required');
    if (!createUserDto.gender) throw new BadRequestException('Gender is required')
    if (!Object.values(GenderEnum).includes(createUserDto.gender.toUpperCase() as GenderEnum)) throw new BadRequestException('Gender is not valid')
    if (!createUserDto.role) throw new BadRequestException('Role is required');
    if (!Object.values(RoleEnum).includes(createUserDto.role.toUpperCase() as RoleEnum)) {
      throw new BadRequestException('Role is not valid');
    }
    if (!createUserDto.password) throw new BadRequestException('Password is required');
    if (createUserDto.password.length < 6) throw new BadRequestException('Password must be at least 6 characters');
    const isExist = await this.userService.findOneByEmail(createUserDto.email);
    if (isExist) {
      throw new BadRequestException('Email already exists');
    }
    const response = await this.userService.createUser(createUserDto);
    return new UserEntity(response)
  }

  // get all user
  @UseFilters(HttpExceptionFilter)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/user')
  async findAllUser(@Req() req: Request, @Query('role') role?: RoleEnum, @Query('gender') gender?: GenderEnum) {
    const userRole = req.payload?.role; // Access the role property from the payload object
    if (userRole !== 'ADMIN') {
      throw new UnauthorizedException('🚫 User is Un-Authorized 🚫')
    }
    if (role && !Object.values(RoleEnum).includes(role.toUpperCase() as RoleEnum)) {
      throw new BadRequestException()
    }
    if (gender && !Object.values(GenderEnum).includes(gender.toUpperCase() as GenderEnum)) {
      throw new BadRequestException()
    }
    const response = await this.userService.findAllUser(role, gender)
    return response.map(user => new UserEntity(user))
  }

  // get user by id
  @UseFilters(HttpExceptionFilter)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/user/:id')
  async findOne(@Param('id') id: number) {
    const res = await this.userService.findUserById(+id)
    if (!res) {
      throw new NotFoundException()
    }
    return new UserEntity(res)
  }

  @UseFilters(HttpExceptionFilter)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/profile')
  async getProfile(@Req() req: Request) {
    const payload = req.payload
    const userId = payload.userId
    const res = await this.userService.getProfile(+userId)
    if (!res) {
      throw new NotFoundException()
    }
    return new UserProfileEntity(res)
  }


  // delete user:
  @UseFilters(HttpExceptionFilter)
  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(':id')
  async deleteOne(@Req() req: Request, @Param('id') id: number) {
    const userRole = req.payload.role
    if (userRole !== 'ADMIN') {
      throw new UnauthorizedException('🚫 User is Un-Authorized 🚫')
    }
    const existingUser = await this.userService.findUserById(+id)
    if (!existingUser) throw new BadRequestException()
    const user = await this.userService.deleteUser(+id)
    return new UserEntity(user)
  }

  // @Get()
  // findAll() {
  //   return this.userService.findAll();
  // }

  // @Get(':id')
  // findByEmail(@Body('email') email: string) {
  //   return this.userService.findOneByEmail(email);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(+id);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userService.remove(+id);
  // }
}


