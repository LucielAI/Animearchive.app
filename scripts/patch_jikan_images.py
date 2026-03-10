import json
import requests
import time
import argparse
import sys
import os
import re

def normalize_name(name):
    # Lowercase, remove commas and hyphens, split into a set of words
    clean = re.sub(r'[,.-]', ' ', name.lower())
    return set(clean.split())

def patch_images(filepath):
    print(f"// ARCHIVE INITIATED: Patching Jikan images for {filepath}")
    
    if not os.path.exists(filepath):
        print(f"Error: File {filepath} not found.")
        return

    with open(filepath, 'r', encoding='utf-8') as f:
        payload = json.load(f)

    anime_id = payload.get('malId')
    anime_name = payload.get('anime')
    
    if not anime_id:
        print(f"Error: No malId found in {filepath}. Cannot fetch cast.")
        return

    print(f"// Fetching official anime info for {anime_name} (ID: {anime_id})")
    try:
        url = f"https://api.jikan.moe/v4/anime/{anime_id}"
        res = requests.get(url)
        res.raise_for_status()
        anime_data = res.json().get('data', {})
        
        anime_image = anime_data.get('images', {}).get('jpg', {}).get('large_image_url')
        if anime_image:
            payload['animeImageUrl'] = anime_image
            if '_fetchFailed' in payload:
                del payload['_fetchFailed']
            print(f"// Success: Patched primary anime image: {anime_image}")
        else:
            print(f"// Warning: Could not find primary image in Jikan response.")
    except Exception as e:
        print(f"// API Failure for Anime Info: {e}")
        return

    time.sleep(0.5) # Jikan rate limit buffer

    print(f"// Fetching official cast list for {anime_name} (ID: {anime_id})")
    try:
        url = f"https://api.jikan.moe/v4/anime/{anime_id}/characters"
        res = requests.get(url)
        res.raise_for_status()
        cast_data = res.json().get('data', [])
        print(f"// Success: Retrieved {len(cast_data)} cast members.")
    except Exception as e:
        print(f"// API Failure for Cast List: {e}")
        return

    # Build a lookup list [{ id, image, name_set, raw_name }]
    cast_list = []
    for member in cast_data:
        person = member.get('character', {})
        mal_id = person.get('mal_id')
        name = person.get('name', '')
        image = person.get('images', {}).get('jpg', {}).get('image_url')
        
        if mal_id and image:
            cast_list.append({
                "id": mal_id,
                "image": image,
                "name_set": normalize_name(name),
                "raw_name": name
            })

    # Patch the characters in the payload
    characters = payload.get('characters', [])
    patched_count = 0
    
    for char in characters:
        char_name = char.get('name', '')
        char_name_set = normalize_name(char_name)
        match = None
        
        # 1. Exact set match (e.g., {'okabe', 'rintarou'} == {'rintarou', 'okabe'})
        for jikan_char in cast_list:
            if char_name_set == jikan_char['name_set']:
                match = jikan_char
                break
                
        # 2. Subset match (e.g., payload has 'Suzuha', Jikan has 'Amane, Suzuha')
        if not match:
            for jikan_char in cast_list:
                if char_name_set.issubset(jikan_char['name_set']) or jikan_char['name_set'].issubset(char_name_set):
                    match = jikan_char
                    break

        if match:
            print(f"  [+] Match found for '{char_name}' -> '{match['raw_name']}': ID {match['id']}")
            char['malId'] = match['id']
            char['imageUrl'] = match['image']
            if '_fetchFailed' in char:
                del char['_fetchFailed']
            patched_count += 1
        else:
            print(f"  [-] No match found for '{char_name}'. Left intact.")

    print(f"// Patched {patched_count} out of {len(characters)} characters.")
    
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(payload, f, indent=2, ensure_ascii=False)
    
    print("// PATCH COMPLETE. Payload saved.")

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Patch Jikan character/anime images directly from the official Anime cast lists to bypass caching bugs.")
    parser.add_argument('--file', required=True, help="Path to the Universe JSON file (e.g. src/data/aot.json)")
    args = parser.parse_args()
    patch_images(args.file)
