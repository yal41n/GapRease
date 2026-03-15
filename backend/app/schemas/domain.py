from pydantic import BaseModel


class DomainCreate(BaseModel):
    name: str
    domain: str


class DomainOut(BaseModel):
    id: int
    name: str
    domain: str
    manager_id: int
    is_active: bool

    model_config = {"from_attributes": True}
