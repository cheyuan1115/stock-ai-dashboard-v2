# update_stocks.py
import yfinance as yf
import pandas as pd
import json
from datetime import datetime

# 股票清單（示範10支，你可以自己擴充成50支）
tickers = ["AAPL", "MSFT", "TSLA", "GOOGL", "AMZN", "NVDA", "META", "BRK-B", "JPM", "V"]

results = []

for ticker in tickers:
    try:
        print(f"📈 抓取 {ticker} 資料中...")
        df = yf.download(ticker, period="90d", interval="1d", auto_adjust=True, progress=False)

        # 資料防呆
        if df.empty or len(df) < 60:
            print(f"⚠️ {ticker} 資料不足60筆，跳過")
            continue

        df["20MA"] = df["Close"].rolling(window=20).mean()
        df["60MA"] = df["Close"].rolling(window=60).mean()

        # 確保最後一筆均線有數值
        if pd.isna(df["20MA"].iloc[-1]) or pd.isna(df["60MA"].iloc[-1]):
            print(f"⚠️ {ticker} 均線不足，跳過")
            continue

        # 趨勢判斷
        if df["20MA"].iloc[-1] > df["60MA"].iloc[-1]:
            trend = "上升"
            score = 80
        elif df["20MA"].iloc[-1] < df["60MA"].iloc[-1]:
            trend = "下降"
            score = 20
        else:
            trend = "不明"
            score = 50

        # 近30日漲跌幅
        pct_change_30d = round((df["Close"].iloc[-1] - df["Close"].iloc[-30]) / df["Close"].iloc[-30] * 100, 2)

        # 成交量變化（近7日均量 / 近30日均量）
        volume_7d = df["Volume"].tail(7).mean()
        volume_30d = df["Volume"].tail(30).mean()
        if volume_30d == 0:
            volume_ratio = 1.0
        else:
            volume_ratio = round(volume_7d / volume_30d, 2)

        # 整理結果
        results.append({
            "股票代碼": ticker,
            "趨勢分類": trend,
            "趨勢強度": round(abs(df["20MA"].iloc[-1] - df["60MA"].iloc[-1]), 2),
            "近30日漲跌幅(%)": pct_change_30d,
            "成交量變化(7/30)": volume_ratio,
            "建議買進機率(%)": score,
            "建議賣出機率(%)": 100 - score,
            "AI分析語錄": f"{ticker} 目前屬於「{trend}」趨勢，建議依照市場情緒靈活調整策略"
        })

    except Exception as e:
        print(f"❗ 抓取 {ticker} 時發生錯誤：{e}")
        continue

# 輸出結果到 JSON
with open("public/data/stocks.json", "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print("✅ 完成 stocks.json 更新！")
