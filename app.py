from flask import Flask, render_template, request, jsonify, session
import os
import json
from scrapers.amazon_scraper import AmazonScraper
from analyzers.sentiment import SentimentAnalyzer
import nltk

# Download VADER lexicon for sentiment analysis
nltk.download('vader_lexicon')

app = Flask(__name__)
app.secret_key = os.urandom(24)  # For session management

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/scrape', methods=['POST'])
def scrape():
    data = request.get_json()
    url = data.get('url', '')
    
    # Validate URL (simple check)
    if 'amazon' not in url:
        return jsonify({"error": "Invalid Amazon URL"}), 400
    
    # Initialize scraper
    scraper = AmazonScraper()
    
    try:
        # Get product details and image
        product_details = scraper.scrape_product_details(url)
        
        # Start scraping reviews
        reviews = scraper.scrape_reviews(url)
        
        # Store data in session
        session['product_details'] = product_details
        session['reviews'] = reviews
        
        return jsonify({
            "status": "success",
            "message": f"Successfully scraped {len(reviews)} reviews",
            "product_details": product_details,
            "review_count": len(reviews)
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/analyze', methods=['GET'])
def analyze():
    if 'reviews' not in session or 'product_details' not in session:
        return jsonify({"error": "No scraped data available"}), 400
    
    reviews = session['reviews']
    product_details = session['product_details']
    
    # Initialize sentiment analyzer
    analyzer = SentimentAnalyzer()
    
    # Analyze reviews
    sentiment_results = analyzer.analyze_reviews(reviews)
    
    # Generate word cloud data
    word_cloud_data = analyzer.generate_word_cloud_data(reviews)
    
    # Store results in session
    session['sentiment_results'] = sentiment_results
    session['word_cloud_data'] = word_cloud_data
    
    return render_template('analysis.html', 
                           product_details=product_details,
                           sentiment_results=sentiment_results,
                           word_cloud_data=json.dumps(word_cloud_data))

@app.route('/scraping_page')
def scraping_page():
    if 'product_details' not in session:
        return render_template('index.html')
    
    product_details = session['product_details']
    review_count = len(session.get('reviews', []))
    
    return render_template('scraping.html', 
                           product_details=product_details,
                           review_count=review_count)

@app.route('/results')
def results():
    if 'reviews' not in session or 'product_details' not in session:
        return render_template('index.html')
    
    reviews = session['reviews']
    product_details = session['product_details']
    sentiment_results = session.get('sentiment_results', {})
    
    return render_template('results.html', 
                           product_details=product_details,
                           reviews=reviews,
                           sentiment_results=sentiment_results)

if __name__ == '__main__':
    app.run(debug=True)