import { Global, Module } from "@nestjs/common";
import { ActivityLogService } from "./services/activity-log.service";

@Global()
@Module({
    providers: [ActivityLogService],
    exports: [ActivityLogService],
})
export class ActivityLogModule {}
