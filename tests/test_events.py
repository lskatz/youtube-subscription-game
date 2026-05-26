import pytest
from player import Player, Niche, Personality
from channel import Channel
from events import generate_events, apply_events, EventType, Event


def _player(personality=Personality.CALM, niche=Niche.SCIENCE, on_camera=True):
    return Player(niche=niche, personality=personality, on_camera=on_camera)


def test_generate_returns_list():
    p = _player()
    c = Channel(subscribers=500)
    events = generate_events(p, c, week=1, seed=42)
    assert isinstance(events, list)


def test_controversial_player_higher_risk(run=200):
    # Over many seeds, controversial personality should get more controversy events
    controversy_count = 0
    calm_count = 0
    for seed in range(run):
        p_con = _player(personality=Personality.CONTROVERSIAL, niche=Niche.GAMING)
        p_calm = _player(personality=Personality.CALM, niche=Niche.SCIENCE)
        c = Channel(subscribers=500)
        for e in generate_events(p_con, c, week=1, seed=seed):
            if e.type == EventType.CONTROVERSY:
                controversy_count += 1
        for e in generate_events(p_calm, c, week=1, seed=seed):
            if e.type == EventType.CONTROVERSY:
                calm_count += 1
    assert controversy_count > calm_count


def test_mismatch_on_camera_increases_controversy():
    # FUNNY on SCIENCE niche (mismatch) while on camera
    p_mismatch = _player(personality=Personality.FUNNY, niche=Niche.SCIENCE, on_camera=True)
    p_offcam = _player(personality=Personality.FUNNY, niche=Niche.SCIENCE, on_camera=False)
    c = Channel(subscribers=500)
    controversy_on = sum(
        1 for seed in range(200)
        for e in generate_events(p_mismatch, c, week=1, seed=seed)
        if e.type == EventType.CONTROVERSY
    )
    controversy_off = sum(
        1 for seed in range(200)
        for e in generate_events(p_offcam, c, week=1, seed=seed)
        if e.type == EventType.CONTROVERSY
    )
    assert controversy_on > controversy_off


def test_apply_events_neutral():
    subs, rev = apply_events(100, 50.0, [])
    assert subs == 100
    assert rev == pytest.approx(50.0)


def test_apply_events_viral():
    viral = Event(EventType.VIRAL_VIDEO, "Went viral!", 3.0, 2.5)
    subs, rev = apply_events(100, 50.0, [viral])
    assert subs == 300
    assert rev == pytest.approx(125.0)


def test_apply_events_copyright_strike():
    strike = Event(EventType.COPYRIGHT_STRIKE, "Strike!", 0.4, 0.0)
    subs, rev = apply_events(100, 50.0, [strike])
    assert subs == 40
    assert rev == pytest.approx(0.0)


def test_apply_events_stack():
    viral = Event(EventType.VIRAL_VIDEO, "Viral!", 3.0, 2.5)
    penalty = Event(EventType.ALGORITHM_PENALTY, "Penalty", 0.6, 0.6)
    subs, rev = apply_events(100, 50.0, [viral, penalty])
    assert subs == int(100 * 3.0 * 0.6)
    assert rev == pytest.approx(50.0 * 2.5 * 0.6)


def test_collaboration_requires_min_subs():
    p = _player()
    c_low = Channel(subscribers=10)
    events_low = [e for seed in range(500) for e in generate_events(p, c_low, 1, seed)
                  if e.type == EventType.COLLABORATION]
    assert len(events_low) == 0
