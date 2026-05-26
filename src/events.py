import random
from enum import Enum
from dataclasses import dataclass
from player import Player, PERSONALITY_STATS, NICHE_PERSONALITY_FIT
from channel import Channel


class EventType(Enum):
    VIRAL_VIDEO        = "viral_video"
    CONTROVERSY        = "controversy"
    ALGORITHM_BOOST    = "algorithm_boost"
    ALGORITHM_PENALTY  = "algorithm_penalty"
    COLLABORATION      = "collaboration"
    COPYRIGHT_STRIKE   = "copyright_strike"
    FAN_MILESTONE      = "fan_milestone"
    EQUIPMENT_FAILURE  = "equipment_failure"


@dataclass
class Event:
    type: EventType
    description: str
    sub_modifier: float      # multiplier on subscriber gain this week
    revenue_modifier: float  # multiplier on revenue this week
    duration_weeks: int = 1


EVENT_TEMPLATES = {
    EventType.VIRAL_VIDEO:       ("One of your videos went viral!", 3.0, 2.5),
    EventType.CONTROVERSY:       ("A video sparked controversy online.", 0.5, 0.7),
    EventType.ALGORITHM_BOOST:   ("The algorithm is recommending your content!", 1.8, 1.5),
    EventType.ALGORITHM_PENALTY: ("The algorithm deprioritized your channel.", 0.6, 0.6),
    EventType.COLLABORATION:     ("You collaborated with another creator!", 2.0, 1.3),
    EventType.COPYRIGHT_STRIKE:  ("You received a copyright strike.", 0.4, 0.0),
    EventType.FAN_MILESTONE:     ("Your fans organized a celebration for your channel.", 1.4, 1.2),
    EventType.EQUIPMENT_FAILURE: ("Your equipment failed mid-recording.", 0.7, 0.8),
}


def generate_events(player: Player, channel: Channel, week: int, seed: int = None) -> list:
    rng = random.Random(seed if seed is not None else week * 137 + channel.subscribers)
    events = []

    controversy_risk = PERSONALITY_STATS[player.personality]["risk"]
    fits = NICHE_PERSONALITY_FIT.get(player.niche, [])
    mismatch = player.on_camera and player.personality not in fits

    # Controversy: elevated if personality mismatches niche while on camera
    if mismatch:
        controversy_risk = min(0.60, controversy_risk * 3)

    if rng.random() < controversy_risk:
        events.append(_make_event(EventType.CONTROVERSY))

    # Viral: rare baseline, slightly better for high-risk personalities
    viral_chance = 0.04 + PERSONALITY_STATS[player.personality]["risk"] * 0.05
    if rng.random() < viral_chance:
        events.append(_make_event(EventType.VIRAL_VIDEO))

    # Algorithm events: random
    if rng.random() < 0.10:
        events.append(_make_event(EventType.ALGORITHM_BOOST))
    elif rng.random() < 0.08:
        events.append(_make_event(EventType.ALGORITHM_PENALTY))

    # Collaboration: more likely after 1000 subs
    if channel.subscribers >= 1_000 and rng.random() < 0.08:
        events.append(_make_event(EventType.COLLABORATION))

    # Copyright strike: small random chance
    if rng.random() < 0.03:
        events.append(_make_event(EventType.COPYRIGHT_STRIKE))

    # Fan milestone: tied to milestone thresholds
    if channel.subscribers >= 100 and rng.random() < 0.05:
        events.append(_make_event(EventType.FAN_MILESTONE))

    # Equipment failure: random bad luck
    if rng.random() < 0.04:
        events.append(_make_event(EventType.EQUIPMENT_FAILURE))

    return events


def apply_events(sub_gain: int, revenue: float, events: list) -> tuple:
    """Apply all active events to sub gain and revenue. Returns (int, float)."""
    for event in events:
        sub_gain = int(sub_gain * event.sub_modifier)
        revenue = revenue * event.revenue_modifier
    return sub_gain, revenue


def _make_event(event_type: EventType) -> Event:
    desc, sub_mod, rev_mod = EVENT_TEMPLATES[event_type]
    return Event(type=event_type, description=desc, sub_modifier=sub_mod, revenue_modifier=rev_mod)
