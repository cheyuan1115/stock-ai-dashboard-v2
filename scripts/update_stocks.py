import yfinance as yf
import pandas as pd
import json
from datetime import datetime, timedelta
import numpy as np

# 股票清單
tickers = ["AAPL", "MSFT", "TSLA", "GOOGL", "AMZN", "NVDA", "META", "BRK-B", "JPM", "V"]

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

        # 趨勢強度（防止 NaN）
        trend_strength = abs(df["20MA"].iloc[-1] - df["60MA"].iloc[-1])
        trend_strength = 0 if pd.isna(trend_strength) else round(trend_strength, 2)

        # 近30日漲跌幅
        pct_change = round((df["Close"].iloc[-1] - df["Close"].iloc[0]) / df["Close"].iloc[0] * 100, 2)

        # 成交量變化比（7日平均 / 30日平均）
        volume_7 = df["Volume"].tail(7).mean()
        volume_30 = df["Volume"].tail(30).mean()
        volume_ratio = round(volume_7 / volume_30, 2) if volume_30 != 0 else 0

        results.append({
            "股票代碼": ticker,
            "趨勢分類": trend,
            "趨勢強度": trend_strength,
            "近30日漲跌幅(%)": pct_change,
            "成交量變化(7/30)": volume_ratio,
            "建議買進機率(%)": score,
            "建議賣出機率(%)": 100 - score,
            "AI分析語錄": f"{ticker} 目前為 {trend} 趨勢，建議依照市場波動靈活調整策略"
        })
    except Exception as e:
        print(f"錯誤：{ticker} 無法處理 → {e}")

# 輸出 stocks.json
with open("public/data/stocks.json", "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print("✅ stocks.json 產生完成！")
