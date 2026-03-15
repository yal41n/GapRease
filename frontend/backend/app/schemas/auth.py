from pydantic import BaseModel, EmailStr


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RegisterFreeRequest(BaseModel):
    name: str
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str
    plan_type: str

    model_config = {"from_attributes": True}
