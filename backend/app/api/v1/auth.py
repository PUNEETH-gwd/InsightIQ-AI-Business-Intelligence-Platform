from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.deps import get_current_user

from app.core.database import get_db
from app.schemas.user import (
    UserRegister,
    UserResponse,
    UserLogin,
    TokenResponse,
)
from app.services.auth_service import AuthService

router = APIRouter(
    prefix="/api/v1/auth",
    tags=["Authentication"]
)


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED
)
def register(
    user: UserRegister,
    db: Session = Depends(get_db)
):
    service = AuthService(db)

    try:
        return service.register(user)

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )
    
@router.post(
    "/login",
    response_model=TokenResponse
)
def login(
    user: UserLogin,
    db: Session = Depends(get_db)
):
    service = AuthService(db)

    try:
        return service.login(user)

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e)
        )

    
@router.get(
    "/me",
    response_model=UserResponse
)
def me(
    current_user=Depends(get_current_user)
):
    return current_user