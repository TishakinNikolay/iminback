import {ResponseError} from "../../_shared/models/response-error.model";
import {PushNotificationTemplateErrors} from "../enums/push-notification-template-errors";

export class NotificationTemplateNotFoundError extends ResponseError  {
    public readonly message = 'Not found notification template';
    public readonly statusCode = 404;
    public readonly typeError: string = PushNotificationTemplateErrors.NOTIFICATION_TEMPLATE_NOT_FOUND;
    public errorDetails: any;

    constructor(details: any) {
        super();
        this.errorDetails = details;
    }
}
