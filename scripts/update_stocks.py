import yfinance as yf
import pandas as pd
import json
from datetime import datetime, timedelta

# 股票清單（美股市值前 50 大範例）
tickers = ["AAPL", "MSFT", "TSLA", "GOOGL", "AMZN", "NVDA", "META", "BRK-B", "JPM", "V"]  # 你可以擴充為 50 支

end_date = datetime.today()
start_date = end_date - timedelta(days=60)

results = []

for ticker in tickers:
    try:
        df = yf.Ticker(ticker).history(start=start_date, end=end_date)
        if df.empty:
            continue

        df["20MA"] = df["Close"].rolling(window=20).mean()
        df["60MA"] = df["Close"].rolling(window=60).mean()

        # 趨勢分類
        if df["20MA"].iloc[-1] > df["60MA"].iloc[-1]:
            trend = "上升"
            score = 80
        elif df["20MA"].iloc[-1] < df["60MA"].iloc[-1]:
            trend = "下降"
            score = 20
        else:
            trend = "不明"
            score = 50

        # 波動率、漲幅
        pct_change = round((df["Close"].iloc[-1] - df["Close"].iloc[0]) / df["Close"].iloc[0] * 100, 2)
        ratio = round(df["Close"].iloc[-1] / df["Close"].max(), 2)

        results.append({
            "股票代碼": ticker,
            "趨勢分類": trend,
            "趨勢強度": round(abs(df["20MA"].iloc[-1] - df["60MA"].iloc[-1]), 2),
            "近30日漲跌幅(%)": pct_change,
            "成交量變化(7/30)": ratio,
            "建議買進機率(%)": score,
            "建議賣出機率(%)": 100 - score
        })
    except Exception as e:
        print(f"錯誤：{ticker} 無法處理 → {e}")

# 輸出為 JSON
with open("public/data/stocks.json", "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=2)
