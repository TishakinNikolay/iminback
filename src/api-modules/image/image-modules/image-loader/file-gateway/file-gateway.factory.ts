import {DropboxGatewayStrategy} from './strategies/dropbox-gateway-strategy';
import {FileGatewayStrategiesEnum} from './strategies/file-gateway-strategies.enum';
import {LocalFsGatewayStrategy} from './strategies/local-fs-gateway-strategy';

export class FileGatewayFactory {
    // @ts-ignore
    private static strategies = new Map([
        [FileGatewayStrategiesEnum.LOCAL_FS, LocalFsGatewayStrategy],
        [FileGatewayStrategiesEnum.DROPBOX , DropboxGatewayStrategy]
    ]);

    public static getFileGatewayIstance() {
        return new (FileGatewayFactory.strategies.get(process.env.IMAGE_STORAGE_STRATEGY as FileGatewayStrategiesEnum))();
    }
}