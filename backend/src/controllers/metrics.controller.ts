import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guards';
import { MetricsService } from 'src/services/metrics.service';

@Controller('metrics')
export class MetricsController {

    constructor(private readonly metricsService: MetricsService) {}

    @UseGuards(JwtAuthGuard)
    @Get('user/nbposts')
    async getNbPostsUser(@Request() req) {
        return this.metricsService.getNbPostsUser(req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Get('user/nblikes')
    async getNbLikesUser(@Request() req) {
        return this.metricsService.getNbLikesUser(req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Get('user/nbpostssevendays')
    async getNbPostsUserSinceSevenDays(@Request() req) {
        return this.metricsService.getNbPostsUserSinceSevenDays(req.user);
    }

}