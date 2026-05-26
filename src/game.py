from dataclasses import dataclass, field
from player import Player, Avatar
from channel import Channel, add_subscribers, add_views, add_watch_time, ready_to_prestige
from equipment import Inventory
from economy import calculate_views, calculate_new_subscribers, calculate_watch_time, calculate_revenue
from events import generate_events, apply_events

PRESTIGE_MULTIPLIER_BONUS = 0.10  # +10% per prestige loop


@dataclass
class Decision:
    upload_freq: int = 3         # videos per week (1-7)
    video_length: str = "medium" # short | medium | long
    video_quality: str = "medium"# low | medium | high
    ad_spend: float = 0.0        # dollars spent on ads this week
    self_in_video: bool = True   # whether the player appears on camera


@dataclass
class TurnResult:
    views: int
    new_subscribers: int
    watch_time_added: float
    revenue: float
    events: list
    week: int


def new_game(player: Player = None, inventory: Inventory = None) -> dict:
    return {
        "player": player or Player(),
        "channel": Channel(),
        "inventory": inventory or Inventory(),
        "week": 1,
        "prestige_count": 0,
        "prestige_multiplier": 1.0,
        "active_events": [],
    }


def advance_turn(state: dict, decision: Decision) -> tuple:
    """Process one week. Returns (updated state, TurnResult)."""
    player = state["player"]
    channel = state["channel"]
    inventory = state["inventory"]
    mult = state["prestige_multiplier"]

    # Sync on_camera from decision
    player.on_camera = decision.self_in_video

    views = calculate_views(
        player, channel, inventory,
        decision.upload_freq, decision.video_length,
        decision.video_quality, decision.ad_spend, mult,
    )

    new_subs = calculate_new_subscribers(views, channel, player)
    watch_hours = calculate_watch_time(views, decision.video_length)
    revenue = calculate_revenue(channel, views, decision.ad_spend, mult)

    events = generate_events(player, channel, state["week"])
    new_subs, revenue = apply_events(new_subs, revenue, events)

    # Deduct ad spend from budget
    inventory.budget -= decision.ad_spend
    inventory.budget += max(0.0, revenue)

    add_views(channel, views)
    add_watch_time(channel, watch_hours)
    add_subscribers(channel, int(new_subs))
    channel.week_number += 1

    state["week"] += 1
    state["active_events"] = events

    result = TurnResult(
        views=views,
        new_subscribers=int(new_subs),
        watch_time_added=watch_hours,
        revenue=revenue,
        events=events,
        week=state["week"] - 1,
    )
    return state, result


def do_prestige(state: dict) -> dict:
    """Prestige at 500M: reset subs, keep everything, add growth multiplier bonus."""
    state["prestige_count"] += 1
    state["prestige_multiplier"] += PRESTIGE_MULTIPLIER_BONUS
    state["channel"].subscribers = 0
    state["channel"].week_number = 1
    state["week"] = 1
    state["active_events"] = []
    return state


