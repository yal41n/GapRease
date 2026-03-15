from typing import Literal, Optional

from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: Literal["manager", "user", "admin", "intern"] = "intern"
    plan_type: Optional[Literal["free", "approved"]] = None
    manager_id: Optional[int] = None


class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str
    plan_type: str
    manager_id: Optional[int] = None
    is_active: bool

    model_config = {"from_attributes": True}
