import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Example } from './schemas/example.schema';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Example.name) private exampleModel: Model<Example>,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getAllExamples() {
    return this.exampleModel.find().exec();
  }
}
