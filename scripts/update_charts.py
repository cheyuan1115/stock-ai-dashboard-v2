# update_charts.py

import os
import yfinance as yf
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.font_manager as fm
from datetime import datetime, timedelta

# 設定中文字體（可改成自己的字體）
font_path = 'NotoSansTC-Regular.otf'
if os.path.exists(font_path):
    fontprop = fm.FontProperties(fname=font_path)
else:
    fontprop = None

# 股票清單
tickers = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'BRK-B', 'META', 'TSLA', 'UNH', 'LLY']

# 時間範圍
end_date = datetime.today()
start_date = end_date - timedelta(days=365)

# 確保資料夾乾淨
if not os.path.exists('charts'):
    os.makedirs('charts')

for f in os.listdir('charts'):
    if f.endswith('.png'):
        os.remove(os.path.join('charts', f))

# 儲存分析資料
html_cards = []

for ticker in tickers:
    print(f"分析 {ticker} 中...")

    df = yf.Ticker(ticker).history(start=start_date, end=end_date)

    if df.empty or 'Volume' not in df.columns:
        print(f"⚠️ {ticker} 沒有資料，跳過")
        continue

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

    # 畫圖儲存
    plt.figure(figsize=(14, 8))

    plt.subplot(2, 1, 1)
    plt.plot(df.index, df['Close'], label="收盤價", linewidth=1.5)
    plt.plot(df.index, df['20MA'], label="20日均線", linestyle="--")
    plt.plot(df.index, df['60MA'], label="60日均線", linestyle="--")
    plt.title(f"{ticker} 股價走勢", fontproperties=fontprop)
    plt.ylabel("價格 (USD)", fontproperties=fontprop)
    plt.legend(prop=fontprop)
    plt.grid(True)

    plt.subplot(2, 1, 2)
    plt.bar(df.index, df['Volume'], color='lightgray', label='每日成交量')
    plt.plot(df.index, df['7MA_Volume'], label='7日均量', color='orange')
    plt.plot(df.index, df['30MA_Volume'], label='30日均量', color='green')
    plt.title(f"{ticker} 成交量走勢", fontproperties=fontprop)
    plt.ylabel("成交量", fontproperties=fontprop)
    plt.xlabel("日期", fontproperties=fontprop)
    plt.legend(prop=fontprop)
    plt.grid(True)

    plt.tight_layout()
    plt.savefig(f'charts/{ticker}.png')
    plt.close()

    # 加到 HTML
    html_cards.append(f"""
    <h2>{ticker}</h2>
    <img src="charts/{ticker}.png" width="800">
    <p><b>綜合建議：</b>{suggestion}</p>
    """)

# 產生 index.html
html_content = f"""
<html>
<head><title>美股每日價量線圖分析</title></head>
<body>
<h1>美股每日價量線圖分析 ({datetime.today().strftime('%Y-%m-%d')})</h1>
{''.join(html_cards)}
</body>
</html>
"""

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

print("✅ 網頁與圖表產生完成！")
