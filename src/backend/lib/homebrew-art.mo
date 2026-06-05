import Map "mo:core/Map";
import Types "../types/homebrew-art";

module {
  public type HomebrewItemId = Types.HomebrewItemId;
  public type HomebrewArtKey = Types.HomebrewArtKey;

  /// Store or overwrite the art key for a homebrew item.
  public func setArt(
    homebrewArt : Map.Map<HomebrewItemId, HomebrewArtKey>,
    itemId : HomebrewItemId,
    artKey : HomebrewArtKey,
  ) {
    homebrewArt.add(itemId, artKey);
  };

  /// Retrieve the art key for a homebrew item, if one has been stored.
  public func getArtKey(
    homebrewArt : Map.Map<HomebrewItemId, HomebrewArtKey>,
    itemId : HomebrewItemId,
  ) : ?HomebrewArtKey {
    homebrewArt.get(itemId);
  };

  /// Remove the art entry for a homebrew item (e.g. when the item is deleted).
  public func removeArt(
    homebrewArt : Map.Map<HomebrewItemId, HomebrewArtKey>,
    itemId : HomebrewItemId,
  ) {
    homebrewArt.remove(itemId);
  };
};
