import { Controller, Post } from '@nestjs/common';
import { IsPublic } from 'src/auth/decoratots/auth.decorator';
import { MockService } from './mock.service';

@Controller('mock')
export class MockController {
  constructor(private readonly mockService: MockService) {}

  @IsPublic()
  @Post('generate')
  async generateMockData() {
    return this.mockService.generateMockData();
  }
}
