import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guards';
import { GetDatedDataDTO } from 'src/models/metrics/dto/GetDatedDataDTO';
import { MetricsService } from 'src/services/metrics.service';

@Controller('metrics')
export class MetricsController {

    constructor(private readonly metricsService: MetricsService) {}

    @UseGuards(JwtAuthGuard)
    @Post('user/nbposts')
    async getNbPostsUser(@Request() req, @Body() dateParam : GetDatedDataDTO) {
        return this.metricsService.getNbPostsUser(req.user, dateParam);
    }

    @UseGuards(JwtAuthGuard)
    @Post('user/nblikesreceivedposts')
    async getNbLikesReceivedOnPostUser(@Request() req,  @Body() dateParam : GetDatedDataDTO) {
        return this.metricsService.getNbLikesReceivedOnPostUser(req.user, dateParam);
    }

    @UseGuards(JwtAuthGuard)
    @Post('user/nbcommentsreceived')
    async getNbCommentsReceivedUser(@Request() req, @Body() dateParam : GetDatedDataDTO) {
        return this.metricsService.getNbCommentsReceivedUser(req.user, dateParam);
    }

    @UseGuards(JwtAuthGuard)
    @Post('user/nbcommentsposted')
    async getNbCommentsPostedUser(@Request() req, @Body() dateParam: GetDatedDataDTO) {
        return this.metricsService.getNbCommentsPostedUser(req.user, dateParam);
    }

    @UseGuards(JwtAuthGuard)
    @Post('nbpostsperuser')
    async getNbPostsPerUser() {
        return this.metricsService.getNbPostsPerUser();
    }

    @UseGuards(JwtAuthGuard)
    @Post('user/nbpostsevolution')
    async getEvolutionNbPosts(@Request() req, @Body() dateParam : GetDatedDataDTO ) {
        return this.metricsService.getEvolutionNbPosts(req.user, dateParam);
    }

    @UseGuards(JwtAuthGuard)
    @Post('user/nblikesreceivedpostevolution')
    async getEvolutionLikesReceivedOnPostUser(@Request() req, @Body() dateParam : GetDatedDataDTO) {
        return this.metricsService.getEvolutionLikesReceivedOnPostUser(req.user, dateParam);
    }

    @UseGuards(JwtAuthGuard)
    @Get('wordcloud')
    async getWordsUsedInPosts() {
        return this.metricsService.getWordsUsedInPosts();
    }

}