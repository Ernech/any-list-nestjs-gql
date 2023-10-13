import { Injectable } from '@nestjs/common';

@Injectable()
export class SeedService {

    constructor(){}

    async executeSeed():Promise<Boolean>{
        return true;
    }

}
