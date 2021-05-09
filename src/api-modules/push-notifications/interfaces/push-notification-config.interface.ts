export interface IPushNotificationConfig {
    gcm: IPushNotificationGCM
}

export interface IPushNotificationGCM {
    id: string
    phonegap: boolean
}
