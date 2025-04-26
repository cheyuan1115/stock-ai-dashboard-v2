import yfinance as yf
import pandas as pd
import json
from datetime import datetime, timedelta

# 股票清單（可擴充）
tickers = ["AAPL", "TSLA", "MSFT"]

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

        trend = "不明"
        score = 50
        change_30d = ((df["Close"].iloc[-1] - df["Close"].iloc[-30]) / df["Close"].iloc[-30]) * 100
        vol_change = df["Volume"].iloc[-7:].mean() / df["Volume"].iloc[-30:].mean()

        if df["20MA"].iloc[-1] > df["60MA"].iloc[-1]:
            trend = "上升"
            score = min(100, round(70 + change_30d / 2))
        elif df["20MA"].iloc[-1] < df["60MA"].iloc[-1]:
            trend = "下降"
            score = max(0, round(30 + change_30d / 2))

        stock = {
            "股票代碼": ticker,
            "趨勢分類": trend,
            "趨勢強度": round((df["20MA"].iloc[-1] - df["60MA"].iloc[-1]) / df["Close"].iloc[-1], 2),
            "近30日漲跌幅(%)": round(change_30d, 2),
            "成交量變化(7/30)": round(vol_change, 2),
            "建議買進機率(%)": score,
            "建議賣出機率(%)": 100 - score,
        }

        results.append(stock)

    except Exception as e:
        print(f"Error processing {ticker}: {e}")

with open("public/data/stocks.json", "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=2)
