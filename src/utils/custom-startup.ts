import {Category} from '../api-modules/category/category.entity';
import {EventLocation} from '../api-modules/event/event-modules/event-location/models/event-location.entity';
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
            event.startTime = startDate;
            startDate.setUTCDate(startDate.getUTCDate() + 3);
            event.endTime = startDate;
            event.totalOfPersons = 10;
            event.eventLocation = eventLocation[0];
            i++;
            startDate.setUTCDate(startDate.getUTCDate() + 3);
            payload.push(event);
        }
        return await Event.save(payload);
    }
}