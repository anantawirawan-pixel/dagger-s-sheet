import Map "mo:core/Map";

module {
  type OldActor = {};

  type NewActor = {
    characterImages : Map.Map<Text, Text>;
  };

  public func migration(_ : OldActor) : NewActor {
    {
      characterImages = Map.empty<Text, Text>();
    };
  };
};
