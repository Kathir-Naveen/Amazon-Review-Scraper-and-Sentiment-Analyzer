# Amazon Review Scraper and Sentiment Analyzer

## 📌 Project Description
This project scrapes product reviews from Amazon and analyzes their sentiment. 
It helps users understand the general sentiment (positive, negative, or neutral) of product reviews.

## 🚀 Features
- Scrapes reviews from Amazon product pages.
- Cleans and processes text data.
- Performs sentiment analysis using NLP techniques.
- Visualizes sentiment distribution.

## 🛠 Tech Stack
- **Programming Language:** Python flask 
- **Libraries Used:** BeautifulSoup, Selenium, NLTK, VADER. 

## 📥 Installation Guide
1. Clone this repository:
   ```bash
   git clone https://github.com/Kathir-Naveen/Amazon-Review-Scraper-and-Sentiment-Analyzer-.git
   cd amazon-review-scraper
   ```
2. Install required dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Ensure that **Selenium** is set up properly (with the appropriate web driver for your browser).

## 📌 Usage
1. Run the scraper to collect Amazon reviews:
   ```bash
   python scraper.py
   ```
2. Process and clean the data:
   ```bash
   python data_cleaner.py
   ```
3. Perform sentiment analysis:
   ```bash
   python sentiment_analyzer.py
   ```
4. View sentiment results and visualizations:
   ```bash
   python visualize_results.py
   ```

## 📂 Project Structure
```
amazon_review_analyzer/
│
├── __pycache__/                   # Compiled Python files
│   ├── app.cpython-310.pyc
│   ├── sentiment.cpython-310.pyc
│   └── amazon_scraper.cpython-310.pyc
│
├── analyzers/                      # Sentiment analysis-related code
│   └── sentiment.py                # Sentiment analysis logic
│
├── app.py                          # Main application entry point
│
├── requirements.txt                # List of dependencies
│
├── scrapers/                       # Web scraping-related code
│   └── amazon_scraper.py           # Amazon review scraper
│
├── static/                         # Static files (CSS, JS)
│   ├── css/
│   │   └── styles.css              # Styles for the web app
│   └── js/
│       ├── main.js                 # Main JS file for app functionality
│       └── sentiment.js            # JS for sentiment analysis
│
├── templates/                      # HTML templates
│   ├── analysis.html               # Page for displaying analysis
│   ├── index.html                  # Home page
│   ├── results.html                # Page to show results of analysis
│   └── scraping.html               # Page to show scraping progress/results
│
└── README.md                       # Project documentation

```



## ✨ Contributors
- **Your Name** (Replace with your details)

## 📜 License
This project is licensed under the MIT License.
