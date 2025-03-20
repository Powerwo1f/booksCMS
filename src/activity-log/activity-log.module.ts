import { Module } from "@nestjs/common";
import { ActivityLogService } from "./services/activity-log.service";

@Module({
    providers: [ActivityLogService],
    exports: [ActivityLogService],
})
export class ActivityLogModule {}
