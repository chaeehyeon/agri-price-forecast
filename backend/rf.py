import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import numpy as np

# 1. 데이터 불러오기
df = pd.read_csv(
        r'C:\Users\chkim\OneDrive\바탕 화면\데이터베이스 프로젝트\물량+날씨+가격데이터_10개선별_total_dataset_cp949.csv',
        encoding='cp949'
    )

# 2. 날짜 전처리
df["YEAR"] = df["PRCE_REG_YMD"].astype(str).str[:4].astype(int)
df["MONTH"] = df["PRCE_REG_YMD"].astype(str).str[4:6].astype(int)

# 3. 특성과 타겟 설정
features = ["PDLT_NM", "AMNT_RAIN", "AVG_TEMP_C", "total_SunL", "Quantity", "YEAR", "MONTH"]
target = "PDLT_PRCE"
X = df[features]
y = df[target]

# 4. 전처리 (OneHotEncoder)
categorical_features = ["PDLT_NM"]
preprocessor = ColumnTransformer(
    transformers=[
        ("cat", OneHotEncoder(handle_unknown="ignore"), categorical_features)
    ],
    remainder="passthrough"
)

# 5. 학습/테스트 분할
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 6. Random Forest 모델 정의
rf_model = RandomForestRegressor(
    n_estimators=100,
    max_depth=None,
    min_samples_split=2,
    min_samples_leaf=1,
    random_state=42
)

# 7. 파이프라인 구성
rf_pipeline = Pipeline(steps=[
    ("preprocessor", preprocessor),
    ("regressor", rf_model)
])

# 8. 학습 및 예측
rf_pipeline.fit(X_train, y_train)
y_pred = rf_pipeline.predict(X_test)

# 9. 평가 지표 계산
mse = mean_squared_error(y_test, y_pred)
rmse = np.sqrt(mse)
mae = mean_absolute_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

# 10. 결과 출력
print("Random Forest 성능 결과")
print("1. MSE (Mean Squared Error):", round(mse, 2))
print("2. RMSE (Root Mean Squared Error):", round(rmse, 2))
print("3. MAE (Mean Absolute Error):", round(mae, 2))
print("4. R² (R-squared):", round(r2, 4))

import joblib

# 기존에 rf_pipeline.fit(...) 학습까지 다 하고 나서
joblib.dump(rf_pipeline, "model.pkl")
