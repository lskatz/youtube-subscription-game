import pytest
from player import Player, Niche, Personality
from channel import Channel
from equipment import Inventory
from economy import (
    calculate_views, calculate_new_subscribers, calculate_watch_time,
    calculate_revenue, BASE_CPM, VIDEO_LENGTH_MINUTES,
)


def _base_state():
    player = Player(niche=Niche.GAMING, personality=Personality.ENTHUSIASTIC, on_camera=True)
    channel = Channel(subscribers=1000, watch_time_hours=5000)
    inventory = Inventory(budget=500.0)
    return player, channel, inventory


def test_views_positive():
    player, channel, inventory = _base_state()
    views = calculate_views(player, channel, inventory, 3, "medium", "medium", 0.0)
    assert views > 0


def test_views_scale_with_frequency():
    player, channel, inventory = _base_state()
    v1 = calculate_views(player, channel, inventory, 1, "medium", "medium", 0.0)
    v7 = calculate_views(player, channel, inventory, 7, "medium", "medium", 0.0)
    assert v7 > v1


def test_views_scale_with_ad_spend():
    player, channel, inventory = _base_state()
    v_no_ads = calculate_views(player, channel, inventory, 3, "medium", "medium", 0.0)
    v_with_ads = calculate_views(player, channel, inventory, 3, "medium", "medium", 100.0)
    assert v_with_ads > v_no_ads


def test_views_scale_with_prestige():
    player, channel, inventory = _base_state()
    v1 = calculate_views(player, channel, inventory, 3, "medium", "medium", 0.0, 1.0)
    v2 = calculate_views(player, channel, inventory, 3, "medium", "medium", 0.0, 2.0)
    assert v2 > v1


def test_new_subscribers_positive():
    player, channel, inventory = _base_state()
    subs = calculate_new_subscribers(1000, channel, player)
    assert subs > 0


def test_new_subscribers_zero_views():
    player, channel, inventory = _base_state()
    subs = calculate_new_subscribers(0, channel, player)
    assert subs == 0


def test_watch_time_calculation():
    hours = calculate_watch_time(1000, "medium", retention_rate=0.5)
    expected = 1000 * VIDEO_LENGTH_MINUTES["medium"] * 0.5 / 60.0
    assert hours == pytest.approx(expected)


def test_revenue_zero_before_monetization():
    player, channel, inventory = _base_state()
    unmonetized = Channel(subscribers=0, watch_time_hours=0)
    rev = calculate_revenue(unmonetized, 10000, 0.0)
    assert rev == pytest.approx(0.0)


def test_revenue_correct_formula():
    player, channel, inventory = _base_state()
    views = 10_000
    rev = calculate_revenue(channel, views, 0.0, 1.0)
    expected = (views / 1000.0) * BASE_CPM
    assert rev == pytest.approx(expected)


def test_revenue_deducts_ad_spend():
    player, channel, inventory = _base_state()
    rev = calculate_revenue(channel, 10_000, 50.0, 1.0)
    expected = (10_000 / 1000.0) * BASE_CPM - 50.0
    assert rev == pytest.approx(expected)


def test_revenue_scales_with_prestige():
    player, channel, inventory = _base_state()
    r1 = calculate_revenue(channel, 10_000, 0.0, 1.0)
    r2 = calculate_revenue(channel, 10_000, 0.0, 2.0)
    assert r2 == pytest.approx(r1 * 2)
