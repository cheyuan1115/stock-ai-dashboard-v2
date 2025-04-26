import yfinance as yf
import pandas as pd
import json
from datetime import datetime, timedelta

# 股票清單（美股市值前 50 大範例，可自行擴充）
tickers = ["AAPL", "MSFT", "TSLA", "GOOGL", "AMZN", "NVDA", "META", "BRK-B", "JPM", "V"]

end_date = datetime.today()
start_date = end_date - timedelta(days=60)

results = []

for ticker in tickers:
    try:
        df = yf.Ticker(ticker).history(start=start_date, end=end_date)
        if df.empty:
            print(f"警告：{ticker} 抓取到的資料為空")
            continue

        # 計算20日與60日均線
        df["20MA"] = df["Close"].rolling(window=20).mean()
        df["60MA"] = df["Close"].rolling(window=60).mean()

        # 取最後一個非 NaN 的 20MA 和 60MA
        last_valid_20MA = df["20MA"].dropna().iloc[-1] if not df["20MA"].dropna().empty else None
        last_valid_60MA = df["60MA"].dropna().iloc[-1] if not df["60MA"].dropna().empty else None

        if last_valid_20MA is None or last_valid_60MA is None:
            trend = "不明"
            score = 50
            diff = 0
        else:
            if last_valid_20MA > last_valid_60MA:
                trend = "上升"
                score = 80
            elif last_valid_20MA < last_valid_60MA:
                trend = "下降"
                score = 20
            else:
                trend = "不明"
                score = 50
            diff = round(abs(last_valid_20MA - last_valid_60MA), 2)

        # 近30日漲跌幅
        if len(df) >= 30:
            pct_change = round((df["Close"].iloc[-1] - df["Close"].iloc[-30]) / df["Close"].iloc[-30] * 100, 2)
        else:
            pct_change = round((df["Close"].iloc[-1] - df["Close"].iloc[0]) / df["Close"].iloc[0] * 100, 2)

        # 成交量變化比例
        ratio = round(df["Close"].iloc[-1] / df["Close"].max(), 2)

        results.append({
            "股票代碼": ticker,
            "趨勢分類": trend,
            "趨勢強度": diff,
            "近30日漲跌幅(%)": pct_change,
            "成交量變化(7/30)": ratio,
            "建議買進機率(%)": score,
            "建議賣出機率(%)": 100 - score,
            "AI分析語錄": f"{ticker} 目前為 {trend} 趨勢，屬於模擬語錄，稍後將由 GPT 替換"
        })

    except Exception as e:
        print(f"錯誤：{ticker} 無法處理 → {e}")

# 輸出為 JSON
with open("public/data/stocks.json", "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print("✅ stocks.json 更新完成！")
