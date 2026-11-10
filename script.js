// Grab the elements we need from the page
const quoteText = document.getElementById("quote-text");
const quoteAuthor = document.getElementById("quote-author");
const newQuoteBtn = document.getElementById("new-quote");
const copyBtn = document.getElementById("copy-quote");
const shareLink = document.getElementById("share-quote");
 
// Free API that returns one random quote: { quote: "...", author: "..." }
const API_URL = "https://dummyjson.com/quotes/random";
 
// Backup quotes in case the API is down or there is no internet
const backupQuotes = [
  { quote: "When one tugs at a single thing in nature, he finds it attached to the rest of the world.", author: "John Muir" },
  { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { quote: "It always seems impossible until it is done.", author: "Nelson Mandela" },
  { quote: "Well done is better than well said.", author: "Benjamin Franklin" },
  { quote: "The best way to predict the future is to create it.", author: "Peter Drucker" }
];
 
// Keep the current quote so Copy and Share can use it
let currentQuote = null;
 
// Show a quote on the page
function showQuote(data) {
  currentQuote = data;
 
  quoteText.textContent = "\u201C" + data.quote + "\u201D";
  quoteAuthor.textContent = "\u2014 " + data.author;
 
  // Restart the fade animation
  quoteText.classList.remove("fade");
  void quoteText.offsetWidth;
  quoteText.classList.add("fade");
 
  // Update the share link with the new quote
  const tweet = "\u201C" + data.quote + "\u201D \u2014 " + data.author;
  shareLink.href = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(tweet);
}
 
// Pick a random quote from the backup list
function getBackupQuote() {
  const index = Math.floor(Math.random() * backupQuotes.length);
  return backupQuotes[index];
}
 
// Get a new quote from the API
async function getQuote() {
  quoteText.textContent = "Loading...";
  quoteAuthor.textContent = "";
  newQuoteBtn.disabled = true;
 
  try {
    const response = await fetch(API_URL);
 
    if (!response.ok) {
      throw new Error("Request failed with status " + response.status);
    }
 
    const data = await response.json();
    showQuote(data);
  } catch (error) {
    // Something went wrong, so use a backup quote instead
    console.log("Could not load quote from the API:", error);
    showQuote(getBackupQuote());
  }
 
  newQuoteBtn.disabled = false;
}
 
// Copy the current quote to the clipboard
function copyQuote() {
  if (!currentQuote) return;
 
  const text = currentQuote.quote + " - " + currentQuote.author;
 
  navigator.clipboard.writeText(text).then(function () {
    copyBtn.textContent = "Copied!";
 
    // Change the label back after 1.5 seconds
    setTimeout(function () {
      copyBtn.textContent = "Copy";
    }, 1500);
  });
}
 
// Button events
newQuoteBtn.addEventListener("click", getQuote);
copyBtn.addEventListener("click", copyQuote);
 
// Load a quote when the page opens
getQuote();
 