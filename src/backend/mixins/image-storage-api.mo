import Map "mo:core/Map";
import ImageStorageLib "../lib/image-storage";
import Types "../types/image-storage";

mixin (characterImages : Map.Map<Types.CharacterId, Types.CharacterImageKey>) {

  /// Associate a character portrait with a pre-uploaded blob hash.
  /// The client first uploads the image blob via the Caffeine object storage
  /// service (which returns a blobHash), then calls this function to register
  /// that hash against the character record.
  public shared func uploadCharacterImage(
    characterId : Types.CharacterId,
    blobHash : Types.CharacterImageKey,
  ) : async Types.UploadResult {
    ImageStorageLib.setImage(characterImages, characterId, blobHash);
    { characterId; imageKey = blobHash };
  };

  /// Retrieve the blob hash (image key) for a character.
  /// Returns null if no portrait has been registered yet.
  public query func getCharacterImageKey(
    characterId : Types.CharacterId,
  ) : async ?Types.CharacterImageKey {
    ImageStorageLib.getImageKey(characterImages, characterId);
  };

  /// Delete the portrait record for a character.
  public shared func deleteCharacterImage(
    characterId : Types.CharacterId,
  ) : async () {
    ImageStorageLib.removeImage(characterImages, characterId);
  };
};
