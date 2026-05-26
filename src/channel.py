from dataclasses import dataclass, field


MONETIZATION_SUBS = 1_000
MONETIZATION_WATCH_HOURS = 4_000

MILESTONES = [
    (100,        "First 100 Subscribers"),
    (1_000,      "Monetization Unlocked"),
    (10_000,     "Silver Play Button"),
    (100_000,    "Silver Play Button (Official)"),
    (1_000_000,  "Gold Play Button"),
    (10_000_000, "Diamond Play Button"),
    (50_000_000, "Custom Play Button"),
    (500_000_000,"WINNER — Prestige!"),
]

PRESTIGE_TARGET = 500_000_000


@dataclass
class Channel:
    subscribers: int = 0
    total_views: int = 0
    watch_time_hours: float = 0.0
    week_number: int = 1
    reached_milestones: list = field(default_factory=list)


def is_monetized(channel: Channel) -> bool:
    return (channel.subscribers >= MONETIZATION_SUBS and
            channel.watch_time_hours >= MONETIZATION_WATCH_HOURS)


def add_subscribers(channel: Channel, n: int) -> Channel:
    channel.subscribers = max(0, channel.subscribers + n)
    _check_milestones(channel)
    return channel


def add_views(channel: Channel, n: int) -> Channel:
    channel.total_views += max(0, n)
    return channel


def add_watch_time(channel: Channel, hours: float) -> Channel:
    channel.watch_time_hours += max(0.0, hours)
    return channel


def _check_milestones(channel: Channel) -> None:
    for threshold, label in MILESTONES:
        if channel.subscribers >= threshold and label not in channel.reached_milestones:
            channel.reached_milestones.append(label)


def ready_to_prestige(channel: Channel) -> bool:
    return channel.subscribers >= PRESTIGE_TARGET
