from enum import Enum
from dataclasses import dataclass, field


class Niche(Enum):
    GAMING = "gaming"
    SCIENCE = "science"
    GOVERNMENT = "government"
    HUMOR = "humor"
    THEORETICAL = "theoretical"
    COOKING = "cooking"
    FINANCE = "finance"
    FITNESS = "fitness"
    TECHNOLOGY = "technology"
    ART = "art"


class Personality(Enum):
    ENTHUSIASTIC = "enthusiastic"
    CALM = "calm"
    CONTROVERSIAL = "controversial"
    EDUCATIONAL = "educational"
    FUNNY = "funny"
    MYSTERIOUS = "mysterious"


# Growth modifier and controversy risk per personality [growth_mod, risk]
PERSONALITY_STATS = {
    Personality.ENTHUSIASTIC:  {"growth": 1.10, "risk": 0.05},
    Personality.CALM:          {"growth": 1.00, "risk": 0.01},
    Personality.CONTROVERSIAL: {"growth": 1.20, "risk": 0.30},
    Personality.EDUCATIONAL:   {"growth": 1.05, "risk": 0.02},
    Personality.FUNNY:         {"growth": 1.15, "risk": 0.08},
    Personality.MYSTERIOUS:    {"growth": 1.08, "risk": 0.04},
}

# Which personalities naturally fit which niches
NICHE_PERSONALITY_FIT = {
    Niche.GAMING:      [Personality.ENTHUSIASTIC, Personality.FUNNY, Personality.CONTROVERSIAL],
    Niche.SCIENCE:     [Personality.EDUCATIONAL, Personality.CALM, Personality.MYSTERIOUS],
    Niche.GOVERNMENT:  [Personality.EDUCATIONAL, Personality.CONTROVERSIAL, Personality.CALM],
    Niche.HUMOR:       [Personality.FUNNY, Personality.ENTHUSIASTIC, Personality.CONTROVERSIAL],
    Niche.THEORETICAL: [Personality.MYSTERIOUS, Personality.EDUCATIONAL, Personality.CALM],
    Niche.COOKING:     [Personality.ENTHUSIASTIC, Personality.CALM, Personality.FUNNY],
    Niche.FINANCE:     [Personality.EDUCATIONAL, Personality.CALM, Personality.MYSTERIOUS],
    Niche.FITNESS:     [Personality.ENTHUSIASTIC, Personality.CALM, Personality.EDUCATIONAL],
    Niche.TECHNOLOGY:  [Personality.EDUCATIONAL, Personality.MYSTERIOUS, Personality.ENTHUSIASTIC],
    Niche.ART:         [Personality.MYSTERIOUS, Personality.CALM, Personality.EDUCATIONAL],
}


@dataclass
class Avatar:
    skin_tone: str = "light"       # light, medium, tan, dark, deep
    hair_style: str = "short"      # short, long, curly, bun, bald, mohawk
    hair_color: str = "brown"      # brown, black, blonde, red, gray, blue, pink
    outfit: str = "casual"         # casual, professional, sporty, streetwear, fantasy
    accessory: str = "none"        # none, glasses, hat, headphones, mask, crown


@dataclass
class Player:
    name: str = "Creator"
    niche: Niche = Niche.GAMING
    personality: Personality = Personality.ENTHUSIASTIC
    avatar: Avatar = field(default_factory=Avatar)
    on_camera: bool = True


def persona_niche_match(player: Player) -> float:
    """Return a multiplier based on personality/niche fit and on_camera toggle."""
    fits = NICHE_PERSONALITY_FIT.get(player.niche, [])
    if not player.on_camera:
        return 1.0  # neutral — no bonus or penalty when off-camera

    if player.personality in fits:
        return 1.12  # mild bonus for good fit
    else:
        return 0.88  # mild penalty for mismatch (controversy risk handled in events.py)
