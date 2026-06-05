import Map "mo:core/Map";
import ImageStorageApi "mixins/image-storage-api";
import MixinObjectStorage "mo:caffeineai-object-storage/Mixin";
import Types "types/image-storage";
import HomebrewArtApi "mixins/homebrew-art-api";
import HomebrewArtTypes "types/homebrew-art";

actor {
  let characterImages : Map.Map<Types.CharacterId, Types.CharacterImageKey>;
  let homebrewArt : Map.Map<HomebrewArtTypes.HomebrewItemId, HomebrewArtTypes.HomebrewArtKey>;

  include MixinObjectStorage();
  include ImageStorageApi(characterImages);
  include HomebrewArtApi(homebrewArt);

  public query func health() : async Text { "ok" };
};
