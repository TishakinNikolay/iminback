import {Injectable} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import {User} from '../../models/user.entity';
import {Context} from './models/context.models';
import {TokenPayload} from './models/token-payload.models';
import {Tokens} from './models/token.models';

@Injectable()
export class JwtService {
    public async createTokens(context: Context): Promise<Tokens> {
        let tokens: Tokens;

        const accessTokenPayload: TokenPayload = {
            expiresAt: Date.now() + Number(process.env.JWT_EXPIRES_IN) * 1000,
            context: {...context}
        };

        const refreshTokenPayload: TokenPayload = {
            expiresAt: Date.now() + Number(process.env.JWT_REFRESH_EXPIRES_IN) * 1000,
            context: {...context}
        };

        tokens = {
            expiresIn: Number(process.env.JWT_EXPIRES_IN),
            accessToken: jwt.sign(accessTokenPayload, String(process.env.JWT_SECRET)),
            refreshToken: jwt.sign(refreshTokenPayload, String(process.env.JWT_REFRESH_SECRET)),
            context: {...context},
            tokenType: String(process.env.JWT_TOKEN_TYPE)
        };

        return tokens;
    }

    public async tokensByUser(user: User): Promise<Tokens> {
        return this.createTokens({
            nickname: user.nickname,
            userId: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
        });
    }

    public getPayload(token: string, secret: string): TokenPayload {
        return jwt.verify(token, secret) as TokenPayload;
    }
}
