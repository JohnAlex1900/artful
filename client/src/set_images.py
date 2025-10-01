import json
import requests
from pathlib import Path
from time import sleep

# === CONFIG ===
NAV_LINKS_FILE = "./lib/nav_links.json"
SERVICES_DATA_FILE = "./lib/services_data.json"
UNSPLASH_ACCESS_KEY = "oA1qqqUNGT6AQBomOMzGtlcxEhpXpY9Q7oGr4lynn1U"
IMAGES_PER_SERVICE = 3
SLEEP_BETWEEN_REQUESTS = 0.5  # avoid hitting API rate limit
VERIFY_IMAGES = True  # check if URL returns 200

# Load nav_links.json
with open(NAV_LINKS_FILE, "r") as f:
    nav_links = json.load(f)

# Load services_data.json
with open(SERVICES_DATA_FILE, "r") as f:
    services_data = json.load(f)

def verify_url(url):
    """Check if the URL is valid (returns 200)."""
    try:
        resp = requests.head(url, allow_redirects=True, timeout=5)
        return resp.status_code == 200
    except:
        return False

def search_images(query, per_page=IMAGES_PER_SERVICE):
    """Search images from Unsplash and verify they exist."""
    url = "https://api.unsplash.com/search/photos"
    params = {
        "query": query,
        "client_id": UNSPLASH_ACCESS_KEY,
        "per_page": per_page * 3,  # fetch extra to account for invalid URLs
    }
    response = requests.get(url, params=params)
    if response.status_code != 200:
        print(f"Error fetching images for '{query}': {response.text}")
        return []

    results = response.json().get("results", [])
    urls = []
    for r in results:
        image_url = r["urls"]["regular"]
        if VERIFY_IMAGES and not verify_url(image_url):
            continue
        urls.append(image_url)
        if len(urls) >= per_page:
            break

    # fallback: if no valid image, use a placeholder
    if not urls:
        urls = [f"https://via.placeholder.com/800x600?text={query.replace(' ', '+')}"]
    return urls

def fill_images(service_node, data_node):
    """Recursively fill images for a service and its subservices."""
    if "link" in service_node:
        target = next((s for s in data_node if s["link"] == service_node["link"]), None)
        if target:
            # Always update if empty or fewer images than desired
            if not target.get("images") or len(target["images"]) < IMAGES_PER_SERVICE:
                print(f"Fetching images for '{service_node['title']}'...")
                target["images"] = search_images(service_node["title"])
                sleep(SLEEP_BETWEEN_REQUESTS)

            # Handle subServices recursively
            if "children" in service_node and "subServices" in target:
                for child in service_node["children"]:
                    fill_images(child, target["subServices"])

# Traverse all services
for top_level in nav_links:
    if top_level["title"] == "Services":
        for service in top_level["children"]:
            fill_images(service, services_data)

# Save updated services_data.json
backup_file = SERVICES_DATA_FILE.replace(".json", "_backup.json")
Path(SERVICES_DATA_FILE).rename(backup_file)
print(f"Backup saved as {backup_file}")

with open(SERVICES_DATA_FILE, "w") as f:
    json.dump(services_data, f, indent=2)

print("services_data.json updated with verified images successfully!")
