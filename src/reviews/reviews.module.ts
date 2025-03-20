import { Module } from "@nestjs/common";
import { ReviewsService } from "./services/reviews.service";
import { ReviewResolver } from "./resolvers/reviews.resolver";

@Module({
    providers: [ReviewsService, ReviewResolver],
    exports: [ReviewsService],
})
export class ReviewsModule {}
