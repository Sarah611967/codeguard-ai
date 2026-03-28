import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { code, language } = await request.json();

    // MVP阶段：模拟检测逻辑
    const probability = Math.floor(Math.random() * 100);
    const confidence = probability > 70 ? 'high' : probability > 40 ? 'medium' : 'low';
    
    // 生成详细分析
    const analysis = {
      probability,
      confidence,
      summary: probability > 70 
        ? '该代码很可能由AI生成'
        : probability > 40
        ? '代码存在AI生成特征，但不确定'
        : '代码风格自然，可能为人工编写',
      
      indicators: [
        {
          name: '代码风格',
          score: Math.floor(Math.random() * 100),
          description: probability > 50 ? '过于规范，缺乏个人特征' : '自然流畅，有个人风格'
        },
        {
          name: '命名规范',
          score: Math.floor(Math.random() * 100),
          description: '变量命名符合最佳实践'
        },
        {
          name: '注释质量',
          score: Math.floor(Math.random() * 100),
          description: probability > 60 ? '注释过于完美' : '注释适度'
        },
        {
          name: '代码复杂度',
          score: Math.floor(Math.random() * 100),
          description: '结构清晰，逻辑简洁'
        }
      ],
      
      suggestions: probability > 70 ? [
        '建议人工审查代码逻辑',
        '检查是否理解代码实现',
        '尝试用自己的方式重写'
      ] : [
        '代码质量良好',
        '继续保持编码风格'
      ]
    };

    return NextResponse.json(analysis);
  } catch (error) {
    return NextResponse.json(
      { error: '检测失败' },
      { status: 500 }
    );
  }
}
