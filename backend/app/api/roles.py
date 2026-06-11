from fastapi import APIRouter
from app.schema.role import RoleCreate
from app.database.database import SessionLocal
from app.database.model import Role


role_router = APIRouter()

@role_router.post("/create_role")
def create_role(role: RoleCreate):

    db = SessionLocal()

    new_role = Role(
        role_name=role.role_name,
        required_skills=role.required_skills
    )

    db.add(new_role)
    db.commit()
    db.refresh(new_role)

    db.close()

    return {
        "id": new_role.id,
        "role_name": new_role.role_name
    }

@role_router.get("/get_roles")
def get_roles():

    db = SessionLocal()

    roles = db.query(Role).all()

    db.close()

    return roles


@role_router.delete("/roles")
def delete_roles():
    db = SessionLocal()

    db.query(Role).delete()

    db.commit()
    db.close()

    return {"message": "All roles deleted"}
