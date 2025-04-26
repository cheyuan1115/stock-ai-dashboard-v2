# scripts/update_stocks.py

import yfinance as yf
import pandas as pd
import json
from datetime import datetime, timedelta

# 股票清單（50大市值美股）
tickers = [
    'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA',
    'BRK-B', 'META', 'TSLA', 'UNH', 'LLY',
    'JPM', 'V', 'XOM', 'WMT', 'PG',
    'MA', 'CVX', 'HD', 'AVGO', 'MRK',
    'PEP', 'ABBV', 'COST', 'ADBE', 'KO',
    'CRM', 'NFLX', 'ABT', 'TMO', 'INTC',
    'ACN', 'LIN', 'ORCL', 'NKE', 'MCD',
    'AMD', 'AMAT', 'MDT', 'BMY', 'TXN',
    'QCOM', 'HON', 'LOW', 'UPS', 'NEE',
    'UNP', 'SBUX', 'PM', 'CAT', 'GS'
]

# 抓取一年內資料
end_date = datetime.today()
start_date = end_date - timedelta(days=365)

# 存分析結果
analysis = []

for ticker in tickers:
    try:
        df = yf.Ticker(ticker).history(start=start_date, end=end_date)

        if df.empty or 'Volume' not in df.columns:
            continue

        # 計算各種均線
        df['20MA'] = df['Close'].rolling(window=20).mean()
        df['60MA'] = df['Close'].rolling(window=60).mean()
        df['7MA_Volume'] = df['Volume'].rolling(window=7).mean()
        df['30MA_Volume'] = df['Volume'].rolling(window=30).mean()

        latest_close = df['Close'].iloc[-1]
        latest_20MA = df['20MA'].iloc[-1]
        latest_60MA = df['60MA'].iloc[-1]
        latest_7MA_vol = df['7MA_Volume'].iloc[-1]
        latest_30MA_vol = df['30MA_Volume'].iloc[-1]

        # 價格趨勢
        if latest_20MA > latest_60MA:
            price_trend = "上升"
        elif latest_20MA < latest_60MA:
            price_trend = "下降"
        else:
            price_trend = "盤整"

        # 成交量趨勢
        if latest_7MA_vol > latest_30MA_vol:
            volume_trend = "量增"
        else:
            volume_trend = "量縮"

        # 均線交叉
        if (df['20MA'].iloc[-2] < df['60MA'].iloc[-2]) and (latest_20MA > latest_60MA):
            cross = "黃金交叉"
        elif (df['20MA'].iloc[-2] > df['60MA'].iloc[-2]) and (latest_20MA < latest_60MA):
            cross = "死亡交叉"
        else:
            cross = "無明顯交叉"

        # 綜合建議
        if price_trend == "上升" and volume_trend == "量增":
            suggestion = "強勢上漲，可留意"
        elif price_trend == "上升" and volume_trend == "量縮":
            suggestion = "虛弱上漲，觀察為主"
        elif price_trend == "下降" and volume_trend == "量增":
            suggestion = "強勢下跌，應謹慎"
        elif price_trend == "下降" and volume_trend == "量縮":
            suggestion = "弱勢下跌，觀望"
        else:
            suggestion = "盤整中，耐心等待"

        # 收集線圖資料
        chart_data = {
            "日期": df.index.strftime('%Y-%m-%d').tolist(),
            "收盤價": df['Close'].round(2).tolist(),
            "20MA": df['20MA'].round(2).where(pd.notna(df['20MA']), None).tolist(),
            "60MA": df['60MA'].round(2).where(pd.notna(df['60MA']), None).tolist()
        }

        analysis.append({
            "股票": ticker,
            "最新收盤價": round(latest_close, 2),
            "價格趨勢": price_trend,
            "成交量趨勢": volume_trend,
            "均線交叉": cross,
            "綜合建議": suggestion,
            "線圖資料": chart_data
        })
    except Exception as e:
        print(f"⚠️ 錯誤：{ticker} 無法處理 → {e}")

# 輸出成 JSON
with open('public/data/stocks.json', 'w', encoding='utf-8') as f:
    json.dump(analysis, f, ensure_ascii=False, indent=2)

print("✅ stocks.json 產生完成！")
