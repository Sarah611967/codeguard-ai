import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { code, language } = await request.json();

    // MVP阶段：简单的模拟检测逻辑
    // 实际应该调用后端AI模型
    const probability = Math.floor(Math.random() * 100);
    const confidence = probability > 70 ? 'high' : probability > 40 ? 'medium' : 'low';
    
    const explanation = probability > 70 
      ? '代码风格过于规范，缺乏个人特征，疑似AI生成'
      : probability > 40
      ? '代码存在一些AI生成的特征，但不确定'
      : '代码风格自然，可能为人工编写';

    return NextResponse.json({
      probability,
      confidence,
      explanation,
      highlights: []
    });
  } catch (error) {
    return NextResponse.json(
      { error: '检测失败' },
      { status: 500 }
    );
  }
}
