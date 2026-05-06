export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const tickers = [
    '2222.SR','2010.SR','1120.SR','7010.SR','1211.SR',
    '1180.SR','7030.SR','2050.SR','2310.SR','4300.SR'
  ];

  const symbols = tickers.join(',');
  const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbols}&lang=ar&region=SA`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'application/json'
      }
    });

    const data = await response.json();
    const quotes = data?.quoteResponse?.result || [];

    const result = quotes.map(q => ({
      ticker: q.symbol,
      price: q.regularMarketPrice,
      change: q.regularMarketChange,
      changePct: q.regularMarketChangePercent,
      high52: q.fiftyTwoWeekHigh,
      low52: q.fiftyTwoWeekLow,
      volume: q.regularMarketVolume,
      avgVolume: q.averageDailyVolume3Month,
      ma50: q.fiftyDayAverage,
      ma200: q.twoHundredDayAverage,
      name: q.shortName || q.longName
    }));

    res.status(200).json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}
