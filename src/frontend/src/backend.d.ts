import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UploadResult {
    imageKey: CharacterImageKey;
    characterId: CharacterId;
}
export type CharacterId = string;
export type HomebrewItemId = string;
export type CharacterImageKey = string;
export type HomebrewArtKey = string;
export interface HomebrewArtResult {
    itemId: HomebrewItemId;
    artKey: HomebrewArtKey;
}
export interface backendInterface {
    deleteCharacterImage(characterId: CharacterId): Promise<void>;
    deleteHomebrewArt(itemId: HomebrewItemId): Promise<void>;
    getCharacterImageKey(characterId: CharacterId): Promise<CharacterImageKey | null>;
    getHomebrewArtKey(itemId: HomebrewItemId): Promise<HomebrewArtKey | null>;
    health(): Promise<string>;
    uploadCharacterImage(characterId: CharacterId, blobHash: CharacterImageKey): Promise<UploadResult>;
    uploadHomebrewArt(itemId: HomebrewItemId, artKey: HomebrewArtKey): Promise<HomebrewArtResult>;
}
