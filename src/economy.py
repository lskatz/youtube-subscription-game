from channel import Channel, is_monetized
from player import Player, persona_niche_match, PERSONALITY_STATS
from equipment import Inventory, total_quality_bonus


BASE_CPM = 3.0          # dollars per 1000 views (simplified flat rate)
AD_SPEND_ROI = 0.8      # subscribers gained per dollar of ad spend (at week 1, decays)

# Video length in minutes affects watch time accumulation
VIDEO_LENGTH_MINUTES = {
    "short":  8,
    "medium": 18,
    "long":   35,
}

# Upload frequency caps (videos per week)
FREQ_MIN = 1
FREQ_MAX = 7

# Quality tier multipliers on view count
QUALITY_MULTIPLIERS = {
    "low":    0.80,
    "medium": 1.00,
    "high":   1.25,
}


def _subscriber_view_rate(channel: Channel) -> float:
    """Average views per upload based on current subscriber count."""
    subs = channel.subscribers
    if subs < 100:
        return subs * 0.5
    elif subs < 10_000:
        return subs * 0.3
    elif subs < 1_000_000:
        return subs * 0.15
    else:
        return subs * 0.08


def calculate_views(
    player: Player,
    channel: Channel,
    inventory: Inventory,
    upload_freq: int,
    video_length: str,
    video_quality: str,
    ad_spend: float,
    prestige_multiplier: float = 1.0,
) -> int:
    """Estimate weekly views from all contributing factors."""
    upload_freq = max(FREQ_MIN, min(FREQ_MAX, upload_freq))
    base = _subscriber_view_rate(channel) * upload_freq
    quality_mod = QUALITY_MULTIPLIERS.get(video_quality, 1.0)
    equipment_mod = 1.0 + total_quality_bonus(inventory)
    persona_mod = persona_niche_match(player)
    personality_mod = PERSONALITY_STATS[player.personality]["growth"]
    ad_views = ad_spend * 200  # each dollar buys ~200 additional views

    raw = (base * quality_mod * equipment_mod * persona_mod * personality_mod * prestige_multiplier) + ad_views
    return max(0, int(raw))


def calculate_new_subscribers(
    views: int,
    channel: Channel,
    player: Player,
) -> int:
    """Derive new subscribers from views using a declining conversion rate."""
    # Conversion rate drops as channel grows (harder to grow at scale)
    subs = channel.subscribers
    if subs < 1_000:
        rate = 0.08
    elif subs < 10_000:
        rate = 0.05
    elif subs < 100_000:
        rate = 0.03
    elif subs < 1_000_000:
        rate = 0.015
    elif subs < 10_000_000:
        rate = 0.008
    else:
        rate = 0.003

    persona_mod = persona_niche_match(player)
    return max(0, int(views * rate * persona_mod))


def calculate_watch_time(views: int, video_length: str, retention_rate: float = 0.50) -> float:
    """Return watch hours accumulated this week."""
    minutes = VIDEO_LENGTH_MINUTES.get(video_length, 18)
    return views * minutes * retention_rate / 60.0


def calculate_revenue(
    channel: Channel,
    views: int,
    ad_spend: float,
    prestige_multiplier: float = 1.0,
) -> float:
    """Return net revenue for the week (0 if not monetized)."""
    if not is_monetized(channel):
        return -ad_spend  # still pay for ads even before monetization
    gross = (views / 1000.0) * BASE_CPM * prestige_multiplier
    return gross - ad_spend
