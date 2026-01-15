
import random
from datetime import datetime, timedelta
from config import get_supabase_admin_client

# Feature names that will be tracked
FEATURE_NAMES = [
    "date_picker",
    "filter_age",
    "filter_gender",
    "chart_bar",
    "bar_chart_zoom",
    "line_chart_hover"
]

# First names for generating users
FIRST_NAMES = [
    "Alice", "Bob", "Charlie", "Diana", "Evan", "Fiona", "George", "Hannah",
    "Ivan", "Julia", "Kevin", "Luna", "Mike", "Nina", "Oscar", "Paula",
    "Quinn", "Rachel", "Steve", "Tina", "Uma", "Victor", "Wendy", "Xander",
    "Yara", "Zack", "Amber", "Brian", "Chloe", "Derek", "Emma", "Frank",
    "Grace", "Henry", "Iris", "Jake", "Kara", "Leo", "Maya", "Noah",
    "Olivia", "Peter", "Rosa", "Sam", "Tara", "Uri", "Vera", "Will",
    "Xena", "Yuri", "Zoe", "Adam", "Beth", "Carl", "Dana"
]

GENDERS = ["Male", "Female", "Other"]


def generate_dummy_users(count=55):
    """Generate dummy user data with varied ages and genders."""
    users = []
    for name in FIRST_NAMES[:count]:
        # Randomly pick an age bracket, then random age within it
        age_bracket = random.choice(["young", "middle", "older"])
        if age_bracket == "young":
            age = random.randint(13, 17)
        elif age_bracket == "middle":
            age = random.randint(18, 40)
        else:
            age = random.randint(41, 65)

        users.append({
            "email": f"{name.lower()}@test.com",
            "password": "test123",
            "username": name.lower(),
            "age": age,
            "gender": random.choice(GENDERS)
        })
    return users


DUMMY_USERS = generate_dummy_users(55)


def create_seed_users(supabase):
    """Create seed users and return their IDs."""
    user_ids = []

    for user in DUMMY_USERS:
        user_id = None

        # First, check if profile already exists
        try:
            existing = supabase.table("profiles").select("id").eq("username", user["username"]).single().execute()
            if existing.data:
                user_id = existing.data["id"]
                user_ids.append(user_id)
                print(f"Using existing user: {user['username']}")
                continue
        except:
            pass  # Profile doesn't exist, continue to create

        # Try to create auth user
        try:
            auth_response = supabase.auth.admin.create_user({
                "email": user["email"],
                "password": user["password"],
                "email_confirm": True
            })

            if auth_response.user:
                user_id = auth_response.user.id
        except Exception as e:
            # Auth user might already exist, try to get by email
            try:
                users_response = supabase.auth.admin.list_users()
                for u in users_response:
                    if u.email == user["email"]:
                        user_id = u.id
                        break
            except:
                print(f"Could not find/create auth user {user['username']}: {e}")
                continue

        if not user_id:
            print(f"Skipping {user['username']}: no user_id")
            continue

        # Create/upsert profile
        try:
            supabase.table("profiles").upsert({
                "id": user_id,
                "username": user["username"],
                "age": user["age"],
                "gender": user["gender"]
            }).execute()
            user_ids.append(user_id)
            print(f"Created user: {user['username']} ({user_id})")
        except Exception as e:
            print(f"Error creating profile for {user['username']}: {e}")

    return user_ids


def create_seed_clicks(supabase, user_ids: list[str], num_clicks: int = 100):
    """Generate random feature clicks across the last 30 days."""
    if not user_ids:
        print("No users available for seeding clicks")
        return

    now = datetime.utcnow()
    clicks = []

    for _ in range(num_clicks):
        # Random timestamp within last 30 days
        days_ago = random.randint(0, 30)
        hours_ago = random.randint(0, 23)
        minutes_ago = random.randint(0, 59)
        timestamp = now - timedelta(days=days_ago, hours=hours_ago, minutes=minutes_ago)

        clicks.append({
            "user_id": random.choice(user_ids),
            "feature_name": random.choice(FEATURE_NAMES),
            "timestamp": timestamp.isoformat()
        })

    # Batch insert
    try:
        response = supabase.table("feature_clicks").insert(clicks).execute()
        print(f"Created {len(response.data)} click events")
    except Exception as e:
        print(f"Error creating clicks: {e}")


def main():
    print("Starting seed process...")
    supabase = get_supabase_admin_client()

    print("\n1. Creating seed users...")
    user_ids = create_seed_users(supabase)
    print(f"   Total users: {len(user_ids)}")

    print("\n2. Creating seed clicks...")
    create_seed_clicks(supabase, user_ids, num_clicks=500)

    print("\nSeeding complete!")


if __name__ == "__main__":
    main()
