from pydantic import BaseModel, EmailStr


class LoginRequest(BaseModel):
    username: str  # Can be email or username "ciso"
    password: str

class ChangePasswordRequest(BaseModel):
    new_password: str

class RegisterFreeRequest(BaseModel):
    name: str
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    requires_password_change: bool = False

class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str
    plan_type: str
    requires_password_change: bool

    model_config = {"from_attributes": True}
