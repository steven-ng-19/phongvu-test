import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from '../services';
import { User } from '../models';

@Controller('users')
export class UsersController {
  constructor(private readonly _usersService: UsersService) {}

  // @Post()
  // create(@Body() createUserDto: CreateAddressDto) {
  //   return this._usersService.create(createUserDto);
  // }

  // @Get()
  // findAll() {
  //   return this._usersService.findAll();
  // }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this._usersService.findOne<User>(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateAddressDto) {
  //   return this._usersService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this._usersService.remove(+id);
  // }
}
