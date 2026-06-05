module {
  /// Maps a character ID to a stored blob hash (the image key).
  public type CharacterImageKey = Text;
  public type CharacterId = Text;

  /// Result returned after uploading a character portrait.
  public type UploadResult = {
    characterId : CharacterId;
    imageKey : CharacterImageKey;
  };
};
