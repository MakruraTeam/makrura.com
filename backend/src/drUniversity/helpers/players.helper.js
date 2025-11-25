export function buildPlayerRaceMap(raceRows) {
  const raceMap = {
    nightelf: false,
    orc: false,
    human: false,
    undead: false,
  };

  raceRows.forEach(({ name }) => {
    const race = name.toLowerCase();
    if (race.includes('night')) raceMap.nightelf = true;
    else if (race.includes('orc')) raceMap.orc = true;
    else if (race.includes('human')) raceMap.human = true;
    else if (race.includes('undead')) raceMap.undead = true;
  });

  return raceMap;
}

export function buildPlayerSocialMap(rows) {
  return rows.map(({ platform, url }) => ({
    platform: platform.toLowerCase(),
    url,
  }));
}

export function buildPlayerCard(player, raceMap, socials) {
  return {
    id: player.id,
    name: player.name,
    mmr: player.mmr,
    country: player.country,
    role: player.role,
    contribution: player.contribution,
    race: raceMap,
    links: socials,
  };
}
