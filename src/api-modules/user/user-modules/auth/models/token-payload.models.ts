import {Context} from './context.models';

export class TokenPayload {
    public context!: Context;
    public expiresAt!: number;
}