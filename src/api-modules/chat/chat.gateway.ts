import {
    ConnectedSocket, MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
} from "@nestjs/websockets";
import {ChatService} from "./chat.service";
import { Socket, Server } from 'socket.io'
import {User} from "../user/models/user.entity";
import {MessageChatRequestDto} from "./models/dto/request/message-chat-request.dto";
import {LeftChatRequestDto} from "./models/dto/request/left-chat-request.dto";
import {TypingChatRequestDto} from "./models/dto/request/typing-chat-request.dto";
import {JwtService} from "../user/user-modules/auth/jwt.service";
import {RedisService} from "nestjs-redis";
import {setUserIdAndSocketIdOnRedis} from "./redis-chat.utils";

@WebSocketGateway()
export class ChatGateway implements
    OnGatewayConnection,
    OnGatewayDisconnect {
    constructor(
        private chatService: ChatService,
        private jwtService: JwtService,
        private readonly redisService: RedisService,
    ) {}

    @WebSocketServer()
    server: Server

    @SubscribeMessage('joinChat')
    async handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() payload: any) {
        const {context: {userId, nickname},} = this.getUserBySocket(client)

        const {eventId} = payload
        const user = await User.findOne(userId)
        const chat = await this.chatService.getChatByEventId(eventId, ['event'])

        const isJoined = await this.chatService.addChatMemberOnApprove(userId, eventId)
        const args = {nickname: user.nickname, isJoined}

        if(isJoined) {
            client.emit('already joined')
        }
        client.join(chat.event.title)

        console.log(`Client joinChat ${nickname}`)
        this.server.to(chat.event.title).emit('joinChat', args)
        return
    }

    @SubscribeMessage('chatMsg')
    async handleChatMessage(client: Socket, payload: MessageChatRequestDto) {
        const {context: {userId, nickname},} = this.getUserBySocket(client)
        const user = await User.findOne(userId)
        const {chatId, text} = payload

        console.log(chatId)

        const chat = await this.chatService.getChatById(chatId, ['event', 'chatMembers'])

        await this.chatService.postMessage(userId,chatId,text)
        const args = {nickname: user.nickname, text}

        console.log(`Client chatMsg ${nickname}`)
        this.server.to(chat.event.title).emit('chatMsgToClient', args)
    }

    @SubscribeMessage('leftChat')
    async handleChatLeft(client: Socket, payload: LeftChatRequestDto) {
        const {context: {userId, nickname},} = this.getUserBySocket(client)
        const {eventId} = payload
        const user = await User.findOne(userId)
        const chat = await this.chatService.getChatByEventId(eventId, ['event'])

        await this.chatService.removeChatMemberOnDecline(userId, eventId)

        const args = {nickname: user.nickname}
        console.log(`Client userLeft ${nickname}`)
        this.server.to(chat.event.title).emit('leftChat', args)
    }

    @SubscribeMessage('chatTyping')
    async chatTyping(client: Socket, payload: TypingChatRequestDto) {
        const {context} = this.getUserBySocket(client)
        console.log(`Client chatTyping ${context.nickname}`)
        client.broadcast.emit('chatTyping', `${context.nickname}`)
    }

    @SubscribeMessage('stopTyping')
    async stopTyping(client: Socket, payload: TypingChatRequestDto) {
        const {context} = this.getUserBySocket(client)
        console.log(`Client stopTyping ${context.nickname}`)
        client.broadcast.emit('stopTyping', `${payload.nickname}`)
    }

    async handleConnection(client: Socket, ...args: any[]) {
        console.log(client.handshake.query)
        const {context} = this.getUserBySocket(client)
        await setUserIdAndSocketIdOnRedis(this.redisService, String(context.userId), client.id)

        const chats = await this.chatService.getUserChats(await User.findOne(context.userId), 0, 50000000)
        const joinChats = chats.map((i) => {
            return i.event.title
        })

        client.join(joinChats)

        console.log(`Client connected: ${client.id}`)
        console.log(`User connected: ${context.nickname}`)
    }

    async handleDisconnect(client: any) {
        const {context: {userId, nickname}} = this.getUserBySocket(client)
        await this.redisService.getClient().del(`users:${userId}`);

        console.log(`Client disconnected: ${client.id}`)
        console.log(`User disconnected: ${nickname}`)
    }

    private getUserBySocket(client) {
        return this.jwtService.getPayload(String((client.handshake.query as any).token), String(process.env.JWT_SECRET))
    }
}
