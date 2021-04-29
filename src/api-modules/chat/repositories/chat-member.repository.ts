import {EntityRepository, Repository} from 'typeorm';
import {ChatMember} from '../models/chat-member.entity';

@EntityRepository(ChatMember)
export class ChatMemberRepository extends Repository<ChatMember> {}