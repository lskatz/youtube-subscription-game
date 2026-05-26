import pytest
from channel import (
    Channel, is_monetized, add_subscribers, add_views,
    add_watch_time, ready_to_prestige, MONETIZATION_SUBS,
    MONETIZATION_WATCH_HOURS, PRESTIGE_TARGET,
)


def test_not_monetized_at_start():
    c = Channel()
    assert not is_monetized(c)


def test_monetized_when_both_thresholds_met():
    c = Channel(subscribers=MONETIZATION_SUBS, watch_time_hours=MONETIZATION_WATCH_HOURS)
    assert is_monetized(c)


def test_not_monetized_subs_only():
    c = Channel(subscribers=MONETIZATION_SUBS, watch_time_hours=0)
    assert not is_monetized(c)


def test_not_monetized_watch_hours_only():
    c = Channel(subscribers=0, watch_time_hours=MONETIZATION_WATCH_HOURS)
    assert not is_monetized(c)


def test_add_subscribers():
    c = Channel(subscribers=100)
    add_subscribers(c, 50)
    assert c.subscribers == 150


def test_subscribers_cannot_go_negative():
    c = Channel(subscribers=10)
    add_subscribers(c, -100)
    assert c.subscribers == 0


def test_add_views():
    c = Channel(total_views=0)
    add_views(c, 1000)
    assert c.total_views == 1000


def test_add_watch_time():
    c = Channel(watch_time_hours=0)
    add_watch_time(c, 100.5)
    assert c.watch_time_hours == pytest.approx(100.5)


def test_milestone_unlocked():
    c = Channel()
    add_subscribers(c, 100)
    assert "First 100 Subscribers" in c.reached_milestones


def test_milestone_not_duplicated():
    c = Channel()
    add_subscribers(c, 100)
    add_subscribers(c, 1)
    assert c.reached_milestones.count("First 100 Subscribers") == 1


def test_ready_to_prestige_false():
    c = Channel(subscribers=499_999_999)
    assert not ready_to_prestige(c)


def test_ready_to_prestige_true():
    c = Channel(subscribers=PRESTIGE_TARGET)
    assert ready_to_prestige(c)
