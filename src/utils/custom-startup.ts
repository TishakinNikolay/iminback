import {MoreThanOrEqual} from 'typeorm';
import {ChatMember} from '../api-modules/chat/models/chat-member.entity';
import {Chat} from '../api-modules/chat/models/chat.entity';
import {EventLocation} from '../api-modules/event/event-modules/event-location/models/event-location.entity';
import {StatusEnum} from '../api-modules/event/event-modules/event-member/enums/status.enum';
import {EventMember} from '../api-modules/event/event-modules/event-member/models/event-member.entity';
import {EventReactionType} from '../api-modules/event/event-modules/event-reaction/enums/event-reaction-type.enum';
import {EventReaction} from '../api-modules/event/event-modules/event-reaction/models/event-reaction.entity';
import {Event} from '../api-modules/event/models/event.entity';
import {Image} from '../api-modules/image/models/image.entity';
import {User} from '../api-modules/user/models/user.entity';

export class CustomStartup {
    public static async run() {
        const allimages = await Image.find({relations: ['category']});
        const user = await User.findOne(7);
        const eventLocation = await EventLocation.find();
        const startDate = new Date();
        startDate.setUTCFullYear(2022);

        const payload = [];
        let i = 1;
        for(let im of allimages) {
            const event = new Event();
            event.image = im;
            event.categories = [im.category];
            event.owner = user;
            event.title = 'Test Event #' + i;
            event.description = 'Lorem impsum дальше не помню #' + i;
            event.startTime = new Date(startDate);
            startDate.setUTCDate(startDate.getUTCDate() + 3);
            event.endTime = new Date(startDate);
            event.totalOfPersons = 10;
            event.eventLocation = eventLocation[0];
            i++;
            startDate.setUTCDate(startDate.getUTCDate() + 3);
            payload.push(event);
        }
        await Event.save(payload);
        return Promise.resolve()
    }

    public static async run_images() {
        const events = await Event.find({take: 176});
        const imgs =  await Image.find({where:{isActive:true}});
        console.log(imgs);
        imgs.forEach((img,i) => {
            events[i].image = img;
        });
        console.log(events);
        return await Event.save(events);
    }

    public static async run_members() {
        const events = await Event.find();
        const users = await User.find({where:{id : MoreThanOrEqual(31)}})
        const members = []
        events.forEach((event,i) => {
            users.forEach((usr, i) => {
                const eventMemer = new EventMember();
                eventMemer.userId = usr.id;
                eventMemer.status = StatusEnum.APPROVED;
                eventMemer.approvalDate = new Date();
                eventMemer.eventId = event.id;
                members.push(eventMemer);
            });
        });
        return await EventMember.save(members);
    }

    public static async run_dis() {
        const user = new User();
        user.id = 8;
        const events = await Event.find();
        const reacts = [];
        events.forEach( event => {
          const react = new EventReaction();
          react.eventId = event.id;
          react.userId = 8;
          react.reactionType = EventReactionType.ADD_TO_FAVORITE;
          reacts.push(react);
        });
        return EventReaction.save(reacts);
    }
}