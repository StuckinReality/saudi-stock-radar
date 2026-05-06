export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const tickers = [
    '2222.SR','2010.SR','1120.SR','7010.SR','1211.SR',
    '1180.SR','7030.SR','2050.SR','2310.SR','4300.SR'
  ];

  try {
    const response = await fetch(
      `https://query2.finance.yahoo.com/v7/finance/quote?formatted=false&symbols=${tickers.join(',')}&fields=regularMarketPrice,regularMarketChange,regularMarketChangePercent,fiftyTwoWeekHigh,fiftyTwoWeekLow,regularMarketVolume,averageDailyVolume3Month,fiftyDayAverage,twoHundredDayAverage,shortName`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          'Accept': 'application/json',
          'Referer': 'https://finance.yahoo.com/',
        }
      }
    );

    const text = await response.text();
    if (text.startsWith('<!') || text.startsWith('<html')) throw new Error('HTML response');

    const data = JSON.parse(text);
    const quotes = data?.quoteResponse?.result || [];
    if (!quotes.length) throw new Error('No data');

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
      name: q.shortName || q.symbol
    }));

    res.status(200).json({ success: true, data: result, source: 'yahoo' });

  } catch (err) {
    const fallback = [
      { ticker: '2222.SR', name: 'أرامكو', price: 27.15, change: -0.35, changePct: -1.27, high52: 32.0, low52: 24.9, volume: 18500000, avgVolume: 15000000, ma50: 27.8, ma200: 28.5 },
      { ticker: '2010.SR', name: 'سابك', price: 87.20, change: 1.20, changePct: 1.40, high52: 102.0, low52: 83.0, volume: 1200000, avgVolume: 980000, ma50: 89.5, ma200: 92.0 },
      { ticker: '1120.SR', name: 'الراجحي', price: 81.50, change: -0.90, changePct: -1.09, high52: 95.0, low52: 77.0, volume: 3400000, avgVolume: 2800000, ma50: 83.0, ma200: 85.5 },
      { ticker: '7010.SR', name: 'stc', price: 50.30, change: 0.30, changePct: 0.60, high52: 60.0, low52: 47.5, volume: 890000, avgVolume: 750000, ma50: 51.5, ma200: 53.0 },
      { ticker: '1211.SR', name: 'معادن', price: 46.20, change: -1.10, changePct: -2.33, high52: 57.0, low52: 43.0, volume: 2100000, avgVolume: 1800000, ma50: 48.5, ma200: 50.0 },
      { ticker: '1180.SR', name: 'الأهلي', price: 30.10, change: 0.10, changePct: 0.33, high52: 36.5, low52: 28.5, volume: 1500000, avgVolume: 1200000, ma50: 31.0, ma200: 32.5 },
      { ticker: '7030.SR', name: 'زين السعودية', price: 11.20, change: -0.20, changePct: -1.75, high52: 14.0, low52: 10.2, volume: 4200000, avgVolume: 3500000, ma50: 11.8, ma200: 12.3 },
      { ticker: '2050.SR', name: 'صافولا', price: 33.10, change: 0.60, changePct: 1.85, high52: 39.5, low52: 30.5, volume: 780000, avgVolume: 650000, ma50: 34.0, ma200: 35.5 },
      { ticker: '2310.SR', name: 'الكيميائية', price: 18.50, change: -0.30, changePct: -1.60, high52: 23.5, low52: 17.2, volume: 1100000, avgVolume: 900000, ma50: 19.5, ma200: 20.8 },
      { ticker: '4300.SR', name: 'دار الأركان', price: 13.20, change: 0.20, changePct: 1.54, high52: 16.5, low52: 11.8, volume: 5600000, avgVolume: 4800000, ma50: 13.8, ma200: 14.2 }
    ];
    res.status(200).json({ success: true, data: fallback, source: 'fallback' });
  }
}
