from enum import Enum
from dataclasses import dataclass, field
from typing import Optional


class EquipmentType(Enum):
    CAMERA           = "camera"
    MICROPHONE       = "microphone"
    LIGHTS           = "lights"
    GRAPHICS         = "graphics"
    SCREEN_PROJECTION = "screen_projection"
    BACKGROUND       = "background"
    MUSIC            = "music"
    EDITOR           = "editor"


@dataclass
class Equipment:
    type: EquipmentType
    name: str
    cost: float
    sell_value: float
    quality_bonus: float   # additive, e.g. 0.10 = +10% to quality score
    description: str


# Catalog: tiered options per type (basic → pro)
EQUIPMENT_CATALOG = [
    # Cameras
    Equipment(EquipmentType.CAMERA, "Webcam",          150,   50,  0.05, "Decent for a beginner."),
    Equipment(EquipmentType.CAMERA, "DSLR Camera",    1200,  400,  0.15, "Sharp, professional look."),
    Equipment(EquipmentType.CAMERA, "Cinema Camera",  5000, 1800,  0.30, "Cinematic quality."),

    # Microphones
    Equipment(EquipmentType.MICROPHONE, "USB Mic",      80,   25,  0.05, "Clear audio on a budget."),
    Equipment(EquipmentType.MICROPHONE, "Condenser Mic",400,  130,  0.12, "Studio-quality sound."),
    Equipment(EquipmentType.MICROPHONE, "Boom Mic",    900,  300,  0.20, "Pro broadcast audio."),

    # Lights
    Equipment(EquipmentType.LIGHTS, "Ring Light",      60,   20,  0.04, "Eliminates harsh shadows."),
    Equipment(EquipmentType.LIGHTS, "Softbox Kit",    300,  100,  0.10, "Even, diffused lighting."),
    Equipment(EquipmentType.LIGHTS, "LED Panel Array",900,  300,  0.18, "Full studio lighting."),

    # Graphics
    Equipment(EquipmentType.GRAPHICS, "Free Templates",  0,    0,  0.02, "Basic overlays."),
    Equipment(EquipmentType.GRAPHICS, "Motion Pack",    200,   60,  0.08, "Animated intros and overlays."),
    Equipment(EquipmentType.GRAPHICS, "Custom Branding",800,  250,  0.15, "Unique channel identity."),

    # Screen Projection
    Equipment(EquipmentType.SCREEN_PROJECTION, "Screen Share",    0,   0,  0.02, "Basic screen recording."),
    Equipment(EquipmentType.SCREEN_PROJECTION, "Capture Card",  150,  50,  0.08, "Smooth console/PC capture."),
    Equipment(EquipmentType.SCREEN_PROJECTION, "4K Capture",    600, 200,  0.15, "Crystal-clear screen content."),

    # Background
    Equipment(EquipmentType.BACKGROUND, "Blank Wall",       0,   0,  0.01, "Simple but clean."),
    Equipment(EquipmentType.BACKGROUND, "Green Screen",    80,  25,  0.07, "Virtual backgrounds."),
    Equipment(EquipmentType.BACKGROUND, "Custom Set",    2000, 700,  0.20, "Branded, professional studio."),

    # Music
    Equipment(EquipmentType.MUSIC, "Royalty-Free Tracks",  0,   0,  0.02, "Safe, free music."),
    Equipment(EquipmentType.MUSIC, "Premium Library",     100,  30,  0.07, "High-quality licensed music."),
    Equipment(EquipmentType.MUSIC, "Original Composer",  1500, 500,  0.18, "Custom soundtrack."),

    # Editor
    Equipment(EquipmentType.EDITOR, "Free Editor",          0,   0,  0.03, "Gets the job done."),
    Equipment(EquipmentType.EDITOR, "Pro Editor",         300, 100,  0.12, "Fast, feature-rich editing."),
    Equipment(EquipmentType.EDITOR, "AI-Assisted Editor", 900, 300,  0.22, "Smart cuts, color grading, auto-captions."),
]


@dataclass
class Inventory:
    owned: list = field(default_factory=list)   # list of Equipment
    budget: float = 500.0                        # starting budget in dollars


def buy_equipment(inventory: Inventory, item: Equipment) -> tuple:
    """Returns (success: bool, message: str)."""
    existing = _owned_of_type(inventory, item.type)
    if existing:
        return False, f"You already own {existing.name}. Sell it first."
    if inventory.budget < item.cost:
        return False, f"Not enough budget. Need ${item.cost:.2f}, have ${inventory.budget:.2f}."
    inventory.budget -= item.cost
    inventory.owned.append(item)
    return True, f"Bought {item.name} for ${item.cost:.2f}."


def sell_equipment(inventory: Inventory, item: Equipment) -> tuple:
    """Returns (success: bool, message: str)."""
    if item not in inventory.owned:
        return False, f"{item.name} not in inventory."
    inventory.owned.remove(item)
    inventory.budget += item.sell_value
    return True, f"Sold {item.name} for ${item.sell_value:.2f}."


def replace_equipment(inventory: Inventory, old: Equipment, new: Equipment) -> tuple:
    """Sell old, buy new in one step. Returns (success: bool, message: str)."""
    ok, msg = sell_equipment(inventory, old)
    if not ok:
        return False, msg
    return buy_equipment(inventory, new)


def total_quality_bonus(inventory: Inventory) -> float:
    """Sum of all quality bonuses from owned equipment."""
    return sum(e.quality_bonus for e in inventory.owned)


def _owned_of_type(inventory: Inventory, eq_type: EquipmentType) -> Optional[Equipment]:
    for item in inventory.owned:
        if item.type == eq_type:
            return item
    return None
