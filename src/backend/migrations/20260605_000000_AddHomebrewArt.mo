import Map "mo:core/Map";

module {
  type OldActor = {
    characterImages : Map.Map<Text, Text>;
  };

  type NewActor = {
    characterImages : Map.Map<Text, Text>;
    homebrewArt : Map.Map<Text, Text>;
  };

  public func migration(old : OldActor) : NewActor {
    {
      characterImages = old.characterImages;
      homebrewArt = Map.empty<Text, Text>();
    };
  };
};
