import { Injectable } from '@nestjs/common';
import { UserType } from './types/user-type';
import { resolve } from 'path';
import { readFileSync, writeFileSync } from 'fs';
import { isEmpty } from 'lodash';

import * as Papa from 'papaparse';

const csvFilePath: string = resolve('src', 'data', 'MOCK_DATA.csv');
const limit = 20;

@Injectable()
export class UserService {
  private async fetch(): Promise<UserType[]> {
    return new Promise((resolve, reject) => {
      const csvFile = readFileSync(csvFilePath);
      const csvData = csvFile.toString();
      Papa.parse(csvData, {
        header: true,
        complete: results => {
          if (!isEmpty(results.errors)) {
            return reject(results);
          }
          return resolve(results.data);
        }
      });
    })
  }

  async find(page: number): Promise<UserType[]> {
    if (page < 0) {
      throw new Error("Page parameter should be more than 0")
    }
    const startIndex = page * limit;
    const users = await this.fetch();

    if (users.length <= startIndex) {
      return [];
    }
    const result = users.slice(startIndex, startIndex + limit);
    return result;
  }


  async findOne(id: number): Promise<UserType> {
    const users = await this.fetch()
    const user = users.find(user => user.id === id);
    return user;
  }

  async deleteOne(id: number): Promise<boolean> {
    const users = await this.fetch();
    const isUserExist = users.find(u => u.id === id);
    if (isEmpty(isUserExist)) {
      return false;
    }
    const usersExceptDeletedUser = users.filter(u => u.id !== id);
    let usersToSave = Papa.unparse(usersExceptDeletedUser);
    writeFileSync(csvFilePath, usersToSave);
    return true;
  }

  async updateUser(id: number, user: Partial<UserType>): Promise<boolean> {
    const users = await this.fetch();
    const usersExceptUpdatedUser = users.map(u => u.id !== id ? u : { ...u, ...user });
    let usersToSave = Papa.unparse(usersExceptUpdatedUser);
    writeFileSync(csvFilePath, usersToSave);
    return true;
  }
}
