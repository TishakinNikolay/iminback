import { Module } from "@nestjs/common";
import { ObjectRemapperService } from "./base/object-remapper.service";

@Module({
    providers: [ObjectRemapperService],
    exports: [ObjectRemapperService]
})
export class SharedModule {

}