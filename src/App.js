// ============================================================
// CRT Stock Research Platform — Unified API Router (src/api.js)
// Connects your Vercel Web App to your Live Render Backend
// ============================================================

// Your live Python server running on Render cloud
const API_BASE_URL = "https://crt-screener-backend-1.onrender.com";

/**
 * 1. DOJI SCREENER ENDPOINT
 * Triggered when clicking the 1D, 1W, 1M, or 3M timeframe buttons.
 * Maps UI formats (e.g., '1D') to lowercase backend keys ('1d').
 */
export const fetchDojiScan = async (timeframe = "1D", market = "NSE") => {
  try {
    const cleanTf = timeframe.toLowerCase();
    const response = await fetch(
      `${API_BASE_URL}/scan?type=doji&tf=${cleanTf}&market=${market}&limit=30`
    );

    if (!response.ok) {
      throw new Error(`Screener server responded with status: ${response.status}`);
    }

    const data = await response.json();
    return {
      ok: true,
      results: data.results || [],
      count: data.count || 0
    };
  } catch (error) {
    console.error("Error running Doji Screener pipeline:", error);
    return { ok: false, results: [], error: error.message };
  }
};

/**
 * 2. SEARCH STOCK/QUOTES ENDPOINT
 * Triggered by the top search bar to check stock prices and daily changes.
 */
export const fetchStockQuote = async (ticker, market = "NSE") => {
  if (!ticker) return { ok: false, error: "Ticker symbol is required" };
  
  try {
    const cleanTicker = ticker.trim().toUpperCase();
    const response = await fetch(
      `${API_BASE_URL}/quote?symbols=${cleanTicker}&market=${market}`
    );

    if (!response.ok) {
      throw new Error(`Quote server responded with status: ${response.status}`);
    }

    const data = await response.json();
    return {
      ok: true,
      quotes: data.quotes || []
    };
  } catch (error) {
    console.error(`Error looking up stock quote for ${ticker}:`, error);
    return { ok: false, quotes: [], error: error.message };
  }
};

/**
 * 3. AI RESEARCH ANALYZER ENDPOINT
 * Triggered by the bottom AI block to run technical, fundamental, and risk matrices.
 */
export const fetchAIAnalysis = async (ticker, market = "NSE") => {
  if (!ticker) return { ok: false, error: "Ticker symbol is required" };

  try {
    const cleanTicker = ticker.trim().toUpperCase();
    const response = await fetch(
      `${API_BASE_URL}/ai/${cleanTicker}?market=${market}`
    );

    if (!response.ok) {
      throw new Error(`AI Engine server responded with status: ${response.status}`);
    }

    const data = await response.json();
    return {
      ok: true,
      analysisData: data
    };
  } catch (error) {
    console.error(`Error processing AI Research for ${ticker}:`, error);
    return { ok: false, analysisData: null, error: error.message };
  }
};
