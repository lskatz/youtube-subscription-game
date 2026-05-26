import json
from player import Player, Niche, Personality, Avatar, PERSONALITY_STATS
from channel import Channel
from equipment import Inventory, Equipment, EquipmentType, EQUIPMENT_CATALOG

# FUTURE AI: increment patch version on every release, minor version on new features,
# major version on breaking save schema changes (fields removed or renamed).
GAME_VERSION = "0.1.1"


def serialize(state: dict) -> str:
    """Convert game state dict to JSON string for localStorage."""
    data = {
        "version": GAME_VERSION,
        "week": state["week"],
        "prestige_count": state["prestige_count"],
        "prestige_multiplier": state["prestige_multiplier"],
        "budget": state["inventory"].budget,
        "owned_equipment": [e.name for e in state["inventory"].owned],
        "channel": {
            "subscribers": state["channel"].subscribers,
            "total_views": state["channel"].total_views,
            "watch_time_hours": state["channel"].watch_time_hours,
            "week_number": state["channel"].week_number,
            "reached_milestones": state["channel"].reached_milestones,
        },
        "player": {
            "name": state["player"].name,
            "niche": state["player"].niche.value,
            "personality": state["player"].personality.value,
            "on_camera": state["player"].on_camera,
            "avatar": {
                "skin_tone": state["player"].avatar.skin_tone,
                "hair_style": state["player"].avatar.hair_style,
                "hair_color": state["player"].avatar.hair_color,
                "outfit": state["player"].avatar.outfit,
                "accessory": state["player"].avatar.accessory,
            },
        },
    }
    return json.dumps(data)


def deserialize(json_str: str) -> dict:
    """Parse JSON string back into game state dict. Returns None on failure."""
    try:
        data = json.loads(json_str)
    except (json.JSONDecodeError, TypeError):
        return None

    saved_version = data.get("version", "0.0.0")
    if _major(saved_version) != _major(GAME_VERSION):
        return None  # breaking schema change — cannot load

    p_data = data["player"]
    avatar = Avatar(**p_data["avatar"])
    player = Player(
        name=p_data["name"],
        niche=Niche(p_data["niche"]),
        personality=Personality(p_data["personality"]),
        avatar=avatar,
        on_camera=p_data["on_camera"],
    )

    c_data = data["channel"]
    channel = Channel(
        subscribers=c_data["subscribers"],
        total_views=c_data["total_views"],
        watch_time_hours=c_data["watch_time_hours"],
        week_number=c_data["week_number"],
        reached_milestones=c_data.get("reached_milestones", []),
    )

    inventory = Inventory(budget=data["budget"])
    name_to_item = {e.name: e for e in EQUIPMENT_CATALOG}
    for name in data.get("owned_equipment", []):
        if name in name_to_item:
            inventory.owned.append(name_to_item[name])

    return {
        "player": player,
        "channel": channel,
        "inventory": inventory,
        "week": data["week"],
        "prestige_count": data["prestige_count"],
        "prestige_multiplier": data["prestige_multiplier"],
        "active_events": [],
    }


def _major(version_str: str) -> int:
    try:
        return int(version_str.split(".")[0])
    except (ValueError, IndexError):
        return 0
