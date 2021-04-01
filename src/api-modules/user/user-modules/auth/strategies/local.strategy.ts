import {PassportStrategy} from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import {UserErrorEnum} from '../../../enums/user-error.enum';
import {UserFindError} from '../../../errors/user-find.error';
import {User} from '../../../models/user.entity';

export class LocalStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET
        });
    }

    public async validate(payload) {
        const {id} = payload;
        const user = await User.findOne(id);

        if (user) {
            return user;
        } else {
            throw new UserFindError([
                {
                    type: UserErrorEnum.NOT_FOUND,
                    details: 'Not found user by id: ' + id
                }
            ]);
        }
    }
}