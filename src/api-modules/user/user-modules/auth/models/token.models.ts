import {Context} from './context.models';

export class Tokens {
    public expiresIn!: number;
    public accessToken!: string;
    public refreshToken!: string;
    public context!: Context;
    public tokenType!: string;
}
