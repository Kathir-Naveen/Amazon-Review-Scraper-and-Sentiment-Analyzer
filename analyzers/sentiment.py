from nltk.sentiment.vader import SentimentIntensityAnalyzer
import re
from collections import Counter
import string

class SentimentAnalyzer:
    def __init__(self):
        self.sid = SentimentIntensityAnalyzer()
        
    def preprocess_text(self, text):
        """Preprocess text before sentiment analysis."""
        # Convert to lowercase
        text = text.lower()
        
        # Remove URLs
        text = re.sub(r'https?://\S+|www\.\S+', '', text)
        
        # Remove punctuation
        text = text.translate(str.maketrans('', '', string.punctuation))
        
        # Remove extra spaces
        text = re.sub(r'\s+', ' ', text).strip()
        
        return text
        
    def analyze_reviews(self, reviews):
        """Analyze sentiment of reviews using VADER."""
        if not reviews:
            return {"compound": 0, "pos": 0, "neu": 0, "neg": 0}
            
        compound_scores = []
        positive_scores = []
        neutral_scores = []
        negative_scores = []
        
        for review in reviews:
            # Preprocess the review text
            processed_review = self.preprocess_text(review)
            
            # Skip empty reviews after preprocessing
            if not processed_review:
                continue
                
            # Get sentiment scores
            scores = self.sid.polarity_scores(processed_review)
            
            compound_scores.append(scores['compound'])
            positive_scores.append(scores['pos'])
            neutral_scores.append(scores['neu'])
            negative_scores.append(scores['neg'])
        
        # Calculate average scores
        if compound_scores:
            avg_compound = sum(compound_scores) / len(compound_scores)
            avg_positive = sum(positive_scores) / len(positive_scores)
            avg_neutral = sum(neutral_scores) / len(neutral_scores)
            avg_negative = sum(negative_scores) / len(negative_scores)
        else:
            avg_compound = avg_positive = avg_neutral = avg_negative = 0
        
        # Classify reviews
        positive_reviews = sum(1 for score in compound_scores if score > 0.05)
        neutral_reviews = sum(1 for score in compound_scores if -0.05 <= score <= 0.05)
        negative_reviews = sum(1 for score in compound_scores if score < -0.05)
        
        return {
            "compound": avg_compound,
            "pos": avg_positive,
            "neu": avg_neutral,
            "neg": avg_negative,
            "positive_count": positive_reviews,
            "neutral_count": neutral_reviews,
            "negative_count": negative_reviews,
            "total_reviews": len(compound_scores)
        }
    
    def generate_word_cloud_data(self, reviews):
        """Generate word frequency data for word cloud visualization."""
        # Common English stopwords to exclude
        stopwords = set([
            'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 
            'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 
            'himself', 'she', 'her', 'hers', 'herself', 'it', 'its', 'itself', 
            'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which', 
            'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'is', 'are', 
            'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 
            'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 
            'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 
            'with', 'about', 'against', 'between', 'into', 'through', 'during', 
            'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 
            'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 
            'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 
            'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 
            'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 
            's', 't', 'can', 'will', 'just', 'don', 'should', 'now', 'product',
            'amazon', 'review', 'star', 'stars', 'one', 'two', 'three', 'four', 'five'
        ])
        
        # Process all reviews
        all_words = []
        for review in reviews:
            # Preprocess the review text
            processed_review = self.preprocess_text(review)
            
            # Tokenize into words
            words = processed_review.split()
            
            # Filter out stopwords and short words
            filtered_words = [word for word in words if word not in stopwords and len(word) > 2]
            
            all_words.extend(filtered_words)
        
        # Count word frequencies
        word_counts = Counter(all_words)
        
        # Get the top 100 words
        top_words = word_counts.most_common(100)
        
        # Format for visualization
        word_cloud_data = [{"text": word, "size": count} for word, count in top_words]
        
        return word_cloud_data