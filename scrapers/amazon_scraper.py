import time
import re
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
# Remove this if you're using direct path
# from webdriver_manager.chrome import ChromeDriverManager

class AmazonScraper:
    def __init__(self):
        # Setup Selenium WebDriver
        chrome_options = Options()
        chrome_options.add_argument("--headless")  # Run in headless mode
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        
        # Use the specific chromedriver.exe path
        chromedriver_path = r"C:\chromedriver-win64\chromedriver.exe"
        service = Service(executable_path=chromedriver_path)
        self.driver = webdriver.Chrome(service=service, options=chrome_options)
        
    def __del__(self):
        # Ensure the driver is closed when the object is destroyed
        try:
            self.driver.quit()
        except:
            pass
            
    def scrape_product_details(self, url):
        """Scrape product details including title, price, rating, and image."""
        try:
            self.driver.get(url)
            time.sleep(3)  # Allow page to load
            
            soup = BeautifulSoup(self.driver.page_source, 'html.parser')
            
            # Extract product title
            title_element = soup.select_one('#productTitle')
            title = title_element.text.strip() if title_element else "No title found"
            
            # Extract product price
            price_element = soup.select_one('.a-price .a-offscreen')
            price = price_element.text.strip() if price_element else "Price not available"
            
            # Extract product rating
            rating_element = soup.select_one('#acrPopover')
            rating = rating_element['title'] if rating_element and 'title' in rating_element.attrs else "No rating found"
            
            # Extract product image
            img_element = soup.select_one('#landingImage') or soup.select_one('#imgBlkFront')
            image_url = img_element['src'] if img_element and 'src' in img_element.attrs else ""
            
            # Get total review count
            review_count_element = soup.select_one('#acrCustomerReviewText')
            review_count = review_count_element.text.strip() if review_count_element else "0 reviews"
            product_url = url  # Assign the original product URL

            return {
                'title': title,
                'price': price,
                'rating': rating,
                'image_url': image_url,
                'review_count': review_count,
                'url': product_url  # Ensure this is included
            }
            
        except Exception as e:
            raise Exception(f"Error scraping product details: {str(e)}")
    
    def scrape_reviews(self, url):
        """Scrape reviews visible on the main product page."""
        try:
            self.driver.get(url)
            time.sleep(3)  # Allow page to load
            
            soup = BeautifulSoup(self.driver.page_source, 'html.parser')
            
            reviews = []
            
            # Look for customer reviews section on the product page
            review_elements = soup.select('.review-text-content')
            
            if not review_elements:
                # Try alternative selectors for reviews that might be present on the product page
                review_elements = soup.select('.a-expander-content')
            
            if not review_elements:
                # Try another common selector for featured reviews
                review_elements = soup.select('#cm-cr-dp-review-list .a-text-content')
                
            for review_element in review_elements:
                # Clean and extract review text
                review_text = review_element.get_text(strip=True)
                # Remove "Read more" button text if present
                review_text = re.sub(r'Read more$', '', review_text).strip()
                
                if review_text and len(review_text) > 5:  # Minimum length to filter out empty reviews
                    reviews.append(review_text)
            
            return reviews
            
        except Exception as e:
            raise Exception(f"Error scraping reviews: {str(e)}")