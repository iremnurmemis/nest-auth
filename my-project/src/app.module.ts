import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import * as path from 'path';
import { GoogleStrategy } from './strategies/google.strategy';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret:  'yourSecretKey',
      signOptions: { expiresIn: '1d' },
    }),
    I18nModule.forRoot({
      fallbackLanguage:'en',
      loaderOptions:{
        path: path.join('apps/my-project/src/i18n'),
       
        watch:true,
      },
      resolvers:[
        //{use:QueryResolver,options:['lang']},
        AcceptLanguageResolver,
      ],
    }),
    AuthModule,
      
  ],
  controllers: [AppController],
  providers: [AppService,GoogleStrategy],
})
export class AppModule {}
