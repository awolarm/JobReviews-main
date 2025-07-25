from bs4 import BeautifulSoup
from seleniumbase import SB
import json

reviews_data = []

with SB(uc=True, test=True, locale="en") as sb:
    url = "https://www.indeed.com/cmp/Macy's/reviews"
    sb.activate_cdp_mode(url)
    sb.uc_gui_click_captcha()
    sb.sleep(5)
    page_html = sb.get_page_source()
    soup = BeautifulSoup(page_html, 'html.parser')

    reviewList = soup.find('ul', class_='css-u74ql7 eu4oa1w0')
    
    for child in reviewList: 
        spans = child.find_all('span', class_='css-15r9gu1 eu4oa1w0')
        spans_date = child.find('span', class_='css-1tqkbyy e1wnkr790') 
        spans_location = child.find('span', class_='css-7egqgm e1wnkr790')
        h2_role = child.find('h2', class_='css-1fvr0l2 e1tiznh50')
        if not h2_role: 
           h2_role = child.find('h2', class_='css-p5j9gb e1tiznh50')
        if len(spans) >= 2: 
            title = spans[0]
            description = spans[1]
            review = {
                'title' : title.text.strip(),
                'description': description.text.strip(),
                'date': spans_date.text.strip() if spans_date else 'N/A',
                'role': h2_role.text.strip() if h2_role else 'N/A',
                'location': spans_location.text.strip() if spans_location else 'N/A',
                'company' : "Macy's", 
            }
            reviews_data.append(review)
        
with open('reviews.json', 'w', encoding='utf-8') as f: 
    json.dump(reviews_data, f, indent=2, ensure_ascii=False)

