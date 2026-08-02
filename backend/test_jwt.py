from app.core.security import create_access_token

token = create_access_token(
    {
        "sub": "12345678-1234-5678-1234-567812345678"
    }
)

print(token)