'use client';

import { useState } from 'react';

export default function Home() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleDetect = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language }),
      });
      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error('检测失败:', error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">CodeGuard AI</h1>
          <p className="text-gray-600">检测AI生成的代码</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              选择语言
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
              <option value="java">Java</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              粘贴代码
            </label>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="在此粘贴代码..."
              className="w-full h-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            />
          </div>

          <button
            onClick={handleDetect}
            disabled={!code || loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
          >
            {loading ? '检测中...' : '开始检测'}
          </button>
        </div>

        {result && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">检测结果</h2>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700">AI生成概率:</span>
                <span className="text-3xl font-bold text-blue-600">{result.probability}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-blue-600 h-4 rounded-full transition-all"
                  style={{ width: `${result.probability}%` }}
                />
              </div>
            </div>
            <div className="mb-4">
              <span className="text-gray-700">置信度: </span>
              <span className={`font-semibold ${
                result.confidence === 'high' ? 'text-red-600' :
                result.confidence === 'medium' ? 'text-yellow-600' : 'text-green-600'
              }`}>
                {result.confidence === 'high' ? '高' : result.confidence === 'medium' ? '中' : '低'}
              </span>
            </div>
            <div className="text-gray-600 text-sm">
              {result.explanation}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
