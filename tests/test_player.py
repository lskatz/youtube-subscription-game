import pytest
from player import Player, Niche, Personality, Avatar, persona_niche_match, NICHE_PERSONALITY_FIT


def test_default_player():
    p = Player()
    assert p.name == "Creator"
    assert p.niche == Niche.GAMING
    assert p.on_camera is True


def test_avatar_defaults():
    a = Avatar()
    assert a.skin_tone == "light"
    assert a.hair_style == "short"


def test_persona_match_bonus():
    # FUNNY is a good fit for HUMOR niche
    p = Player(niche=Niche.HUMOR, personality=Personality.FUNNY, on_camera=True)
    assert persona_niche_match(p) == pytest.approx(1.12)


def test_persona_mismatch_penalty():
    # MYSTERIOUS is not in HUMOR niche fits
    p = Player(niche=Niche.HUMOR, personality=Personality.MYSTERIOUS, on_camera=True)
    assert persona_niche_match(p) == pytest.approx(0.88)


def test_persona_off_camera_neutral():
    # Off camera always returns 1.0 regardless of fit
    p_match = Player(niche=Niche.HUMOR, personality=Personality.FUNNY, on_camera=False)
    p_mismatch = Player(niche=Niche.HUMOR, personality=Personality.MYSTERIOUS, on_camera=False)
    assert persona_niche_match(p_match) == pytest.approx(1.0)
    assert persona_niche_match(p_mismatch) == pytest.approx(1.0)


def test_all_niches_have_fits():
    for niche in Niche:
        assert niche in NICHE_PERSONALITY_FIT
        assert len(NICHE_PERSONALITY_FIT[niche]) > 0


def test_avatar_custom_fields():
    a = Avatar(skin_tone="dark", hair_style="bun", outfit="professional", accessory="glasses")
    assert a.skin_tone == "dark"
    assert a.accessory == "glasses"
