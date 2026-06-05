module {
  /// Unique identifier for a homebrew item (spell or ancestry).
  /// Matches the client-side ID used in useHomebrewSpellStore / useHomebrewAncestryStore.
  public type HomebrewItemId = Text;

  /// The kind of homebrew item this art belongs to.
  public type HomebrewItemKind = { #spell; #ancestry };

  /// The object-storage key (blob hash) for a piece of homebrew art.
  public type HomebrewArtKey = Text;

  /// Returned after a successful art registration.
  public type HomebrewArtResult = {
    itemId : HomebrewItemId;
    artKey : HomebrewArtKey;
  };
};
