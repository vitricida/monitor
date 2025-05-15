import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AreaSelectionModule } from './features/area-selection/area-selection.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AreaSelectionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
