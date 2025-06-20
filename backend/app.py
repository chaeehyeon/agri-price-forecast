from flask import Flask, jsonify
from flask_cors import CORS 
import pandas as pd
from flask import request
import datetime
from flask import request, jsonify
import joblib

app = Flask(__name__)
CORS(app)
model = joblib.load("model.pkl")

@app.route('/api/log')
def get_log():
    try:
        with open('api_log.csv', encoding='utf-8') as f:
            lines = f.readlines()
        logs = []
        for line in lines:
            time, ip, url = line.strip().split(', ', 2)
            logs.append({'time': time, 'ip': ip, 'url': url})
        return jsonify(logs)
    except FileNotFoundError:
        return jsonify([])  # 로그가 아직 없으면 빈 리스트 반환

@app.route('/api/predict', methods=['POST'])
def predict():
    data = request.json
    # 아래 key는 당신의 학습 코드의 features 순서에 맞게 바꿔야 합니다!
    X = pd.DataFrame([{
        'PDLT_NM': data['product'],
        'AMNT_RAIN': data['rain'],
        'AVG_TEMP_C': data['temperature'],
        'total_SunL': data['sunlight'],
        'Quantity': data['volume'],
        'YEAR': data['year'],
        'MONTH': data['month'],
    }])
    pred = model.predict(X)[0]
    return jsonify({'prediction': float(pred)})

@app.route('/api/data')
def get_data():
    user = request.args.get('user', '익명')
    df = pd.read_csv(
        r'C:\Users\chkim\OneDrive\바탕 화면\데이터베이스 프로젝트\물량+날씨+가격데이터_10개선별_total_dataset_cp949.csv',
        encoding='cp949'
    )
    print(df.shape)
    print(df['PRCE_REG_YMD'].tail(20))
    df = df.rename(columns={
        'PRCE_REG_YMD': 'date',
        'PDLT_CODE': 'code',
        'PDLT_NM': 'product',
        'AMNT_RAIN': 'rain',
        'AVG_TEMP_C': 'temperature',
        'total_SunL': 'sunlight',
        'Quantity': 'volume',
        'PDLT_PRCE': 'price'
    })

    # 🔥 여기에 추가! (이 아래)
    with open('api_log.csv', 'a', encoding='utf-8') as f:
        f.write(f"{datetime.datetime.now()}, {user}, {request.remote_addr}, /api/data\n")

    df['date'] = df['date'].astype(str)  # 이 줄 추가!
    df['month'] = df['date'].apply(lambda x: f"{x[:4]}-{x[4:6].zfill(2)}")
    # 예시 결과: "2020-03", "2020-11", "2020-12"

    # JSON으로 변환 (리스트 of 딕셔너리)
    data = df.to_dict(orient='records')
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)
