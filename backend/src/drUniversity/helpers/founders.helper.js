export function buildRaceMap(raceRows) {
  const raceMap = {
    nightelf: false,
    orc: false,
    human: false,
    undead: false,
  };

  raceRows.forEach(({ name }) => {
    const lower = name.toLowerCase();
    if (lower.includes('night')) raceMap.nightelf = true;
    else if (lower.includes('orc')) raceMap.orc = true;
    else if (lower.includes('human')) raceMap.human = true;
    else if (lower.includes('undead')) raceMap.undead = true;
  });

  return raceMap;
}

export function buildSocialMap(rows) {
  const socials = {};
  rows.forEach(({ platform, name, url }) => {
    socials[(platform || name).toLowerCase()] = url;
  });
  return socials;
}

export function buildFounderCard(founder, raceMap, socials) {
  return {
    id: founder.id,
    image: founder.imageId ? `/api/common/images/${founder.imageId}` : null,
    name: founder.name,
    role: founder.role,
    race: raceMap,
    contribution: founder.contribution,
    ...socials,
  };
}
