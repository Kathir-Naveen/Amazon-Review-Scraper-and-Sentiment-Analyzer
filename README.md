# Amazon Review Scraper and Sentiment Analyzer

## 📌 Project Description
The Amazon Reviews Scraper is a Python-based tool designed to extract and analyze customer reviews from Amazon products. This project allows users to gather valuable data, such as review ratings, titles, review content, dates,from a specific Amazon product page. The scraper is designed to be efficient and easy to use, making it an excellent tool for anyone interested in analyzing product feedback for research, sentiment analysis, or competitive market research.
## 🚀 Features
- Scrapes reviews from Amazon product pages.
- Cleans and processes text data.
- Performs sentiment analysis using NLP techniques.
- Visualizes sentiment distribution.

## 🛠 Tech Stack
- **Programming Language:** Python flask 
- **Libraries Used:** BeautifulSoup, Selenium, NLTK, VADER. 

# Amazon Review Analyzer

## Installation

To use the Amazon Review Analyzer, follow these steps:

1. Clone the repository:
```
git clone https://github.com/Kathir-Naveen/Amazon-Review-Scraper-and-Sentiment-Analyzer-.git
```

2. Navigate to the project directory:
```
cd amazon-review-analyzer
```

3. Install the required dependencies:
```
pip install -r requirements.txt
```

4. (important✔✔)Ensure you have the necessary drivers installed for your web browser (e.g., ChromeDriver for Google Chrome).

## Usage

1. Run the Flask application:
```
python app.py
```

2. Open your web browser and navigate to `http://localhost:5000`.



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
## OUTPUT SCREEN SHORTS:

Home page
![image](https://github.com/user-attachments/assets/63304654-90f8-4b38-a783-c87bf3da06e8)

URL input Page
![image](https://github.com/user-attachments/assets/ab69b108-d4cc-42fc-9c9a-e68557e16739)

Review scrapped

 ![image](https://github.com/user-attachments/assets/c307c2e4-c475-4446-a594-5e72581f283f)


Sentiment score 

![image](https://github.com/user-attachments/assets/ddffe302-c0b8-48ca-955d-b286740d06ee)

Word cloud

![image](https://github.com/user-attachments/assets/a1488217-600e-4379-a2ed-3866fd738a1e)

Review page

![image](https://github.com/user-attachments/assets/7b2bb804-e430-4d36-990b-35f1da41591d)

Buy page


![image](https://github.com/user-attachments/assets/1f79d39c-39c5-4bad-8547-70c52b97ab15)


