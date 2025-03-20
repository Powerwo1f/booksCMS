import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ActivityLogService } from "./activity-log/services/activity-log.service";
import { ActivityLogInterceptor } from "./activity-log/interceptors/activity-log.interceptor";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const activityLogService = app.get(ActivityLogService);
    app.useGlobalInterceptors(new ActivityLogInterceptor(activityLogService));

    await app.listen(3000);
}
bootstrap();
