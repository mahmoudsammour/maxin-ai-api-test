import { Body, Controller, Get, Param, Put, Query, Delete } from '@nestjs/common';
import { CreateUserDto } from './dto/user-body';
import { UserType } from './types/user-type';
import { UserService } from './user.service';

@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  async getUsersList(@Query('page') page: number = 0): Promise<UserType[]> {
    const users = await this.userService.find(page);
    return users;
  }

  @Get(':id')
  async getUserByID(@Param('id') id: number): Promise<UserType> {
    const user = await this.userService.findOne(id);
    return user;
  }

  @Delete(':id')
  async deleteUserByID(@Param('id') id: number): Promise<boolean> {
    const isDeleted = await this.userService.deleteOne(id);
    return isDeleted;
  }

  @Put('/:id')
  async updateUser(@Param('id') id: number, @Body() body: CreateUserDto): Promise<boolean> {
    const isUpdated = await this.userService.updateUser(id, body);
    return isUpdated;
  }
}
