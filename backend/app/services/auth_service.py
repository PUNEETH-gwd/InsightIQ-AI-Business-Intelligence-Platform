from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.user import UserRegister


class AuthService:
    def __init__(self, db: Session):
        self.repository = UserRepository(db)

    def register(self, data: UserRegister):
        existing_user = self.repository.get_by_email(data.email)

        if existing_user:
            raise ValueError("Email already registered")

        user = User(
            name=data.name,
            email=data.email,
            password_hash=hash_password(data.password),
            role="viewer"
        )

        return self.repository.create(user)