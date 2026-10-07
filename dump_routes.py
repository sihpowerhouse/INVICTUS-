import sys
from fastapi.routing import APIRoute
from invite_backend import app
for route in app.routes:
    if isinstance(route, APIRoute):
        print(f"{list(route.methods)} {route.path}")
