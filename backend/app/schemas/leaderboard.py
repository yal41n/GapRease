from pydantic import BaseModel


class LeaderboardEntry(BaseModel):
    user_id: int
    name: str
    unit: str | None = None
    resolved_count: int
