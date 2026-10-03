"""Validated site typography, based on the rendered Governance reference page."""
from typing import Annotated, Literal
from bson import ObjectId
from datetime import datetime, timezone
from pydantic import BaseModel, BeforeValidator, ConfigDict, Field, StringConstraints

PyObjectId = Annotated[str, BeforeValidator(str)]
HexColor = Annotated[str, Field(pattern=r'^#[0-9a-fA-F]{6}$')]
FontFamily = Literal["'Playfair Display', Georgia, serif", "'DM Sans', system-ui, sans-serif", "'Inter', system-ui, sans-serif", "'Space Grotesk', sans-serif", "'DM Mono', monospace", "'Poppins', sans-serif", "'Montserrat', sans-serif", "'Lora', Georgia, serif", "Georgia, serif"]

class BaseDocument(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    id: PyObjectId | None = Field(default=None, alias='_id')

    @classmethod
    def from_mongo(cls, doc):
        return cls.model_validate(doc)

    def to_mongo(self):
        doc = self.model_dump(by_alias=True, exclude_none=True)
        if self.id:
            doc['_id'] = ObjectId(self.id)
        return doc

class TypeStyle(BaseModel):
    model_config = ConfigDict(extra='forbid')
    family: FontFamily
    mobile: float = Field(ge=10, le=96)
    tablet: float = Field(ge=10, le=96)
    desktop: float = Field(ge=10, le=96)
    weight: int = Field(ge=100, le=900, multiple_of=50)
    style: Literal['normal', 'italic'] = 'normal'
    color: HexColor
    darkColor: HexColor = '#ffffff'
    lineHeight: float = Field(default=1.62, ge=1, le=2.5)
    letterSpacing: float = Field(default=0, ge=-0.05, le=0.3)

SERIF = "'Playfair Display', Georgia, serif"
SANS = "'DM Sans', system-ui, sans-serif"

def preset(family, sizes, weight, color, height, spacing=0, dark='#ffffff'):
    return TypeStyle(family=family, mobile=sizes[0], tablet=sizes[1], desktop=sizes[2], weight=weight,
                     color=color, darkColor=dark, lineHeight=height, letterSpacing=spacing)

class Typography(BaseModel):
    model_config = ConfigDict(extra='forbid')
    header: TypeStyle = Field(default_factory=lambda: preset(SERIF, (18, 18, 17), 400, '#1a1a2e', 1.5))
    hero: TypeStyle = Field(default_factory=lambda: preset(SERIF, (34, 40, 46), 450, '#00388e', 1.12, -0.01))
    section: TypeStyle = Field(default_factory=lambda: preset(SERIF, (28, 34, 38), 450, '#00388e', 1.18, -0.005))
    subheading: TypeStyle = Field(default_factory=lambda: preset(SANS, (14, 15, 15), 700, '#00388e', 1.3, 0.03))
    body: TypeStyle = Field(default_factory=lambda: preset(SANS, (16, 16, 16), 400, '#2e3745', 1.62, dark='#eef1f7'))
    small: TypeStyle = Field(default_factory=lambda: preset(SANS, (14, 14, 14), 400, '#4b5766', 1.55, dark='#e0e6ef'))
    eyebrow: TypeStyle = Field(default_factory=lambda: preset(SANS, (11, 11, 11), 700, '#895600', 1.5, 0.2, '#f2a91c'))

class ThemeSettings(BaseModel):
    brand: str = Field(default='', pattern=r'^(#[0-9a-fA-F]{6})?$')
    royal: str = Field(default='', pattern=r'^(#[0-9a-fA-F]{6})?$')
    accent: str = Field(default='', pattern=r'^(#[0-9a-fA-F]{6})?$')
    pageBg: str = Field(default='', pattern=r'^(#[0-9a-fA-F]{6})?$')
    headingFont: FontFamily | Literal[''] = ''
    bodyFont: FontFamily | Literal[''] = ''
    typography: Typography = Field(default_factory=Typography)
    typographyPublished: bool = False

class ThemeDocument(BaseDocument, ThemeSettings):
    key: Literal['theme'] = 'theme'
PresetName = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=60)]

class TypographyPresetRename(BaseModel):
    model_config = ConfigDict(extra='forbid')
    name: PresetName

class TypographyPresetCreate(TypographyPresetRename):
    typography: Typography

class TypographyPresetPublic(TypographyPresetCreate):
    id: PyObjectId
    created_at: datetime

class TypographyPresetDocument(BaseDocument, TypographyPresetCreate):
    name_key: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

