import yfinance as yf
import json
import os
import requests
from bs4 import BeautifulSoup
from datetime import datetime
import xml.etree.ElementTree as ET

# Configuration
TAPE_SYMBOLS = ["^NSEI", "^GSPC", "^FTSE", "INR=X", "BTC-USD", "CL=F", "GC=F"]
COMPARATIVE_SYMBOLS = ["^NSEI", "^GSPC", "^FTSE"]
SUBSTACK_URL = "https://shandilyabh.substack.com/p/chaos-and-excess"
TWITTER_RSS_URL = "https://rss.app/feeds/I7WhfJUj4rp4rtH1.xml"
GITHUB_USERNAME = "shandilyabh"
GITHUB_TOKEN = os.getenv("GH_TOKEN")

def get_github_level(level_str):
    mapping = {
        "NONE": 0,
        "FIRST_QUARTILE": 1,
        "SECOND_QUARTILE": 2,
        "THIRD_QUARTILE": 3,
        "FOURTH_QUARTILE": 4
    }
    return mapping.get(level_str, 0)

def fetch_market_data():
    data = {
        "last_updated": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "tickers": {},
        "charts": {},
        "article": {"title": "", "content": "", "url": SUBSTACK_URL},
        "tweet": {"text": "", "date": "", "url": ""},
        "github": {"weeks": []}
    }

    # 1. Fetch Ticker Data
    for symbol in TAPE_SYMBOLS:
        try:
            ticker = yf.Ticker(symbol)
            info = ticker.fast_info
            current_price = info.last_price
            prev_close = info.previous_close
            change = current_price - prev_close
            percent_change = (change / prev_close) * 100
            data["tickers"][symbol] = {
                "price": round(current_price, 2),
                "change": round(change, 2),
                "percent_change": round(percent_change, 2),
                "currency": getattr(info, 'currency', 'USD')
            }
        except Exception as e:
            print(f"Error fetching ticker {symbol}: {e}")

    # 2. Fetch Comparative Chart Data (YTD)
    start_of_year = f"{datetime.now().year}-01-01"
    for symbol in COMPARATIVE_SYMBOLS:
        try:
            history = yf.download(symbol, start=start_of_year, interval="1d", progress=False, auto_adjust=True)
            if history.empty: continue
            chart_data = []
            for index, row in history.iterrows():
                val = row["Close"]
                scalar_val = float(val.iloc[0]) if hasattr(val, 'iloc') else float(val)
                chart_data.append({"time": index.strftime("%Y-%m-%d"), "value": scalar_val})
            data["charts"][symbol] = chart_data
        except Exception as e:
            print(f"Error fetching chart {symbol}: {e}")

    # 3. Scrape Substack Article (Improved selector)
    try:
        response = requests.get(SUBSTACK_URL, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'})
        if response.ok:
            soup = BeautifulSoup(response.text, 'html.parser')
            title = soup.find('h1', class_='post-title')
            data["article"]["title"] = title.get_text() if title else "Chaos and Excess"
            
            # Substack body content often lives in these classes
            content_div = soup.find('div', class_='available-content') or soup.find('div', class_='body') or soup.find('div', class_='markup')
            
            if content_div:
                # Clean up redundant UI elements
                for tag in content_div.find_all(['div', 'section', 'button'], class_=['button-wrapper', 'post-ufi', 'subscription-widget-wrap', 'subscribe-widget']):
                    tag.decompose()
                
                # Extract clean HTML string
                data["article"]["content"] = "".join([str(c) for c in content_div.contents])
    except Exception as e:
        print(f"Error scraping article: {e}")

    # 4. Fetch Latest Tweet from RSS
    try:
        response = requests.get(TWITTER_RSS_URL, headers={'User-Agent': 'Mozilla/5.0'})
        if response.ok:
            root = ET.fromstring(response.content)
            item = root.find('.//item')
            if item is not None:
                data["tweet"]["text"] = item.find('title').text
                data["tweet"]["url"] = item.find('link').text
                pub_date = item.find('pubDate').text
                if pub_date:
                    try:
                        dt = datetime.strptime(pub_date, "%a, %d %b %Y %H:%M:%S %Z")
                        data["tweet"]["date"] = dt.strftime("%d %b %y").upper()
                    except:
                        data["tweet"]["date"] = pub_date
    except Exception as e:
        print(f"Error fetching tweet RSS: {e}")

    # 5. Fetch GitHub Contributions
    if GITHUB_TOKEN:
        try:
            query = """
            query($userName:String!) {
              user(login:$userName) {
                contributionsCollection {
                  contributionCalendar {
                    weeks {
                      contributionDays {
                        date
                        contributionLevel
                        contributionCount
                      }
                    }
                  }
                }
              }
            }
            """
            variables = {"userName": GITHUB_USERNAME}
            headers = {"Authorization": f"Bearer {GITHUB_TOKEN}"}
            res = requests.post("https://api.github.com/graphql", json={"query": query, "variables": variables}, headers=headers)
            if res.ok:
                json_data = res.json()
                raw_weeks = json_data['data']['user']['contributionsCollection']['contributionCalendar']['weeks']
                processed_weeks = []
                for week in raw_weeks[-18:]:
                    days = []
                    for day in week['contributionDays']:
                        days.append({
                            "date": day['date'],
                            "count": day['contributionCount'],
                            "level": get_github_level(day['contributionLevel'])
                        })
                    processed_weeks.append({"contributionDays": days})
                data["github"]["weeks"] = processed_weeks
        except Exception as e:
            print(f"Error fetching GitHub GraphQL: {e}")
    else:
        try:
            url = f"https://github.com/users/{GITHUB_USERNAME}/contributions"
            res = requests.get(url)
            if res.ok:
                soup = BeautifulSoup(res.text, 'html.parser')
                rects = soup.find_all('td', class_='ContributionCalendar-day')
                flat_list = []
                for rect in rects:
                    date = rect.get('data-date')
                    level = int(rect.get('data-level', '0'))
                    if date: flat_list.append({"date": date, "level": level, "count": 0})
                
                weeks = []
                for i in range(0, len(flat_list), 7):
                    weeks.append({"contributionDays": flat_list[i:i+7]})
                data["github"]["weeks"] = weeks[-18:]
        except Exception as e:
            print(f"Error fetching GitHub scraping: {e}")

    # 6. Save to JSON
    output_path = "public/market-data.json"
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w") as f:
        json.dump(data, f, indent=2)
    print(f"Data successfully saved to {output_path}")

if __name__ == "__main__":
    fetch_market_data()
