import { Module } from "@nestjs/common";
import { ReviewsService } from "./services/reviews.service";
import { ReviewResolver } from "./resolvers/reviews.resolver";
import { ActivityLogModule } from "../activity-log/activity-log.module";

@Module({
    imports: [ActivityLogModule],
    providers: [ReviewsService, ReviewResolver],
    exports: [ReviewsService],
})
export class ReviewsModule {}
