from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import random

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CodeRequest(BaseModel):
    code: str
    language: str

@app.post("/api/detect")
async def detect_code(request: CodeRequest):
    # MVP阶段：简单模拟
    # 实际应该使用AI模型
    probability = random.randint(0, 100)
    confidence = "high" if probability > 70 else "medium" if probability > 40 else "low"
    
    return {
        "probability": probability,
        "confidence": confidence,
        "explanation": "代码检测完成",
        "highlights": []
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
