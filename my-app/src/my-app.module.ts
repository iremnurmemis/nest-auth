
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as path from 'path';
import { I18nModule, AcceptLanguageResolver, QueryResolver, HeaderResolver } from 'nestjs-i18n';
import { watch } from 'fs';

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage:'en',
      loaderOptions:{
        path:path.join(__dirname,'/i18n/'),
        watch:true,
      },
      resolvers:[
        {use:QueryResolver,options:['lang']},
        AcceptLanguageResolver,
      ]
    })
   
  ],
  controllers: [],
})
export class MyAppModule {}



// I18nModule.forRootAsync({
//   useFactory: (configService: ConfigService) => ({
//     fallbackLanguage: configService.getOrThrow('FALLBACK_LANGUAGE'),
//     loaderOptions: {
//       path: path.join(__dirname, '/i18n/'),
//       watch: true,
//     },
//   }),
//   resolvers: [
//     { use: QueryResolver, options: ['lang'] },
//     AcceptLanguageResolver,
//     new HeaderResolver(['x-lang']),
//   ],
//   inject: [ConfigService],
// }),