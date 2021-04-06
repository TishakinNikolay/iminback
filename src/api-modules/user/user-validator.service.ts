import {forwardRef, Inject, Injectable} from '@nestjs/common';
import {UserErrorEnum} from './enums/user-error.enum';
import {UserAlreadyExistsError} from './errors/user-already-exists.error';
import {UserFindError} from './errors/user-find.error';
import {User} from './models/user.entity';
import {UserRepository} from './user.repository';

@Injectable()
export class UserValidatorService {
    constructor(@Inject(forwardRef(() => UserRepository))
                private readonly userRepository: UserRepository
    ) {

    }

    public async validateSameUserByPhoneAndNickname(phone: string, nickname: string) {
        const sameUser = await User.findOne({
            where: [
                {
                    phone: phone
                },
                {
                    nickname: nickname
                }
            ]
        });

        if (sameUser) {
            throw new UserAlreadyExistsError();
        }
    }

    public async validateUserById(userId: number) {
        const user = await this.userRepository.getUserById(userId);
        if (!user) {
            throw new UserFindError([
                {
                    type: UserErrorEnum.NOT_FOUND,
                    details: 'Not found user by id: ' + userId
                }
            ]);
        }
    }
}