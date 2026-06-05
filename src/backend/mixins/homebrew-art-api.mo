import Map "mo:core/Map";
import HomebrewArtLib "../lib/homebrew-art";
import Types "../types/homebrew-art";

mixin (homebrewArt : Map.Map<Types.HomebrewItemId, Types.HomebrewArtKey>) {

  /// Register an art key for a homebrew spell or ancestry.
  /// The caller supplies the object-storage blob hash (artKey) returned by the
  /// object-storage client after the raw upload.
  /// Returns the itemId and artKey for confirmation.
  public shared func uploadHomebrewArt(
    itemId : Types.HomebrewItemId,
    artKey : Types.HomebrewArtKey,
  ) : async Types.HomebrewArtResult {
    HomebrewArtLib.setArt(homebrewArt, itemId, artKey);
    { itemId; artKey };
  };

  /// Retrieve the stored art key for a homebrew item.
  public query func getHomebrewArtKey(
    itemId : Types.HomebrewItemId,
  ) : async ?Types.HomebrewArtKey {
    HomebrewArtLib.getArtKey(homebrewArt, itemId);
  };

  /// Delete the art record for a homebrew item (called when item is removed).
  public shared func deleteHomebrewArt(
    itemId : Types.HomebrewItemId,
  ) : async () {
    HomebrewArtLib.removeArt(homebrewArt, itemId);
  };
};
