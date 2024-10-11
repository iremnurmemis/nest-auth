import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { I18nContext , I18n} from 'nestjs-i18n';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @Get()
  // getHello(@I18n() i18n:I18nContext){
  //   return `iremnur ${i18n.t('test.success.password_changed')}`;
  // }

  
  
}
