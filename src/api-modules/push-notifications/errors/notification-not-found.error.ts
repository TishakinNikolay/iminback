import {ResponseError} from "../../_shared/models/response-error.model";
import {EventErrors} from "../../event/enums/event-errors.enum";
import {PushNotificationErrosEnum} from "../enums/push-notification-erros.enum";

export class NotificationNotFoundError extends ResponseError  {
    public readonly message = 'Not found notification';
    public readonly statusCode = 404;
    public readonly typeError: string = PushNotificationErrosEnum.NOTIFICATION_NOT_FOUND;
    public errorDetails: any;

    constructor(details: any) {
        super();
        this.errorDetails = details;
    }
}
