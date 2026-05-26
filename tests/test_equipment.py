import pytest
from equipment import (
    Inventory, Equipment, EquipmentType,
    buy_equipment, sell_equipment, replace_equipment,
    total_quality_bonus, EQUIPMENT_CATALOG,
)


def _webcam():
    return next(e for e in EQUIPMENT_CATALOG if e.name == "Webcam")


def _dslr():
    return next(e for e in EQUIPMENT_CATALOG if e.name == "DSLR Camera")


def _usb_mic():
    return next(e for e in EQUIPMENT_CATALOG if e.name == "USB Mic")


def test_buy_success():
    inv = Inventory(budget=500.0)
    ok, msg = buy_equipment(inv, _webcam())
    assert ok
    assert inv.budget == pytest.approx(500.0 - _webcam().cost)
    assert _webcam() in inv.owned


def test_buy_insufficient_budget():
    inv = Inventory(budget=10.0)
    ok, msg = buy_equipment(inv, _dslr())
    assert not ok
    assert "Not enough" in msg


def test_buy_duplicate_type_blocked():
    inv = Inventory(budget=5000.0)
    buy_equipment(inv, _webcam())
    ok, msg = buy_equipment(inv, _dslr())
    assert not ok
    assert "already own" in msg


def test_sell_success():
    inv = Inventory(budget=500.0)
    buy_equipment(inv, _webcam())
    ok, msg = sell_equipment(inv, _webcam())
    assert ok
    assert _webcam() not in inv.owned
    assert inv.budget == pytest.approx(500.0 - _webcam().cost + _webcam().sell_value)


def test_sell_item_not_owned():
    inv = Inventory(budget=500.0)
    ok, msg = sell_equipment(inv, _webcam())
    assert not ok


def test_replace_equipment():
    inv = Inventory(budget=5000.0)
    buy_equipment(inv, _webcam())
    ok, msg = replace_equipment(inv, _webcam(), _dslr())
    assert ok
    assert _webcam() not in inv.owned
    assert _dslr() in inv.owned


def test_total_quality_bonus_empty():
    inv = Inventory()
    assert total_quality_bonus(inv) == pytest.approx(0.0)


def test_total_quality_bonus_stacks():
    inv = Inventory(budget=5000.0)
    buy_equipment(inv, _webcam())
    buy_equipment(inv, _usb_mic())
    expected = _webcam().quality_bonus + _usb_mic().quality_bonus
    assert total_quality_bonus(inv) == pytest.approx(expected)


def test_catalog_has_all_types():
    types_in_catalog = {e.type for e in EQUIPMENT_CATALOG}
    for eq_type in EquipmentType:
        assert eq_type in types_in_catalog
