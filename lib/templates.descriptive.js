var descriptiveTemplates = function (propp) {
  // TODO: what? why?
  //WHEN YOU START FILLING IN CONTENT, STICK '\N' AT END OF LINE
  //THEN ERASE THE '\N' IN FINAL STRING

  // 0: Initial situation
  // missing so far..

  // Proppian-function templates
  // Absentation: Someone goes missing
  propp["func0"].templates.push(
    "Someone close to the <%= hero.nickname %> goes missing.",
  );
  propp["func0"].templates.push(
    "Someone close to the <%= hero.nickname %> dies.",
  );

  // Interdiction: hero is warned
  propp["func1"].templates.push("<%= hero.nickname %> is warned.");

  // Violation of Interdiction
  propp["func2"].templates.push("Violation of Interdiction");

  // Reconnaissance: Villain seeks something
  propp["func3"].templates.push("Villain seeks something.");

  // Delivery: The villain gains information
  propp["func4"].templates.push("The villain gains information.");

  // Trickery: Villain attempts to deceive victim.
  propp["func5"].templates.push("Villain attempts to deceive victim.");

  // Complicity: Unwitting helping of the enemy
  propp["func6"].templates.push("Unwitting helping of the enemy.");

  // 2nd Sphere: The Body of the story
  // Villainy and lack: The need is identified (Villainy)
  propp["func7"].templates.push(
    "Villainy and lack: The need is identified (Villainy).",
  );

  //  Villainy and lack: The need is identified (Lack)
  propp["func8"].templates.push(
    "Villainy and lack: The need is identified (Lack)",
  );

  // Lack: something the hero needs is identified
  propp["func8a"].templates.push("Lack: something is missing or desired.");

  // Mediation: hero discovers the lack
  propp["func9"].templates.push(
    "Mediation: <%= hero.nickname %> discovers the lack.",
  );

  // Counteraction: hero chooses positive action
  propp["func10"].templates.push(
    "Counteraction: <%= hero.nickname %> chooses positive action.",
  );

  // Departure: hero leave on mission
  propp["func11"].templates.push(
    "Departure: <%= hero.nickname %> leaves on mission.",
  );

  // 3rd Sphere: The Donor Sequence
  // Testing: hero is challenged to prove heroic qualities
  propp["func12"].templates.push(
    "Testing: <%= hero.nickname %> is challenged to prove heroic qualities.",
  );

  // Reaction: hero responds to test
  propp["func13"].templates.push(
    "Reaction: <%= hero.nickname %> responds to test.",
  );

  //  Acquisition: hero gains magical item
  propp["func14"].templates.push(
    " Acquisition: <%= hero.nickname %> gains magical item.",
  );

  // Guidance: hero reaches destination
  propp["func15"].templates.push(
    "Guidance: <%= hero.nickname %> reaches destination.",
  );

  // Struggle: hero and villain do battle
  propp["func16"].templates.push(
    "Struggle: <%= hero.nickname %> and villain do battle.",
  );

  // Branding: hero is branded
  propp["func17"].templates.push("Branding: <%= hero.nickname %> is branded.");

  // Victory: Villain is defeated
  propp["func18"].templates.push("Victory: Villain is defeated.");

  // Resolution: Initial misfortune or lack is resolved
  propp["func19"].templates.push(
    "Resolution: Initial misfortune or lack is resolved.",
  );

  // 4th Sphere: The hero's return
  // In the final (and often optional) phase of the storyline, the hero returns home, hopefully uneventfully and to a hero's welcome, although this may not always be the case.

  // Return: hero sets out for home
  propp["func20"].templates.push(
    "Return: <%= hero.nickname %> sets out for home.",
  );

  // Pursuit: hero is chased
  propp["func21"].templates.push("Pursuit: <%= hero.nickname %> is chased.");

  // Rescue: pursuit ends
  propp["func22"].templates.push("Rescue: pursuit ends.");

  // Arrival: hero arrives unrecognized
  propp["func23"].templates.push(
    "Arrival: <%= hero.nickname %> arrives unrecognized.",
  );

  // Claim: False hero makes unfounded claims
  propp["func24"].templates.push(
    "Claim: False <%= hero.nickname %> makes unfounded claims.",
  );

  // Task: Difficult task proposed to the <%= hero.nickname %>
  propp["func25"].templates.push(
    "Task: Difficult task proposed to the <%= hero.nickname %>.",
  );

  // Solution: Task is resolved
  propp["func26"].templates.push("Solution: Task is resolved.");

  // Recognition: hero is recognised
  propp["func27"].templates.push(
    "Recognition: <%= hero.nickname %> is recognised.",
  );

  // Exposure: False hero is exposed
  propp["func28"].templates.push(
    "Exposure: False <%= hero.nickname %> is exposed.",
  );

  // Transfiguration: hero is given a new appearance
  propp["func29"].templates.push(
    "Transfiguration: <%= hero.nickname %> is given a new appearance.",
  );

  // Punishment: Villain is punished
  propp["func30"].templates.push("Punishment: Villain is punished.");

  // Wedding: hero marries and ascends the throne
  propp["func31"].templates.push(
    "Wedding: <%= hero.nickname %> marries and ascends the throne.",
  );
  propp["func31"].templates.push(
    "Everything works out for the <%= hero.nickname %>.",
  );

  return propp;
};

export default descriptiveTemplates;
