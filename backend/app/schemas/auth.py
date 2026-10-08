from pydantic import BaseModel
from typing import Optional, List

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserResponse"

class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    email: str
    password: str
    full_name: str
    role_name: str = "Reviewer" # Admin, Finance Manager, Reviewer, Employee

class RoleResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    
    class Config:
        from_attributes = True

class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    role: RoleResponse
    is_active: bool
    
    class Config:
        from_attributes = True
