import Map "mo:core/Map";
import Types "../types/image-storage";

module {
  public type CharacterId = Types.CharacterId;
  public type CharacterImageKey = Types.CharacterImageKey;

  /// Store or overwrite the image key for a character.
  public func setImage(
    characterImages : Map.Map<CharacterId, CharacterImageKey>,
    characterId : CharacterId,
    imageKey : CharacterImageKey,
  ) {
    characterImages.add(characterId, imageKey);
  };

  /// Retrieve the image key for a character, if one has been uploaded.
  public func getImageKey(
    characterImages : Map.Map<CharacterId, CharacterImageKey>,
    characterId : CharacterId,
  ) : ?CharacterImageKey {
    characterImages.get(characterId);
  };

  /// Remove the image entry for a character.
  public func removeImage(
    characterImages : Map.Map<CharacterId, CharacterImageKey>,
    characterId : CharacterId,
  ) {
    characterImages.remove(characterId);
  };
};
